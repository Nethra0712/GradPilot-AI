import { UpdateSubscriptionInput } from '@/types/subscription.types';
import { Subscription } from '@prisma/client';

/**
 * SubscriptionService
 *
 * Business logic layer for the Subscription domain.
 * Manages plan upgrades, downgrades, and Stripe webhook-driven status changes.
 * This service will integrate with the Stripe SDK in a future sprint.
 */
export class SubscriptionService {
  /**
   * Get the subscription record for a user.
   * Called on every authenticated API request to resolve the user's current plan
   * and determine feature access and generation quotas.
   */
  async getSubscription(_userId: string): Promise<Subscription | null> {
    throw new Error('Not implemented');
  }

  /**
   * Apply an update to a subscription from a Stripe webhook event.
   * Called when Stripe confirms a payment, plan change, or cancellation.
   * The webhook handler validates the Stripe signature before invoking this.
   */
  async handleWebhookUpdate(
    _stripeCustomerId: string,
    _update: UpdateSubscriptionInput
  ): Promise<Subscription> {
    throw new Error('Not implemented');
  }

  /**
   * Check whether a user is on the Free plan.
   * Used as a quick guard for quota enforcement in the generation pipeline.
   */
  async isFreeTier(_userId: string): Promise<boolean> {
    throw new Error('Not implemented');
  }

  /**
   * Check whether a user's subscription is currently active.
   * Returns false for CANCELED or PAST_DUE statuses.
   */
  async isActive(_userId: string): Promise<boolean> {
    throw new Error('Not implemented');
  }
}

export const subscriptionService = new SubscriptionService();
