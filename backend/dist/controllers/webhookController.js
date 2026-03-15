"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleClerkWebhook = void 0;
const svix_1 = require("svix");
const prisma_1 = __importDefault(require("../lib/prisma"));
const client_1 = require("@prisma/client");
const handleClerkWebhook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
        return res.status(400).json({ error: 'Please add WEBHOOK_SECRET from Clerk Dashboard to .env' });
    }
    // Get the headers
    const svix_id = req.headers["svix-id"];
    const svix_timestamp = req.headers["svix-timestamp"];
    const svix_signature = req.headers["svix-signature"];
    console.log('--- Webhook Request Received ---');
    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        console.error('Missing svix headers');
        return res.status(400).json({ error: 'Error occured -- no svix headers' });
    }
    // Get the body
    const body = req.body.toString();
    // Create a new Svix instance with your secret.
    const wh = new svix_1.Webhook(WEBHOOK_SECRET);
    let evt;
    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    }
    catch (err) {
        console.error('Error verifying webhook signature:', err);
        return res.status(400).json({ error: 'Error occured' });
    }
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(`Verified Event: ID=${id}, Type=${eventType}`);
    if (eventType === 'user.created' || eventType === 'user.updated') {
        const { id: clerkId, email_addresses, first_name, last_name, public_metadata } = evt.data;
        const email = email_addresses?.[0]?.email_address;
        const name = `${first_name || ''} ${last_name || ''}`.trim() || null;
        const metaRole = public_metadata?.role;
        const role = metaRole?.toUpperCase() || client_1.UserRole.CANDIDATE;
        if (!email) {
            console.error('Missing email in webhook payload:', evt.data);
            return res.status(400).json({ error: 'Missing email address' });
        }
        console.log(`Upserting user: ClerkID=${clerkId}, Email=${email}, Role=${role}, Name=${name}`);
        try {
            const result = await prisma_1.default.user.upsert({
                where: { clerkId: clerkId },
                update: {
                    email: email,
                    name: name,
                    firstName: first_name,
                    lastName: last_name,
                    role: role,
                },
                create: {
                    clerkId: clerkId,
                    email: email,
                    name: name,
                    firstName: first_name,
                    lastName: last_name,
                    role: role,
                },
            });
            console.log('Database sync successful for user ID:', result.id);
        }
        catch (dbError) {
            console.error('--- Database Sync Error (Clerk Webhook) ---');
            console.error('Error Code:', dbError.code);
            console.error('Error Message:', dbError.message);
            return res.status(500).json({ error: 'Database sync failed', details: dbError.message, code: dbError.code });
        }
    }
    if (eventType === 'user.deleted') {
        const { id: clerkId } = evt.data;
        await prisma_1.default.user.delete({
            where: { clerkId: clerkId },
        });
    }
    return res.status(200).json({ success: true });
};
exports.handleClerkWebhook = handleClerkWebhook;
