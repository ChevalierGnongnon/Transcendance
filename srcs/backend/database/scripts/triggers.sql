USE transcendance;
DELIMITER //

CREATE TRIGGER protect_admin_account
BEFORE DELETE ON account
FOR EACH ROW
BEGIN
    IF OLD.account_type = 'admin' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cannot delete admin account';
    END IF
END //

CREATE TRIGGER reset_defaut_avatar
BEFORE DELETE ON file
FOR EACH ROW
BEGIN
    DECLARE random_avatar CHAR(36)
    IF OLD.type = 'profile_photo' THEN
        SELECT file_id INTO random_avatar
        FROM file
        WHERE type = 'default_avatar'
        AND uploader_id IN (SELECT account_id FROM account WHERE account_type = 'admin')
        AND file_id != OLD.file_id
        ORDER BY RAND()
        LIMIT 1;

        UPDATE account
        SET profile_photo_id = random_avatar
        WHERE profile_photo_id = OLD.file_id;
    END IF
END //
DELIMITER ;