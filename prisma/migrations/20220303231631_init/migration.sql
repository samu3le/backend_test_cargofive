-- AddForeignKey
ALTER TABLE "article_categories" ADD CONSTRAINT "article_categories_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
