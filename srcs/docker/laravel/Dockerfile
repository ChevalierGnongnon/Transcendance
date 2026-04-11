FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    php-cli \
    php-fpm \
    php-mysql \
    php-mbstring \
    php-xml \
    php-curl \
    php-zip \
    php-bcmath \
    composer \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

RUN composer create-project laravel/laravel . \ 
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 9000

COPY ./tools/laravel-script.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
