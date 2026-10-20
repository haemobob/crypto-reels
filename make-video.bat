@echo off
rem Renders the final MP4 for one episode on Windows: make-video.bat <episode-id>
if "%~1"=="" (
  echo Usage: make-video.bat ^<episode-id^>
  exit /b 1
)
call npm run render -- %1
if errorlevel 1 exit /b 1
echo Done: output\%1.mp4
