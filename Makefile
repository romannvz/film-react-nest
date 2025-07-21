DOCKER_COMPOSE_local = docker/local/docker-compose.local.yml
DOCKER_COMPOSE_prod  = docker/prod/docker-compose.prod.yml
ENV_local             = docker/local/.env.local
ENV_prod              = docker/prod/.env.prod
ENV_LINK              = frontend/.env

# routes by env
DC      = $(DOCKER_COMPOSE_$(ENV))
ENVFILE = $(ENV_$(ENV))

# all local and prod targets are virtual
.PHONY: link-env start local-% prod-%

# restore envfile by simlink
link-env:
	@echo "🔗 Linking $(ENVFILE) → $(ENV_LINK)"
	ln -snf $(ENVFILE) $(ENV_LINK)

local-%: ENV = local
prod-%:  ENV = prod

local-%: link-env
prod-%:  link-env

start:
	docker-compose -f $(DC) up --build

local-start: start
prod-start:  start

# ────────────────────────────────────────────────────────────────────────────
# local shortcuts
# ────────────────────────────────────────────────────────────────────────────
local-up:
	docker-compose -f $(DC) --env-file $(ENVFILE) up -d --build

local-down:
	docker-compose -f $(DC) down

local-rebuild:
	docker-compose -f $(DC) --env-file $(ENVFILE) build --no-cache

local-logs:
	docker-compose -f $(DC) logs -f

local-shell-frontend:
	docker exec -it filmFrontend sh

local-shell-backend:
	docker exec -it filmBackend sh

# ────────────────────────────────────────────────────────────────────────────
# prod shortcuts
# ────────────────────────────────────────────────────────────────────────────
prod-build:
	docker-compose -f $(DC) --env-file $(ENVFILE) build

prod-up:
	docker-compose -f $(DC) --env-file $(ENVFILE) up -d

prod-down:
	docker-compose -f $(DC) down

prod-logs:
	docker-compose -f $(DC) logs -f

prod-shell-frontend:
	docker exec -it filmFrontend sh

prod-shell-backend:
	docker exec -it filmBackend sh
