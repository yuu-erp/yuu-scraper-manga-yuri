docker run --name yuu-manga-db -e POSTGRES_PASSWORD=123456789 -p 5432:5432 -d postgres
docker exec -it yuu-manga-db psql -U postgres
CREATE DATABASE "yuu-manga-db";
CREATE USER admin WITH PASSWORD '123456789';
ALTER USER admin SUPERUSER;
CREATE DATABASE "yuu-manga-db-test";
