import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
// Ensure users table schema includes stripeCustomerId, stripeSubscriptionId, and stripePriceId fields
import { eq } from 'drizzle-orm';
import { stripe } from '@/lib/db/stripe';
import { sendWelcomeEmail } from '@/lib/email/sendWelcomeEmail';
import { cancelUserWorkflows } from '@/lib/email/cancelUserWorkflows';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error) {
    return new NextResponse(`Webhook Error: ${(error as Error).message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case 'checkout.session.completed': {
      const subscriptionId = session.subscription as string;
      const customerId = session.customer as string;

      await db.update(users)
        .set({
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          stripePriceId: session.metadata?.priceId,
        })
        .where(eq(users.id, customerId));


      // ✅ Call welcome email function
      await sendWelcomeEmail(session.metadata?.userId!);
      break;
    }

    case 'customer.subscription.deleted': {
      const customerId = session.customer as string;

      // ✅ Cancel user workflows
      await cancelUserWorkflows(customerId);
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new NextResponse(null, { status: 200 });
}
