#!/bin/bash

set -e

MYSQL_PASSWORD=$(cat /run/secrets/mysql_password)
MYSQL_ROOT_PASSWORD=$(cat /run/secrets/mysql_root_password)

if [ ! -d /var/lib/mysql/mysql ]; then

mkdir -p /var/lib/mysql
chown -R mysql:mysql /var/lib/mysql
mysqld --initialize-insecure --user=mysql

cat > /tmp/init.sql << EOF
USE mysql;
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF


cat /tmp/database_creation.sql >> /tmp/init.sql
exec mysqld --user=mysql --init-file=/tmp/init.sql

fi

exec mysqld --user=mysql