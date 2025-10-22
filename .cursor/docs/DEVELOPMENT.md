# Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Project Overview

This is a Next.js 15 application with the following stack:
- **Next.js 16.0.0** (Latest) with App Router
- **React 19.2.0**
- **TypeScript 5** (strict mode)
- **Tailwind CSS v4**
- **shadcn/ui** (New York style)
- **Lucide React** for icons

## Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Working with shadcn/ui Components

### Adding Components

To add shadcn/ui components to your project:

```bash
# View all available components
npx shadcn@latest add

# Add specific components
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add form

# Add multiple components at once
npx shadcn@latest add card input form label
```

### Using Components

All shadcn/ui components are added to `src/components/ui/` and can be imported:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MyPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

### Commonly Used Components

Here are some commonly used shadcn/ui components you might want to add:

```bash
# Form elements
npx shadcn@latest add form input label textarea select checkbox radio-group

# Layout & Display
npx shadcn@latest add card dialog sheet tabs accordion

# Feedback
npx shadcn@latest add alert toast popover tooltip

# Navigation
npx shadcn@latest add navigation-menu dropdown-menu
```

## Styling Approaches

### 1. Tailwind CSS (Recommended for most cases)

```tsx
export default function Component() {
  return (
    <div className="flex items-center gap-4 p-6 bg-background">
      <h1 className="text-2xl font-bold">Title</h1>
    </div>
  );
}
```

### 2. CSS Modules

Create a CSS module file in `src/styles/`:

```css
/* src/styles/MyComponent.module.css */
.container {
  padding: 1rem;
  background: var(--background);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
}

/* Can use @apply with Tailwind utilities */
.button {
  @apply rounded-lg bg-primary px-4 py-2;
}
```

Import and use in your component:

```tsx
import styles from "@/styles/MyComponent.module.css";

export default function MyComponent() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Title</h1>
      <button className={styles.button}>Click</button>
    </div>
  );
}
```

### 3. Combining Approaches

You can combine Tailwind with CSS Modules using the `cn()` utility:

```tsx
import { cn } from "@/lib/utils";
import styles from "@/styles/MyComponent.module.css";

export default function MyComponent() {
  return (
    <div className={cn(styles.container, "hover:shadow-lg transition-shadow")}>
      Content
    </div>
  );
}
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles with Tailwind
├── components/            # React components
│   └── ui/               # shadcn/ui components
│       └── button.tsx
├── lib/                   # Utilities and helpers
│   └── utils.ts          # cn() utility for className merging
└── styles/               # CSS Modules
    └── example.module.css
```

## Adding New Pages

With App Router, create folders and files in `src/app/`:

```
src/app/
├── page.tsx              # / (root)
├── about/
│   └── page.tsx         # /about
├── signup/
│   └── page.tsx         # /signup
└── dashboard/
    ├── page.tsx         # /dashboard
    └── settings/
        └── page.tsx     # /dashboard/settings
```

## TypeScript Tips

This project uses TypeScript strict mode. Some helpful patterns:

```tsx
// Type your component props
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

export function MyButton({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// Type your API responses
interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

## Theming

The project uses CSS variables for theming. Colors can be customized in `src/app/globals.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* ... more variables */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark mode overrides */
}
```

Use these colors in your components:

```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Button
  </button>
</div>
```

## Best Practices

1. **Use shadcn/ui components** for consistent UI
2. **Prefer Tailwind CSS** for styling when possible
3. **Use CSS Modules** for complex, component-specific styles
4. **Type your components** with TypeScript interfaces
5. **Use the `cn()` utility** for conditional className merging
6. **Leverage Server Components** by default (they're faster)
7. **Add 'use client'** only when you need interactivity/hooks

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

