#!/usr/bin/env bash

bun run build --no-native
bunx jest src
