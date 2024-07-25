/*
  Warnings:

  - Made the column `content` on table `articles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `articles` MODIFY `content` VARCHAR(255) NOT NULL;
