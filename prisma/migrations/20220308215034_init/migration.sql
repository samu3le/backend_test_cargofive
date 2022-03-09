/*
  Warnings:

  - You are about to drop the `article_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "article_categories" DROP CONSTRAINT "article_categories_id_article_fkey";

-- DropForeignKey
ALTER TABLE "article_categories" DROP CONSTRAINT "article_categories_id_category_fkey";

-- DropTable
DROP TABLE "article_categories";
