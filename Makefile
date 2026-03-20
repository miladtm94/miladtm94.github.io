SITE_DIR := $(shell pwd)

.PHONY: serve rebuild stop logs push open

## Start the Jekyll server (or restart if already running)
serve:
	docker compose up -d

## Rebuild the Docker image and restart (use after Gemfile changes)
rebuild:
	docker compose down
	docker compose build --no-cache
	docker compose up -d

## Stop the Jekyll server
stop:
	docker compose down

## Tail live logs from the Jekyll container
logs:
	docker compose logs -f

## Open site in browser
open:
	open http://localhost:4000

## Commit all changes and push — usage: make push MSG="your message"
push:
	@if [ -z "$(MSG)" ]; then \
		echo "Usage: make push MSG=\"your commit message\""; \
		exit 1; \
	fi
	git -C "$(SITE_DIR)" pull --rebase
	git -C "$(SITE_DIR)" add -A
	git -C "$(SITE_DIR)" commit -m "$(MSG)" || echo "Nothing new to commit."
	git -C "$(SITE_DIR)" push

## Show this help
help:
	@grep -E '^##' Makefile | sed 's/## /  /'
