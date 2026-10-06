CREATE TABLE `games` (
    `id` CHAR(36) NOT NULL,
    `invitation_id` CHAR(36) NOT NULL,
    `board_size` INTEGER NOT NULL,
    `player_x_id` CHAR(36) NOT NULL,
    `player_o_id` CHAR(36) NOT NULL,
    `current_turn_user_id` CHAR(36) NOT NULL,
    `board` JSON NOT NULL,
    `winner_id` CHAR(36) NULL,
    `is_draw` BOOLEAN NOT NULL DEFAULT false,
    `winning_line` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `games_invitation_id_key`(`invitation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;