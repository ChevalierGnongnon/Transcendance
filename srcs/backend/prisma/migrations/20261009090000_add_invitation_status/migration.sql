CREATE TABLE `game_invitations` (
    `invitation_id` CHAR(36) NOT NULL,
    `status` ENUM('pending', 'accepted', 'declined', 'expired') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `resolved_at` DATETIME(3) NULL,

    PRIMARY KEY (`invitation_id`),
    INDEX `game_invitations_status_created_at_idx`(`status`, `created_at`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `game_invitations` (`invitation_id`, `status`, `created_at`, `resolved_at`)
SELECT
    `messages`.`id`,
    CASE WHEN `games`.`id` IS NULL THEN 'expired' ELSE 'accepted' END,
    `messages`.`created_at`,
    `games`.`created_at`
FROM `messages`
LEFT JOIN `games` ON `games`.`invitation_id` = `messages`.`id`
WHERE `messages`.`type` = 'invitation';
