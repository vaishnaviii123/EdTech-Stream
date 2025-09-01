# 📱 EdTech Stream – React Native (Expo) Assignment

This is a **React Native app built with Expo** as part of the assignment:  
**WebView + Notifications + Video Player**.

---

## 🎯 Objective

The goal of this project is to demonstrate the integration of:

- A **WebView** page that embeds a website.  
- **Local notifications** triggered by user interactions.  
- A **video player** that plays an HLS stream with playback controls.  

---

## 🚀 Features

### 🔗 WebView + Notifications
- Embeds **React Native’s official site** inside a WebView.  
- Two buttons below the WebView trigger **distinct notifications** with a slight delay.  
- Sends a **notification when the page is ready** (bonus feature).  

### 🎬 Video Player
- Plays HLS video using `expo-av`.  
- Controls: **Play/Pause, Mute/Unmute, Switch Streams, Fullscreen**.  
- Orientation handling with `expo-screen-orientation`.  
- Auto-hides custom controls after inactivity.  
- Supports switching between **multiple streams**.  

### 🧭 Navigation
- Smooth navigation with `@react-navigation/native-stack`.  
- Home → Video Player → WebView pages.  
- Notifications can **navigate back into the app** (e.g., “Watch Big Buck Bunny” notification opens the video).  

---

## 📂 Project Structure

```
.
├── App.tsx                # Root app, navigation + notification setup
├── src/screens
│   ├── HomeScreen.tsx     # Landing page, video preview, navigation
│   ├── VideoScreen.tsx    # HLS video player with custom controls
│   └── WebViewScreen.tsx  # WebView + notification triggers
├── src/theme/colors.ts    # Centralized color theme
├── app.json               # Expo config
├── package.json           # Dependencies + scripts
└── assets/                # Logo, splash images
```

---

## 🛠 Tech Stack

- **React Native 0.79.6** (Expo SDK 53)  
- **TypeScript**  
- **React Navigation** (`@react-navigation/native`, `native-stack`)  
- **expo-av** (Video player)  
- **expo-notifications**  
- **expo-screen-orientation**  
- **react-native-webview**  
- **react-native-paper** (UI components)  

---

## ▶️ Getting Started

### 1️⃣ Install dependencies
```bash
npm install
# or
yarn install
```

### 2️⃣ Start development server
```bash
npm start
# then press 'i' for iOS simulator, 'a' for Android
```

### 3️⃣ Run on a device
- Install **Expo Go** app on your phone.  
- Scan the QR code from the terminal/Expo DevTools.  

---

## 📸 Screens

- **Home Screen**: Video preview, “Play” & “Info” buttons, link to WebView.  
- **Video Screen**: Full HLS playback with custom controls + fullscreen support.  
- **WebView Screen**: Embedded site with two notification-triggering buttons.  

---

## ✅ Assignment Requirements Covered

- [x] WebView integration  
- [x] At least two distinct notifications  
- [x] Video player with HLS support and playback controls  
- [x] Navigation between WebView and Video Player  
- [x] Bonus: Notification on WebView load  
- [x] Bonus: Notification navigates to Video page  

---

## 📦 Scripts

```bash
npm run start     # Start Expo dev server
npm run android   # Run on Android
npm run ios       # Run on iOS
```

---

## 👨‍💻 Author

Developed as part of an **EdTech React Native assignment**.
