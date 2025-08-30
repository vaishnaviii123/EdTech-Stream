# edtech (Expo) — WebView + Notifications + HLS Video

## How to run
1. Install deps: `npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context react-native-webview expo-av expo-notifications`
2. Start: `npx expo start`
3. Open in **Expo Go** (scan QR). On device, allow notifications when prompted.

## What’s implemented
- `WebView` screen with:
  - Embedded website (`https://example.com`).
  - Two buttons that schedule local notifications (2s and 5s delay).
  - Bonus: notification on WebView load completion.
  - Tapping the 5s notification opens the Video screen (handled via data payload + listener).
- `Video` screen:
  - Plays HLS stream: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`.
  - Native controls plus custom play/pause, mute, seek, switch-stream buttons.

## Notes & testing tips
- Notifications: allow permission on device. Foreground notifications are shown because the app sets a notification handler.
- On some platforms / OS versions, the behavior of scheduled local notifications in Expo Go can differ; building a standalone app gives final behavior.
- If TypeScript red underlines appear in VSCode, restart the TS server: open command palette -> “TypeScript: Restart TS server”.

## Bonus implemented
- Notification on WebView finish.
- Tapping scheduled notification navigates to Video screen.
- Custom video controls (seek, mute) and stream switching.
