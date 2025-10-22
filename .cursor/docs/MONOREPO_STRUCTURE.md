# Home Gate - Monorepo Structure

## Overview

The Home Gate project is now organized as a monorepo, allowing for multiple packages and services to coexist.

## Directory Structure

```
home-gate/                              # Monorepo root
│
├── .git/                              # Git repository
├── .gitignore                         # Root-level gitignore
├── README.md                          # Monorepo documentation
├── MONOREPO_STRUCTURE.md              # This file
│
└── front-end/                         # Frontend application package
    ├── .gitignore                     # Frontend-specific ignores
    ├── README.md                      # Frontend documentation
    ├── DEVELOPMENT.md                 # Development guide
    ├── QUICKSTART.md                  # Quick start guide
    ├── PROJECT_SUMMARY.md             # Project summary
    │
    ├── package.json                   # Frontend dependencies
    ├── package-lock.json              # Lock file
    ├── tsconfig.json                  # TypeScript config (strict mode)
    ├── next.config.ts                 # Next.js configuration
    ├── eslint.config.mjs              # ESLint configuration
    ├── postcss.config.mjs             # PostCSS configuration
    ├── components.json                # shadcn/ui configuration
    │
    ├── src/                           # Source code
    │   ├── app/                       # Next.js App Router
    │   │   ├── layout.tsx            # Root layout
    │   │   ├── page.tsx              # Homepage
    │   │   ├── globals.css           # Global styles
    │   │   └── favicon.ico           # Favicon
    │   │
    │   ├── components/               # React components
    │   │   └── ui/                   # shadcn/ui components
    │   │       └── button.tsx        # Button component
    │   │
    │   ├── lib/                      # Utilities
    │   │   └── utils.ts              # Helper functions (cn, etc.)
    │   │
    │   └── styles/                   # CSS Modules
    │       └── example.module.css    # Example CSS module
    │
    └── public/                        # Static assets
        ├── next.svg
        ├── vercel.svg
        └── ...
```

## Packages

### Frontend (`/front-end`)

**Type**: Next.js 15 Web Application

**Purpose**: User-facing web application for the Pubky homeserver signup gateway

**Tech Stack**:
- Next.js 16.0.0 (App Router)
- React 19.2.0
- TypeScript 5 (strict mode)
- Tailwind CSS v4
- shadcn/ui (New York style)

**Key Features**:
- Modern landing page
- Responsive design
- Dark mode support
- shadcn/ui components pre-configured
- CSS Modules support

**Commands**:
```bash
cd front-end
npm install      # Install dependencies
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run linter
```

## Future Packages

This monorepo structure is designed to accommodate additional packages:

### Planned Additions
- `backend/` - Backend API services
- `shared/` - Shared utilities and types
- `contracts/` - Smart contracts or API contracts
- `docs/` - Documentation site
- `cli/` - Command-line tools

Each package will have its own:
- `package.json` with dependencies
- `README.md` with documentation
- Build and test scripts
- Independent versioning (if needed)

## Working with the Monorepo

### Adding a New Package

1. Create a new directory in the root:
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

2. Add documentation:
   ```bash
   touch README.md
   ```

3. Update root `README.md` to include the new package

### Managing Dependencies

Each package manages its own dependencies independently:
- `front-end/package.json` - Frontend dependencies
- `backend/package.json` - Backend dependencies (future)
- etc.

### Shared Dependencies

For shared code between packages, consider creating a `shared/` package:
```bash
mkdir shared
cd shared
npm init -y
```

Then import it in other packages as needed.

## Git Workflow

The monorepo uses a single Git repository for all packages:

```bash
# Work on frontend
cd front-end
# make changes
git add .
git commit -m "feat(frontend): add new feature"

# Work on other package
cd ../backend
# make changes
git add .
git commit -m "feat(backend): add API endpoint"
```

### Commit Convention

Use conventional commits with package scope:
- `feat(frontend): description`
- `fix(backend): description`
- `docs(shared): description`
- `chore(root): description`

## Benefits of Monorepo Structure

✅ **Single Source of Truth**: All related code in one repository

✅ **Simplified Dependency Management**: Easier to coordinate changes across packages

✅ **Consistent Tooling**: Share configurations and scripts

✅ **Atomic Changes**: Commit changes across multiple packages together

✅ **Better Collaboration**: Easier code review and collaboration

✅ **Flexible**: Each package can use different technologies as needed

## Current Status

- ✅ Monorepo structure created
- ✅ Frontend package fully configured
- ✅ Documentation updated
- ✅ Build verified
- ⏳ Additional packages (to be added)

## Next Steps

1. **Add backend package** when ready for API development
2. **Create shared package** for common utilities
3. **Set up workspace tools** (optional: Turborepo, Nx, or npm workspaces)
4. **Configure CI/CD** for multi-package builds

## Resources

- [Frontend Documentation](./front-end/README.md)
- [Frontend Development Guide](./front-end/DEVELOPMENT.md)
- [Frontend Quick Start](./front-end/QUICKSTART.md)

