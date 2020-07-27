create table users
(
	user_id serial not null primary key,
	user_name varchar unique not null,
	user_password varchar not null,
	user_role varchar
);

