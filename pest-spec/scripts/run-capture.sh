#!/usr/bin/env bash
set -euo pipefail

# Capture stdout+stderr from the provided command string and always exit 0
out="$(bash -lc "$*" 2>&1 || true)"
printf "%s\n" "$out"

