@echo off
title VYOMIK Dev Launcher (MongoDB + Backend + Frontend)
echo ========================================================
echo               VYOMIK E-COMMERCE PLATFORM
echo ========================================================

echo 1. Launching MongoDB Local Database (:27017)...
start "VYOMIK MongoDB (:27017)" cmd /k "if not exist "%~dp0data\db" mkdir "%~dp0data\db" && "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "%~dp0data\db" --bind_ip 127.0.0.1"

echo 2. Launching Backend (FastAPI, Port 8000)...
start "VYOMIK Backend API (:8000)" cmd /k "cd /d "%~dp0backend" && .venv\Scripts\uvicorn.exe app.main:app --host 0.0.0.0 --port 8000 --reload"

echo 3. Launching Frontend (Vite React, Port 5180)...
start "VYOMIK Frontend (:5180)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo All 3 services are starting up in separate terminal windows!
echo - Store:            http://localhost:5180
echo - Team Preview:     http://localhost:5180/?preview=vyomik_team_preview_2026
echo - Backend API Docs: http://localhost:8000/docs
echo - MongoDB:          mongodb://127.0.0.1:27017 (vyomik_db)
echo.
echo Tip: Keep those windows open while developing or previewing.
echo ========================================================
pause
