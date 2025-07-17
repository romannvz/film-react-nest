DOCKER_COMPOSE_LOCAL=docker/local/docker-compose.local.yml
DOCKER_COMPOSE_PROD=docker/prod/docker-compose.prod.yml
ENV_LOCAL=docker/local/.env.local
ENV_PROD=docker/local/.env.prod

# === local shortcuts ===

local-up:
	docker compose -f $(DOCKER_COMPOSE_LOCAL) --env-file $(ENV_LOCAL) up -d --build

local-down:
	docker compose -f $(DOCKER_COMPOSE_LOCAL) down

local-logs:
	docker compose -f $(DOCKER_COMPOSE_LOCAL) logs -f

local-rebuild:
	docker compose -f $(DOCKER_COMPOSE_LOCAL) --env-file $(ENV_LOCAL) build --no-cache

local-shell-backend:
	docker exec -it filmBackend sh

local-shell-frontend:
	docker exec -it filmFrontend sh

# === prod shortcuts ===

prod-build:
	docker compose -f $(DOCKER_COMPOSE_PROD) --env-file $(ENV_PROD) build

prod-up:
	docker compose -f $(DOCKER_COMPOSE_PROD) --env-file $(ENV_PROD) up -d

prod-down:
	docker compose -f $(DOCKER_COMPOSE_PROD) down

prod-logs:
	docker compose -f $(DOCKER_COMPOSE_PROD) logs -f

prod-shell-backend:
	docker exec -it filmBackend sh

prod-shell-frontend:
	docker exec -it filmFrontend sh