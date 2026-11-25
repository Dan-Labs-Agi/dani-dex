#!/usr/bin/env python3
"""Upload one release artifact to R2 and merge it into the public update feed.

Usage (CI, after the build):
  python3 publish-feed.py --platform android --file dani-dex.apk --key android/dani-dex.apk --version 0.1.0
  python3 publish-feed.py --platform mac-arm64 --file Dani-Dex-mac-arm64.dmg --key desktop/Dani-Dex-mac-arm64.dmg --version 0.1.0
  python3 publish-feed.py --platform mac-x64   --file Dani-Dex-mac-x64.dmg   --key desktop/Dani-Dex-mac-x64.dmg   --version 0.1.0
  python3 publish-feed.py --platform linux     --file Dani-Dex.AppImage      --key desktop/Dani-Dex.AppImage      --version 0.1.0
  python3 publish-feed.py --platform windows --file Dani-Dex-win-x64.exe   --key desktop/Dani-Dex-win-x64.exe   --version 0.1.0

Env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (bucket dani-dex-releases).
Writes: <key>, <key>.sha256, latest.json (all platforms). The expo-updates manifest is separate: ota/manifest.json, served at https://auth.dani.danlab.dev/v1/ota/manifest.
latest.json is what the landing page and the in-app Update button read:
  {"updated": ISO, "platforms": {"android": {"version","url","sha256","size","file"}, ...}}
"""
import argparse, hashlib, json, os, datetime
import boto3
from botocore.exceptions import ClientError

BASE = "https://dl.dani.danlab.dev/"
BUCKET = "dani-dex-releases"
TYPES = {".apk": "application/vnd.android.package-archive", ".dmg": "application/x-apple-diskimage",
         ".exe": "application/vnd.microsoft.portable-executable", ".appimage": "application/octet-stream", ".zip": "application/zip"}

ap = argparse.ArgumentParser()
ap.add_argument("--platform", required=True, choices=["android", "mac", "mac-arm64", "mac-x64", "windows", "linux"])
ap.add_argument("--file", required=True)
ap.add_argument("--key", required=True)
ap.add_argument("--version", required=True)
a = ap.parse_args()

s3 = boto3.client("s3", endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
                  aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
                  aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"], region_name="auto")
h = hashlib.sha256()
with open(a.file, "rb") as f:
    for chunk in iter(lambda: f.read(1 << 20), b""):
        h.update(chunk)
sha, size = h.hexdigest(), os.path.getsize(a.file)
ctype = TYPES.get(os.path.splitext(a.file)[1].lower(), "application/octet-stream")
s3.upload_file(a.file, BUCKET, a.key, ExtraArgs={"ContentType": ctype, "CacheControl": "public, max-age=300"})
s3.put_object(Bucket=BUCKET, Key=a.key + ".sha256", Body=f"{sha}  {os.path.basename(a.key)}\n".encode(),
              ContentType="text/plain", CacheControl="public, max-age=300")
entry = {"version": a.version, "url": BASE + a.key, "sha256": sha, "size": size, "file": os.path.basename(a.key)}
try:
    feed = json.loads(s3.get_object(Bucket=BUCKET, Key="latest.json")["Body"].read())
except ClientError:
    feed = {"platforms": {}}
feed.setdefault("platforms", {})[a.platform] = entry
feed["updated"] = datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")
body = json.dumps(feed, indent=2).encode()
s3.put_object(Bucket=BUCKET, Key="latest.json", Body=body, ContentType="application/json", CacheControl="no-cache")
if False:  # android/latest.json removed: the expo-updates manifest lives at ota/manifest.json
    s3.put_object(Bucket=BUCKET, Key="android/latest.json", Body=json.dumps(entry, indent=2).encode(),
                  ContentType="application/json", CacheControl="no-cache")
print(json.dumps(entry))
