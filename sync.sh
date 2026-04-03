#! /bin/bash

echo "🧹 Cleaning up..."
git clean -fdxq

echo "📥 Cloning community edition..."
git clone --depth 1 https://github.com/pagezero-dev/powerup.git powerup

echo "🔄 Syncing files from community edition..."
rsync -a --exclude-from=./sync-ignore.txt ./powerup/ ./

echo "🧹 Cleaning up..."
rm -rf ./powerup

echo "📦 Setup..."
bun run setup