include .env
site_name = ${PREFIX}-${PROJECT_NAME}
postgres_name = ${site_name}-db

create:
	heroku create ${site_name} --region eu

pg:
	heroku addons:create heroku-postgresql:hobby-dev --name=${postgres_name}

push:
	git push heroku main

open:
	heroku open

deploy: create pg push open

destroy:
	heroku destroy ${site_name} --confirm=${site_name}

pg-destroy:
	heroku addons:destroy heroku-postgresql --confirm=${site_name}

redeploy: pg-destroy destroy deploy