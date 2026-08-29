@ECHO OFF
color 0
echo this script begins the Worship helper app and its remote, hit CTRL + C or close this window to end the app
color 2
echo starting server...
start http://localhost:55771/
node server.js
pause