/*
  Warnings:

  - A unique constraint covering the columns `[hashedTkn]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_hashedTkn_key" ON "RefreshToken"("hashedTkn");

-- CreateIndex
CREATE INDEX "RefreshToken_hashedTkn_idx" ON "RefreshToken"("hashedTkn");
