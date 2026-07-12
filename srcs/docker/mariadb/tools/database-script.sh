#!/bin/bash

set -e

MYSQL_PASSWORD=$(cat /run/secrets/mysql_password | tr -d '\n') 
MYSQL_ROOT_PASSWORD=$(cat /run/secrets/mysql_root_password | tr -d '\n')

if [ ! -d /var/lib/mysql/mysql ]; then
    mkdir -p /var/lib/mysql
    chown -R mysql:mysql /var/lib/mysql
    mysql_install_db --user=mysql --datadir=/var/lib/mysql
fi

if [ ! -d /var/lib/mysql/transcendance ]; then
    mysqld --user=mysql --skip-networking &
    MYSQLD_PID=$!
    until mysqladmin ping --silent 2>/dev/null; do sleep 1; done

    mariadb -u root << EOF
        SET PASSWORD FOR 'root'@'localhost' = PASSWORD('${MYSQL_ROOT_PASSWORD}');
        CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\`;
        CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
        CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'localhost' IDENTIFIED BY '${MYSQL_PASSWORD}';
        GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
        GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'localhost';
        FLUSH PRIVILEGES;
        $(cat /tmp/database_creation.sql)
        $(cat /tmp/triggers.sql) 
EOF
    kill $MYSQLD_PID
    wait $MYSQLD_PID

fi

exec mysqld --user=mysql