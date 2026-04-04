DC:=docker compose
LOGIN=chhoflac

all: up

up:
# 	@echo "Building images and starting the containers"
	@sudo mkdir -p $(WP_DATA) $(DB_DATA)
	@cd srcs/ && $(DC) up -d --build

down :
# 	@echo "Shutting down the server and containers"
	@cd srcs/ && $(DC) down

clean : down
	@echo "light cleaning"

fclean : clean
# 	@echo "Deleting Wordpress and mariadb volumes"
	@cd srcs/ && $(DC) down -v
	@sudo rm -rf $(WP_DATA) $(DB_DATA)

re : fclean all
# 	@echo "Restarting server and services"

logs :
# 	@echo "Showing  containers logs"
	@cd srcs/ && $(DC) logs -f

big_reset:
	@echo "⚠️  BIG RESET: removing ALL docker containers/images/volumes/networks on this VM"
	@docker stop $$(docker ps -qa) 2>/dev/null || true
	@docker rm $$(docker ps -qa) 2>/dev/null || true
	@docker rmi -f $$(docker images -qa) 2>/dev/null || true
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@docker network rm $$(docker network ls -q) 2>/dev/null || true

factory_reset: fclean big_reset
	@echo "Nuke clean, data is also deleted"

ps :
	@echo "Active containers :"
	@cd srcs/ && $(DC) ps

.PHONY : all up down clean fclean re logs big_reset ps factory_reset