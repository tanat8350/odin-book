const prisma = require('../configs/prisma');

const comments = [
  {
    message: 'comment 1 of post 1',
    authorid: 1,
    postid: 1,
  },
  {
    message: 'comment 2 of post 2',
    authorid: 1,
    postid: 1,
  },
  {
    message: 'comment 3 of post 3, author 2',
    postid: 1,
    authorid: 2,
  },
];
const seed = async () => {
  for (const item of comments) {
    const created = await prisma.comment.create({ data: item });
    console.log(created);
  }
  console.log('done');
};

seed().then(() => prisma.$disconnect());
