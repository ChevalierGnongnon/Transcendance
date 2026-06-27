USE transcendance;

CREATE TABLE account (
	account_id CHAR(36) PRIMARY KEY,
	name VARCHAR(50),
	last_name VARCHAR(50),
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255),
	pseudo VARCHAR(30) UNIQUE NOT NULL,
	profile_photo_url VARCHAR(255),
	birthdate DATE NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	games_played INTEGER UNSIGNED NOT NULL DEFAULT 0,
	games_won INTEGER UNSIGNED NOT NULL DEFAULT 0,
	games_lost INTEGER UNSIGNED NOT NULL DEFAULT 0,
	personal_best INTEGER UNSIGNED NOT NULL DEFAULT 0,
	is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE Oauth_account(
	account_id CHAR(36) NOT NULL,
	provider VARCHAR(20),
	provider_id VARCHAR(255),
	FOREIGN KEY (account_id) REFERENCES account(account_id),
	PRIMARY KEY(account_id, provider)
);

CREATE TABLE game (
	game_id CHAR(36) PRIMARY KEY,
	players_count INTEGER UNSIGNED NOT NULL,
	played_at DATETIME NOT NULL,
	winner_id CHAR(36) NOT NULL,
	FOREIGN KEY (winner_id) REFERENCES account(account_id)
);

CREATE TABLE game_player (
	game_player_id CHAR(36) PRIMARY KEY,
	game_id CHAR(36) NOT NULL,
	account_id CHAR(36) NOT NULL,
	score INTEGER UNSIGNED NOT NULL,
	placement INTEGER UNSIGNED NOT NULL,
	FOREIGN KEY (game_id) REFERENCES game(game_id)
	ON DELETE CASCADE,
	FOREIGN KEY (account_id) REFERENCES account(account_id)
	ON DELETE CASCADE,
	UNIQUE (game_id, account_id)
);

CREATE TABLE friendship (
	account_id_1 CHAR(36) NOT NULL,
	account_id_2 CHAR(36) NOT NULL,
	created_at DATETIME NOT NULL,
	FOREIGN KEY (account_id_1) REFERENCES account(account_id)
	ON DELETE CASCADE,
	FOREIGN KEY (account_id_2) REFERENCES account(account_id)
	ON DELETE CASCADE,
	PRIMARY KEY(account_id_1, account_id_2),
	CHECK (account_id_1 < account_id_2)
);

CREATE TABLE blocking(
	account_blocker_id CHAR(36) NOT NULL,
	account_blocked_id CHAR(36) NOT NULL,
	FOREIGN KEY (account_blocker_id) REFERENCES account(account_id)
	ON DELETE CASCADE,
	FOREIGN KEY (account_blocked_id) REFERENCES account(account_id)
	ON DELETE CASCADE,
	PRIMARY KEY(account_blocker_id, account_blocked_id),
	CHECK (account_blocker_id != account_blocked_id)
);

CREATE TABLE conversation(
	conversation_id CHAR(36) PRIMARY KEY,
	account_id_1 CHAR(36),
	account_id_2 CHAR(36),
	created_at DATETIME NOT NULL,
	FOREIGN KEY (account_id_1) REFERENCES account(account_id)
	ON DELETE SET NULL,
	FOREIGN KEY (account_id_2) REFERENCES account(account_id)
	ON DELETE SET NULL
);

CREATE TABLE message(
	message_id CHAR(36) PRIMARY KEY,
	conversation_id CHAR(36) NOT NULL,
	sender_id CHAR(36) NOT NULL,
	content TEXT NOT NULL,
	is_read BOOLEAN,
	send_at DATETIME,
	read_at DATETIME,
	FOREIGN KEY (conversation_id) REFERENCES conversation(conversation_id)
	ON DELETE CASCADE,
	FOREIGN KEY (sender_id) REFERENCES account(account_id)
	ON DELETE CASCADE
);

CREATE TABLE notification(
	notification_id CHAR(36) PRIMARY KEY,
	notification_type ENUM('message', 'friend_request', 'game_invite', 'news') NOT NULL,
	is_read BOOLEAN NOT NULL,
	created_at DATETIME NOT NULL,
	read_at DATETIME,
	sender_type ENUM('user', 'friend', 'moderation', 'newsletter') NOT NULL,
	sender_id CHAR(36),
	receiver_id CHAR(36) NOT NULL,
	FOREIGN KEY (sender_id) REFERENCES account(account_id)
	ON DELETE SET NULL,
	FOREIGN KEY (receiver_id) REFERENCES account(account_id)
	ON DELETE CASCADE
);

CREATE TABLE file(
	file_id CHAR(36) PRIMARY KEY,
	file_name VARCHAR(255) NOT NULL,
	uploader_id CHAR(36) NOT NULL,
	type ENUM('profile_photo', 'message') NOT NULL,
	uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (uploader_id) REFERENCES account(account_id) ON DELETE CASCADE
);
