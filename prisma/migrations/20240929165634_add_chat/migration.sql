-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "chatroom" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "authorid" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
