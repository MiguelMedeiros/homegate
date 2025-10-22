# Home Gate - Homeserver Signup Gateway

A modern, responsive web application built with Next.js 15 that serves as a gateway for users to sign up and join the Pubky homeserver network.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + CSS Modules
- **UI Components**: shadcn/ui (New York style)
- **Font**: Geist Sans & Geist Mono

## Features

- ✨ Modern, responsive UI with shadcn/ui components
- 🎨 Beautiful design with Tailwind CSS
- 🌗 Dark mode support built-in
- 📱 Mobile-first responsive design
- ⚡ Fast performance with Next.js 15
- 🔒 Type-safe with TypeScript strict mode
- 🎯 SEO optimized

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Prelude API token for SMS verification

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd home-gate/front-end
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```bash
# Prelude SMS Verification API Token
# Get your API token from https://prelude.so
PRELUDE_API_TOKEN=your_prelude_api_token_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

> **Note**: This project is part of a monorepo. Make sure you're in the `front-end` directory.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure

```
home-gate/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Homepage
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   └── ui/           # shadcn/ui components
│   ├── lib/              # Utility functions
│   │   └── utils.ts      # Helper utilities
│   └── styles/           # CSS modules (create as needed)
├── public/               # Static assets
├── components.json       # shadcn/ui configuration
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration (if created)
└── tsconfig.json         # TypeScript configuration
```

## Adding shadcn/ui Components

This project is pre-configured with shadcn/ui. To add more components:

```bash
# Add a specific component (e.g., Card)
npx shadcn@latest add card

# Add multiple components
npx shadcn@latest add card input form

# Browse all available components
npx shadcn@latest add
```

All components will be added to `src/components/ui/` and can be imported like:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## CSS Modules

CSS Modules are fully supported alongside Tailwind CSS. To use CSS Modules:

1. Create a file with `.module.css` extension in the `src/styles/` directory
2. Import it in your component:

```tsx
import styles from "@/styles/MyComponent.module.css";

export default function MyComponent() {
  return <div className={styles.container}>Hello</div>;
}
```

## Styling Approach

This project uses a hybrid approach:
- **Tailwind CSS**: For utility-first styling and rapid development
- **CSS Modules**: For component-specific styles when needed
- **shadcn/ui**: Pre-built, customizable components with consistent design

## Configuration

### TypeScript

The project uses strict TypeScript configuration for better type safety. See `tsconfig.json` for details.

### Tailwind CSS v4

Tailwind CSS v4 is configured with:
- CSS variables for theming
- Dark mode support
- Custom color scheme (neutral/slate)
- Responsive breakpoints

### shadcn/ui

shadcn/ui is configured with:
- Style: New York
- Base color: Neutral
- CSS variables for theming
- Lucide icons library

## Additional Documentation

For more detailed guides and project information, see:
- [Development Guide](../.cursor/docs/DEVELOPMENT.md) - Detailed development practices
- [Quick Start](../.cursor/docs/QUICKSTART.md) - Get started in 3 steps
- [Project Summary](../.cursor/docs/PROJECT_SUMMARY.md) - Complete project overview
- [Monorepo Structure](../.cursor/docs/MONOREPO_STRUCTURE.md) - Monorepo organization

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Pubky Stack](https://pubky.tech)

## License

[Add your license here]
