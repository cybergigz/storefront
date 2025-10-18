# Saleor Mobile App (Expo)

React Native mobile application for Saleor e-commerce platform built with Expo.

## Current Status

**Phase 1 Complete** - Infrastructure and foundation are ready:

- ✅ Expo app initialized with TypeScript
- ✅ File-based routing with Expo Router
- ✅ TypeScript configuration working
- ✅ All dependencies installed
- ✅ Can run dev server successfully

**Not Yet Implemented:**

- ❌ Saleor API integration
- ❌ Product listing screens
- ❌ Cart functionality
- ❌ Checkout flow
- ❌ User authentication

## Development Setup

### Prerequisites

- Node.js >= 18
- pnpm >= 9.4.0
- Expo CLI (installed via dependencies)
- iOS Simulator (for macOS) or Android Emulator

### Install Dependencies

From the root directory:

```bash
pnpm install
```

### Run Development Server

```bash
# From root directory
pnpm mobile:dev

# Or from mobile/ directory
pnpm dev
```

This will start the Expo dev server. You can then:

- Press `i` to open iOS Simulator
- Press `a` to open Android Emulator
- Press `w` to open in web browser
- Scan QR code with Expo Go app on physical device

### Other Commands

```bash
# Run on iOS simulator
pnpm mobile:ios

# Run on Android emulator
pnpm mobile:android

# Build for production
pnpm mobile:build

# Type checking
cd mobile && npx tsc --noEmit
```

## Project Structure

```
mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/             # Tab navigation
│   │   ├── _layout.tsx     # Tabs configuration
│   │   ├── index.tsx       # Home tab (Tab One)
│   │   └── two.tsx         # Tab Two
│   ├── _layout.tsx         # Root layout
│   ├── +html.tsx           # Custom HTML wrapper
│   ├── +not-found.tsx      # 404 page
│   └── modal.tsx           # Example modal
├── components/             # Reusable components
├── constants/              # Constants (colors, etc.)
├── assets/                 # Images, fonts
├── app.json                # Expo configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

## Configuration

### Environment Variables

Create `.env` file in the mobile directory:

```
EXPO_PUBLIC_SALEOR_API_URL=https://your-saleor-instance.com/graphql/
```

## Technology Stack

- **Expo SDK 54** - React Native framework
- **Expo Router 6** - File-based routing
- **React 19** - UI library
- **React Native 0.81** - Native framework
- **TypeScript 5.9** - Type safety
- **React Native Reanimated** - Animations

## Next Steps (MVP Implementation)

To make this a functional Saleor storefront:

1. Add URQL GraphQL client
2. Create environment configuration
3. Build product listing screen
4. Build product detail screen
5. Implement basic cart
6. Add user authentication

## Troubleshooting

### Dependencies not found

```bash
# Reinstall dependencies
pnpm install
```

### TypeScript errors

```bash
cd mobile
npx tsc --noEmit
```

### Clear cache

```bash
cd mobile
npx expo start --clear
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/)
- [Saleor API Docs](https://docs.saleor.io/docs/3.x/)
