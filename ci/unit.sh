#! /bin/sh
cd "${0%/*}" || exit
bun run build --no-native
bunx jest src
