import { Resend } from 'resend';
import { db } from '../../lib/db';
// Update the path below to the correct location of your schema file
import { users } from '@/lib/db/schema';
// or, if the file is actually at '../lib/db/schema', use:
// import { users } from '../lib/db/schema';
import path from 'path';
import { fileURLToPath } from 'url';
// Resolve the base directory for the '@' alias
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Optionally, configure module-alias if using CommonJS
// import 'module-alias/register';
import { eq } from 'drizzle-orm';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(userId: string): Promise<void> {
  // Import eq from drizzle-orm if not already imported
  // import { eq } from 'drizzle-orm';
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user || !user.email) return;

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: user.email,
    subject: 'Welcome to Flow Forge 👋',
    html: `<p>Hey ${user.name || ''}, welcome to Flow Forge!</p>`,
  });
}
