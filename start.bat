set PATH=C:\ProgramData\Oracle\Java\javapath;C:\WINDOWS\system32;C:\WINDOWS;C:\WINDOWS\System32\Wbem;C:\WINDOWS\System32\WindowsPowerShell\v1.0\;C:\Program Files\nodejs\;C:\Program Files\TortoiseSVN\bin;C:\Program Files\Git\cmd;C:\Program Files (x86)\WebEx\Productivity Tools;C:\Program Files\dotnet\;C:\Program Files\Microsoft SQL Server\130\Tools\Binn\;C:\Program Files (x86)\Sennheiser\SoftphoneSDK\;C:\Users\A307620\AppData\Roaming\npm;C:\Program Files\Microsoft VS Code\bin;C:\oracle\instantclient_12_2_x64

::nodemon server.js
set DEBUG=express:* & nodemon server.js
::PORT=5000 nodemon --debug server.js
::nodemon --debug server.js