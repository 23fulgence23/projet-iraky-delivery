#!/usr/bin/env bash
echo "Cache config..."
php artisan config:cache
php artisan route:cache

echo "Migration..."
php artisan migrate --force

echo "Demarrage..."
