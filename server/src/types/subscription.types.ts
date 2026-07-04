import { Subscription, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

// ─── Input types for Subscription CRUD ───────────────────────────────────────

export interface CreateSubscriptionInput {
  userId: string;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  billingProvider?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
}

export interface UpdateSubscriptionInput {
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: Date;
}

export type SubscriptionWithUser = Subscription & {
  user: {
    id: string;
    email: string;
    fullName: string;
  };
};
