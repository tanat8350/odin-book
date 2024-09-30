const prisma = require('../configs/prisma');
const asyncHandler = require('express-async-handler');
const CustomError = require('../utils/CustomError');

module.exports = {
  getChat: asyncHandler(async (req, res, next) => {
    const messages = await prisma.chat.findMany({
      orderBy: {
        timestamp: 'asc',
      },
      where: {
        roomId: req.params.id,
      },
      include: {
        author: true,
      },
    });
    res.json(messages);
  }),

  getUserChatRooms: asyncHandler(async (req, res, next) => {
    const chats = await prisma.chatRoom.findMany({
      where: {
        id: {
          not: `${req.params.id}-${req.params.id}`,
        },
        users: {
          some: {
            id: +req.params.id,
          },
        },
      },
      include: {
        users: true,
        // get only latest message
        chats: {
          take: 1,
          orderBy: {
            timestamp: 'desc',
          },
          include: {
            author: true,
          },
        },
      },
    });
    res.json(chats);
  }),
};
