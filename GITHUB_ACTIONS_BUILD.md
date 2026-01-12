# GitHub Actions Build Guide

## Overview

This guide explains how to use GitHub Actions to automatically build the Windows EXE installer for the Lofi Music application.

## Prerequisites

1. A GitHub account
2. A GitHub repository for this project
3. Basic understanding of Git

## Setup Instructions

### 1. Push Code to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Enable GitHub Actions

The workflow file is already configured at `.github/workflows/build-windows.yml`. It will be available once you push the code to GitHub.

### 3. Trigger a Build

#### Option A: Using GitHub Web Interface (Recommended)

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Select "Build Windows EXE" from the workflow list
4. Click "Run workflow" button
5. Choose the branch (usually "main")
6. Click "Run workflow" button to start the build

#### Option B: Using GitHub CLI

```bash
gh workflow run build-windows.yml
```

#### Option C: Pushing to Main Branch

The workflow can also be triggered automatically when you push to the main branch (you need to modify the workflow file for this).

### 4. Monitor the Build

1. Go to the "Actions" tab in your repository
2. Click on the running workflow run
3. You can see the real-time build progress in the logs

### 5. Download the EXE

Once the build completes successfully:

1. Go to the "Actions" tab
2. Click on the completed workflow run
3. Scroll down to the "Artifacts" section
4. Click on "lofi-music-windows-installer" to download the ZIP file
5. Extract the ZIP file to get the `.exe` installer

## Workflow Details

The workflow performs the following steps:

1. **Checkout code**: Retrieves the latest code from your repository
2. **Setup Node.js**: Installs Node.js 18 with npm caching
3. **Install dependencies**: Runs `npm ci --legacy-peer-deps` to install all dependencies
4. **Build React app**: Creates the production build of the React application
5. **Build Windows executable**: Uses electron-builder to create the NSIS installer
6. **Upload artifacts**: Uploads the generated EXE file as a GitHub artifact
7. **Generate summary**: Creates a build summary with file information

## Build Time

The build process typically takes 5-10 minutes, depending on:
- GitHub Actions queue time
- Dependency installation time
- Electron download time (cached on GitHub Actions)

## Troubleshooting

### Build Failed

Check the workflow logs for specific error messages. Common issues:

1. **Dependency errors**: Check if all dependencies are properly listed in package.json
2. **Build errors**: Check the React build logs for compilation errors
3. **Electron errors**: Check the electron-builder logs for packaging errors

### Artifact Not Found

Make sure the build completed successfully before trying to download artifacts.

### Workflow Not Triggering

1. Verify the workflow file is in `.github/workflows/` directory
2. Check that the file has correct YAML syntax
3. Ensure you have proper permissions to trigger workflows

## Advanced Configuration

### Automatic Builds on Push

To automatically build on every push to main, modify the workflow trigger:

```yaml
on:
  push:
    branches: [ main ]
  workflow_dispatch:
```

### Multiple Platforms

To build for multiple platforms (Windows, macOS, Linux), you can add matrix strategy:

```yaml
strategy:
  matrix:
    os: [windows-latest, macos-latest, ubuntu-latest]
```

### Release Automation

To automatically create GitHub releases with the built artifacts, you can add a release step:

```yaml
- name: Create Release
  uses: softprops/action-gh-release@v1
  with:
    files: dist/*.exe
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Cost Considerations

GitHub Actions is free for:
- Public repositories
- Private repositories (up to 2000 minutes/month for free accounts)

For larger projects, consider the usage limits.

## Support

For issues related to:
- GitHub Actions: https://docs.github.com/en/actions
- Electron Builder: https://www.electron.build/
- This project: Check the main README.md