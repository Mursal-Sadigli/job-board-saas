"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./lib/prisma"));
async function main() {
    try {
        const users = await prisma_1.default.user.findMany();
        console.log('Database connection successful. Existing users:', users.length);
    }
    catch (error) {
        console.error('Database connection failed:', error);
    }
    finally {
        await prisma_1.default.$disconnect();
    }
}
main();
