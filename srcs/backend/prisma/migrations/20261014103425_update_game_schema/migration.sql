/*
  Warnings:

  - You are about to drop the column `result` on the `games` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `games` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invitation_id]` on the table `games` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `board` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `board_size` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_turn_user_id` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invitation_id` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_o_id` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player_x_id` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `games` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winning_line` to the `games` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `games` DROP FOREIGN KEY `games_user_id_fkey`;

-- DropIndex
DROP INDEX `games_created_at_idx` ON `games`;

-- DropIndex
DROP INDEX `games_user_id_idx` ON `games`;

-- AlterTable
ALTER TABLE `games` DROP COLUMN `result`,
    DROP COLUMN `user_id`,
    ADD COLUMN `board` JSON NOT NULL,
    ADD COLUMN `board_size` INTEGER NOT NULL,
    ADD COLUMN `closed_at` DATETIME(3) NULL,
    ADD COLUMN `current_turn_user_id` CHAR(36) NOT NULL,
    ADD COLUMN `invitation_id` CHAR(36) NOT NULL,
    ADD COLUMN `is_draw` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `player_o_id` CHAR(36) NOT NULL,
    ADD COLUMN `player_o_left_at` DATETIME(3) NULL,
    ADD COLUMN `player_x_id` CHAR(36) NOT NULL,
    ADD COLUMN `player_x_left_at` DATETIME(3) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `winner_id` CHAR(36) NULL,
    ADD COLUMN `winning_line` JSON NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `games_invitation_id_key` ON `games`(`invitation_id`);

-- AddForeignKey
ALTER TABLE `games` ADD CONSTRAINT `games_player_x_id_fkey` FOREIGN KEY (`player_x_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `games` ADD CONSTRAINT `games_player_o_id_fkey` FOREIGN KEY (`player_o_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `games` ADD CONSTRAINT `games_winner_id_fkey` FOREIGN KEY (`winner_id`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
