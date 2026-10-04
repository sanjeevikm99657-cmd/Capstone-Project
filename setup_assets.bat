@echo off
echo Copying welcome image to assets folder...
if not exist "assets" mkdir assets
copy /Y "C:\Users\sanje\.gemini\antigravity-ide\brain\cf8cc912-9bd1-4dfa-a381-e993247a25ee\sanjay_textiles_welcome_1791107337793.jpg" "assets\welcome_hero.jpg"
echo Done! You can now open index.html in your browser.
pause
