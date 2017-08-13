Start-Process node.exe C:\nodedev\curator-server\server.js -WorkingDirectory C:\nodedev\curator-server
Push-Location c:\nodedev\curator
Start-Process npm start
Pop-Location
Start-Process "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "http://localhost:8080"