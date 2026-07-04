import { User, UserRole, SubscriptionPlan } from '@prisma/client';

// ─── Input types used for future CRUD operations ──────────────────────────────

export interface CreateUserInput {
  email: string;
  password?: string | null;
  fullName: string;
  authProvider?: string;
  role?: UserRole;
  subscriptionTier?: SubscriptionPlan;
}

export interface UpdateUserInput {
  fullName?: string;
  password?: string | null;
  role?: UserRole;
  subscriptionTier?: SubscriptionPlan;
  emailVerifiedAt?: Date | null;
}

// ─── Public-facing user type (password stripped) ─────────────────────────────

export type SafeUser = Omit<User, 'password'>;
