-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_profile_photo_id_fkey` FOREIGN KEY (`profile_photo_id`) REFERENCES `file`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
