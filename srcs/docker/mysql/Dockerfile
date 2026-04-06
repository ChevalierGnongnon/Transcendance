FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y mysql-server \
	&& rm -rf /var/lib/apt/lists/*

COPY backend/database/database_creation.sql /tmp/

COPY tools/database-script.sh /usr/local/bin

EXPOSE 3306

RUN chmod +x /usr/local/bin/database-script.sh 

ENTRYPOINT ["/usr/local/bin/database-script.sh"]


