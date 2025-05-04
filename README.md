# @bs/Shackuz

## Overview

`@bs/Shackuz` is a modern TypeScript package designed to provide robust, scalable, and maintainable solutions for your JavaScript/TypeScript projects. The package is engineered with best practices in mind, ensuring type safety, performance, and ease of integration.

## Goals

- Deliver a high-quality, production-ready TypeScript library.
- Ensure seamless developer experience with strict type checking and modern tooling.
- Provide a fully automated, reliable deployment workflow for npm and GitHub releases.

## Features

- Written in TypeScript with strict type safety.
- Modern ESNext output for optimal compatibility.
- Automated versioning, tagging, and publishing workflow.
- GitHub release integration (optional).

## Installation

```bash
npm install @bs/Shackuz
# or
yarn add @bs/Shackuz
```

## Usage

```typescript
import /* exported members */ "@bs/Shackuz";

// Example usage
import { EmailTemplateBuilder } from "../server";

// Create a new email template builder instance
const email = new EmailTemplateBuilder({
  appConfig: { title: "Test this tool" }
})
  .addBlock("h", "Welcome to Shackuz!")
  .addBlock("p", "Hello {{name}},\n\nThank you for joining us.")
  .addBlock("d")
  .addBlock("p", "Regargs")
  .addBlock("p", "Shackuz")
  .buildHTML();

console.log(email);
```

## Automatic Deployment

This package includes a top-tier deployment script (`deploy.sh`) that automates the entire release process:

- Ensures a clean working directory.
- Pulls the latest changes from the master branch.
- Bumps the version (patch, minor, or major).
- Builds the package (if a build script is present).
- Commits and tags the release.
- Pushes commits and tags to git.
- Publishes to npm.
- Optionally creates a GitHub release if the `gh` CLI is available.

### Prerequisites

- Node.js and npm installed.
- Authenticated with npm (`npm login`).
- GitHub CLI (`gh`) installed and authenticated (optional, for GitHub releases).

### Deployment Steps

1. **Make the script executable:**

   ```bash
   chmod +x ./deploy.sh
   ```

2. **Run the deployment script:**

   ```bash
   ./deploy.sh [patch|minor|major]
   ```

   - Default is `patch` if no argument is provided.
   - Example for a minor release:
     ```bash
     ./deploy.sh minor
     ```

3. **What happens next:**
   - The script checks for a clean git state.
   - Pulls the latest changes from the main branch.
   - Bumps the version in `package.json` and creates a git tag.
   - Runs the build (if defined in `package.json`).
   - Pushes commits and tags to the remote repository.
   - Publishes the package to npm.
   - If `gh` is installed, creates a GitHub release with the new tag.

### Example Workflow

```bash
# Make sure your working directory is clean
git status

# Run deployment (patch bump)
./deploy.sh

# Or for a minor/major bump
./deploy.sh minor
./deploy.sh major
```

### Notes

- Ensure you have the necessary permissions to push to the repository and publish to npm.
- The deployment script is idempotent and will abort if your working directory is not clean.

---

## License

MIT
