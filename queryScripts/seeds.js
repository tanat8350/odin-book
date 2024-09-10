const bcrypt = require('bcryptjs');

const prisma = require('../configs/prisma');

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

const posts = [
  {
    id: 1,
    message: 'this is post 1',
    authorid: 1,
  },
  {
    id: 2,
    message: 'this is post 2',
    authorid: 1,
  },
  {
    id: 3,
    message: 'this is post 3 from user 2',
    authorid: 2,
  },
  {
    id: 4,
    message: 'this is post 4 from user 3',
    authorid: 3,
  },
];

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
    const newPost = await prisma.post.upsert({
      where: {
        id: post.id,
      },
      update: post,
      create: post,
    });
    console.log(newPost);
  }
  console.log('done');
};

seed()
  .catch((e) => {
    console.log(e);
  })
  .finally(() => prisma.$disconnect());
