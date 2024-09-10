const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');

const prisma = require('./prisma');

passport.use(
  'local',
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { username: username },
      });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async function (jwt_payload, done) {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: jwt_payload.id,
          },
        });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.use(
  'github',
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/github/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await prisma.user.findUnique({
        where: {
          githubid: +profile.id,
        },
      });
      if (!user) {
        try {
          const newUser = await prisma.user.create({
            data: {
              githubid: profile.id,
              username: profile.username,
              password: '123456',
              displayName: profile.username,
              private: false,
            },
          });
        } catch {
          return done(null, false, { message: 'Failed to create user' });
        }
      }
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);
