/* Replace with your SQL commands */
CREATE TABLE users (
    user_id serial PRIMARY KEY,
    username VARCHAR (50) UNIQUE NOT NULL,
	  password VARCHAR (50) NOT NULL,
    role VARCHAR (50)
);