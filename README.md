# Miebach Project
## Launch Project
- Have a docker deamon running
- From root directory, run `docker compose -f docker-compose.database.yml up -d`
- Go to `/backend` and run `npx mikro-orm migration:up`
- From root directory, run `docker compose -f docker-compose.yml up -d`
