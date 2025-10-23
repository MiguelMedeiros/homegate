.PHONY: help up down restart logs build clean frontend backend phoenixd

# Default target
help:
	@echo "Home Gate - Docker Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - View logs (all services)"
	@echo "  make build       - Build/rebuild services"
	@echo "  make clean       - Stop and remove all containers, networks, and volumes"
	@echo ""
	@echo "Service-specific commands:"
	@echo "  make frontend    - View frontend logs"
	@echo "  make backend     - View backend logs"
	@echo "  make phoenixd    - View phoenixd logs"
	@echo ""
	@echo "Development commands:"
	@echo "  make dev         - Start services in development mode"
	@echo "  make shell       - Open shell in frontend container"
	@echo "  make shell-be    - Open shell in backend container"

# Start all services
up:
	docker compose up -d

# Start in foreground (development)
dev:
	docker compose up

# Stop all services
down:
	docker compose down

# Restart all services
restart:
	docker compose restart

# View all logs
logs:
	docker compose logs -f

# Build/rebuild services
build:
	docker compose up --build -d

# Frontend logs
frontend:
	docker compose logs -f frontend

# Backend logs
backend:
	docker compose logs -f backend

# phoenixd logs
phoenixd:
	docker compose logs -f phoenixd

# Clean everything
clean:
	docker compose down -v
	rm -rf phoenixd/

# Shell access to frontend
shell:
	docker compose exec frontend sh

# Shell access to backend
shell-be:
	docker compose exec backend sh

# Install npm packages in frontend
install:
	docker compose exec frontend npm install

# Run npm commands in frontend
npm-run:
	@read -p "Enter npm command: " cmd; \
	docker compose exec frontend npm run $$cmd

