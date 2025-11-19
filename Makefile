.PHONY: install dev start test lint format clean

install:
	npm install

dev:
	npm run dev

start:
	npm start

test:
	npm test

lint:
	npm run lint

format:
	npm run format

clean:
	rm -rf node_modules

seed:
	npm run seed

health-check:
	npm run health-check
