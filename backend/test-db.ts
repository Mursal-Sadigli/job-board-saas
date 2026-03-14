import prisma from './lib/prisma';

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Database connection successful. Existing users:', users.length);
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
