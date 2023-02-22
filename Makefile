install:
	npm ci
lint:
	npx eslint .
test:
	npm test
test-coverage:
	NODE_OPTIONS=--experimental-vm-modules npx jest --coverage
publish:
	npm publish --dry-run