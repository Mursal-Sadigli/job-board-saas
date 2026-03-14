import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

export const createCheckoutSession = async (req: any, res: Response) => {
  try {
    const clerkId = req.auth?.sessionClaims?.sub as string;
    if (!clerkId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'LIFETIME Premium - Sınırsız CV Yükləmə',
              description: 'Birdəfəlik ödənişlə bütün CV yükləmə limitlərini ləğv edin.',
            },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/upgrade`,
      metadata: {
        clerkId: user.clerkId,
        userId: user.id,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ message: 'Ödəniş seansı yaradılarkən xəta baş verdi' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkId = session.metadata?.clerkId;

    if (clerkId) {
      await prisma.user.update({
        where: { clerkId },
        data: {
          plan: 'LIFETIME',
        },
      });
      console.log(`User ${clerkId} upgraded to LIFETIME plan`);
    }
  }

  res.json({ received: true });
};
