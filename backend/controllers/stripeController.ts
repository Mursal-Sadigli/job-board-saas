import { Request, Response } from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export const createCheckoutSession = async (req: any, res: Response) => {
  console.log('--- Stripe Checkout Session Request ---');
  try {
    const userId = req.auth?.userId;
    console.log('Authenticated User ID:', userId);

    if (!userId) {
      console.error('No User ID found in request auth');
      return res.status(401).json({ message: 'Səlahiyyətiniz yoxdur' });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }

    // Dynamic Plan Data from Request
    const { planName, amount } = req.body;
    const finalAmount = amount ? amount * 100 : 2900; // Convert to cents, default to $29
    const finalPlanName = planName || 'Premium Plan - Sınırsız CV Yükləmə';

    console.log(`Creating session for: ${finalPlanName} - ${finalAmount} cents`);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: finalPlanName,
              description: 'İş elanları və namizəd idarəetməsi üçün tam giriş əldə edin.',
            },
            unit_amount: finalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${FRONTEND_URL}/employer/ats/talent-pool?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${FRONTEND_URL}/employer/upgrade?canceled=true`,
      metadata: {
        userId: userId,
        plan: finalPlanName,
      },
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    res.status(500).json({ message: 'Ödəniş sessiyası yaradıla bilmədi', error: error.message });
  }
};

export const verifyCheckoutSession = async (req: any, res: Response) => {
  try {
    const { sessionId } = req.query;
    const userId = req.auth.userId;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID tələb olunur' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId as string);

    if (session.payment_status === 'paid') {
      // Upgrade user to PREMIUM
      await prisma.user.update({
        where: { clerkId: userId },
        data: { plan: 'PREMIUM' }
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

      return res.status(200).json({ success: true, message: 'Plan uğurla yüksəldildi' });
    }

    res.status(400).json({ success: false, message: 'Ödəniş hələ tamamlanmayıb' });
  } catch (error: any) {
    console.error('Verify Session Error:', error);
    res.status(500).json({ message: 'Sessiya yoxlanılırken xəta baş verdi', error: error.message });
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
