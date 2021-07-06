docker command to create postgresql database
```bash
docker run --name postgres -p 32772:5432 --env POSTGRES_PASSWORD=admin --env POSTGRES_USER=admin --env POSTGRES_DB=demo postgres
```

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

.env file contents if above docker command is used
```
PG_USERNAME = admin
PG_PASSWORD = admin
POSTGRES_DB = demo
PG_HOST = 127.0.0.1
PG_PORT = 32772
APP_PORT = 3000
```
