#!/bin/bash

set -e

MYSQL_PASSWORD=$(cat /run/secrets/mysql_password | tr -d '\n')
MYSQL_ROOT_PASSWORD=$(cat /run/secrets/mysql_root_password | tr -d '\n')

echo "DEBUG MYSQL_DATABASE=${MYSQL_DATABASE}"
echo "DEBUG MYSQL_USER=${MYSQL_USER}"

if [ ! -d /var/lib/mysql/mysql ]; then
    echo "DEBUG: mysql dir not found, running mysql_install_db"
    mkdir -p /var/lib/mysql
    chown -R mysql:mysql /var/lib/mysql
    mysql_install_db --user=mysql --datadir=/var/lib/mysql
else
    echo "DEBUG: mysql dir exists"
fi

if [ ! -d /var/lib/mysql/transcendance ]; then
    echo "DEBUG: running init"
    mysqld --user=mysql &
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
EOF

    kill $MYSQLD_PID
    wait $MYSQLD_PID
else
    echo "DEBUG: transcendance already exists, skipping init"
fi

exec mysqld --user=mysql