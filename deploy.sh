#!/usr/bin/env bash

set -euo pipefail

# Configurable variables
DEFAULT_BRANCH="master"
PACKAGE_JSON="package.json"

# Step 1: Ensure clean working directory
if [[ -n $(git status --porcelain) ]]; then
  echo "Error: Working directory is dirty. Please commit or stash changes."
  exit 1
fi

# Step 2: Pull latest changes
git checkout $DEFAULT_BRANCH
git pull origin $DEFAULT_BRANCH

# Step 3: Bump version
BUMP_TYPE=${1:-patch}
if ! [[ "$BUMP_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "Usage: $0 [patch|minor|major]"
  exit 1
fi

CURRENT_VERSION=$(node -p "require('./$PACKAGE_JSON').version")
npm version $BUMP_TYPE -m "chore(release): bump version to %s"
NEW_VERSION=$(node -p "require('./$PACKAGE_JSON').version")

# Step 4: Build (if build script exists)
if npm run | grep -q "build"; then
  npm run build
fi

# Step 5: Push commits and tags
git push origin $DEFAULT_BRANCH
git push origin "v$NEW_VERSION"

# Step 6: Publish to npm
npm publish --access public

# Step 7: Create GitHub release (optional)
if command -v gh &>/dev/null; then
  gh release create "v$NEW_VERSION" --title "v$NEW_VERSION" --notes "Release v$NEW_VERSION"
fi

echo "✅ Deployment complete: v$NEW_VERSION published and pushed."

