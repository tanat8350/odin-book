const asyncHandler = require('express-async-handler');

const prisma = require('../configs/prisma');

const CustomError = require('../utils/CustomError');

module.exports = {
  getUser: asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
      where: {
        id: +req.params.id,
      },
      include: {
        following: true,
        followedBy: true,
        posts: {
          include: {
            author: true,
            likes: true,
            comments: true,
          },
        },
      },
    });
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    res.json(user);
  }),

  getUserProfile: asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
      where: {
        id: +req.params.id,
      },
    });
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    res.json(user);
  }),

  putUpdateUserProfile: asyncHandler(async (req, res, next) => {
    // to profile image later
    const updated = await prisma.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        displayName: req.body.displayName,
        bio: req.body.bio,
      },
    });
    if (!updated) {
      throw new CustomError('Fail to update user profile', 404);
    }

    res.json(updated);
  }),
};
