@echo off
setlocal
cd /d "%~dp0"
title SocialNet - Local Server

echo ==========================================
echo   SocialNet - Complete Project Launcher
echo ==========================================
echo.
where python >nul 2>nul
if errorlevel 1 (
  echo ERROR: Python was not found. Install Python 3.10 or newer and enable Add Python to PATH.
  pause
  exit /b 1
)

if not exist "templates\login.html" (
  echo ERROR: templates\login.html is missing from this folder:
  echo %CD%
  echo Please extract the entire ZIP again and open the extracted project folder.
  pause
  exit /b 1
)
if not exist "templates\admin_login.html" (
  echo ERROR: templates\admin_login.html is missing from this folder:
  echo %CD%
  pause
  exit /b 1
)

echo [1/3] Installing project dependencies...
python -m pip install -r requirements.txt
if errorlevel 1 (
  echo ERROR: Dependency installation failed.
  pause
  exit /b 1
)

echo.
echo [2/3] Initializing and checking THIS folder's database...
python verify_database.py
if errorlevel 1 (
  echo ERROR: Database verification failed. Read the message above.
  pause
  exit /b 1
)

echo.
echo [3/3] Starting SocialNet...
echo Open http://127.0.0.1:5000 in your browser.
echo Stop the server with Ctrl+C in this window.
echo.
python app.py
pause
