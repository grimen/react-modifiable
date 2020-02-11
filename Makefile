
all: build

.PHONY: install
install:
	yarn install

.PHONY: install-ci
install-ci: install

.PHONY: build
build:
	yarn run build

.PHONY: build-dev
build-dev:
	yarn run build-dev

.PHONY: test
test:
	yarn run test

.PHONY: test-dev
test-dev:
	yarn run test-dev

.PHONY: test-ci
test-ci:
	yarn run test-ci

.PHONY: validate
validate:
	yarn run validate

.PHONY: release
release:
	yarn run release

.PHONY: coverage
coverage:
	yarn run coverage
