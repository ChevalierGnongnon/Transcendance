FROM debian:bookworm-slim

RUN apt-get update \
	&&  apt-get install -y --no-install-recommends nginx openssl ca-certificates \
	&& mkdir -p /etc/nginx/ssl \
	&& openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
	-keyout /etc/nginx/ssl/chhoflac.key \
	-out /etc/nginx/ssl/chhoflac.crt \
	-subj "/C=FR/ST=GRAND_EST/L=MULHOUSE/O=42/OU=chhoflac/CN=chhoflac.42.fr" \
	&& rm -rf /var/lib/apt/lists/* 
	
EXPOSE 443

COPY ./conf/default.conf /etc/nginx/sites-available/chhoflac

RUN rm -f /etc/nginx/sites-enabled/default \
    && ln -sf /etc/nginx/sites-available/chhoflac /etc/nginx/sites-enabled/chhoflac

CMD ["nginx", "-g", "daemon off;"]
