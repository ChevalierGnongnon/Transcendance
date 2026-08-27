-- protects admin account
CREATE TRIGGER protect_admin_account
BEFORE DELETE ON user
FOR EACH ROW
BEGIN
    IF OLD.type = 'admin' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete admin account';
    END IF;
END;

-- gives a random avatar if a profile photo is deleted
CREATE TRIGGER reset_defaut_avatar
BEFORE DELETE ON file
FOR EACH ROW
BEGIN
    DECLARE random_avatar CHAR(36);
    IF OLD.type = 'profile_photo' THEN
        SELECT id INTO random_avatar
        FROM file
        WHERE type = 'default_avatar'
        AND user_id IN (SELECT id FROM user WHERE type = 'admin')
        AND id != OLD.id
        ORDER BY RAND()
        LIMIT 1;

        UPDATE user
        SET profile_photo_id = random_avatar
        WHERE profile_photo_id = OLD.id;
    END IF;
END;
