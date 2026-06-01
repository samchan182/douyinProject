# Douyin Content Generator

Upload an English screenshot (e.g. from X/Twitter) — get a translated Chinese image + ready-to-post Douyin caption.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **LLM:** Google Gemini 2.5 Flash (vision + text generation)
- **Image Processing:** node-canvas + sharp (server-side text replacement)
- **Proxy:** undici ProxyAgent (required for environments behind a firewall)

## Setup

1. Create `.env.local` in the project root:
   ```
   GEMINI_API_KEY=your-gemini-api-key-here
   ```
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open http://localhost:3000

## Known Issues — Gemini API Key

### 403 Permission Denied on `gemini-2.5-flash`

```
Gemini API error (403): Your project has been denied access. Please contact support.
```

**Cause:** The Google Cloud project associated with the API key does not have access to the `gemini-2.5-flash` model. This can happen when:
- The API key was created before `gemini-2.5-flash` became available in your region
- The project has not enabled the Generative Language API
- The project is on a restricted plan

**Fix:** Go to https://aistudio.google.com/apikey and generate a new API key from a project that has the model enabled. Or switch the model in `src/lib/gemini.ts` to one your project has access to (e.g. `gemini-2.0-flash`).

### 429 Quota Exceeded

```
Gemini API error (429): You exceeded your current quota, please check your plan and billing details.
```

**Cause:** The free tier quota for the Gemini API has been exhausted.

**Fix:** Either:
- Wait for quota to reset (free tier resets daily)
- Enable billing on your Google Cloud project at https://console.cloud.google.com/
- Create a new API key from a different Google Cloud project

### How to update the API key

Edit `.env.local` in the project root:
```
GEMINI_API_KEY=your-new-key-here
```
Then restart the dev server.

## Network / Proxy

This project uses `undici.ProxyAgent` to route Gemini API calls through a local proxy at `http://127.0.0.1:7897`. If your proxy runs on a different port, update the proxy URL in `src/lib/gemini.ts`.

Node.js's built-in `fetch` does NOT respect `HTTPS_PROXY` environment variables. That is why `undici` is used directly.
