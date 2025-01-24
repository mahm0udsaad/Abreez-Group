-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "totalAvailable" INTEGER NOT NULL,
    "stockcoming" INTEGER NOT NULL DEFAULT 0,
    "multiImages" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "itemSize" TEXT,
    "itemWeight" TEXT,
    "materials" TEXT,
    "itemLocation" TEXT,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "createdAt", "description", "id", "itemLocation", "itemSize", "itemWeight", "materials", "multiImages", "name", "totalAvailable", "updatedAt") SELECT "categoryId", "createdAt", "description", "id", "itemLocation", "itemSize", "itemWeight", "materials", "multiImages", "name", "totalAvailable", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
