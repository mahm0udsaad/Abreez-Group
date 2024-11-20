/*
  Warnings:

  - A unique constraint covering the columns `[platform]` on the table `SocialLink` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN "itemLocation" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_platform_key" ON "SocialLink"("platform");
