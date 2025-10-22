# Quick Start Guide

## Get Started in 3 Steps

> **Note**: Make sure you're in the `front-end` directory first: `cd front-end`

### 1. Start the Development Server

```bash
npm run dev
```

The application will start at **http://localhost:3000**

### 2. View Your Application

Open your browser and navigate to:
- **Homepage**: http://localhost:3000

You'll see the Home Gate landing page with:
- Navigation bar with "About" and "Get Started" buttons
- Hero section welcoming users to the Pubky homeserver network
- Features section highlighting key benefits
- Footer with Pubky branding

### 3. Start Building

You're ready to add your signup flow! Here's where to begin:

#### Add a Signup Page

Create `src/app/signup/page.tsx`:

```tsx
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign Up</h1>
          <p className="text-muted-foreground">
            Create your account on the Pubky homeserver
          </p>
        </div>
        
        {/* Add your signup form here */}
        <div className="space-y-4">
          <Button className="w-full" size="lg">
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
```

Visit: http://localhost:3000/signup

#### Add Form Components

Install form components from shadcn/ui:

```bash
npx shadcn@latest add form input label
```

#### Explore shadcn/ui Components

Browse all available components:

```bash
npx shadcn@latest add
```

Popular components to add:
- `card` - Card container
- `input` - Text input field
- `form` - Form wrapper with validation
- `label` - Form labels
- `dialog` - Modal dialogs
- `toast` - Toast notifications

## Project Structure Overview

```
src/
├── app/              # Pages and routes
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Homepage
│   └── signup/      # Create this for signup page
│       └── page.tsx
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utilities
└── styles/          # CSS Modules
```

## Common Tasks

### Add a New Page
Create a folder in `src/app/` with a `page.tsx` file.

### Add a Component
```bash
npx shadcn@latest add [component-name]
```

### Use CSS Modules
Create `*.module.css` files in `src/styles/` and import them.

### Build for Production
```bash
npm run build
npm start
```

## Need Help?

- See **README.md** for full documentation
- See **DEVELOPMENT.md** for detailed development guide
- See **PROJECT_SUMMARY.md** for complete project overview

## Ready to Build! 🚀

Your Next.js + shadcn/ui scaffolding is complete and working. Start adding your signup flow and Pubky integration!

