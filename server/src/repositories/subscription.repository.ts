import { Subscription } from '@prisma/client';
import { CreateSubscriptionInput, UpdateSubscriptionInput } from '@/types/subscription.types';

/**
 * SubscriptionRepository
 *
 * Data-access layer for the Subscription model.
 * Subscription is a 1:1 extension of User — each user has exactly one Subscription record.
 * This record is created at the same time as the user and is never deleted independently.
 * It tracks the billing plan, Stripe identifiers, and current period timing.
 */
export class SubscriptionRepository {
  /**
   * Find a user's subscription by their user ID.
   * Used on every authenticated request to enforce quota and feature access.
   * The unique index on `userId` makes this lookup O(1).
   */
  async findByUserId(_userId: string): Promise<Subscription | null> {
    throw new Error('Not implemented');
  }

  /**
   * Find a subscription by the Stripe Customer ID.
   * Used when processing incoming Stripe webhook events (e.g. payment_succeeded).
   */
  async findByStripeCustomerId(_stripeCustomerId: string): Promise<Subscription | null> {
    throw new Error('Not implemented');
  }

  /**
   * Create the initial subscription record for a new user.
   * Always defaults to the FREE plan with ACTIVE status.
   */
  async create(_data: CreateSubscriptionInput): Promise<Subscription> {
    throw new Error('Not implemented');
  }

  /**
   * Update a subscription's plan, status, or Stripe identifiers.
   * Called when a Stripe webhook confirms a plan change or payment event.
   */
  async update(_userId: string, _data: UpdateSubscriptionInput): Promise<Subscription> {
    throw new Error('Not implemented');
  }
}

export const subscriptionRepository = new SubscriptionRepository();
