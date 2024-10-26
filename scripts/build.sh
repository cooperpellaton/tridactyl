#!/usr/bin/env bash

# Default configuration
declare -A CONFIG=(
  [QUICK_BUILD]=0
  [OLD_NATIVE]=0
  [CLEANSLATE]="node_modules/cleanslate/docs/files/cleanslate.css"
  [WIN_PYTHON]="python"
  [BUILD_DIR]="build"
  [GENERATED_DIR]="generated"
  [TEMP_DIR]="buildtemp"
)

# Help message
show_help() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Options:
    --quick         Perform a quick build, skipping documentation and type checking
    --old-native   Install old native messenger
    -h, --help     Show this help message

EOF
}

# Parse command line arguments
parse_args() {
  while [[ $# -gt 0 ]]; do
    case $1 in
    --quick)
      CONFIG[QUICK_BUILD]=1
      shift
      ;;
    --old-native)
      CONFIG[OLD_NATIVE]=1
      shift
      ;;
    -h | --help)
      show_help
      exit 0
      ;;
    *)
      echo "Error: Unknown argument '$1'" >&2
      show_help
      exit 1
      ;;
    esac
  done
}

# Utility functions
is_windows_mingw() {
  local uname
  uname=$(uname)
  [[ ${uname:0:5} == "MINGW" ]] || [[ ${uname:0:4} == "MSYS" ]]
}

ensure_directory_exists() {
  local dir=$1
  if ! mkdir -p "$dir"; then
    echo "Error: Failed to create directory: $dir" >&2
    exit 1
  fi
}

copy_file_if_exists() {
  local src=$1
  local dst=$2
  if [[ -f "$src" ]]; then
    cp -v "$src" "$dst"
  else
    echo "Warning: $src not found, skipping copy." >&2
  fi
}

# Build steps
setup_directories() {
  local dirs=(
    "${CONFIG[BUILD_DIR]}"
    "${CONFIG[BUILD_DIR]}/static"
    "${CONFIG[GENERATED_DIR]}/static"
    "${CONFIG[GENERATED_DIR]}/static/clippy"
  )

  for dir in "${dirs[@]}"; do
    ensure_directory_exists "$dir"
  done
}

run_excmds_macros() {
  if is_windows_mingw; then
    "${CONFIG[WIN_PYTHON]}" scripts/excmds_macros.py
  else
    scripts/excmds_macros.py
  fi
}

perform_full_build() {
  echo "Performing full build..."

  # Generate bracketexpr grammar
  bunx nearleyc src/grammars/bracketexpr.ne >src/grammars/.bracketexpr.generated.ts

  # Generate metadata
  bunx tsc compiler/gen_metadata.ts -m commonjs --target es2017 &&
    bun run compiler/gen_metadata.js \
      --out src/.metadata.generated.ts \
      --themeDir src/static/themes \
      src/excmds.ts src/lib/config.ts

  # Generate documentation and tutorials
  scripts/newtab.md.sh
  scripts/make_tutorial.sh
  scripts/make_docs.sh

  # Type checking
  bunx tsc --project tsconfig.json --noEmit
}

build_main_application() {
  ensure_directory_exists "${CONFIG[TEMP_DIR]}"
  bun scripts/esbuild.js
  mv "${CONFIG[TEMP_DIR]}"/* "${CONFIG[BUILD_DIR]}/"
  rmdir "${CONFIG[TEMP_DIR]}"
}

copy_static_files() {
  # Copy main files
  cp src/manifest.json "${CONFIG[BUILD_DIR]}/"
  cp -r src/static "${CONFIG[BUILD_DIR]}"
  cp -r "${CONFIG[GENERATED_DIR]}/static" "${CONFIG[BUILD_DIR]}"
  cp issue_template.md "${CONFIG[BUILD_DIR]}/"

  # Clean up large unused files
  rm -f "${CONFIG[BUILD_DIR]}/static/logo/Tridactyl.psd"
  rm -f "${CONFIG[BUILD_DIR]}/static/logo/Tridactyl_1024px.png"
}

install_old_native() {
  if [[ ${CONFIG[OLD_NATIVE]} -eq 1 ]]; then
    if is_windows_mingw; then
      powershell \
        -NoProfile \
        -InputFormat None \
        -ExecutionPolicy Bypass \
        native/win_install.ps1 -DebugDirBase native
    else
      native/install.sh local
    fi
  fi
}

# Main execution
main() {
  parse_args "$@"

  setup_directories
  run_excmds_macros

  if [[ ${CONFIG[QUICK_BUILD]} -eq 0 ]]; then
    perform_full_build
  else
    echo "Warning: dirty rebuild. Skipping docs, metadata and type checking..."
  fi

  build_main_application
  copy_static_files
  install_old_native

  # Update AUTHORS file
  scripts/authors.sh

  # Copy cleanslate.css
  copy_file_if_exists "${CONFIG[CLEANSLATE]}" "${CONFIG[BUILD_DIR]}/static/css/cleanslate.css"

  echo "Build completed successfully!"
}

main "$@"
