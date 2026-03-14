import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export const createCheckoutSession = async (req: any, res: Response) => {
  try {
    const userId = req.auth.userId;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Premium Plan - Sınırsız CV Yükləmə',
              description: 'İstedad hovuzuna sınırsız namizəd əlavə edin və AI analizlərindən limitsiz yararlanın.',
            },
            unit_amount: 2900, // $29.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${FRONTEND_URL}/employer/ats/talent-pool?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${FRONTEND_URL}/employer/upgrade?canceled=true`,
      metadata: {
        userId: userId,
      },
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ message: 'Ödəniş sessiyası yaradıla bilmədi', error: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (userId) {
      console.log(`Payment successful for user: ${userId}`);
      
      // Upgrade user to PREMIUM and reset/ignore limits
      await prisma.user.update({
        where: { clerkId: userId },
        data: { 
          plan: 'PREMIUM',
          // We can also record subscription details in Subscription model if needed
        }
      });
      
      // Update or create Subscription record
      await prisma.subscription.upsert({
        where: { clerkId: userId },
        update: {
          status: 'active',
          plan: 'PREMIUM',
          stripeCustomerId: session.customer as string,
        },
        create: {
          clerkId: userId,
          status: 'active',
          plan: 'PREMIUM',
          stripeCustomerId: session.customer as string,
        }
      });
    }
  }

  res.json({ received: true });
};
