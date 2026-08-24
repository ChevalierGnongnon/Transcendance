/*
  Warnings:

  - Made the column `password_hash` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `password_hash` VARCHAR(255) NOT NULL;
