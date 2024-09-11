const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');

const prisma = require('../configs/prisma');

const CustomError = require('../utils/CustomError');

const { upload } = require('../configs/cloudinary');

module.exports = {
  getAllUsers: asyncHandler(async (req, res, next) => {
    const users = await prisma.user.findMany({
      orderBy: {
        username: 'asc',
      },
    });
    res.json(users);
  }),

  getUser: asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
      where: {
        id: +req.params.id,
      },
      include: {
        following: true,
        followedBy: true,
        requested: true,
        requestPending: true,
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

  deleteDeleteUser: asyncHandler(async (req, res, next) => {
    const deleted = await prisma.user.delete({
      where: {
        id: +req.params.id,
      },
    });
    if (!deleted) {
      throw new CustomError('Failed to delete user', 404);
    }
    res.json({ success: true });
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
    const updated = await prisma.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        displayName: req.body.displayName,
        bio: req.body.bio,
        private: req.body.private,
      },
    });
    if (!updated) {
      throw new CustomError('Fail to update user profile', 404);
    }
    res.json(updated);
  }),

  putUpdateUserProfileImage: [
    upload.single('profileImage'),
    asyncHandler(async (req, res, next) => {
      console.log('file ', req.file);
      const updated = await prisma.user.update({
        where: {
          id: +req.params.id,
        },
        data: {
          profileImage: req.file.path,
        },
        include: {
          following: true,
          followedBy: true,
          requested: true,
          requestPending: true,
          posts: {
            include: {
              author: true,
              likes: true,
              comments: true,
            },
          },
        },
      });
      if (!updated) {
        throw new CustomError('Failed to update user profile image', 404);
      }
      res.json(updated);
    }),
  ],

  putUpdatePassword: asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      const updated = await prisma.user.update({
        where: {
          id: +req.params.id,
        },
        data: {
          password: hash,
        },
      });
      if (!updated) {
        throw new CustomError('Failed to update password', 404);
      }
      res.json({ success: true });
    });
  }),

  postFollowRequest: asyncHandler(async (req, res, next) => {
    const user = await prisma.user.findUnique({
      where: {
        id: +req.params.id,
      },
    });
    if (!user) {
      throw new CustomError('Cannot find target user', 404);
    }
    if (user.private === false) {
      const following = await prisma.user.update({
        where: {
          id: +req.body.userid,
        },
        data: {
          following: {
            connect: {
              id: +req.params.id,
            },
          },
        },
      });
      if (!following) {
        throw new CustomError('fail to follow', 404);
      }
      return res.json({ success: true });
    }
    const request = await prisma.user.update({
      where: {
        id: +req.body.userid,
      },
      data: {
        requested: {
          connect: {
            id: +req.params.id,
          },
        },
      },
    });
    if (!request) {
      throw new CustomError('fail to send request', 404);
    }
    return res.json({ success: true });
  }),

  deleteUnfollow: asyncHandler(async (req, res, next) => {
    if (req.body.pending) {
      const updated = await prisma.user.update({
        where: {
          id: +req.body.userid,
        },
        data: {
          requested: {
            disconnect: {
              id: +req.params.id,
            },
          },
        },
      });
      if (!updated) {
        throw new CustomError('Fail to remove request', 404);
      }
    } else {
      const updated = await prisma.user.update({
        where: {
          id: +req.body.userid,
        },
        data: {
          following: {
            disconnect: {
              id: +req.params.id,
            },
          },
        },
      });
      if (!updated) {
        throw new CustomError('Fail to unfollow', 404);
      }
    }
    return res.json({ success: true });
  }),

  putAcceptRequest: asyncHandler(async (req, res, next) => {
    const updated = await prisma.user.update({
      where: {
        id: +req.body.userid,
      },
      data: {
        requestPending: {
          disconnect: {
            id: +req.params.id,
          },
        },
        followedBy: {
          connect: {
            id: +req.params.id,
          },
        },
      },
    });
    if (!updated) {
      throw new CustomError('Fail to accept request', 404);
    }
    return res.json({ success: true });
  }),

  deleteRejectRequest: asyncHandler(async (req, res, next) => {
    const updated = await prisma.user.update({
      where: {
        id: +req.body.userid,
      },
      data: {
        requestPending: {
          disconnect: {
            id: +req.params.id,
          },
        },
      },
    });
    if (!updated) {
      throw new CustomError('Fail to remove request', 404);
    }
    return res.json({ success: true });
  }),
};
