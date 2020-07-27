create table notes
(
	note_id serial primary key,
	note_name varchar not null,
	user_id integer not null,
	foreign key (user_id) references users(user_id)
);

create table todos
(
    todo_id serial primary key,
    todo_name varchar not null,
    todo_done boolean not null,
    note_id integer not null,
    foreign key (note_id) references notes(note_id)
);
