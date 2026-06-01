/**
 * @file server/src/routes/ai.js
 * @description Thin AI orchestration routes.
 * 
 * Responsibilities:
 * - Authentication & authorization (via middleware)
 * - Rate limiting (via middleware)
 * - Input validation (delegated to services)
 * - Calling AI services
 * - Returning standardized responses + usage info
 *
 * Heavy AI logic lives in dedicated services for better maintainability and testability.
 */

import { Router } from 'express';
import {
  verifyFirebaseToken,
  requireEmailVerified,           // Enforced only in production (skipped in dev)
} from '../middleware/auth.js';
import {
  rateLimitResumeAnalysis,
  rateLimitMockInterview,
  rateLimitAnyAiAction,
  attachUsageHeaders,
} from '../middleware/rateLimiter.js';
import { getUserUsageSnapshot } from '../services/usageTracker.js';
import { analyzeResume } from '../services/resumeAnalysis.service.js';
import { generateMockQuestions } from '../services/mockInterview.service.js';

const router = Router();

/**
 * POST /api/ai/analyze-resume
 * Protected + rate limited: 20 per day (free)
 */
router.post(
  '/analyze-resume',
  verifyFirebaseToken,
  requireEmailVerified,           // Enforced only in production (skipped in dev)           // Enforced only in production (skipped in dev)
  rateLimitResumeAnalysis,        // Specific limit
  rateLimitAnyAiAction,           // Global safety cap
  attachUsageHeaders,
  async (req, res) => {
    try {
      const { resumeText } = req.body;

      const analysis = await analyzeResume(resumeText);

      res.json({
        success: true,
        analysis,
        usage: req.rateLimit,
      });
    } catch (error) {
      if (error.code === 'VALIDATION_ERROR') {
        return res.status(400).json({ error: 'InvalidInput', message: error.message });
      }
      if (error.code === 'AI_PARSE_ERROR') {
        return res.status(502).json({ error: 'AIGenerationFailed', message: error.message });
      }
      res.status(500).json({ error: 'AnalysisFailed', message: 'Failed to analyze resume.' });
    }
  }
);

/**
 * POST /api/ai/generate-mock-interview
 * Protected + rate limited: 5 per day (free)
 */
router.post(
  '/generate-mock-interview',
  verifyFirebaseToken,
  requireEmailVerified,           // Enforced only in production (skipped in dev)
  rateLimitMockInterview,
  rateLimitAnyAiAction,
  attachUsageHeaders,
  async (req, res) => {
    try {
      const { resumeText, targetRole } = req.body;

      const questions = await generateMockQuestions(resumeText, targetRole);

      res.json({
        success: true,
        questions,
        usage: req.rateLimit,
      });
    } catch (error) {
      if (error.code === 'VALIDATION_ERROR') {
        return res.status(400).json({ error: 'InvalidInput', message: error.message });
      }
      if (error.code === 'AI_PARSE_ERROR') {
        return res.status(502).json({ error: 'AIGenerationFailed', message: error.message });
      }
      res.status(500).json({ error: 'GenerationFailed', message: 'Failed to generate questions.' });
    }
  }
);

/**
 * GET /api/ai/usage
 * Returns current usage for the logged-in user (great for UI progress bars)
 */
router.get('/usage', verifyFirebaseToken, async (req, res) => {
  try {
    const usage = await getUserUsageSnapshot(req.user.uid, req.user.tier);
    res.json(usage);
  } catch (err) {
    res.status(500).json({ error: 'UsageFetchFailed' });
  }
});

export default router;
