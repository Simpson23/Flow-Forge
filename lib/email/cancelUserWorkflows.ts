import { db } from '@/lib/db';
import { users, workflows } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function cancelUserWorkflows(customerId: string): Promise<void> {
  const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, customerId)).limit(1);

  if (!user) return;

  await db.update(workflows).set({ isActive: false }).where(eq(workflows.userId, user.id));
}
