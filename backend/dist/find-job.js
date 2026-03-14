"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./lib/prisma"));
async function findJob() {
    const job = await prisma_1.default.job.findFirst();
    if (job) {
        console.log('JOB_ID_FOUND:', job.id);
    }
    else {
        console.log('NO_JOBS_FOUND');
    }
    process.exit(0);
}
findJob();
