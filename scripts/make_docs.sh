#!/bin/sh
dest=generated/static/docs
"$(yarn bin)/typedoc" --theme src/static/typedoc/ --exclude "src/**/?(test_utils|*.test).ts"  --out $dest src --skipErrorChecking
cp -r $dest build/static/
