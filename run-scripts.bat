@echo off
REM QR Code Admin - Script Runner (Windows Batch File)
REM Usage: run-scripts.bat [category] [script] [options]

echo.
echo ============================================================
echo QR Code Admin - Script Runner
echo ============================================================

if "%1"=="" (
    echo Usage: run-scripts.bat [category] [script] [options]
    echo.
    echo Examples:
    echo   run-scripts.bat help
    echo   run-scripts.bat list
    echo   run-scripts.bat database init-database
    echo   run-scripts.bat auth test-auth
    echo   run-scripts.bat utils generate-password-hash mypassword
    echo.
    goto :eof
)

node run-scripts.js %*

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Script execution failed with error code %ERRORLEVEL%
    pause
)
