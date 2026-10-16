-- AlterTable
ALTER TABLE `file` ADD COLUMN `chat_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `file` ADD CONSTRAINT `file_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `chats`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
