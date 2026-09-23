@echo off
REM PDFNova Firebase Deployment Script for Windows
REM Run this script to deploy your site to Firebase

echo.
echo ================================================
echo   PDFNova Firebase Deployment
echo ================================================
echo.

REM Check if Firebase CLI is installed
where firebase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Firebase CLI not found. Installing...
    call npm install -g firebase-tools
    if %ERRORLEVEL% NEQ 0 (
        echo [X] Failed to install Firebase CLI
        pause
        exit /b 1
    )
    echo [OK] Firebase CLI installed
) else (
    echo [OK] Firebase CLI found
)

REM Check if logged in
echo.
echo Checking Firebase login status...
firebase login:list >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Please login to Firebase...
    call firebase login
)

REM Build the project
echo.
echo [i] Building project...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [X] Build failed. Please fix errors and try again.
    pause
    exit /b 1
)
echo [OK] Build successful

REM Deploy
echo.
echo [i] Deploying to Firebase...
call firebase deploy --only hosting:pdfnova

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ================================================
    echo   [OK] Deployment successful!
    echo ================================================
    echo.
    echo Your site is live at:
    echo   - https://pdfnova.web.app
    echo   - https://pdfnova.web.app
    echo.
    echo The Firebase Hosting target is pdfnova
) else (
    echo.
    echo [X] Deployment failed. Check the error messages above.
)

echo.
pause
