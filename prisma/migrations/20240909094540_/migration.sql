/*
  Warnings:

  - A unique constraint covering the columns `[githubid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubid" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_githubid_key" ON "User"("githubid");
