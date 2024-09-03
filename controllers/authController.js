const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');

const prisma = require('../configs/prisma');

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
    passport.authenticate('local'),
    (req, res) => {
      res.json(req.user);
    },
  ],
};
