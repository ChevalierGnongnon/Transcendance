#!/bin/bash

#laravel refuses to start migrations in production
#environment without interactive confirmation, but 
#docker doesn't have an interactive terminal so
#--force flag is needed.
php artisan migrate --force  
#starts php-fpm 8.2
php-fpm8.2 -F