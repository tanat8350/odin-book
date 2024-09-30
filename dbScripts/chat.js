const prisma = require('../configs/prisma');

const oldMessages = [
  {
    roomId: '1-4',
    message: 'oldest message',
    authorid: 4,
    timestamp: new Date('2022-09-30T15:56:10.818Z'),
  },
  {
    roomId: '1-4',
    message: 'older message',
    authorid: 4,
    timestamp: new Date('2023-09-30T15:56:10.818Z'),
  },
  {
    roomId: '1-4',
    message: 'old message',
    authorid: 4,
    timestamp: new Date('2024-01-01T15:56:10.818Z'),
  },
];

const main = async () => {
  try {
    const newChatRoom = await prisma.chatRoom.create({
      data: {
        id: '1-4',
        users: {
          connect: [{ id: 1 }, { id: 4 }],
        },
      },
    });
    console.log(newChatRoom);
  } catch (e) {
    console.log(e);
  }

  const deleteOldMessages = await prisma.chat.deleteMany({
    where: {
      roomId: '1-4',
    },
  });
  console.log(deleteOldMessages);

  oldMessages.forEach(async (message) => {
    const newMessage = await prisma.chat.create({
      data: message,
    });
    console.log(newMessage);
  });
};

main()
  .then(async () => await prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
