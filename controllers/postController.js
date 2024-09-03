const asyncHandler = require('express-async-handler');

const prisma = require('../configs/prisma');

module.exports = {
  getPosts: asyncHandler(async (req, res, next) => {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    });
    res.json(posts);
  }),

  getUserPost: asyncHandler(async (req, res, next) => {
    const posts = await prisma.post.findMany({
      where: {
        authorId: req.params.id,
      },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    });
    res.json(posts);
  }),
};
