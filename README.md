# 📱 EdTech Stream – React Native (Expo) Assignment

This is a React Native app built with **Expo** as part of the assignment:  
**WebView + Notifications + Video Player**.

---

## 🎯 Objective
The goal of this project is to demonstrate the integration of:
- A **WebView** page that embeds a website.
- **Local notifications** triggered by user interactions.
- An **HLS video player** with custom playback controls.
- **Navigation** between multiple screens.

---

## 🛠 Features & Implementation

### 1. WebView Page
- Embeds [React Native official site](https://reactnative.dev/) inside a WebView.
- Two buttons (`Notify 1`, `Notify 2`) trigger **local notifications** with random delay (2–3s).
- **Bonus**: A notification also appears when the page finishes loading.

### 2. Notifications
- Configured with **Expo Notifications API**.
- Foreground + background notifications supported.
- Two distinct messages implemented.
- On tap, notifications can **navigate to the Video Player screen**.

### 3. Video Player Page
- Plays an **HLS video** (`Big Buck Bunny`) using Expo’s `expo-av` package.  
  - Primary stream: `https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`.
- Features:
  - **Play / Pause**
  - **Mute / Unmute**
  - **Fullscreen toggle (landscape orientation)**
  - **Switch between multiple streams** (bonus).
- Auto-hides playback controls with tap gestures.

### 4. Navigation
- Implemented using **React Navigation (Native Stack)**.
- Three screens:
  - `HomeScreen` → launch video and send notifications.
  - `VideoScreen` → video player with custom controls.
  - `WebViewScreen` → embedded site with notifications.

---

## 📂 Project Structure
