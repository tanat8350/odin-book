const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const prisma = require('../configs/prisma');

const validateUser = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Username is required'),
  body('password').isLength({ min: 1 }).withMessage('Password is required'),
];

module.exports = {
  postSignup: [
    body('username').custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: {
          username: value,
        },
      });
      if (user) {
        throw new Error('Username already exists');
      }
    }),
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        const created = await prisma.user.create({
          data: {
            username: req.body.username,
            password: hashedPassword,
            displayName: req.body.username,
          },
        });
        res.json(created);
      });
    },
  ],

  postLogin: [
    validateUser,
    async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
      } else {
        passport.authenticate(
          'local',
          { session: false },
          (err, user, info) => {
            if (err) {
              return res.status(500).json({ error: [{ msg: err }] });
            }
            if (!user) {
              return res.status(400).json({ error: [{ msg: info.message }] });
            }
            if (user) {
              jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET,
                async (err, token) => {
                  if (err) {
                    next(err);
                  }
                  const populatedUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    include: {
                      posts: true,
                      following: true,
                      followedBy: true,
                      requested: true,
                      requestPending: true,
                    },
                  });
                  return res.json({ token, user: populatedUser });
                }
              );
            }
          }
        )(req, res, next);
      }
    },
  ],

  getAuthGithub: passport.authenticate('github', { scope: ['profile'] }),

  getAuthGithub2: passport.authenticate('github', {
    successRedirect: 'http://localhost:5173/',
    failureRedirect: 'http://localhost:5173/',
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  },
};
