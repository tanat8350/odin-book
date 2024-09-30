const bcrypt = require('bcryptjs');

const prisma = require('../configs/prisma');
const { connect } = require('../routes/auth');

const users = [
  {
    id: 1,
    displayName: 'a',
    username: 'a',
    password: 'a',
    bio: 'i am a',
  },
  {
    id: 2,
    displayName: 'b',
    username: 'b',
    password: 'b',
    bio: 'i am b',
    private: true,
  },
  {
    id: 3,
    displayName: 'c',
    username: 'c',
    password: 'c',
  },
  {
    id: 4,
    displayName: 'd',
    username: 'd',
    password: 'd',
    bio: 'i am d',
  },
];

const posts = [];

let postCount = 1;
users.forEach((user) => {
  for (let i = 0; i < 100; i++) {
    posts.push({
      // with id, auto increment stopped working properly
      // id: postCount,
      authorid: user.id,
      message: `post ${postCount} by ${user.id}`,
    });
    postCount++;
  }
});

const seed = async () => {
  for (const user of users) {
    bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log(err);
      }
      const newUser = await prisma.user.upsert({
        where: {
          id: user.id,
        },
        update: { ...user, password: hashedPassword },
        create: { ...user, password: hashedPassword },
      });
      console.log(newUser);
    });
  }

  for (const post of posts) {
    const newPost = await prisma.post.create({
      data: post,
    });
    console.log(newPost);
  }

  for (let i = 1; i <= 4; i++) {
    await prisma.user.update({
      where: {
        id: 3,
      },
      data: {
        following: {
          connect: {
            id: i,
          },
        },
        followedBy: {
          connect: {
            id: i,
          },
        },
      },
    });
  }
  console.log('done');
};

seed()
  .catch((e) => {
    console.log(e);
  })
  .finally(() => prisma.$disconnect());
