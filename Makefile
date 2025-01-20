build:
	docker build -t lovebot .
run:
	docker run -d -p 3000:3000 --name lovebot --rm lovebot