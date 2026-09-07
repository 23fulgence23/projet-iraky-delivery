#!/usr/bin/env bash
set -e
echo "Cache config..."
php artisan config:cache
php artisan route:cache
echo "Migration..."
php artisan migrate --force
echo "Seed admin..."
php artisan db:seed --class=AdminSeeder --force
echo "Demarrage du serveur..."
exec /start.sh
