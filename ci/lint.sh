#!/bin/sh

if [ "$(which shellcheck)" ]; then
    GLOBIGNORE="node_modules" shellcheck -e2012 ./**/*.sh
else
    echo "Warning: shellcheck is not installed, skipping shell scripts"
fi

cd "$(dirname "$(readlink -f "$0")")/.." || exit 1

# Check for incompatible sed flags and provide warnings
incompatible_sed=$(! grep -RPn --color=always --exclude-dir=node_modules --exclude-dir=.git 'sed(?:\s-\w+)*\s-i(?!\S|\s"")')
if [ "$incompatible_sed" ]; then
    printf "\nWarning: avoid non-portable sed flag -i without backup extension, use -i.bak\n"
    printf "%s\n\n" "$incompatible_sed"
fi

# Run linting tools with proper error handling
bun lint || { echo "Error running lint; exiting"; exit 1; }
bunx eslint --rulesdir custom-eslint-rules --ext .ts .
