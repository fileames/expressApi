## Running

To run:
```bash
yarn start
```

### Documentation

Api documentation using Postman can be found [here](https://documenter.getpostman.com/view/10799193/Tzm3py1U#ed2103c1-5c8f-4366-b80b-5ee4f7814817)


## Preparation

### Docker
docker command to create postgresql database
```bash
docker run --name postgres -p 32772:5432 --env POSTGRES_PASSWORD=admin --env POSTGRES_USER=admin --env POSTGRES_DB=demo postgres
```

### Database
to create the tables
```sql
create table recipes(
    id              SERIAL PRIMARY KEY,
    name TEXT,
    cook_time_minutes integer,
    time_added timestamp
)
```
```sql
create table ingredients(
    recipe_id   SERIAL,
    ingredient text,
    PRIMARY KEY(recipe_id,ingredient),
    CONSTRAINT fk
      FOREIGN KEY(recipe_id)
	  REFERENCES recipes(id)
      ON DELETE CASCADE
)
```

### Environment
.env file contents if above docker command is used
```
PG_USERNAME = admin
PG_PASSWORD = admin
POSTGRES_DB = demo
PG_HOST = 127.0.0.1
PG_PORT = 32772
APP_PORT = 3000
```
