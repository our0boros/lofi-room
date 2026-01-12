@echo off
echo ========================================
echo GitHub Actions Build Setup Script
echo ========================================
echo.

echo This script will help you set up GitHub Actions for automatic Windows EXE builds.
echo.

echo Prerequisites:
echo 1. Git installed and configured
echo 2. GitHub account
echo 3. GitHub repository created
echo.

set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo Error: Repository URL is required
    pause
    exit /b 1
)

echo.
echo Step 1: Initializing Git repository...
git init

echo.
echo Step 2: Adding all files...
git add .

echo.
echo Step 3: Creating initial commit...
git commit -m "Initial commit - Setup for GitHub Actions build"

echo.
echo Step 4: Adding remote repository...
git remote add origin %REPO_URL%

echo.
echo Step 5: Pushing to GitHub...
git branch -M main
git push -u origin main

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error: Failed to push to GitHub
    echo Please check your credentials and repository URL
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your code has been pushed to GitHub.
echo.
echo Next steps:
echo 1. Go to your repository on GitHub
echo 2. Click on the "Actions" tab
echo 3. Select "Build Windows EXE" workflow
echo 4. Click "Run workflow" button
echo 5. Wait for the build to complete (5-10 minutes)
echo 6. Download the EXE from the Artifacts section
echo.
echo For more details, see GITHUB_ACTIONS_BUILD.md
echo.
pause