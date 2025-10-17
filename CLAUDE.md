# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Next.js 15 storefront for Saleor e-commerce platform. It uses the App Router with React Server Components, TypeScript with strict mode, and GraphQL for API communication.

## Environment Setup

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SALEOR_API_URL` - Full Saleor GraphQL endpoint URL (e.g., `https://storefront1.saleor.cloud/graphql/`)
- `NEXT_PUBLIC_STOREFRONT_URL` - Your storefront URL for canonical URLs in production
- `SALEOR_APP_TOKEN` - Token used for fetching channels

## Development Commands

**Package Manager**: This project uses `pnpm` (v9.6.0 or higher)

```bash
# Install dependencies
pnpm i

# Development server (runs generate automatically)
pnpm dev          # Starts at http://localhost:3000

# Build for production
pnpm build        # Runs generate before building

# Production server
pnpm start

# Linting
pnpm lint         # ESLint with auto-fix

# GraphQL codegen (run after modifying .graphql files)
pnpm run generate

# Testing
pnpm test         # Playwright E2E tests
```

## Architecture

### Next.js App Structure

The app uses Next.js 15 App Router with file-based routing and channel support:

```
src/app/
├── [channel]/           # Channel-specific routes (multi-channel support)
│   ├── (main)/          # Main storefront layout with Header/Footer
│   │   ├── page.tsx     # Homepage
│   │   ├── products/    # Product listing and detail pages
│   │   ├── categories/  # Category pages
│   │   ├── collections/ # Collection pages
│   │   ├── cart/        # Cart page
│   │   ├── login/       # Login page
│   │   ├── orders/      # Order history
│   │   ├── search/      # Search page
│   │   └── pages/       # CMS pages
│   └── layout.tsx       # Channel-specific layout
├── checkout/            # Checkout page (separate layout)
├── api/                 # API routes (draft mode, etc.)
└── config.ts            # Server auth client config
```

### GraphQL Architecture

**Critical workflow**: After creating or modifying any `.graphql` file in `src/graphql/`, you MUST run `pnpm run generate` to regenerate TypeScript types.

GraphQL setup:
- **Queries/Mutations**: Defined as `.graphql` files in `src/graphql/`
- **Generated types**: Output to `src/gql/` (auto-generated, don't edit)
- **Config**: `.graphqlrc.ts` configures GraphQL Codegen
- **API client**: `src/lib/graphql.ts` contains `executeGraphQL()` for server-side queries

The project uses `TypedDocumentString` to reduce bundle size and provide type safety without importing large GraphQL documents on the client.

### Checkout Architecture

The checkout system is **framework-agnostic** and isolated in `src/checkout/`:

```
src/checkout/
├── Root.tsx             # Checkout root component with URQL provider
├── views/               # Main checkout views
├── sections/            # Checkout sections (shipping, billing, etc.)
├── components/          # Checkout-specific components
├── state/               # Zustand stores for checkout state
│   ├── updateStateStore/          # Tracks update operation states
│   └── checkoutValidationStateStore/  # Validation state
├── hooks/               # Checkout-specific hooks
├── providers/           # Checkout context providers
├── lib/                 # Checkout utilities
└── graphql/             # Checkout-specific GraphQL (separate from main app)
```

**Important constraints**:
- Checkout code CANNOT import from Next.js (`next/*`, `@next/*`)
- ESLint will error if Next.js imports are used in `src/checkout/**`
- Uses URQL for GraphQL client (not the main app's fetch-based approach)
- State management via Zustand stores
- Integrated with `@saleor/auth-sdk` for authentication

### State Management

- **Checkout state**: Zustand stores in `src/checkout/state/`
  - `updateStateStore` - tracks loading/success/error states for checkout operations
  - `checkoutValidationStateStore` - manages validation state
- **Global state**: No global state management outside checkout (uses React Server Components)

### Authentication

Uses `@saleor/auth-sdk` for authentication:
- SDK provides `useSaleorAuthContext()` hook
- Handles token refresh and auth state
- Server-side: `getServerAuthClient()` from `@/app/config`
- Checkout uses `saleorAuthClient.fetchWithAuth()` for authenticated requests

### Payment Integration

- **Adyen**: Supported via `@adyen/adyen-web` and Saleor Adyen App
- **Stripe**: Integration via `@stripe/react-stripe-js` and `@stripe/stripe-js`
- **Dummy Gateway**: Test payment provider for development

### Multi-Channel Support

- Channel slug in URL: `/[channel]/`
- Channel selection via `ChannelSelect` component
- GraphQL queries parameterized with channel
- Channel data fetched using `SALEOR_APP_TOKEN`

## Code Style and Conventions

### ESLint Rules

Key rules enforced:
- **No default exports** except for Next.js special files (page.tsx, layout.tsx, etc.) and config files
- **Type imports**: Use inline type imports (`import { type Foo }`)
- **Import order**: Enforced via `import/order`
- **No circular imports**: `import/no-cycle` is enabled
- **Unused vars**: Allowed if prefixed with `_`

### TypeScript Paths

Configured path aliases:
- `@/*` → `./src/*`
- `@ui/*` → `./src/components/*`

### Pre-commit Hooks

Husky + lint-staged configured:
- Runs ESLint on staged TypeScript/JavaScript files
- Runs Prettier on all staged files

## Testing

- **Framework**: Playwright
- **Test location**: `__tests__/` directory
- **Config**: `playwright.config.ts`
- **Test pattern**: `STF_*.spec.ts`
- By default, tests run against `http://localhost:3000` with auto-start of dev server
- Tests are NOT fully parallel (uses 3 workers in CI)

## Important Development Notes

### Draft Mode

Visit `/api/draft` to enable draft mode, which disables caching for previewing catalog and content changes instantly.

### GraphQL Workflow

1. Create/modify `.graphql` files in `src/graphql/`
2. Run `pnpm run generate` (or it runs automatically with `pnpm dev` or `pnpm build`)
3. Import generated types from `src/gql/`
4. Use `executeGraphQL()` from `src/lib/graphql.ts` for server-side queries

Example:
```typescript
import { executeGraphQL } from "@/lib/graphql";
import { ProductListDocument } from "@/gql/graphql";

const data = await executeGraphQL(ProductListDocument, {
  variables: { first: 12 },
  cache: "force-cache",
});
```

### Checkout Integration

To integrate checkout into a page:
1. Import `Root` from `@/checkout/Root`
2. Pass `saleorApiUrl` prop
3. Provide checkout ID or order ID via URL search params (`?checkout=xxx` or `?order=xxx`)

## File Organization

- `/src/app` - Next.js App Router pages and layouts
- `/src/app/[channel]` - Channel-specific routes
- `/src/checkout` - Framework-agnostic checkout (no Next.js dependencies)
- `/src/graphql` - GraphQL query/mutation definitions
- `/src/gql` - Auto-generated GraphQL types (don't edit manually)
- `/src/lib` - Shared utilities
- `/src/ui` - UI components (atoms, components)
- `/src/hooks` - Custom React hooks
- `/__tests__` - Playwright E2E tests

## Key Dependencies

- **Next.js 15** - Framework with App Router
- **React 19** - UI library with Server Components
- **TypeScript 5.3** - Type safety
- **GraphQL Codegen** - Type generation from GraphQL schema
- **URQL** - GraphQL client for checkout
- **Zustand** - State management for checkout
- **TailwindCSS** - Styling with container queries support
- **Formik + Yup** - Form handling and validation
- **Saleor Auth SDK** - Authentication
