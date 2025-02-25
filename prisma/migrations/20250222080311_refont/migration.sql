/*
  Warnings:

  - The primary key for the `airports` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `altitude` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `dst` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `iata` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `icao` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `popularity` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `airports` table. All the data in the column will be lost.
  - You are about to drop the column `tzDatabase` on the `airports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ident]` on the table `airports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[icao_code]` on the table `airports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[iata_code]` on the table `airports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `continent` to the `airports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ident` to the `airports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iso_country` to the `airports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iso_region` to the `airports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude_deg` to the `airports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude_deg` to the `airports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `municipality` to the `airports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduled_service` to the `airports` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "airports_iata_key";

-- DropIndex
DROP INDEX "airports_icao_key";

-- AlterTable
ALTER TABLE "airports" DROP CONSTRAINT "airports_pkey",
DROP COLUMN "altitude",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "dst",
DROP COLUMN "iata",
DROP COLUMN "icao",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "popularity",
DROP COLUMN "source",
DROP COLUMN "timezone",
DROP COLUMN "tzDatabase",
ADD COLUMN     "continent" TEXT NOT NULL,
ADD COLUMN     "elevation_ft" INTEGER,
ADD COLUMN     "gps_code" TEXT,
ADD COLUMN     "home_link" TEXT,
ADD COLUMN     "iata_code" TEXT,
ADD COLUMN     "icao_code" TEXT,
ADD COLUMN     "ident" TEXT NOT NULL,
ADD COLUMN     "iso_country" TEXT NOT NULL,
ADD COLUMN     "iso_region" TEXT NOT NULL,
ADD COLUMN     "keywords" TEXT,
ADD COLUMN     "latitude_deg" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "local_code" TEXT,
ADD COLUMN     "longitude_deg" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "municipality" TEXT NOT NULL,
ADD COLUMN     "scheduled_service" TEXT NOT NULL,
ADD COLUMN     "wikipedia_link" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "full_name_country" DROP NOT NULL;
DROP SEQUENCE "airports_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "airports_ident_key" ON "airports"("ident");

-- CreateIndex
CREATE UNIQUE INDEX "airports_icao_code_key" ON "airports"("icao_code");

-- CreateIndex
CREATE UNIQUE INDEX "airports_iata_code_key" ON "airports"("iata_code");
