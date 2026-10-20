ALTER TABLE `game_invitations`
    ADD COLUMN IF NOT EXISTS `sender_id` CHAR(36) NULL,
    ADD COLUMN IF NOT EXISTS `recipient_id` CHAR(36) NULL,
    ADD COLUMN IF NOT EXISTS `chat_id` CHAR(36) NULL,
    ADD COLUMN IF NOT EXISTS `board_size` INTEGER NULL;

CREATE INDEX IF NOT EXISTS `game_invitations_chat_status_idx`
    ON `game_invitations` (`chat_id`, `status`);
