include .env
dir_name = $(notdir $(abspath .))
site_name = ${PREFIX}-${PROJECT_NAME}
postgres_name = ${site_name}-db

create:
	heroku create ${site_name} --region eu

env:
	heroku config:set JWT_SECRET=super_secret_123
	heroku config:set JWT_EXPIRE=1h
	heroku config:set CLIENT_URL=https://auth-react-jwt-access-cookie.vercel.app

pg:
	heroku addons:create heroku-postgresql:hobby-dev --name=${postgres_name}

push:
	git push heroku main

pipeline:
	heroku pipelines:create ${site_name} --stage=production

github:
	heroku pipelines:connect ${site_name} --repo=BlackLacost/${dir_name}

open:
	heroku open

deploy: create env pg push pipeline github open

destroy:
	heroku destroy ${site_name} --confirm=${site_name}

pg-destroy:
	heroku addons:destroy heroku-postgresql --confirm=${site_name}

pipeline-destroy:
	heroku pipelines:destroy ${site_name}

redeploy: pg-destroy destroy deploy