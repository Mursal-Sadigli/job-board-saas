require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixUrls() {
  console.log('Fixing resume URLs...');
  const applications = await prisma.application.findMany({
    where: {
      resumeUrl: {
        contains: 'cloudinary',
        not: {
          contains: '.'
        }
      }
    }
  });

  console.log(`Found ${applications.length} applications with potential missing extensions.`);

  for (const app of applications) {
    // If it's a Cloudinary raw URL without extension, it's almost certainly a PDF from our previous logic
    const newUrl = app.resumeUrl + '.pdf';
    console.log(`Updating ${app.id}: ${app.resumeUrl} -> ${newUrl}`);
    
    await prisma.application.update({
      where: { id: app.id },
      data: { resumeUrl: newUrl }
    });
  }

  console.log('Done!');
  await prisma.$disconnect();
}

fixUrls().catch(err => {
  console.error(err);
  process.exit(1);
});
