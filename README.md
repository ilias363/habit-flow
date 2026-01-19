# HabitFlow

A habit tracking app built with React Native and Expo. Track your daily habits, visualize your progress, and build lasting routines.

## Features

- **Track Habits** - Create and log habits with custom icons and colors
- **Detailed Statistics** - View your progress with charts and insights
- **Streak Tracking** - Stay motivated with streak counters
- **Historical Logs** - Log habits for past dates and view your history
- **Backup & Restore** - Export and import your data as JSON
- **Dark Mode** - Full support for light and dark themes

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/habit-flow.git
   cd habit-flow
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Start the development server

   ```bash
   pnpm start
   ```

4. Run on your device
   - Scan the QR code with Expo Go (Android/iOS)
   - Press `a` for Android emulator
   - Press `i` for iOS simulator

## Building

### Preview Build (Android)

```bash
eas build --profile preview --platform android
```

### Production Build

```bash
eas build --profile production --platform android
```

### OTA Updates

```bash
eas update --branch preview --message "Your update message"
```

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 54)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Language**: TypeScript
- **Styling**: React Native StyleSheet

## Project Structure

```
habit-flow/
├── app/                 # App screens (file-based routing)
│   ├── (tabs)/          # Tab navigation screens
│   └── habit/           # Habit detail screens
├── components/          # Reusable UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and storage
├── constants/           # Theme and app constants
├── types/               # TypeScript type definitions
└── assets/              # Images and icons
```

## Scripts

| Script           | Description                   |
| ---------------- | ----------------------------- |
| `pnpm start`     | Start Expo development server |
| `pnpm android`   | Start on Android              |
| `pnpm ios`       | Start on iOS                  |
| `pnpm lint`      | Run ESLint                    |
| `pnpm typecheck` | Run TypeScript type checking  |
