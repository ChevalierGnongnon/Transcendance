/*
  Warnings:

  - A unique constraint covering the columns `[file_name,type]` on the table `file` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `file_file_name_type_key` ON `file`(`file_name`, `type`);
