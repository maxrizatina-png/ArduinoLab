# ArduinoLab

A mobile app for browsing, building, and sharing Arduino projects. Built with Expo and React Native.

## Features

- **Browse projects** — 2-column grid of community Arduino projects with difficulty ratings
- **Project detail** — hero image, description, step-by-step instructions, wiring diagram, Arduino code, and YouTube demo
- **Favorites** — save projects with a heart tap; persisted across sessions
- **Submit a project** — upload your own project (image, title, difficulty, instructions, code, wiring diagram) for community review
- **Settings** — view your pending/approved submissions and manage preferences

## Screenshots

| Home | Project Detail | Favorites | Add Project |
|------|---------------|-----------|-------------|
| Project grid with search & filter | Full instructions + Arduino code | Saved projects | Bottom-sheet submission form |

## Tech Stack

- [Expo](https://expo.dev) SDK 56
- [React Native](https://reactnative.dev) 0.85
- [React Navigation](https://reactnavigation.org) 7 (native stack + bottom tabs)
- [`@react-native-async-storage/async-storage`](https://github.com/react-native-async-storage/async-storage) — favorites persistence
- [`expo-image-picker`](https://docs.expo.dev/versions/latest/sdk/imagepicker/) — project photo uploads
- TypeScript (strict mode)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo Go](https://expo.dev/go) on your iOS or Android device, **or** Xcode (iOS Simulator) / Android Studio (Android Emulator)

### Install

```bash
git clone https://github.com/rizamax/ArduinoLab.git
cd ArduinoLab
npm install
```

### Run

```bash
npm start          # Expo dev server + QR code for Expo Go
npm run ios        # iOS Simulator (requires Xcode)
npm run android    # Android Emulator (requires Android Studio)
npm run web        # Browser preview
```

## Project Structure

```
src/
├── components/
│   ├── AddProjectModal.tsx   # Bottom-sheet submission form
│   ├── DifficultyBadge.tsx   # Colored Easy / Medium / Advanced badge
│   └── ProjectCard.tsx       # Grid card with image + title + badge
├── constants/
│   └── theme.ts              # Colors, spacing, border-radius
├── context/
│   └── AppContext.tsx        # Favorites + submissions state (AsyncStorage)
├── data/
│   └── mockProjects.ts       # 8 sample Arduino projects
├── navigation/
│   └── index.tsx             # Root stack + bottom tab navigator
├── screens/
│   ├── HomeScreen.tsx        # Project grid, search, filter
│   ├── ProjectDetailScreen.tsx
│   ├── FavoritesScreen.tsx
│   └── SettingsScreen.tsx
└── types/
    └── index.ts              # Shared TypeScript types
```

## Difficulty Levels

| Level | Color |
|-------|-------|
| 🟢 Easy | Green |
| 🟡 Medium | Yellow |
| 🔴 Advanced | Red |

## Contributing

Project submissions go through an approval flow. Tap the **+** button on the Home screen, fill in the details, and submit — approved projects appear in the community feed.

## License

MIT
