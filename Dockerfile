FROM richarvey/nginx-php-fpm:latest

COPY backend/ .
COPY nginx-site.conf /etc/nginx/sites-available/default.conf
COPY php-perf.ini /usr/local/etc/php/conf.d/zz-iraky-perf.ini

RUN composer install --no-dev --optimize-autoloader --working-dir=/var/www/html

ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr
ENV COMPOSER_ALLOW_SUPERUSER 1

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
CMD ["/docker-entrypoint.sh"]