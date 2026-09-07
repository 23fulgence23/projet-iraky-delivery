FROM richarvey/nginx-php-fpm:latest

COPY backend/ .
COPY nginx-site.conf /etc/nginx/sites-available/default.conf

RUN composer install --no-dev --optimize-autoloader --working-dir=/var/www/html

ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

ENV DB_CONNECTION=pgsql
ENV DB_HOST=dpg-dac25a8u01pc73fhmiu0-a
ENV DB_PORT=5432
ENV DB_DATABASE=iraky_delivery
ENV DB_USERNAME=iraky_delivery_user
ENV DB_PASSWORD=z7cfOINMWwy5Rz2Io4QWALm35sbLch5j
ENV APP_KEY=base64:HVoSUTZiJjAXEMZWGqBv/vGr7Q8Yw+xkR95cxNI1ECI=

RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan migrate --force

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
CMD ["/docker-entrypoint.sh"]
