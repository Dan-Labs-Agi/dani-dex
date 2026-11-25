#!/usr/bin/env python3
"""Upload updater metadata and payloads under their build names so the in-app updater can read them.

The electron-updater feed (generic provider at https://dl.dani.danlab.dev/desktop/) reads
latest.yml / latest-mac.yml, and those files point at the zip, exe and blockmap names that
electron-builder produced, so these files keep their original basenames.

Usage: python3 publish-updater-files.py dist/latest-mac.yml dist/dani-dex-1.4.12-arm64.zip ...
Env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY (bucket dani-dex-releases).
"""
import os, sys
import boto3

BUCKET = "dani-dex-releases"
s3 = boto3.client("s3", endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
                  aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
                  aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"], region_name="auto")
for path in sys.argv[1:]:
    key = "desktop/" + os.path.basename(path)
    cache = "no-cache" if path.endswith(".yml") else "public, max-age=300"
    s3.upload_file(path, BUCKET, key, ExtraArgs={"CacheControl": cache})
    print(key)
