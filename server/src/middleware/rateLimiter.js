/**
 * @file server/src/middleware/rateLimiter.js
 * @description Production-grade per-user rate limiting middleware for AI endpoints.
 * 
 * Features:
 * - Uses Firebase UID (from verified token) — immune to IP spoofing / VPNs.
 * - Tier-aware limits.
 * - Proper HTTP 429 + standard rate limit headers.
 * - User-friendly messages.
 * - Integrates with usageTracker service (Firestore + in-memory cache).
 * 
 * Headers returned on success and on limit:
 *   X-RateLimit-Limit
 *   X-RateLimit-Remaining
 *   X-RateLimit-Reset
 *   Retry-After (only on 429)
 */

import { incrementUsageAndCheckLimit } from '../services/usageTracker.js';
import { AI_ACTIONS } from '../utils/rateLimitConfig.js';

/**
 * Creates a rate limiting middleware for a specific AI action.
 * 
 * @param {string} action - One of AI_ACTIONS (e.g. 'resumeAnalysis')
 * @returns {Function} Express middleware
 */
export function createAiRateLimiter(action) {
  if (!Object.values(AI_ACTIONS).includes(action) && action !== 'totalAiActions') {
    throw new Error(`Invalid AI action for rate limiter: ${action}`);
  }

  return async function aiRateLimiter(req, res, next) {
    // Must be preceded by verifyFirebaseToken middleware
    if (!req.user?.uid) {
      return res.status(500).json({
        error: 'InternalError',
        message: 'Rate limiter requires authenticated user. Did you forget verifyFirebaseToken?',
      });
    }

    const { uid, tier = 'free' } = req.user;

    try {
      const result = await incrementUsageAndCheckLimit(uid, action, tier);

      // Always set standard rate limit headers (even on success)
      const limit = result.limit;
      const remaining = result.remaining ?? Math.max(0, limit - result.current);

      res.set({
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(Date.now() + (result.retryAfter || 0) * 1000).toISOString(),
      });

      if (!result.allowed) {
        // Rate limit exceeded
        res.set('Retry-After', result.retryAfter.toString());

        return res.status(429).json({
          error: 'RateLimitExceeded',
          message: getFriendlyRateLimitMessage(action, result),
          usage: {
            current: result.current,
            limit: result.limit,
            totalUsed: result.totalUsed,
            totalLimit: result.totalLimit,
          },
          retryAfter: result.retryAfter, // seconds until daily reset
        });
      }

      // Attach usage info to request for logging / response enrichment
      req.rateLimit = {
        action,
        current: result.current,
        limit: result.limit,
        remaining,
        tier,
      };

      next();
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Rate limit check failed for user ${uid} on ${action}:`, error.message);
      }

      // Fail-closed for cost protection. You can change to fail-open if you prefer availability.
      return res.status(503).json({
        error: 'RateLimitServiceUnavailable',
        message: 'We are temporarily unable to verify your usage quota. Please try again in a moment.',
      });
    }
  };
}

/**
 * Pre-configured middleware instances for the most common AI endpoints.
 * Import these directly in your route files.
 */
export const rateLimitResumeAnalysis = createAiRateLimiter(AI_ACTIONS.RESUME_ANALYSIS);
export const rateLimitMockInterview = createAiRateLimiter(AI_ACTIONS.MOCK_INTERVIEW);

/**
 * Global AI action limiter (use on every AI call as a final safety net).
 * Apply this in addition to the specific one.
 */
export const rateLimitAnyAiAction = createAiRateLimiter('totalAiActions');

/**
 * Generates a helpful, non-technical error message for the user.
 */
function getFriendlyRateLimitMessage(action, result) {
  const actionName = action === AI_ACTIONS.RESUME_ANALYSIS
    ? 'resume analysis'
    : action === AI_ACTIONS.MOCK_INTERVIEW
      ? 'mock interview question generation'
      : 'AI feature';

  if (result.current >= result.limit) {
    return `You've reached your daily limit of ${result.limit} ${actionName} requests. Your quota resets at midnight UTC.`;
  }

  return `You've reached your daily AI usage cap (${result.totalUsed}/${result.totalLimit}). Please try again tomorrow.`;
}

/**
 * Utility middleware to attach current usage to responses (optional).
 * Useful if your frontend wants to show "12/20 analyses used today".
 */
export async function attachUsageHeaders(req, res, next) {
  // Can be expanded to call getUserUsageSnapshot and set more headers
  if (req.rateLimit) {
    res.set('X-RateLimit-Action', req.rateLimit.action);
  }
  next();
}
