"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUser = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
const clerk_sdk_node_1 = require("@clerk/clerk-sdk-node");
const syncUser = async (req, res) => {
    console.log('--- Direct Sync Started ---');
    try {
        const auth = req.auth;
        console.log('Auth details from Clerk:', auth);
        const { userId } = auth;
        if (!userId) {
            console.error('Unauthorized: No userId in request');
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.log('Fetching user from Clerk API for ID:', userId);
        let clerkUser;
        try {
            clerkUser = await clerk_sdk_node_1.clerkClient.users.getUser(userId);
        }
        catch (clerkError) {
            console.error('Clerk API Error:', clerkError);
            return res.status(500).json({ error: 'Clerk API lookup failed', details: clerkError.message });
        }
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null;
        const metaRole = clerkUser.publicMetadata?.role || 'CANDIDATE';
        const role = metaRole.toUpperCase() || client_1.UserRole.CANDIDATE;
        console.log(`Syncing user to DB: ClerkID=${userId}, Email=${email}, Role=${role}`);
        if (!email) {
            console.error('User email not found in Clerk for user:', userId);
            return res.status(400).json({ error: 'User email not found in Clerk' });
        }
        const syncedUser = await prisma_1.default.user.upsert({
            where: { clerkId: userId },
            update: {
                email,
                name,
                role,
            },
            create: {
                clerkId: userId,
                email,
                name,
                role,
            },
        });
        console.log('Successfully synced user:', syncedUser.id);
        return res.status(201).json({ success: true, user: syncedUser });
    }
    catch (error) {
        console.error('CRITICAL Error in direct user sync:', error);
        return res.status(500).json({ error: 'Sync failed', details: error.message });
    }
};
exports.syncUser = syncUser;
