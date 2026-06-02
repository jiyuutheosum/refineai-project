# RefineAI - AI-Powered Resume Enhancement Platform

**RefineAI** is a web application that leverages artificial intelligence to analyze resumes, provide actionable feedback on content and structure, and allows users to manually edit and improve their resumes with real-time comparison tools. It includes mock interview generation, job search integration, and per-user AI quotas.

A dedicated Express backend (`/server`) proxies all AI calls (Groq) for security and enforces production-grade per-user rate limiting using Firebase UID + Firestore.

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | React 18 + Vite |
| **Build Tool** | Vite 5 |
| **State Management** | Redux Toolkit (feature slices) + React Redux |
| **Routing** | React Router DOM v6 (`createBrowserRouter`, lazy + Suspense) |
| **Styling** | Tailwind CSS 3 + CSS variables + class-variance-authority |
| **Forms** | React Hook Form + schemas |
| **Animations** | Framer Motion |
| **Charts / Viz** | Recharts |
| **Icons** | Lucide React |
| **Client API / Auth** | Axios + Firebase (Auth + Firestore + Storage) |
| **Backend** | Node.js + Express (AI proxy + rate limiting) |
| **AI** | Groq (server-side only via `/api/ai/*`) |
| **Other** | Radix UI primitives, React PDF Renderer, Tiptap (editor), date-fns |
| **Testing** | Vitest + React Testing Library (manual testing primary) |

## 🏗️ Architecture

**Feature-First Modular Design** (self-contained features under `src/features/`):

- `app/` — Only core config: router (Routes.jsx with lazy + WorkflowGuard + AuthGuard), providers, store (7 Redux slices, myResumes is primary for persisted data), layouts.
- `features/` — Domain modules (auth, resume-upload, resume-analysis, my-resumes, manual-resume-editor, feedback-summary, mock-interview, hirings, not-found). Each typically has pages/, components/, hooks/, store/ (slice + selectors), services/, utils/, schemas/, constants/.
- `shared/` — Cross-feature: components (ui/, layout/, feedback/, ErrorBoundary, UsageQuota, etc.), lib/cn.js.
- `lib/` — Centralized: `backendApi.js` (axios instance + Firebase token injection + aiApi helpers for analyze/generate/getUsage), firebase.js.
- `styles/` — Tailwind + globals + design tokens (CSS vars).

**Backend (`/server`)**: Express app with:
- Auth middleware (Firebase ID token verification + optional email verified).
- Rate limiting middleware + usageTracker (Firestore per-day docs + in-memory cache, tier-aware limits).
- AI routes (`/api/ai/analyze-resume`, `/api/ai/generate-mock-interview`, `/api/ai/usage`) with input validation/sanitization and prompt hardening.
- All expensive AI (Groq) happens server-side only.

**Key patterns**:
- All AI calls go through `aiApi` (secure, rate-limited).
- Firebase for user data + auth; direct writes still exist in feature services alongside backend (see analysis for debt).
- Usage quotas (`remaining` counts) exposed via `UsageQuota` component on upload, my-resumes, detail, and mock pages.
- Lazy loading, error boundaries, React Hook Form + validation.

See the full current structure and recommendations in `PROJECT_ANALYSIS.md`.

## 🚀 Quick Start

**Prerequisites**: Node.js, npm. Firebase project + Groq key. Copy `.env` / `server/.env` and place `server/serviceAccountKey.json` (see `server/README.md` and `server/FIREBASE_SETUP.md`).

```bash
npm install

# 1. Start the backend (required for AI + rate limiting + auth-protected endpoints)
cd server
npm run dev     # http://localhost:4000 (default)

# 2. In another terminal: start the frontend
cd ..
npm start       # http://localhost:5173 (Vite default; see vite.config.js)
```

- `npm run build` for production frontend.
- Backend health: `GET http://localhost:4000/health`
- Full AI usage/quotas require a logged-in Firebase user (the app enforces auth on protected routes).

## 📁 Features Implemented

- **auth**: Email/password + Google sign-in, email verification modal/guard, protected routes.
- **resume-upload**: Drag/drop or manual, validation, PDF/DOCX text extraction, triggers backend AI analysis.
- **resume-analysis**: Calls secure backend, displays overall score + section feedback.
- **my-resumes**: List of all user resumes (uploaded + manual), detail view with re-analysis, PDF export of manual edits, mock questions per-resume, AI quota display.
- **manual-resume-editor**: Tiptap rich-text editor, templates (classic/modern/etc), live comparison, section editing, save to Firestore (marks for re-analysis).
- **feedback-summary**: Visual breakdown (Recharts), overall + section scores, priority actions, export options.
- **mock-interview**: Select resume → generate tailored questions via backend (persisted on resume doc), practice view with `InterviewQuestionsList`.
- **hirings**: Adzuna job search integration (role detection from resume).
- **not-found**: 404 page.

**Backend-powered**:
- Resume analysis (20/day free)
- Mock interview generation (5/day free)
- Global AI action cap (100/day)
- Real-time quota/remaining display via `UsageQuota` component + `/api/ai/usage`

## 🧩 Extending Features

1. Create `features/[new-feature]/pages/[Name]Page.jsx` (thin page).
2. Add feature slice under `features/.../store/` + register in `app/store/index.js`.
3. Business logic in `hooks/`, `services/`, `utils/`.
4. Add protected route in `app/router/Routes.jsx` (use `ProtectedRoute` + optional `WorkflowGuard`).
5. For AI features: use `aiApi` from `@/lib/backendApi` (never call Groq client-side).

See `PROJECT_ANALYSIS.md` (Latest Code Review) for architecture details, open items, and refactoring guidance. Backend routes live in `server/src/routes/ai.js`.

## 🔒 Backend, Rate Limiting & Quotas

A full **Node.js + Express** backend powers all AI:

- Secure proxy: No Groq keys or direct SDK calls in the browser (`src/lib/groq.js` is a safe stub; `VITE_GROQ_API_KEY` removed from client `.env`).
- Rate limiting: Per-Firebase-UID daily limits (enforced on every AI call). Hybrid cache (Firestore source-of-truth + in-memory).
- Usage visibility: `aiApi.getUsage()` + `<UsageQuota />` component shows remaining analyses / mock interviews on key pages. Buttons can be disabled when quota is 0. Rate limit errors are surfaced nicely (429 handling in backendApi).
- Validation: Resume text length + basic prompt-injection redaction on the server before Groq.

**Free tier defaults** (see `server/src/utils/rateLimitConfig.js`):
- 20 resume analyses / day
- 5 mock interview generations / day
- 100 total AI actions / day (global safety cap)

**See**:
- `server/README.md` and `server/FIREBASE_SETUP.md` for setup (service account, env vars).
- `src/lib/backendApi.js` (the aiApi wrapper + interceptors).
- `server/src/middleware/rateLimiter.js`, `usageTracker.js`, `routes/ai.js`.

The frontend integration (calls + quota UI) is complete. Recent cleanup also removed random dev request logging while keeping error + startup logs.

---

## 📋 Prerequisites & Environment

- Node.js (v18+ recommended)
- Firebase project (Auth + Firestore + Storage enabled)
- Groq API key (stored **only** in `server/.env` as `GROQ_API_KEY`)
- For local: `server/serviceAccountKey.json` (gitignored) or `FIREBASE_SERVICE_ACCOUNT_PATH`

Copy and fill:
- Root `.env` (Firebase web config + `VITE_BACKEND_URL=http://localhost:4000`)
- `server/.env` (from `server/.env.example`)

Never commit keys or service account files. See `PROJECT_ANALYSIS.md` for security notes.


## 📁 Project Structure (Current)

See the detailed tree and explanations in `PROJECT_ANALYSIS.md` (section 3 and the "Latest Code Review").

High level:
- `src/app/` — router, store, providers, MainLayout
- `src/features/*` — self-contained feature folders (see list above)
- `src/shared/components/` + `src/lib/` — shared UI + `backendApi.js`
- `server/src/` — Express routes, middleware (auth + rateLimiter), services (usageTracker, resumeAnalysis, mockInterview), config (firebaseAdmin)

## 🎨 Customization & Theming

- Tailwind + CSS variables (see `styles/globals.css`, `tailwind.config.js`).
- Theme tokens for primary, success, destructive, etc.
- Edit `app/router/Routes.jsx` for routes (lazy-loaded, wrapped with `ProtectedRoute` / `WorkflowGuard`).
- Shared UI primitives in `src/shared/components/ui/`.

The app is fully responsive via Tailwind breakpoints.

## 📦 Development & Deployment Notes

- **Frontend dev**: `npm start` (Vite on 5173).
- **Backend dev**: `cd server && npm run dev` (or `npm run start`).
- **Build**: `npm run build` (outputs to `dist/`).
- **Preview**: `npm run serve`.
- Production requires proper Firebase rules, server env vars / secrets for the Express app, and the Vite `VITE_BACKEND_URL` pointing at your deployed backend.
- See `PROJECT_ANALYSIS.md` (Latest Code Review - 2025-04-10 and updates) for health, open items (data layer unification, observability, etc.), and security recommendations. Recent work includes quota UI (`UsageQuota`), client AI key cleanup, and removal of random dev console logs (kept errors + startup).

For backend-specific setup, read `server/README.md`.