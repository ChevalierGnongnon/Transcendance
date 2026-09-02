-- DropForeignKey
ALTER TABLE `chat_members` DROP FOREIGN KEY `chat_members_last_read_message_id_fkey`;

-- DropIndex
DROP INDEX `chat_members_last_read_message_id_fkey` ON `chat_members`;

-- AlterTable
ALTER TABLE `chat_members` MODIFY `last_read_message_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `chat_members` ADD CONSTRAINT `chat_members_last_read_message_id_fkey` FOREIGN KEY (`last_read_message_id`) REFERENCES `messages`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
