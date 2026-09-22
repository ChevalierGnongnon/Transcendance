/*
  Warnings:

  - You are about to alter the column `chat_id` on the `file` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.
  - The primary key for the `friendships` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `friendships` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `friendships` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `friendships` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `friendships` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.
  - You are about to alter the column `user_id` on the `friendships` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.
  - You are about to alter the column `friend_id` on the `friendships` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(36)`.

*/
-- DropForeignKey
ALTER TABLE `file` DROP FOREIGN KEY `file_chat_id_fkey`;

-- DropForeignKey
ALTER TABLE `friendships` DROP FOREIGN KEY `friendships_friend_id_fkey`;

-- DropForeignKey
ALTER TABLE `friendships` DROP FOREIGN KEY `friendships_user_id_fkey`;

-- DropIndex
DROP INDEX `file_chat_id_fkey` ON `file`;

-- DropIndex
DROP INDEX `friendships_friend_id_status_idx` ON `friendships`;

-- DropIndex
DROP INDEX `friendships_user_id_status_idx` ON `friendships`;

-- AlterTable
ALTER TABLE `file` MODIFY `chat_id` CHAR(36) NULL;

-- AlterTable
ALTER TABLE `friendships` DROP PRIMARY KEY,
    DROP COLUMN `created_at`,
    DROP COLUMN `status`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `id` CHAR(36) NOT NULL,
    MODIFY `user_id` CHAR(36) NOT NULL,
    MODIFY `friend_id` CHAR(36) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `friend_request` (
    `id` CHAR(36) NOT NULL,
    `sender_id` CHAR(36) NOT NULL,
    `receiver_id` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `friend_request_receiver_id_idx`(`receiver_id`),
    UNIQUE INDEX `friend_request_sender_id_receiver_id_key`(`sender_id`, `receiver_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `block` (
    `id` CHAR(36) NOT NULL,
    `blocker_id` CHAR(36) NOT NULL,
    `blocked_id` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `block_blocked_id_idx`(`blocked_id`),
    UNIQUE INDEX `block_blocker_id_blocked_id_key`(`blocker_id`, `blocked_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `friendships_friend_id_idx` ON `friendships`(`friend_id`);

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friendships` ADD CONSTRAINT `friendships_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friendships` ADD CONSTRAINT `friendships_friend_id_fkey` FOREIGN KEY (`friend_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_request` ADD CONSTRAINT `friend_request_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend_request` ADD CONSTRAINT `friend_request_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `block` ADD CONSTRAINT `block_blocker_id_fkey` FOREIGN KEY (`blocker_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `block` ADD CONSTRAINT `block_blocked_id_fkey` FOREIGN KEY (`blocked_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
