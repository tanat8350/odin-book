const prisma = require('../configs/prisma');

const posts = [
  {
    message: 'this is post 1',
    authorid: 1,
  },
  {
    message: 'this is post 2',
    authorid: 1,
  },
  {
    message: 'this is post 3',
    authorid: 2,
  },
];
const seed = async () => {
  for (const post of posts) {
    const newPost = await prisma.post.create({ data: post });
    console.log(newPost);
  }
  console.log('done');
};

seed().then(() => prisma.$disconnect());
