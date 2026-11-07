# @mehul214/react-native-flash-toast ⚡️

[![npm version](https://img.shields.io/npm/v/@mehul214/react-native-flash-toast.svg?style=flat-square)](https://www.npmjs.com/package/@mehul214/react-native-flash-toast)
[![npm downloads](https://img.shields.io/npm/dm/@mehul214/react-native-flash-toast.svg?style=flat-square)](https://www.npmjs.com/package/@mehul214/react-native-flash-toast)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Fabric Ready](https://img.shields.io/badge/New%20Architecture-Fabric%20%26%20TurboModules-brightgreen.svg?style=flat-square)](https://reactnative.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)
[![Sponsor](https://img.shields.io/badge/Sponsor-GitHub%20Sponsors-pink.svg?style=flat-square)](https://github.com/sponsors/Mehul214)
[![Donate UPI](https://img.shields.io/badge/Donate-UPI-orange.svg?style=flat-square)](#-support-via-upi)

> Next-generation flash message, alert bar, and toast notification library for **React Native** and **Expo**. Built for the **New Architecture (Fabric)**, modern safe areas, dynamic islands, and interactive swipe-to-dismiss gestures.

A modern, drop-in replacement for the outdated `react-native-flash-message` package.

---

## 🌟 Why react-native-flash-toast?

| Feature | `react-native-flash-message` (Legacy) | `react-native-flash-toast` (This Package) |
| :--- | :---: | :---: |
| **New Architecture (Fabric)** | ⚠️ Deprecated / Layout warnings | ✅ **100% Native Driver & Fabric Ready** |
| **Edge-to-Edge / Dynamic Island** | ❌ Hardcoded iPhone X dimensions | ✅ **Auto-adaptive safe-area insets** |
| **Gestures** | ❌ No swipe gesture dismissal | ✅ **Smooth swipe-up / swipe-down to dismiss** |
| **Countdown Timer Progress Bar** | ❌ None | ✅ **Built-in animated progress bar** |
| **Pause on Press** | ❌ None | ✅ **Pauses autoHide timer while held** |
| **Action Buttons** | ❌ Manual boilerplate | ✅ **Native Action Buttons (Undo, Retry)** |
| **React Hooks** | ❌ Global ref only | ✅ **Both `useFlashMessage()` hook & global `showMessage()`** |
| **Zero Native Dependencies** | ✅ Pure JS/TS | ✅ **Pure JS/TS (Works in Expo Go instantly)** |

---

## 📦 Installation

```bash
npm install @mehul214/react-native-flash-toast
# or
yarn add @mehul214/react-native-flash-toast
# or
pnpm add @mehul214/react-native-flash-toast
```

*(No `pod install` or native linking required!)*

---

## 🚀 Quick Start

### 1. Mount the Container

Add `<FlashMessage />` at the root of your application (typically in `App.tsx` or your root layout component):

```tsx
import React from 'react';
import { View } from 'react-native';
import { FlashMessage } from '@mehul214/react-native-flash-toast';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <YourAppNavigator />
      {/* Place at the very end so it renders above everything */}
      <FlashMessage position="top" />
    </View>
  );
}
```

### 2. Trigger from Anywhere!

Call `showMessage` anywhere in your code — inside components, hooks, navigation listeners, Redux sagas, Zustand stores, or API error interceptors:

```tsx
import { showMessage, hideMessage } from '@mehul214/react-native-flash-toast';

// Simple success message
showMessage({
  message: 'Payment Successful!',
  description: 'Your subscription is now active.',
  type: 'success',
});

// Danger / Error alert
showMessage({
  message: 'Failed to upload image',
  description: 'Please check your internet connection.',
  type: 'danger',
});

// Bottom toast with action button & progress bar
showMessage({
  message: 'Item moved to Archive',
  type: 'default',
  position: 'bottom',
  showProgressBar: true,
  action: {
    label: 'Undo',
    onPress: () => console.log('Undoing action...'),
  },
});
```

---

## 🪝 React Hook Usage

Prefer modern React hooks? Wrap your app with `<FlashMessageProvider>`:

```tsx
import { FlashMessageProvider, useFlashMessage } from '@mehul214/react-native-flash-toast';

function Root() {
  return (
    <FlashMessageProvider position="top">
      <App />
    </FlashMessageProvider>
  );
}

function ProfileScreen() {
  const { show, hide } = useFlashMessage();

  return (
    <Button
      title="Save"
      onPress={() =>
        show({
          message: 'Saved!',
          type: 'success',
        })
      }
    />
  );
}
```

---

## 🎨 Semantic Types & Built-in Themes

| Type | Default Background | Default Icon | Intended Use |
| :--- | :--- | :--- | :--- |
| `success` | `#059669` (Emerald) | ✓ Checkmark | Confirmed actions, saved states |
| `danger` | `#DC2626` (Red) | ✕ Close | Errors, network failures |
| `warning` | `#D97706` (Amber) | ! Warning | Disconnections, low storage |
| `info` | `#2563EB` (Blue) | ℹ Info | Informational alerts, updates |
| `default` | `#1F2937` (Dark Slate) | ● Bullet | Neutral toasts & notifications |

---

## ⚙️ Options & API Reference

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `message` | `string \| ReactNode` | **Required** | The main title or text content |
| `description` | `string \| ReactNode` | `undefined` | Secondary subtitle or detailed message |
| `type` | `'default' \| 'success' \| 'danger' \| 'warning' \| 'info'` | `'default'` | Semantic color preset |
| `position` | `'top' \| 'bottom' \| 'center'` | `'top'` | Screen anchor position |
| `duration` | `number` | `3000` | Auto-dismiss duration in ms (0 to disable) |
| `autoHide` | `boolean` | `true` | Automatically dismiss after duration |
| `floating` | `boolean` | `true` | Modern rounded floating card vs edge-to-edge |
| `swipeToDismiss` | `boolean` | `true` | Swipe up (or down) gesture to dismiss |
| `pauseOnPress` | `boolean` | `true` | Pauses countdown timer while finger holds card |
| `showProgressBar`| `boolean` | `false` | Displays visual countdown progress indicator |
| `action` | `{ label, onPress, style?, textStyle? }` | `undefined` | Action button (e.g. Undo, Retry) |
| `icon` | `FlashMessageType \| 'none' \| ReactNode \| Function` | Semantic type | Custom or preset icon |
| `backgroundColor`| `string` | Preset background | Override card color |
| `color` | `string` | Preset text color | Override text & icon color |
| `onPress` | `() => void` | `undefined` | Callback on banner tap |
| `onShow` | `() => void` | `undefined` | Callback when message enters view |
| `onHide` | `() => void` | `undefined` | Callback after message finishes exit |
| `customComponent`| `(options, hide) => ReactNode` | `undefined` | Completely replace the inner card layout |

---

## 🔄 Migrating from `react-native-flash-message`

Migrating is 100% drop-in compatible! Simply change the import:

```diff
- import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
+ import FlashMessage, { showMessage, hideMessage } from "@mehul214/react-native-flash-toast";
```

Your existing `showMessage({ message, description, type, ... })` calls will work immediately, but with:
- No more New Architecture Fabric warnings
- Native iOS & Android edge-to-edge support
- Modern fluid spring animations & swipe gestures

---

## 💖 Support the Project & Sponsoring

Building and maintaining open-source libraries takes dedicated effort. If `react-native-flash-toast` helps you build great React Native applications or saves your team time, please consider supporting development:

- ⭐️ **Star the repository on GitHub** (helps more developers discover it)
- 💖 **[Sponsor on GitHub Sponsors](https://github.com/sponsors/Mehul214)**

### ☕️ Support via UPI

If you're in India or use any UPI-enabled payment app (Google Pay, PhonePe, Paytm, BHIM, Cred, Amazon Pay):

- **UPI ID:** `mehulreshamwala7@okhdfcbank`
- **Payee Name:** Mehul Reshamwala

<p align="left">
  <a href="upi://pay?pa=mehulreshamwala7@okhdfcbank&pn=Mehul%20Reshamwala&cu=INR&tn=Support%20react-native-flash-toast">
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi%3A%2F%2Fpay%3Fpa%3Dmehulreshamwala7%40okhdfcbank%26pn%3DMehul%2520Reshamwala%26cu%3DINR%26tn%3DSupport%2520react-native-flash-toast" alt="Scan to Pay with UPI" width="180" height="180" />
  </a>
  <br />
  <sub>Scan with Google Pay / PhonePe / Paytm or <a href="upi://pay?pa=mehulreshamwala7@okhdfcbank&pn=Mehul%20Reshamwala&cu=INR&tn=Support%20react-native-flash-toast">tap here on mobile to pay directly</a>.</sub>
</p>

---

## 🤝 Contributing

Contributions, feature requests, and bug reports are welcome! Please check the [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT © 2026 Mehul. Free for personal and commercial use.

