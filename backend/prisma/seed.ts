import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Mühəndislik', slug: 'engineering' },
    { name: 'Dizayn', slug: 'design' },
    { name: 'Marketinq', slug: 'marketing' },
    { name: 'Satış', slug: 'sales' },
    { name: 'Məhsul', slug: 'product' },
    { name: 'Müştəri Xidmətləri', slug: 'customer-support' },
    { name: 'Digər', slug: 'other' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('Categories seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
