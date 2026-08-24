@echo off
cd /d %~dp0apps\api
set PYTHONPATH=.
start "mmw-api" cmd /k python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
cd /d %~dp0apps\web
start "mmw-web" cmd /k npm run dev -- -p 3000
echo Open http://127.0.0.1:3000
