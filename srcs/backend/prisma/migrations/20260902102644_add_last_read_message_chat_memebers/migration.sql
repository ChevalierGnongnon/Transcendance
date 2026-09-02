/*
  Warnings:

  - Added the required column `last_read_message_id` to the `chat_members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chat_members` ADD COLUMN `last_read_message_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `chat_members` ADD CONSTRAINT `chat_members_last_read_message_id_fkey` FOREIGN KEY (`last_read_message_id`) REFERENCES `messages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
