/*
  Warnings:

  - Made the column `first_name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `first_name` VARCHAR(50) NOT NULL,
    MODIFY `last_name` VARCHAR(50) NOT NULL;
