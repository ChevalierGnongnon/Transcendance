
CREATE TABLE account (
	account_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(50),
	last_name VARCHAR(50),
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	pseudo VARCHAR(30) UNIQUE NOT NULL,
	-- profile_photo_url VARCHAR(255),
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	-- games_played INTEGER UNSIGNED NOT NULL DEFAULT 0,
	-- games_won INTEGER UNSIGNED NOT NULL DEFAULT 0,
	-- games_lost INTEGER UNSIGNED NOT NULL DEFAULT 0,
	-- personal_best INTEGER UNSIGNED NOT NULL DEFAULT 0,
	is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- CREATE TABLE game (
-- 	game_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
-- 	players_count INTEGER UNSIGNED NOT NULL,
-- 	played_at DATETIME NOT NULL,
-- 	winner_id INTEGER UNSIGNED NOT NULL,
-- 	FOREIGN KEY (winner_id) REFERENCES account(account_id)
-- );

-- CREATE TABLE game_player (
-- 	game_player_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
-- 	game_id INTEGER UNSIGNED NOT NULL,
-- 	account_id INTEGER UNSIGNED NOT NULL,
-- 	score INTEGER UNSIGNED NOT NULL,
-- 	placement INTEGER UNSIGNED NOT NULL,
-- 	FOREIGN KEY (game_id) REFERENCES game(game_id)
-- 	ON DELETE CASCADE,
-- 	FOREIGN KEY (account_id) REFERENCES account(account_id)
-- 	ON DELETE CASCADE,
-- 	UNIQUE (game_id, account_id)
-- );

-- CREATE TABLE friendship (
-- 	account_id_1 INTEGER UNSIGNED NOT NULL,
-- 	account_id_2 INTEGER UNSIGNED NOT NULL,
-- 	created_at DATETIME NOT NULL,
-- 	FOREIGN KEY (account_id_1) REFERENCES account(account_id)
-- 	ON DELETE CASCADE,
-- 	FOREIGN KEY (account_id_2) REFERENCES account(account_id)
-- 	ON DELETE CASCADE,
-- 	PRIMARY KEY(account_id_1, account_id_2),
-- 	CHECK (account_id_1 < account_id_2)
-- );

-- CREATE TABLE blocking(
-- 	account_blocker_id INTEGER UNSIGNED NOT NULL,
-- 	account_blocked_id INTEGER UNSIGNED NOT NULL,
-- 	FOREIGN KEY (account_blocker_id) REFERENCES account(account_id)
-- 	ON DELETE CASCADE,
--     FOREIGN KEY (account_blocked_id) REFERENCES account(account_id)
-- 	ON DELETE CASCADE,
-- 	PRIMARY KEY(account_blocker_id, account_blocked_id),
-- 	CHECK (account_blocker_id != account_blocked_id)
-- );

-- CREATE TABLE conversation(
-- 	conversation_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
-- 	account_id_1 INTEGER UNSIGNED,
-- 	account_id_2 INTEGER UNSIGNED,
-- 	created_at DATETIME NOT NULL,
-- 	FOREIGN KEY (account_id_1) REFERENCES account(account_id)
-- 	ON DELETE SET NULL,
-- 	FOREIGN KEY (account_id_2) REFERENCES account(account_id)
-- 	ON DELETE SET NULL
-- );

-- CREATE TABLE message(
-- 	message_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
-- 	conversation_id INTEGER NOT NULL,
-- 	sender_id INTEGER UNSIGNED NOT NULL,
-- 	content TEXT NOT NULL,
-- 	is_read BOOLEAN,
-- 	send_at DATETIME,
-- 	read_at DATETIME,
-- 	FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id)
-- 	ON DELETE CASCADE,
-- 	FOREIGN KEY (sender_id) REFERENCES account(account_id)
-- 	ON DELETE CASCADE
-- );

-- CREATE TABLE notification(
-- 	notification_id INTEGER PRIMARY KEY AUTO_INCREMENT,
-- 	notification_type ENUM('message', 'friend_request', 'game_invite', 'news') NOT NULL,
-- 	is_read BOOLEAN NOT NULL,
-- 	created_at DATETIME NOT NULL,
-- 	read_at DATETIME,
-- 	sender_type ENUM('user', 'friend', 'moderation', 'newsletter') NOT NULL,
-- 	sender_id INTEGER UNSIGNED,
-- 	receiver_id INTEGER UNSIGNED NOT NULL,
-- 	FOREIGN KEY (sender_id) REFERENCES account(account_id)
-- 	ON DELETE SET NULL, 
-- 	FOREIGN KEY (receiver_id) REFERENCES account(account_id)
-- 	ON DELETE CASCADE
-- );
