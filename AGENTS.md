<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Next.js Agent Guidelines

**Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.**

## 1. Project Standards & API Conventions

### 1.1 Architecture
- **App Router**: Use the App Router (`app/`) instead of the Pages Router.
- **Server Components (Default)**: All components should be Server Components unless you explicitly need client-side features. Use the `'use client'` directive only when necessary.
- **Nested Layouts**: Create layouts within the directory structure using `layout.tsx`. Root layout must be in `app/layout.tsx`.

### 1.2 Component API
- **Server Components**: Default (no directive needed). Use for data fetching and rendering static content.
- **Client Components**: Use `'use client'`. Necessary for interactivity, browser APIs (e.g., `window`), and state management.
- **Server Actions**: Use for mutations. Define in server files or use the `"use server"` directive in client files.

### 1.3 Data Fetching
- **Server Components**: Use native `fetch` with caching options or libraries like `react-query` / `tanstack-query` (if needed).
- **Suspense**: Wrap data-fetching components with `<Suspense>` for better loading UX.

### 1.4 Styling
- **Tailwind CSS**: Primary styling solution. Use Tailwind classes directly.
- **CSS Modules**: Use for component-scoped CSS if needed.
- **Global CSS**: Place in `app/globals.css`.

### 1.5 File Structure
- **Pages**: Create `page.tsx` inside the `app/` directory.
- **Layouts**: Create `layout.tsx` for nested layouts.
- **Loading States**: Create `loading.tsx` for Suspense boundaries.
- **Not Found**: Create `not-found.tsx` for custom 404 pages.

## 2. Development Workflow

### 2.1 Local Setup
- **Start Dev Server**: Run `npm run dev`.
- **Code Style**: Ensure code follows TypeScript standards and project linting rules.

### 2.2 Environment Variables
- **Prefix**: Use `NEXT_PUBLIC_` for variables accessible in the browser.
- **Usage**: Access via `process.env.VARIABLE_NAME`.

### 2.3 Route Handling
- **Parallel Routes**: Use `@folder/` syntax in the `app/` directory to render multiple routes in the same layout.
- **Intercepting Routes**: Use parentheses `(route)/` to intercept routes defined in other feature directories.

## 3. API Conventions & Best Practices

### 3.1 Component Naming
- **PascalCase** for components (e.g., `UserProfile.tsx`).
- **camelCase** for hooks and utility functions.

### 3.2 API Routes
- **Location**: Place API routes in the `app/api/` directory.
- **Methods**: Use `GET`, `POST`, `PUT`, `DELETE`, etc., in async handler functions.

### 3.3 Data Mutation Patterns
- **Server Actions**: Prefer Server Actions for mutations. Use `revalidatePath` or `revalidateTag` to update cached data after mutations.

### 3.4 Routing Patterns
- **Dynamic Routes**: Use `[id]` for dynamic segments. Pass segments to components via `params` prop.
- **Catch-all Routes**: Use `[...slug]` for nested dynamic segments.

### 3.5 Performance
- **Lazy Loading**: Use `next/dynamic` for code splitting and lazy loading of heavy components.
- **Image Optimization**: Use `next/image` for optimized image delivery.
- **Memoization**: Use `useMemo` and `useCallback` where necessary to prevent unnecessary re-renders in client components.

## 4. Version & Breaking Changes

### 4.1 Breaking Changes
- **Migration**: Always check for breaking changes when upgrading Next.js. Refer to `node_modules/next/dist/upgrade-guide.md`.
- **Deprecations**: Be aware of deprecated APIs and use the recommended alternatives.

### 4.2 API Versions
- **App Router**: Primary API for new development.
- **Pages Router**: Legacy. Use only for existing pages or specific use cases.

## 5. TypeScript

### 5.1 Type Safety
- **Strong Typing**: Use TypeScript to ensure type safety.
- **Prop Types**: Explicitly type component props.
- **Server Actions Types**: Type mutation functions and their arguments.

### 5.2 Type Definitions
- **App Router Types**: Use types from `next/app` for `AppProps`, `PageProps`, etc.
- **Server Components**: Props from dynamic segments are passed via the `params` prop.

<!-- END:nextjs-agent-rules -->
