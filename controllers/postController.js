const asyncHandler = require('express-async-handler');

const prisma = require('../configs/prisma');
const CustomError = require('../utils/CustomError');
const { uploadImagePost } = require('../configs/cloudinary');

module.exports = {
  getPosts: asyncHandler(async (req, res, next) => {
    const take = 10;
    const skip = (+req.query.page - 1) * take || 0;
    const posts = await prisma.post.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take,
      skip,
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    });
    res.json(posts);
  }),

  getAllPosts: asyncHandler(async (req, res, next) => {
    const allPosts = await prisma.post.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    });
    res.json(allPosts);
  }),

  postPost: [
    uploadImagePost.single('image'),
    async (req, res, next) => {
      const body = {
        message: req.body.message,
        authorid: +req.body.authorid,
      };
      if (req.file) {
        body.imageUrl = req.file.path;
      }
      console.log(body);
      const post = await prisma.post.create({
        data: body,
      });
      console.log(post);
      if (!post) {
        throw new CustomError('Fail to create post', 400);
      }
      res.json({ success: true });
    },
  ],

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
