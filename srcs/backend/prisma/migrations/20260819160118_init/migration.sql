-- CreateTable
CREATE TABLE `user` (
    `id` CHAR(36) NOT NULL,
    `type` ENUM('admin', 'user', 'moderator', 'guest') NOT NULL DEFAULT 'user',
    `email` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(50) NULL,
    `last_name` VARCHAR(50) NULL,
    `password_hash` VARCHAR(255) NULL,
    `pseudo` VARCHAR(30) NOT NULL,
    `profile_photo_id` CHAR(36) NULL,
    `birthdate` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    UNIQUE INDEX `user_pseudo_key`(`pseudo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `file` (
    `id` CHAR(36) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `type` ENUM('profile_photo', 'default_avatar', 'message') NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `expires_at` DATETIME(3) NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
