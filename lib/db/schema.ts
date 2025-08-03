import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  boolean,
} from "drizzle-orm/pg-core";


// Workflows table
export const workflows = pgTable('workflows', {
  id: text('id').primaryKey(),
  name: text('name'),
  userId: text('user_id'),
  data: text('data'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
  isActive: boolean('is_active').default(true),
});

// Subscriptions table
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  plan: varchar("plan", { length: 50 }),
  status: varchar("status", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  stripePriceId: text('stripe_price_id'),
  // Add other fields as needed
});