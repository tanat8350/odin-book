/*
  Warnings:

  - You are about to drop the column `chatroom` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `roomId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "chatroom",
ADD COLUMN     "roomId" TEXT NOT NULL;
