const prisma = require('../configs/prisma');

const main = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      likes: true,
      comments: true,
    },
  });
  console.log(posts);
};

main()
  .then(async () => await prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
