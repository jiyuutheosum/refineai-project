# Firebase Admin SDK Setup Guide (Backend)

This guide explains **exactly** how to set up Firebase Admin credentials for the RefineAI backend.

---

## Why This Is Needed

The backend needs to talk to Firestore (to save rate limit usage, created manual resumes, etc.).  
For that, it uses the **Firebase Admin SDK**, which requires special credentials (a service account).

Without these credentials, the backend will crash with:

```
Failed to initialize Firebase Admin SDK: No Firebase credentials found.
```

---

## Recommended Setup (Local Development)

### Step 1: Download Your Service Account Key

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **refine-ai-project**
3. Click the **gear icon** (Project Settings) in the top left
4. Go to the **Service Accounts** tab
5. Scroll down and click **"Generate new private key"**
6. Click **Generate Key** in the popup
7. A JSON file will be downloaded (something like `refine-ai-project-firebase-adminsdk-xxxxx.json`)

**Keep this file safe.** It gives full access to your Firebase project.

### Step 2: Place the Key File in the Server Folder

Move or copy the downloaded JSON file into this folder:

```
server/serviceAccountKey.json
```

> **Tip**: Rename it to `serviceAccountKey.json` for simplicity.

### Step 3: Update Your `server/.env` File

Open (or create) the file:

```
server/.env
```

Add (or update) this line:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
```

### Recommended Full `server/.env` (Minimal Working Version)

Here’s a clean version you can use:

```env
# Server
PORT=4000
NODE_ENV=development

# Firebase Admin SDK (Required)
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FIREBASE_PROJECT_ID=refine-ai-project

# CORS (allow your frontend)
CORS_ORIGIN=http://localhost:5173

# AI Provider (Server-side only)
GROQ_API_KEY=gsk_your_actual_groq_key_here
```

> **Important**: 
> - Never put your real private key content directly in the `.env` file.
> - Use the file path method above instead.

---

## Alternative Methods

### Method A: Full JSON as Environment Variable (Good for Hosting)

Some platforms (Render, Railway, etc.) don’t let you easily upload files.

In that case, you can do this instead:

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"refine-ai-project","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...","client_email":"firebase-adminsdk-...@refine-ai-project.iam.gserviceaccount.com"}
```

You can generate this string by taking your `serviceAccountKey.json` and removing all newlines and extra spaces.

### Method B: Google Application Default Credentials (Production)

If you deploy to Google Cloud (Cloud Run, App Engine, etc.), you usually **don’t need** to set anything — it uses automatic credentials.

---

## Security Rules

- **Never commit** `serviceAccountKey.json` to Git.
- The `.gitignore` in the `server/` folder is already configured to ignore it.
- Never paste the full private key into public places (like this chat).

---

## How to Verify It Works

After setting up:

1. Go to the `server` folder
2. Run:

```bash
npm run dev
```

You should see something like:

```
✅ Firebase Admin initialized using FIREBASE_SERVICE_ACCOUNT_PATH
🚀 RefineAI Backend running on http://localhost:4000
```

If you still see the error about missing credentials, double-check:

- The file `serviceAccountKey.json` actually exists in the `server/` folder
- The path in `.env` is correct (`./serviceAccountKey.json`)
- You restarted the server after editing `.env`

---

## Common Mistakes

| Mistake | Problem | Fix |
|--------|--------|-----|
| Putting the JSON content directly in `.env` | Very messy and error-prone | Use file path instead |
| Using the frontend `.env` keys | Wrong file | Only edit `server/.env` |
| Forgetting to restart the server | Changes not loaded | Run `npm run dev` again |
| Committing the key file | Security risk | `.gitignore` already handles this |

---

## Need Help?

If you're still stuck, tell me:

1. What does your `server/.env` currently look like? (You can share it without the actual private key)
2. Did you download and place the `serviceAccountKey.json` file in the `server/` folder?
3. What exact error are you seeing when you run `npm run dev`?

This setup is the cleanest and most maintainable way for this project.