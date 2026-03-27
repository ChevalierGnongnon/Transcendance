CREATE TABLE account (
  account_id INTEGER PRIMARY KEY,
  name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  pseudo VARCHAR(30) UNIQUE NOT NULL,
  profile_photo_url VARCHAR(255),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  games_played INTEGER NOT NULL DEFAULT 0,
  games_won INTEGER NOT NULL DEFAULT 0,
  games_lost INTEGER NOT NULL DEFAULT 0,
  personal_best INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE game (
  game_id INTEGER PRIMARY KEY,
  players_count INTEGER NOT NULL
);

CREATE TABLE game_player (
  game_player_id INTEGER PRIMARY KEY,
  game_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  placement INTEGER,
  FOREIGN KEY (game_id) REFERENCES game(game_id),
  FOREIGN KEY (account_id) REFERENCES account(account_id),
  UNIQUE (game_id, account_id)
);