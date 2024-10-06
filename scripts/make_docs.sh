#!/bin/sh
dest=generated/static/docs

# Use entryPointStrategy
"$(yarn bin)/typedoc" \
    --customCss "src/static/typedoc/assets/css/main.css" \
	--exclude "src/**/?(test_utils|*.test).ts" \
	--out $dest \
	--entryPointStrategy expand \
	src \
	--skipErrorChecking

# Check if the docs were generated successfully
if [ -d "$dest" ]; then
	cp -r $dest build/static/
else
	echo "Error: Documentation was not generated. Check the TypeDoc output for errors."
	exit 1
fi
