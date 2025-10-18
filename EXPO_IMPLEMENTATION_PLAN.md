# Expo Mobile App Implementation Plan

## Overview

This document outlines the strategy for adding native mobile support to the Saleor Next.js storefront using a pragmatic hybrid monorepo approach.

## Architecture Decision

**Approach**: Hybrid Monorepo (Recommended)

- Keep existing Next.js web app unchanged
- Add separate Expo mobile app in `mobile/` directory
- Share business logic via `packages/shared`
- Platform-specific UI implementations

**Why Not Universal Expo Router?**

- Next.js 15 with React Server Components incompatible with Expo Router RSC (beta)
- Major rewrite required, high risk
- Loss of Next.js-specific features (SSR, ISR, middleware)
- Two routing systems conflict

## Project Structure

```
storefront/                           # Root (existing Next.js app)
├── src/                              # Web-specific code (Next.js)
│   ├── app/                          # Next.js App Router
│   ├── ui/                           # Web UI components
│   └── lib/                          # Web utilities
├── mobile/                           # NEW: Expo mobile app
│   ├── app/                          # Expo Router
│   │   ├── (tabs)/                   # Tab navigation
│   │   │   ├── index.tsx             # Home/Products
│   │   │   ├── categories.tsx        # Categories
│   │   │   ├── cart.tsx              # Cart
│   │   │   └── account.tsx           # Account
│   │   ├── product/[id].tsx          # Product detail
│   │   ├── checkout.tsx              # Checkout flow
│   │   └── _layout.tsx               # Root layout
│   ├── src/
│   │   └── components/               # Mobile UI components
│   ├── app.json                      # Expo config
│   ├── package.json                  # Mobile dependencies
│   └── tsconfig.json                 # Mobile TypeScript config
├── packages/                         # NEW: Shared code
│   └── shared/
│       ├── src/
│       │   ├── graphql/              # GraphQL operations & types
│       │   ├── auth/                 # Auth logic (@saleor/auth-sdk)
│       │   ├── state/                # Zustand stores
│       │   ├── checkout/             # Checkout logic (framework-agnostic)
│       │   └── utils/                # Shared utilities
│       ├── package.json
│       └── tsconfig.json
├── package.json                      # Root package.json (workspace config)
└── pnpm-workspace.yaml               # NEW: pnpm workspace config
```

## Phase 1: Setup Monorepo Structure

### 1.1 Configure pnpm Workspace

**File**: `pnpm-workspace.yaml`

```yaml
packages:
  - "mobile"
  - "packages/*"
```

**Update**: `package.json` (root)

- Add workspace scripts for mobile commands
- Keep existing Next.js scripts

### 1.2 Create Shared Package

**Location**: `packages/shared/`

**Purpose**:

- GraphQL operations (queries, mutations, types)
- Authentication logic
- Checkout business logic (already framework-agnostic)
- Zustand stores
- Utilities

**Dependencies**:

- `urql` (GraphQL client)
- `@saleor/auth-sdk`
- `zustand`
- `yup` (validation)
- GraphQL Codegen types

### 1.3 Initialize Expo App

**Command**:

```bash
cd mobile && npx create-expo-app@latest . --template tabs
```

**Configuration**:

- Expo Router for navigation
- TypeScript
- NativeWind for styling (Tailwind for React Native)

## Phase 2: Move Shared Logic

### 2.1 GraphQL Layer

**Move**:

- `/src/graphql/*.graphql` → `packages/shared/src/graphql/`
- GraphQL Codegen config
- Generated types

**Keep Separate**:

- Web-specific executeGraphQL (uses fetch)
- Mobile will use URQL client

### 2.2 Checkout Module

**Move**:

- `/src/checkout/` → `packages/shared/src/checkout/`
- Already framework-agnostic!
- Uses URQL (perfect for mobile)
- Zustand stores

**Modifications Needed**:

- Ensure no web-specific imports
- Platform-specific payment UI components

### 2.3 Authentication

**Move**:

- Auth SDK integration → `packages/shared/src/auth/`
- Token management
- User state

**Platform-Specific**:

- Web: Server-side auth client
- Mobile: Client-side auth only

### 2.4 State Management

**Move**:

- Zustand stores → `packages/shared/src/state/`
- Cart state
- User preferences

## Phase 3: Mobile App Implementation

### 3.1 Expo Router Navigation

**Structure**:

```
mobile/app/
├── (tabs)/           # Tab navigation
│   ├── _layout.tsx   # Tabs layout
│   ├── index.tsx     # Home/Products
│   ├── categories.tsx
│   ├── cart.tsx
│   └── account.tsx
├── product/
│   └── [id].tsx      # Product detail
├── checkout.tsx      # Checkout flow
├── login.tsx
└── _layout.tsx       # Root layout (providers)
```

### 3.2 UI Component Library

**Approach**: Create mobile-equivalent components

**Styling**: NativeWind (Tailwind for React Native)

- Matches web styling approach
- className-based styling
- Platform-specific overrides

**Key Components**:

- ProductCard
- ProductList
- CategoryCard
- CartItem
- Button
- Input
- Modal

### 3.3 GraphQL Integration

**Setup**:

- URQL client configuration
- Auth token injection
- Cache configuration

**Usage**:

```typescript
import { useQuery } from "urql";
import { ProductListDocument } from "@repo/shared/graphql";

const [result] = useQuery({
	query: ProductListDocument,
	variables: { first: 20 },
});
```

### 3.4 Checkout Flow

**Integration**:

- Import from `@repo/shared/checkout`
- Use existing logic
- Create mobile-specific UI components
- React Native payment SDKs

## Phase 4: Payment Integration

### 4.1 Stripe

**Package**: `@stripe/stripe-react-native`

**Implementation**:

- Native payment sheet
- Apple Pay / Google Pay support
- Card input components

### 4.2 Adyen (Optional)

**Package**: `@adyen/react-native`

**Implementation**:

- Native drop-in UI
- Platform-specific payment methods

## Phase 5: Platform-Specific Features

### 5.1 iOS

- Apple Pay integration
- Touch ID / Face ID (optional)
- App Store configuration
- Push notifications (future)

### 5.2 Android

- Google Pay integration
- Biometric authentication (optional)
- Play Store configuration
- Push notifications (future)

## Dependencies Overview

### Shared Package Dependencies

```json
{
	"dependencies": {
		"urql": "4.0.6",
		"@saleor/auth-sdk": "1.0.3",
		"zustand": "4.4.6",
		"yup": "1.3.2",
		"formik": "2.4.5",
		"libphonenumber-js": "1.10.58",
		"lodash-es": "4.17.21"
	}
}
```

### Mobile App Dependencies

```json
{
	"dependencies": {
		"expo": "~52.0.0",
		"expo-router": "~4.0.0",
		"react-native": "0.76.x",
		"nativewind": "^4.0.0",
		"@stripe/stripe-react-native": "^0.x.x",
		"expo-image": "~2.0.0",
		"@repo/shared": "workspace:*"
	}
}
```

## Development Workflow

### Commands

**Web (Next.js)**:

```bash
pnpm dev           # Start Next.js dev server
pnpm build         # Build web app
pnpm start         # Production web server
```

**Mobile (Expo)**:

```bash
pnpm mobile:dev    # Start Expo dev server
pnpm mobile:ios    # Run on iOS simulator
pnpm mobile:android # Run on Android emulator
pnpm mobile:web    # Run Expo web (testing only)
```

**Shared**:

```bash
pnpm shared:build  # Build shared package
pnpm shared:watch  # Watch mode for development
```

## Migration Strategy

### Phase 1: Infrastructure (Week 1)

- ✅ Set up pnpm workspace
- ✅ Create shared package
- ✅ Initialize Expo app
- ✅ Configure tooling

### Phase 2: Shared Logic (Week 2)

- ✅ Move GraphQL operations
- ✅ Move checkout module
- ✅ Move auth logic
- ✅ Set up Zustand stores

### Phase 3: Core Mobile Features (Week 3-4)

- ✅ Product listing
- ✅ Product detail
- ✅ Categories
- ✅ Cart functionality
- ✅ User authentication

### Phase 4: Checkout & Payments (Week 5)

- ✅ Checkout flow
- ✅ Stripe integration
- ✅ Order confirmation

### Phase 5: Polish & Testing (Week 6)

- ✅ UI refinements
- ✅ Performance optimization
- ✅ E2E testing
- ✅ iOS/Android testing

## Key Considerations

### Advantages of This Approach

1. **Low Risk**: Web app remains unchanged
2. **Code Reuse**: Share business logic, not UI
3. **Platform Optimization**: Native mobile experience
4. **Independent Development**: Teams can work in parallel
5. **Flexible Deployment**: Deploy web/mobile separately
6. **Technology Fit**: Use best tool for each platform

### Challenges & Solutions

1. **Code Duplication in UI**

   - Solution: Accept it. Platform-specific UI is a feature, not a bug
   - Share design system principles

2. **Keeping Shared Logic in Sync**

   - Solution: TypeScript, shared tests, CI/CD
   - Shared package version management

3. **Different Navigation Patterns**

   - Solution: Platform-appropriate navigation
   - Web: Next.js App Router (with RSC)
   - Mobile: Expo Router (tabs + stack)

4. **Checkout Module Compatibility**
   - Advantage: Already framework-agnostic!
   - Uses URQL (works on mobile)
   - Minor adaptations for React Native components

## Testing Strategy

### Shared Package

- Unit tests with Jest
- Test business logic in isolation
- Run tests in both environments

### Mobile App

- Expo testing tools
- Component tests with React Native Testing Library
- E2E tests with Maestro

### Integration

- Test shared package integration
- GraphQL mocking
- Payment flow testing (test mode)

## Documentation

### Files to Create

1. `MOBILE.md` - Mobile development guide
2. `packages/shared/README.md` - Shared package docs
3. Update `CLAUDE.md` - Add mobile architecture section

### Content

- Setup instructions
- Development workflow
- Architecture decisions
- Troubleshooting guide

## Next Steps

1. Get approval for this plan
2. Create branch: `feat/expo-support`
3. Start Phase 1: Infrastructure setup
4. Implement iteratively with working increments

## Success Metrics

- ✅ Mobile app can authenticate users
- ✅ Mobile app can browse products
- ✅ Mobile app can complete checkout
- ✅ Shared code works in both web and mobile
- ✅ No breaking changes to web app
- ✅ CI/CD pipeline for both platforms
