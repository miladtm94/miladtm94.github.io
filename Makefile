SITE_DIR := $(shell pwd)
VENV      := $(SITE_DIR)/.venv
PYTHON    := $(VENV)/bin/python

.PHONY: serve rebuild stop logs push open venv bib

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

## Create/update the Python virtual environment (run once)
venv:
	python3 -m venv $(VENV)
	$(VENV)/bin/pip install --upgrade pip -q
	$(VENV)/bin/pip install -r requirements.txt
	@echo "Virtual environment ready at .venv/"

## Convert BibTeX files in files/ to _publications/ markdown
bib:
	@test -f $(PYTHON) || (echo "Run 'make venv' first to set up the Python environment." && exit 1)
	$(PYTHON) scripts/bib_to_md.py $(BIB)

## Show this help
help:
	@grep -E '^##' Makefile | sed 's/## /  /'
