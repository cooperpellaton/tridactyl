#!/usr/bin/env bash
set -euo pipefail

bun run build
cd "${0%/*}"/../build || exit 1
bunx web-ext lint
