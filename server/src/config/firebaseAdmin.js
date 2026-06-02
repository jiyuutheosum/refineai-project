/**
 * @file server/src/config/firebaseAdmin.js
 * @description Firebase Admin SDK initialization for server-side operations.
 * 
 * IMPORTANT: Never commit service account keys to git.
 * Use environment variables or Google Application Default Credentials (ADC) in production.
 * 
 * For local dev:
 *   - Download serviceAccountKey.json from Firebase Console → Project Settings → Service Accounts
 *   - Place it securely (outside repo) or use GOOGLE_APPLICATION_CREDENTIALS env var.
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseApp;

function initializeFirebaseAdmin() {
  if (firebaseApp) {
    return firebaseApp; // Singleton pattern
  }

  try {
    let credential;

    // Priority 1: Standard Google ADC (best for production on Google Cloud)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      credential = admin.credential.applicationDefault();
      console.log('Firebase Admin initialized using GOOGLE_APPLICATION_CREDENTIALS (ADC)');
    }

    // Priority 2: Full service account JSON as environment variable (great for Render, Railway, Heroku, etc.)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = admin.credential.cert(serviceAccount);
      console.log('Firebase Admin initialized using FIREBASE_SERVICE_ACCOUNT (from env variable)');
    }

    // Priority 3: Path to service account key file (best for local development)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
      console.log('Firebase Admin initialized using FIREBASE_SERVICE_ACCOUNT_PATH');
    }

    // Priority 4: Try Application Default Credentials anyway (works in many cloud environments)
    else {
      credential = admin.credential.applicationDefault();
      console.log('Firebase Admin initialized using Application Default Credentials (ADC)');
    }

    firebaseApp = admin.initializeApp({
      credential,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    return firebaseApp;

  } catch (error) {
    console.error('\n❌ Failed to initialize Firebase Admin SDK');
    console.error('Error:', error.message);
    console.error('\n→ Please configure one of the following in your server/.env file:');
    console.error('');
    console.error('  Local Development:');
    console.error('    FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json');
    console.error('');
    console.error('  Render, Railway, Heroku, etc.:');
    console.error('    FIREBASE_SERVICE_ACCOUNT={"type":"service_account", ...full json...}');
    console.error('');
    console.error('  Google Cloud (Cloud Run, etc.):');
    console.error('    Usually works automatically (Application Default Credentials)');
    console.error('');
    process.exit(1);
  }
}

// Initialize immediately on import
initializeFirebaseAdmin();

export const auth = admin.auth();
export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
export const Timestamp = admin.firestore.Timestamp;

export default admin;
