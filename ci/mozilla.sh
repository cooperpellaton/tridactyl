#!/usr/bin/env bash

bun run build
cd "${0%/*}"/../build || exit 1
bunx web-ext lint
