/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- AlterTable
ALTER TABLE "articles" ALTER COLUMN "published_at" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "sessions";
