#!/bin/sh
dest=generated/static/docs
# The theme is a TSX file. This turns it into a JS plugin.
bunx tsc src/static/typedoc/theme.tsx -m commonjs -t esnext --jsx react --jsxFactory "JSX.createElement" --jsxFragmentFactory "JSX.Fragment" --skipLibCheck
# Run typedoc as partially defined in tsconfig.json
bunx typedoc --out $dest
# Copy the result.
cp -r $dest build/static/
