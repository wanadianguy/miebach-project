# Miebach Project
## Launch Project
- Have a docker deamon running
- From root directory, run `docker compose -f docker-compose.database.yml up -d`
- Go to `/backend` and run `npx mikro-orm migration:up`
- From root directory, run `docker compose -f docker-compose.yml up -d`
- Open `localhost:5173` in a web browser
## Test credentials
- manager:
    - email: manager@example.com
    - password: password
- contributor:
    - email: manager@example.com
    - password: password
## Choices
- I opted for a desktop first application since I assumed it would mostly/only be used on a desktop.
- I chose to link entities as much as possible to have the choice to "populate" when getting data so that I would reduce the number of requests and therefore reduce the strain on the backend server (if we were to be on a production-grade application)
## What's next
- Improve resiliency
- Improve responsiveness of the frontend (not that important since it's mostly a desktop application)
- Dynamic reload of components after adding project, phase, task...
- Add request caching
- Create a more modular frontend (e.g.: the dialog could be a highly customizable component instead of multiple hard-coded instances)
- Integrate the possibility to change states within the frontend app + attribute colors to the different statuses for a more user-friendly interface
- Add useful tools to the overview tab of the detailed project view like a burndown chart
- Create environment variables for the frontend
- Create more feedback for the user (e.g.: when creating an invoice)
- Fix a few bugs I came across
## Side notes
- The authentication checks are deactivated (Anotation commented) to ease the testing, especially with Postman
- `.env` was pushed for ease of testing, but we wouldn't do that on a production-grade application
