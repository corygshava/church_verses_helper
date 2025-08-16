@ECHO OFF
color 0
echo this script begins the Worship helper app and its remote, hit CTRL + C or close this wwindow to kill the app
color 2
echo starting server...
start http://localhost:3000/
node server.js
pause