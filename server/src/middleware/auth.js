/**
 * @file server/src/middleware/auth.js
 * @description Firebase Authentication middleware.
 * Verifies the Bearer token sent from the React frontend (using getIdToken() or similar).
 * 
 * Usage in routes:
 *   router.post('/analyze', verifyFirebaseToken, rateLimitResumeAnalysis, handler);
 * 
 * After successful verification, attaches:
 *   - req.user.uid          → the Firebase UID (primary key for rate limiting)
 *   - req.user.email
 *   - req.user.tier         → looked up from Firestore (or defaults to 'free')
 */

import { auth, db } from '../config/firebaseAdmin.js';
import { DEFAULT_TIER } from '../utils/rateLimitConfig.js';

const USERS_COLLECTION = 'users'; // Adjust if you store profiles elsewhere

/**
 * Express middleware that validates Firebase ID tokens.
 * Expects header: Authorization: Bearer <ID_TOKEN>
 */
export async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header. Expected: Bearer <Firebase ID Token>',
    });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    // Verify the token using Firebase Admin (checks signature, expiration, audience, etc.)
    const decodedToken = await auth.verifyIdToken(idToken, true); // checkRevoked = true for extra security

    // Attach core identity
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      emailVerified: decodedToken.email_verified || false,
      // You can add custom claims here if you use them for roles/tiers
    };

    // Optional but recommended: fetch tier from Firestore user profile
    // This allows you to promote users to "pro" without custom claims
    try {
      const userDoc = await db.collection(USERS_COLLECTION).doc(decodedToken.uid).get();
      if (userDoc.exists && userDoc.data().tier) {
        req.user.tier = userDoc.data().tier;
      } else {
        req.user.tier = DEFAULT_TIER;
      }
    } catch (tierError) {
      // Tier lookup failed — defaulting to free tier is safe
      req.user.tier = DEFAULT_TIER;
    }

    next();
  } catch (error) {
    // Token verification failure is expected for bad clients — no need to log at error level in prod
    if (process.env.NODE_ENV !== 'production') {
      console.error('Firebase token verification failed:', error.code || error.message);
    }

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: 'TokenExpired',
        message: 'Your session has expired. Please sign in again.',
      });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        error: 'TokenRevoked',
        message: 'Your session was revoked. Please sign in again.',
      });
    }

    return res.status(401).json({
      error: 'InvalidToken',
      message: 'Authentication failed. Please sign in again.',
    });
  }
}

/**
 * Require email verification before using AI features.
 *
 * In development (NODE_ENV !== 'production'), this check is skipped
 * to make testing easier. In production, it is enforced.
 */
export function requireEmailVerified(req, res, next) {
  // Skip email verification in development for easier testing
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  if (!req.user?.emailVerified) {
    return res.status(403).json({
      error: 'EmailNotVerified',
      message: 'Please verify your email address before using AI features. Check your inbox (and spam folder).',
    });
  }

  next();
}
