@ECHO OFF & setlocal
set batchPath=%~dp0
REM powershell.exe -noexit -file "%batchPath%run.ps1"
powershell.exe -noexit -command "$env:NODE_OPTIONS=\"--require .\";& 'C:\Program Files (x86)\Steam\steamapps\common\Krunker\Official Krunker.io Client.exe'"
echo Done
pause