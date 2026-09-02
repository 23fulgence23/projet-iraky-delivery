#!/usr/bin/env bash
echo "Installation des dépendances..."
composer install --no-dev --working-dir=/var/www/html

echo "Cache config..."
php artisan config:cache
php artisan route:cache

echo "Migration..."
php artisan migrate --force

echo "Démarrage..."
