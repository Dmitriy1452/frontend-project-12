.PHONY: build
build:
	npm run build

start:
	npx start-server -s ./frontend/dist

install:
	npm ci
