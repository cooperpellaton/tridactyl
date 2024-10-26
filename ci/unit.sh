#!/usr/bin/env bash
# set -euo pipefail

bun run build
bunx jest src
