@echo off
:: Check if the correct number of arguments are passed
if "%~2"=="" (
    echo Usage: commit_with_date.bat "YYYY-MM-DDTHH:MM:SS" "Commit message"
    exit /b
)

:: Set the GIT_COMMITTER_DATE and GIT_AUTHOR_DATE from the first argument
set GIT_COMMITTER_DATE=%1
set GIT_AUTHOR_DATE=%1

:: Remove quotes from the commit message (if any) and store it in a variable
set COMMIT_MESSAGE=%~2

:: Run the git commit command with the date and the commit message
git commit --date="%1" -m "%COMMIT_MESSAGE%"