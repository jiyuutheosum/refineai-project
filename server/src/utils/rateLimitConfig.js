/**
 * @file server/src/utils/rateLimitConfig.js
 * @description Centralized configuration for per-user AI rate limits.
 * 
 * Tiers:
 *   - free: Strict limits for cost protection on free Groq/xAI tier.
 *   - pro / enterprise: Higher limits (future).
 * 
 * Windows: Daily (UTC date-based). Easy to understand and reset.
 * 
 * Why Firestore for tracking:
 *   - Persistent across server restarts / horizontal scaling.
 *   - Can be queried for analytics / billing later.
 *   - Atomic increments via FieldValue.increment().
 */

export const RATE_LIMIT_TIERS = {
  free: {
    resumeAnalysis: 20,      // per calendar day (UTC)
    mockInterview: 5,
    totalAiActions: 100,     // Global cap across all AI features
    window: 'daily',         // Future: 'hourly' | 'monthly' supported via same logic
  },
  pro: {
    resumeAnalysis: 200,
    mockInterview: 50,
    totalAiActions: 1000,
    window: 'daily',
  },
  enterprise: {
    resumeAnalysis: 1000,
    mockInterview: 200,
    totalAiActions: 5000,
    window: 'daily',
  },
};

/**
 * Action types that consume AI quota.
 * Used as keys in Firestore documents and for middleware configuration.
 */
export const AI_ACTIONS = {
  RESUME_ANALYSIS: 'resumeAnalysis',
  MOCK_INTERVIEW: 'mockInterview',
  // Add more as you introduce new features: JOB_MATCH, COVER_LETTER, etc.
};

/**
 * Default tier for users who have no explicit tier set in Firestore.
 */
export const DEFAULT_TIER = 'free';

/**
 * Firestore collection name for usage tracking.
 * One document per user per day is efficient.
 */
export const USAGE_COLLECTION = 'aiUsage';

/**
 * Helper to get the current UTC date key (YYYY-MM-DD)
 */
export function getCurrentDateKey() {
  const now = new Date();
  return now.toISOString().split('T')[0]; // '2025-04-10'
}

/**
 * Builds the Firestore document ID for a user's daily usage.
 * Format: {uid}_{YYYY-MM-DD}
 * This allows cheap point reads and easy daily cleanup if needed.
 */
export function buildUsageDocId(uid, dateKey = getCurrentDateKey()) {
  return `${uid}_${dateKey}`;
}

/**
 * Returns the limit for a given action + tier.
 */
export function getLimitForAction(tier, action) {
  const tierConfig = RATE_LIMIT_TIERS[tier] || RATE_LIMIT_TIERS[DEFAULT_TIER];
  return tierConfig[action] ?? 0;
}

/**
 * Returns all limits for a tier (useful for response headers).
 */
export function getAllLimitsForTier(tier) {
  return RATE_LIMIT_TIERS[tier] || RATE_LIMIT_TIERS[DEFAULT_TIER];
}
