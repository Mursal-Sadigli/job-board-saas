const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

  console.log('Seeding categories...');
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
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
