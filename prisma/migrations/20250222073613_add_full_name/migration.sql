/*
  Warnings:

  - Added the required column `full_name_country` to the `airports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "airports" ADD COLUMN     "full_name_country" TEXT NOT NULL;
