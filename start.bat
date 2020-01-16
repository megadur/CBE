@echo off
::set PATH=C:\ProgramData\Oracle\Java\javapath;C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\Program Files\nodejs\;C:\Program Files\TortoiseSVN\bin;C:\Program Files\Git\cmd;C:\Program Files (x86)\WebEx\Productivity Tools;C:\Program Files\dotnet\;C:\Program Files\Microsoft SQL Server\130\Tools\Binn\;C:\Program Files (x86)\Sennheiser\SoftphoneSDK\;C:\Users\A307620\AppData\Roaming\npm;C:\Program Files\Microsoft VS Code\bin;C:\oracle\instantclient_12_2_x64
set PATH=
set PATH=%PATH%;C:\ProgramData\Oracle\Java\javapath
set PATH=%PATH%;C:\WINDOWS
set PATH=%PATH%;C:\WINDOWS\system32
set PATH=%PATH%;C:\WINDOWS\System32\Wbem
set PATH=%PATH%;C:\WINDOWS\System32\WindowsPowerShell\v1.0\
set PATH=%PATH%;C:\Program Files\nodejs\
set PATH=%PATH%;C:\Program Files\TortoiseSVN\bin
set PATH=%PATH%;C:\Program Files\Git\cmd
set PATH=%PATH%;C:\Program Files\dotnet\
::set PATH=%PATH%;C:\Program Files\Microsoft SQL Server\130\Tools\Binn\
::set PATH=%PATH%;C:\Program Files (x86)\Sennheiser\SoftphoneSDK\
set PATH=%PATH%;%APPDATA%\npm
set PATH=%PATH%;C:\Program Files\Microsoft VS Code\bin
set PATH=%PATH%;C:\oracle

::nodemon server.js
set DEBUG=express:* & nodemon server.js
::PORT=5000 nodemon --debug server.js
::nodemon --debug server.js