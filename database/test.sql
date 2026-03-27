TTable account{
  account_id integer [primary key]
  name VARCHAR(50)
  last_name VARCHAR(50)
  email VARCHAR(255) [unique, not null]
  password_hash VARCHAR(255) [not null]
  pseudo VARCHAR(30) [unique, not null]
  profile_photo_url VARCHAR(255)
  created_at timestamp [not null]
  updated_at timestamp [not null]
  games_played integer [not null, default: 0]
  games_won integer [not null, default: 0]
  games_lost integer [not null, default: 0]
  personal_best integer [not null, default: 0]
}

Table game{
  game_id integer [primary key]
  players_count integer [not null]
}

Table game_player{
  game_player_id integer [primary key]
  game_id integer [not null, ref: > game.game_id]
  account_id integer [not null, ref: > account.account_id]
  score integer [not null]
  placement integer
  /*to avoid same player multiple times on the same*/ 
  /*game*/
  indexes {
    (game_id, account_id) [unique]
  }
}