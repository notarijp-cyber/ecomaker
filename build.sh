#!/bin/bash
# Build script to force npm usage and prevent bun interference

# Ensure we're using npm by explicitly setting PATH
export PATH="/nix/store/$(ls /nix/store | grep nodejs-20 | head -1)/bin:$PATH"

# Remove any bun-related environment variables
unset BUN_INSTALL
unset BUN_EXE

# Force npm to be used
export npm_config_prefix=$(pwd)/.npm-global
export NPM_CONFIG_PREFIX=$npm_config_prefix

# Clean any existing builds
rm -rf dist/
rm -rf node_modules/.vite/

# Install dependencies with npm explicitly
echo "Installing dependencies with npm..."
npm ci --no-optional --prefer-offline

# Run the build
echo "Building application..."
npm run build

echo "Build completed successfully!"