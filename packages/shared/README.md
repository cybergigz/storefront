# @repo/shared

Shared business logic package for Saleor storefront web and mobile apps.

## Purpose

This package contains framework-agnostic code that can be shared between:

- Next.js web application (root)
- React Native mobile application (mobile/)

## Structure

```
src/
├── graphql/       # GraphQL operations and generated types
├── auth/          # Authentication logic (@saleor/auth-sdk integration)
├── state/         # Zustand stores (cart, user preferences, etc.)
├── checkout/      # Checkout business logic (framework-agnostic)
├── utils/         # Shared utilities
└── index.ts       # Package exports
```

## Key Principles

1. **Framework-Agnostic**: No Next.js or React Native specific imports
2. **UI-Independent**: Business logic only, no UI components
3. **Type-Safe**: Full TypeScript support
4. **Testable**: Unit testable in isolation

## Dependencies

- `urql` - GraphQL client
- `@saleor/auth-sdk` - Saleor authentication
- `zustand` - State management
- `yup` - Validation
- `formik` - Form handling

## Usage

### In Web App (Next.js)

```typescript
import { ProductListDocument } from "@repo/shared/graphql";
import { useCartStore } from "@repo/shared/state";
```

### In Mobile App (React Native)

```typescript
import { ProductListDocument } from "@repo/shared/graphql";
import { useCartStore } from "@repo/shared/state";
```

## Development

```bash
# Build
pnpm shared:build

# Watch mode (for development)
pnpm shared:watch
```

## Migration Status

- [ ] GraphQL operations
- [ ] Checkout module
- [ ] Auth logic
- [ ] State stores
- [ ] Utilities
