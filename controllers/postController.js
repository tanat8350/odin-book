const asyncHandler = require('express-async-handler');

const prisma = require('../configs/prisma');
const CustomError = require('../utils/CustomError');

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

  postPost: asyncHandler(async (req, res, next) => {
    const post = await prisma.post.create({
      data: {
        message: req.body.message,
        authorid: +req.body.authorid,
      },
    });
    if (!post) {
      throw new CustomError('Fail to create post', 400);
    }
    res.json({ success: true });
  }),

  getPost: asyncHandler(async (req, res, next) => {
    const posts = await prisma.post.findUnique({
      where: {
        id: +req.params.id,
      },
      include: {
        author: true,
        likes: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
    res.json(posts);
  }),

  putLikePost: asyncHandler(async (req, res, next) => {
    const isLiked = await prisma.post.findUnique({
      where: {
        id: +req.params.id,
        likes: {
          some: {
            id: +req.body.userid,
          },
        },
      },
    });
    if (isLiked) {
      throw new CustomError('Already liked', 400);
    }

    const updated = await prisma.post.update({
      where: {
        id: +req.params.id,
      },
      data: {
        likes: {
          connect: {
            id: +req.body.userid,
          },
        },
      },
      include: {
        likes: true,
      },
    });
    if (!updated) {
      throw new CustomError('Fail to like a post', 404);
    }
    res.json({ ...updated, success: true });
  }),

  deleteUnlikePost: asyncHandler(async (req, res, next) => {
    const isLiked = await prisma.post.findUnique({
      where: {
        id: +req.params.id,
        likes: {
          some: {
            id: +req.body.userid,
          },
        },
      },
    });
    if (!isLiked) {
      throw new CustomError('Already unliked', 400);
    }

    const updated = await prisma.post.update({
      where: {
        id: +req.params.id,
      },
      data: {
        likes: {
          disconnect: {
            id: +req.body.userid,
          },
        },
      },
      include: {
        likes: true,
      },
    });
    if (!updated) {
      throw new CustomError('Fail to unlike a post', 404);
    }
    res.json({ ...updated, success: true });
  }),

  postComment: asyncHandler(async (req, res, next) => {
    const created = await prisma.comment.create({
      data: {
        message: req.body.message,
        author: {
          connect: {
            id: +req.body.authorid,
          },
        },
        post: {
          connect: {
            id: +req.params.id,
          },
        },
      },
    });
    if (!created) {
      throw new CustomError('Fail to create a comment', 404);
    }
    res.json({
      ...created,
      success: true,
    });
  }),
};
