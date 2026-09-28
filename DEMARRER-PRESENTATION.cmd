@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js est absent. Installez Node.js 24 puis relancez ce fichier.
  pause
  exit /b 1
)
node scripts/serve-dist.mjs --open
if errorlevel 1 pause
