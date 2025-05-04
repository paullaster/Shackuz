#!/usr/bin/env bash

set -euo pipefail

# Configurable variables
BRANCH="${BRANCH:-${2:-master}}"
PACKAGE_JSON="package.json"

# Step 0: Check publishConfig.access for scoped package
if grep -q '"name": *"@' "$PACKAGE_JSON"; then
  if ! grep -q '"publishConfig": *{' "$PACKAGE_JSON" || ! grep -q '"access": *"public"' "$PACKAGE_JSON"; then
    echo "⚠️  Warning: Scoped packages are private by default. Add the following to your package.json to publish publicly:"
    echo '  "publishConfig": { "access": "public" }'
    sleep 2
  fi
fi

# Step 1: Ensure clean working directory
if [[ -n $(git status --porcelain) ]]; then
  echo "Error: Working directory is dirty. Please commit or stash changes."
  exit 1
fi

# Step 2: Pull latest changes
git checkout $BRANCH
git pull origin $BRANCH

# Step 3: Bump version
BUMP_TYPE=${1:-patch}
if ! [[ "$BUMP_TYPE" =~ ^(patch|minor|major)$ ]]; then
  echo "Usage: $0 [patch|minor|major] [branch]"
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
git push origin $BRANCH
git push origin "v$NEW_VERSION"

# Step 6: Publish to npm
if ! npm publish --access public; then
  echo "npm publish failed."
  echo "If you see a 404 error for a scoped package, ensure:"
  echo "  - The scope is allowed on the registry."
  echo "  - You have added \"publishConfig\": { \"access\": \"public\" } to your package.json."
  echo "  - You are logged in to npm with the correct account."
  exit 1
fi

# Step 7: Create GitHub release (optional)
if command -v gh &>/dev/null; then
  gh release create "v$NEW_VERSION" --title "v$NEW_VERSION" --notes "Release v$NEW_VERSION"
fi

echo "✅ Deployment complete: v$NEW_VERSION published and pushed."

