import prisma from './lib/prisma';

async function findJob() {
  const job = await prisma.job.findFirst();
  if (job) {
    console.log('JOB_ID_FOUND:', job.id);
  } else {
    console.log('NO_JOBS_FOUND');
  }
  process.exit(0);
}

findJob();
