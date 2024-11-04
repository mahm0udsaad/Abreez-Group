-- AlterTable
ALTER TABLE "Product" ADD COLUMN "itemSize" TEXT;
ALTER TABLE "Product" ADD COLUMN "itemWeight" TEXT;
ALTER TABLE "Product" ADD COLUMN "materials" TEXT;

-- CreateTable
CREATE TABLE "PrintingOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PrintingOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
