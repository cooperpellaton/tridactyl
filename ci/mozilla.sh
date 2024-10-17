#! /bin/sh
bun run build --no-native
cd "${0%/*}"/../build || exit 1
bunx web-ext lint
