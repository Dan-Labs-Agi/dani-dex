#!/usr/bin/env python3
"""Periodically upload a growing build log to R2 so a killed runner still leaves a trail.

Usage: stream-log-to-r2.py <log-file> <object-key>
Env: R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET (default dani-dex-releases).
Runs until killed; the object always holds the newest minute of the log.
"""

import os
import sys
import time

import boto3


def main() -> None:
    log_path, key = sys.argv[1], sys.argv[2]
    account = os.environ["R2_ACCOUNT_ID"]
    bucket = os.environ.get("R2_BUCKET", "dani-dex-releases")
    client = boto3.client(
        "s3",
        endpoint_url=f"https://{account}.r2.cloudflarestorage.com",
        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
        region_name="auto",
    )
    uploaded_size = -1
    while True:
        try:
            size = os.path.getsize(log_path)
        except OSError:
            size = -1
        if size >= 0 and size != uploaded_size:
            with open(log_path, "rb") as handle:
                client.put_object(Bucket=bucket, Key=key, Body=handle.read())
            uploaded_size = size
            print(f"uploaded {size} bytes to {bucket}/{key}", flush=True)
        time.sleep(60)


if __name__ == "__main__":
    main()
