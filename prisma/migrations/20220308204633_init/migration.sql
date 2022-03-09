-- CreateTable
CREATE TABLE "_articlesTocategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_articlesTocategories_AB_unique" ON "_articlesTocategories"("A", "B");

-- CreateIndex
CREATE INDEX "_articlesTocategories_B_index" ON "_articlesTocategories"("B");

-- AddForeignKey
ALTER TABLE "_articlesTocategories" ADD FOREIGN KEY ("A") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_articlesTocategories" ADD FOREIGN KEY ("B") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
