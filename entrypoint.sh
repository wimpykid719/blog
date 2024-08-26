#!/bin/bash
set -e

if [ ! -e "/blog/package.json" ]; then
  echo 'npm初期化'
  npm init -y
fi

if [ ! -d "/blog/node_modules" ]; then
  echo 'npmインストール実行'
  npm install
fi

exec "$@"