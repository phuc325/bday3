@echo off
chcp 65001 >nul
title Birthday Love Web
cd /d "%~dp0"

echo ==========================================
echo   DANG KHOI DONG WEBSITE SINH NHAT...
echo ==========================================
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo KHONG TIM THAY PYTHON.
    echo Hay tai Python tai https://www.python.org/downloads/
    echo Khi cai nho tick "Add Python to PATH".
    echo.
    pause
    exit /b 1
)

if not exist ".venv" (
    echo Dang tao moi truong Python...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo Khong tao duoc moi truong Python.
        pause
        exit /b 1
    )
)

call ".venv\Scripts\activate.bat"

echo Dang cai thu vien can thiet...
python -m pip install --upgrade pip
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo Cai thu vien that bai.
    pause
    exit /b 1
)

echo.
echo Website dang chay tai:
echo http://127.0.0.1:5000
echo.
echo Trinh duyet se tu mo sau vai giay.
echo DUNG DONG CUA SO NAY KHI DANG XEM WEB.
echo.

start "" http://127.0.0.1:5000
python app.py

echo.
echo Website da dung.
pause
