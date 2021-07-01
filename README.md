docker command to create postgresql database
```bash
docker run --name postgres -p 32772:5432 --env POSTGRES_PASSWORD=admin --env POSTGRES_USER=admin --env POSTGRES_DB=demo postgres
```

to create the tables
```sql
create table recipes(
    id              SERIAL PRIMARY KEY,
    name TEXT,
    cooktimeminutes integer,
    timeadded timestamp
)
```
```sql
create table ingredients(
    recipeid   SERIAL,
    ingredient text,
    PRIMARY KEY(recipeid,ingredient),
    CONSTRAINT fk
      FOREIGN KEY(recipeid)
	  REFERENCES recipes(id)
)
```
