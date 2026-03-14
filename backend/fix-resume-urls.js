const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixUrls() {
  console.log('Fixing resume URLs...');
  try {
    const applications = await prisma.application.findMany({
      where: {
        resumeUrl: {
          contains: 'cloudinary',
        }
      }
    });

    console.log(`Found ${applications.length} applications.`);

    for (const app of applications) {
      if (app.resumeUrl && !app.resumeUrl.includes('.') && app.resumeUrl.includes('cloudinary')) {
        const newUrl = app.resumeUrl + '.pdf';
        console.log(`Updating ${app.id}: ${app.resumeUrl} -> ${newUrl}`);
        
        await prisma.application.update({
          where: { id: app.id },
          data: { resumeUrl: newUrl }
        });
      }
    }

    console.log('Done!');
  } catch (e) {
    console.error('Error during update:', e);
  } finally {
    await prisma.$disconnect();
  }
}

fixUrls();
