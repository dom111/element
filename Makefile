SHELL = /bin/bash

.PHONY: build
build:
	npm run build

.PHONY: test
test:
	docker-compose run --rm test npm run test
