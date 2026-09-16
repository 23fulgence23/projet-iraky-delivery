#!/usr/bin/env bash
set -e
echo "Cache config..."
php artisan config:cache
php artisan route:cache
echo "Migration..."
timeout 30 php artisan migrate --force || echo "Migration : timeout ou echec, on continue quand meme"
echo "Seed admin..."
timeout 30 php artisan db:seed --class=AdminSeeder --force || echo "Seed : timeout ou echec, on continue quand meme"
echo "Demarrage du serveur..."
exec /start.sh
