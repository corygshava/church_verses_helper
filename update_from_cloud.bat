@ECHO OFF
echo reseting changes
git reset --hard

echo getting files from cloud source
git pull

echo applet updated

echo updating the underlying ui kit
cd public/cbl

git reset --hard
git pull

echo UI kit updated successfully.

pause
