# RefineAI Backend — Rate Limiting & AI Proxy

This folder contains the **planned Node.js + Express backend** for RefineAI. It is responsible for:

- Proxying all AI calls (Groq, future xAI, Gemini, etc.) so API keys never reach the browser.
- Enforcing strict per-user rate limits using Firebase UID + Firestore.
- Protecting the free tier from abuse and runaway token costs.

---

## 🚀 Quick Start (Important!)

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

### 3. Add Firebase Admin Credentials (Required)

**The backend will not start without this step.**

**Recommended Setup (Best Practice)**

### For Local Development (Easiest)

1. Download your service account key from Firebase Console → Service Accounts.
2. Place it in the `server/` folder and rename it to `serviceAccountKey.json`.
3. Add this to your `server/.env`:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

### For Production / Other Platforms (Render, Railway, etc.)

```

(Paste the entire content of your `serviceAccountKey.json` as a single line)

The code now supports all three common methods automatically.

### 4. Start the backend

```bash
npm run dev
```

You should see:
```
🚀 RefineAI Backend running on http://localhost:4000
```

---

## Common Errors

### "No Firebase credentials found"

→ You did not complete step 3 above. Add `FIREBASE_SERVICE_ACCOUNT_PATH` to `server/.env`.

### "Network Failed" in the frontend

→ The backend is not running. Start it with `npm run dev` in the `server` folder.

## Recommended Architecture (Senior Level)

### 1. Why Firestore + Admin SDK for Rate Limiting?

- **User-centric, not IP**: Firebase UID is the source of truth. Immune to VPNs, proxies, or shared IPs.
- **Persistent & Scalable**: Works across server restarts and multiple instances (horizontal scaling).
- **Atomic & Safe**: `FieldValue.increment()` inside transactions prevents race conditions when a user spams from multiple tabs.
- **Tier Support**: Easy to read `users/{uid}.tier` or custom claims.
- **Analytics Ready**: You get a full history of usage per user per day for free.

### 2. Cost Control (The Most Important Part)

Firestore reads/writes cost money. On free tier this matters.

**Strategies implemented here**:

| Technique                    | How it saves money                          | Implementation |
|-----------------------------|---------------------------------------------|----------------|
| In-memory LRU-style cache   | 95%+ of checks are in-RAM after first hit   | `usageCache` Map + 45s TTL |
| Write coalescing            | Don't write on every single request         | Cache + periodic / on-limit increments |
| Document per user per day   | Small docs, point reads, easy cleanup       | `${uid}_2025-04-10` pattern |
| Fail-closed on errors       | Prevents abuse when DB is slow              | 503 instead of allowing unlimited |
| Transaction only on miss    | Hot path uses optimistic cache + async increment | Hybrid read/write path |

**Expected cost on free tier (100 users, heavy use)**: Usually <$5/month.

### 3. Project Structure (Clean & Maintainable)

```
server/
├── src/
│   ├── config/
│   │   └── firebaseAdmin.js          # Singleton Admin SDK init
│   ├── middleware/
│   │   ├── auth.js                   # verifyFirebaseToken + tier lookup
│   │   └── rateLimiter.js            # createAiRateLimiter factory + prebuilt instances
│   ├── services/
│   │   └── usageTracker.js           # All Firestore logic + in-memory cache
│   ├── routes/
│   │   └── ai.js                     # /analyze-resume, /generate-mock-interview, /usage
│   ├── utils/
│   │   └── rateLimitConfig.js        # Tiers, limits, date helpers (single source of truth)
│   └── index.js                      # Express bootstrap + security
├── .env.example
├── package.json
└── README.md
```

### 4. How to Apply Rate Limiting

```js
// In any route
import { verifyFirebaseToken } from '../middleware/auth.js';
import { rateLimitResumeAnalysis, rateLimitAnyAiAction } from '../middleware/rateLimiter.js';

router.post(
  '/analyze-resume',
  verifyFirebaseToken,
  rateLimitResumeAnalysis,   // 20/day free
  rateLimitAnyAiAction,      // 100 total AI actions/day
  yourHandler
);
```

### 5. Frontend Integration (Required Next Step)

1. Stop calling `groq-sdk` directly from the browser.
2. Move all prompts + `chat.completions.create` calls into the backend routes above.
3. In frontend, use `axios` + Firebase `auth.currentUser.getIdToken()`:

```js
const token = await auth.currentUser.getIdToken();
const res = await axios.post('/api/ai/analyze-resume', { resumeText }, {
  headers: { Authorization: `Bearer ${token}` }
});
```

### 6. Example Free Tier Limits (as specified)

- `resumeAnalysis`: 20 / day
- `mockInterview`: 5 / day  
- `totalAiActions`: 100 / day (global backstop)

Easily changed in `rateLimitConfig.js`.

### 7. Future Enhancements

- Redis-backed distributed cache (for multi-region)
- Custom claims for instant tier upgrades
- Usage dashboard in the app (call `/api/ai/usage`)
- Monthly + daily windows
- Soft limits with "buy more credits" upsell

---

**Status**: Fully implemented and ready to be wired to real AI providers.

Run with:
```bash
cd server
cp .env.example .env
# fill in credentials
npm run dev
```
