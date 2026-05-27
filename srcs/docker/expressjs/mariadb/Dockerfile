FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y mariadb-server \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /var/lib/mysql/*

COPY srcs/docker/mariadb/config/50-server.cnf /etc/mysql/mariadb.conf.d/50-server.cnf
COPY srcs/backend/database/database_creation.sql /tmp/
COPY srcs/docker/mariadb/tools/database-script.sh /usr/local/bin/

RUN mkdir -p /run/mysqld \
    && chown -R mysql:mysql /run/mysqld

EXPOSE 3306

RUN chmod +x /usr/local/bin/database-script.sh 

ENTRYPOINT ["/usr/local/bin/database-script.sh"]
