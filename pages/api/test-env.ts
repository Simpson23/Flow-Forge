import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    stripeKey: process.env.STRIPE_SECRET_KEY ? "Loaded" : "Missing",
    clerkKey: process.env.CLERK_SECRET_KEY ? "Loaded" : "Missing",
  });
}
