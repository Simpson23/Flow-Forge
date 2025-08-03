import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil' as const,
  });

  const { plan } = await req.json();

  let priceId;

  if (plan === "starter") {
    priceId = process.env.STRIPE_PRICE_ID_STARTER;
  } else if (plan === "pro") {
    priceId = process.env.STRIPE_PRICE_ID_PRO;
  } else {
    return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?status=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json({ error: "Stripe session creation failed" }, { status: 500 });
  }
}
