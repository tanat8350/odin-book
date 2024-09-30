const prisma = require('../configs/prisma');
const asyncHandler = require('express-async-handler');
const CustomError = require('../utils/CustomError');

module.exports = {
  getChat: asyncHandler(async (req, res, next) => {
    const messages = await prisma.chat.findMany({
      where: {
        roomId: req.params.id,
      },
      include: {
        author: true,
      },
    });
    res.json(messages);
  }),
};
