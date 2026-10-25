#!/bin/bash
set -e

npm ci --omit=dev --ignore-scripts
echo "Post-merge setup complete."
