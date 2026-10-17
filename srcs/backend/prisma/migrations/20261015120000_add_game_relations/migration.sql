INSERT INTO `game_invitations` (`invitation_id`, `status`, `created_at`, `resolved_at`)
SELECT `games`.`invitation_id`, 'accepted', `games`.`created_at`, `games`.`created_at`
FROM `games`
LEFT JOIN `game_invitations`
    ON `game_invitations`.`invitation_id` = `games`.`invitation_id`
WHERE `game_invitations`.`invitation_id` IS NULL;

ALTER TABLE `games`
    ADD CONSTRAINT `games_invitation_id_fkey`
        FOREIGN KEY (`invitation_id`) REFERENCES `game_invitations` (`invitation_id`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT `games_player_x_id_fkey`
        FOREIGN KEY (`player_x_id`) REFERENCES `user` (`id`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT `games_player_o_id_fkey`
        FOREIGN KEY (`player_o_id`) REFERENCES `user` (`id`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT `games_winner_id_fkey`
        FOREIGN KEY (`winner_id`) REFERENCES `user` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE;