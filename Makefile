ENV_FILE = .env
DC = docker compose --env-file $(ENV_FILE) -f docker/compose.yml

help: ## Display this help message
	@echo "List of available commands:"
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-20s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo "Usage example:"
	@echo "  make up           # Start services"
	@echo "  make build        # Build images"
	@echo "  make clear-cache  # Remove docker cache"

up: ## Start services
	$(DC) up -d
	@echo "Server is up and running 🚀!"

down: ## Stop services
	$(DC) down
	@echo "Server is down 🛑!"

build: ## Build or rebuild services
	$(DC) build
	@echo "Server is built 🧩!"

no-cache: ## Build services without using cache
	$(DC) build --no-cache
	@echo "Server is built without cache 🧩!"

restart: ## Restart services
	$(DC) restart
	@echo "Server is restarted 🔄!"

start: ## Start services if stopped
	$(DC) start
	@echo "Server is started 🚀!"

stop: ## Stop services
	$(DC) stop
	@echo "Server is stopped 🛑!"

logs: ## View logs for services
	$(DC) logs -f
	@echo "Streaming logs 📜!"

clear-cache: ## Clear all Docker cache (including volumes)
	docker system prune -a --volumes -f
	@echo "All Docker cache cleared 🚀!"