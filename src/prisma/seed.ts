import { PrismaService } from '../prisma.service';
import { UtilService } from '../util/util.service';

const prisma = new PrismaService();
const util = new UtilService();

async function main() {
  const alice = await prisma.user.upsert({
    where: {
      email: 'alice@prisma.io',
    },
    update: {},
    create: {
      email: 'alice@prisma.io',
      password: await util.encryptPassword('password'),
      name: 'Alice',
      profile: {
        create: {},
      },
      posts: {
        create: {
          title: 'Check out Prisma with Next.js',
          content: 'https://www.prisma.io/nextjs',
          published: true,
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      password: await util.encryptPassword('password'),
      profile: {
        create: {},
      },
      posts: {
        create: [
          {
            title: 'Follow Prisma on Twitter',
            content: 'https://twitter.com/prisma',
            published: true,
          },
          {
            title: 'Follow Nexus on Twitter',
            content: 'https://twitter.com/nexusgql',
            published: true,
          },
        ],
      },
    },
  });
  console.log({ alice, bob });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
