ALTER TABLE `game_invitations`
    MODIFY `status` ENUM('pending', 'accepted', 'declined', 'expired', 'cancelled') NOT NULL DEFAULT 'pending';