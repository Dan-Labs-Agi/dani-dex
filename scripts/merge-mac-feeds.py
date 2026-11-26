#!/usr/bin/env python3
"""Merge the latest-mac.yml of the arm64 build and the x64 build into one feed.

Each Mac build runs on its own runner, so each writes a feed that lists only its own files. The
in-app updater reads one feed and picks the zip for its architecture, so both must be listed.

Usage: python3 merge-mac-feeds.py arm64/latest-mac.yml x64/latest-mac.yml > latest-mac.yml
"""
import re
import sys


def file_blocks(text):
    head, _, rest = text.partition("\nfiles:\n")
    lines = rest.split("\n")
    blocks, current, end = [], None, len(lines)
    for index, line in enumerate(lines):
        if line.startswith("  - url:"):
            current = [line]
            blocks.append(current)
        elif line.startswith("    ") and current is not None:
            current.append(line)
        elif line and not line.startswith(" "):
            end = index
            break
        elif not line:
            continue
    return head, ["\n".join(b) for b in blocks], "\n".join(lines[end:])


first_head, first_blocks, first_tail = file_blocks(open(sys.argv[1]).read())
_, second_blocks, _ = file_blocks(open(sys.argv[2]).read())
seen, merged = set(), []
for block in first_blocks + second_blocks:
    url = re.search(r"url: (\S+)", block).group(1)
    if url not in seen:
        seen.add(url)
        merged.append(block)
sys.stdout.write(first_head + "\nfiles:\n" + "\n".join(merged) + "\n" + first_tail)
