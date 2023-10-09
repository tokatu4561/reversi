drop database if exists `reversi`;

create database `reversi` default character set utf8mb4 collate utf8mb4_unicode_ci;

use `reversi`;

create table players (
    id int auto_increment,
    name varchar(255) not null,
    primary key (id)
);

create table rooms (
    id int auto_increment,
    name varchar(255) not null,
    -- // 作成者 プレイヤーのidにする
    dark_player_id varchar(20),
    light_player_id varchar(20),
    primary key (id)
);

create table games (
    id int auto_increment,
    room_id int not null,
    started_at datetime not null,
    primary key (id)
);

create table turns (
    id int auto_increment,
    game_id int not null,
    -- player_id int unsigned not null,
    turn_count int not null,
    next_disc int,
    end_at datetime not null,
    primary key (id),
    foreign key (game_id) references games(id),
    unique (game_id, turn_count)
);

create table moves (
    id int auto_increment,
    turn_id int not null,
    disc int not null,
    x int not null,
    y int not null,
    primary key (id),
    foreign key (turn_id) references turns(id)
);

create table squares (
    id int auto_increment,
    turn_id int not null,
    x int not null,
    y int not null,
    disc int not null,
    primary key (id),
    foreign key (turn_id) references turns(id),
    unique (turn_id, x, y)
);

create table game_results (
    id int auto_increment,
    game_id int not null,
    -- 勝者 プレイヤーのid 
    winner_id int unsigned not null,
    end_at datetime not null,
    primary key (id),
    foreign key (game_id) references games(id)
);