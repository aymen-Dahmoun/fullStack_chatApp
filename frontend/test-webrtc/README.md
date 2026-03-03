# WebRTC Phone-to-Browser Test

This is a minimal browser test page to verify WebRTC signaling between the phone app and a desktop browser using your existing Socket.IO backend.

## What this test does

- Connects to your Socket.IO server with a JWT token.
- Waits for a phone call offer.
- Sends an answer and exchanges ICE candidates.
- Renders the remote video stream in the browser.

## Requirements

- Backend running on the same LAN as your phone and PC.
- A valid JWT token copied from the phone logs.
- Phone app built with `react-native-webrtc` (already in this repo).

## Quick start

1) Start the backend.

```bash
cd /home/aymen/fullStack_chatApp/backend
npm run dev
```

2) Serve the test page.

```bash
cd /home/aymen/fullStack_chatApp/frontend/test-webrtc
node server.js
```

3) Open the page in your browser.

- http://localhost:8081

4) Paste the JWT token in the page (from the phone logs).

- The app prints `Stored token:` in the console (Metro logs).

5) Press **Connect**.

6) On the phone, tap **Call** in a chat.

Expected: the browser renders the phone video stream.

## Notes

- Update the Socket URL field if your backend IP changes.
- This page acts as a callee (answer-only). It does not place calls.

## Troubleshooting

- **Connect error**: token missing/invalid or backend unreachable.
- **No video**: ICE candidate exchange failed; check logs and STUN reachability.
- **Autoplay blocked**: click anywhere in the page to allow video playback.
