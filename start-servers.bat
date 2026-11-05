@echo off
title VYOMIK Dev Launcher
echo ========================================================
echo               VYOMIK E-COMMERCE PLATFORM
echo ========================================================
echo Launching Backend (FastAPI, Port 8000)...
start "VYOMIK Backend API (:8000)" cmd /k "cd /d "%~dp0backend" && .venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Launching Frontend (Vite React, Port 5180)...
start "VYOMIK Frontend (:5180)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting up in separate terminal windows!
echo - Store:            http://localhost:5180
echo - Team Preview:     http://localhost:5180/?preview=vyomik_team_preview_2026
echo - Backend API Docs: http://localhost:8000/docs
echo.
echo Tip: Keep those windows open while developing or previewing.
echo ========================================================
pause

