# Bonggo Meet (Yoom)

A lightweight Next.js video meeting app using GetStream Video SDK. Originally built with Clerk auth, this repository has been modified to run with anonymous per-browser identities and a server-side token minting action for Stream.

> Note: This README reflects the current codebase (no Clerk auth, recordings removed). Use the steps below to run locally and deploy.

## Features
- Next.js 14 (App Router)
- Stream Video SDK for real-time video calls
- Anonymous per-browser user ids with optional display name
- Pre-join setup (camera preview, device selection)
- Custom call controls: mute/unmute, camera on/off, screen share, leave
- Responsive toolbar with overflow (three-dots) menu
- Recordings UI removed (disabled)

## Quick Start (Local)
1. Clone the repo

   git clone <your-repo-url>
   cd Bonggo_Meet-main

2. Install dependencies

   npm install

3. Create environment variables

Create a `.env.local` in the project root and set the following variables:

```
NEXT_PUBLIC_STREAM_API_KEY=<your_stream_api_key>
STREAM_API_KEY=<your_stream_api_key>
STREAM_API_SECRET=<your_stream_api_secret>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- `NEXT_PUBLIC_STREAM_API_KEY` is required by the client.
- `STREAM_API_KEY` and `STREAM_API_SECRET` are required by the server action that mints Stream tokens.

4. Run the dev server

```powershell
npm run dev
```

Open `http://localhost:3000` in your browser.

## How User Identity Works (current design)
- The app creates a per-browser id stored in `localStorage` under the key `bonggo_anonymous_id`.
- Users can optionally enter a display name on the meeting setup screen; this is stored under `bonggo_display_name`.
- The client requests a Stream token for the per-browser user id via the server action `actions/stream.actions.ts::createStreamToken(userId)`.
- The `providers/StreamClientProvider.tsx` initializes `StreamVideoClient` with the persistent `user.id` and `user.name` read from `localStorage`. This allows the display name to appear in the meeting UI.

## Important Files
- `app/` — Next.js app routes and layouts.
- `providers/StreamClientProvider.tsx` — Initializes `StreamVideoClient`; reads `localStorage` for id and name and requests tokens for that user id.
- `actions/stream.actions.ts` — Server action that mints Stream tokens using `@stream-io/node-sdk` and `STREAM_API_SECRET`.
- `components/MeetingSetup.tsx` — Pre-join screen with camera preview and "Your name" input.
- `components/CallControlsSimple.tsx` — Custom in-call controls (mute, camera, screen share, leave).
- `components/MeetingRoom.tsx` — Main meeting UI (layout, participants, toolbar).

## Environment Variables
- `NEXT_PUBLIC_STREAM_API_KEY` (client-facing Stream API key)
- `STREAM_API_KEY` (server key, optional but recommended mirror)
- `STREAM_API_SECRET` (server secret for minting tokens)
- `NEXT_PUBLIC_BASE_URL` (used for generating invitation links; default `http://localhost:3000`)

Keep `STREAM_API_SECRET` secret; do not commit it to source control.

## Deployment Notes
- This app uses server actions to mint Stream tokens. Ensure the deployment target supports server-side environment variables (e.g., Vercel, Render, Fly).
- Remove any Clerk references or configuration prior to deploying if you previously had them — this repo has Clerk removed.
- On Vercel, add the environment variables in the project settings.

## Common Troubleshooting
- "Anonymous User" still shown:
  - Confirm a display name was entered on the Setup screen and that `localStorage` contains `bonggo_display_name`.
  - Reload the page after entering a name or restart the dev server so the `StreamVideoClient` reads the stored name.
  - If participant tiles still show anonymous, the SDK may require participant metadata updates after join; `MeetingSetup.tsx` includes a best-effort `getLocalParticipant().update({ name })` call.

- Token errors:
  - Ensure `STREAM_API_SECRET` and `STREAM_API_KEY` are present. The server action will throw if missing.

- Camera or mic not showing:
  - Check site permissions in the browser.
  - Use the Camera Diagnostic button on the Setup screen to verify access.

## Testing Multi-Participant Locally
- Open the same meeting in two browsers (or one browser + incognito) and enter different display names on each Setup screen to verify names show correctly.

## Extending / Re-enabling Auth
- The previous code used Clerk. If you want to re-enable auth, reintroduce Clerk or another auth provider and modify the token minting action to use the authenticated user id.

## Contribution Guidelines
- Fork and open a PR with a clear description of changes.
- Run `npm run lint` and `npm run build` before submitting PRs.

## License
- No license specified (private project). Add a license file if you plan to open-source.

---

If you'd like, I can:
- Run the app locally here and verify the display-name propagation.
- Add a small UI polish to show the saved display name on the personal room page.
- Add a CONTRIBUTING.md and templates for issues/PRs.

Tell me which follow-up you'd prefer and I'll implement it.