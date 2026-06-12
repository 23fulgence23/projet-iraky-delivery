@echo off
echo Demarrage IRAKY Backend...
cd /d "%~dp0"
php artisan config:cache
php artisan route:cache
php -S localhost:8000 -t public
pause
