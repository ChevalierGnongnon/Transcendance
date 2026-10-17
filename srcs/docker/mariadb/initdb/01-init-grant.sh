#!/bin/bash

ROOT_PASSWORD=$(tr -d '\r\n' < /run/secrets/mariadb_root_password)

mariadb -u root -p"$ROOT_PASSWORD" <<-EOSQL
    GRANT ALL PRIVILEGES ON *.* TO '${MARIADB_USER}'@'%';
    FLUSH PRIVILEGES;
EOSQL
