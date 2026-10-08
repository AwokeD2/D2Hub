@echo off
title D2 Hub Release Publisher
cd /d "%~dp0"
node scripts/publish-release.mjs
pause
