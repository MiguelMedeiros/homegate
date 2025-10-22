# Project Documentation & Planning

This directory contains all project planning, architecture, and development documentation for the Home Gate monorepo.

## 📚 Documents

### Architecture & Planning

- **[MONOREPO_STRUCTURE.md](./MONOREPO_STRUCTURE.md)**  
  Complete guide to the monorepo structure, package organization, and how to work with multiple packages.

- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)**  
  Comprehensive summary of what was built, tech stack details, project structure, and current status.

### Development Guides

- **[DEVELOPMENT.md](./DEVELOPMENT.md)**  
  Detailed development guide with:
  - How to add shadcn/ui components
  - Styling approaches (Tailwind + CSS Modules)
  - Project structure explained
  - TypeScript tips
  - Best practices

- **[QUICKSTART.md](./QUICKSTART.md)**  
  Quick start guide to get up and running in 3 steps.

### Docker & Deployment

- **[DOCKER_QUICK_REFERENCE.md](./DOCKER_QUICK_REFERENCE.md)**  
  Quick command reference for Docker Compose operations and common tasks.

### Pubky SDK

- **[PUBKY_DOCS.md](./PUBKY_DOCS.md)**  Documentation about @synonymdev/pubky

## 🎯 Purpose

These documents are kept in `.cursor/docs` to:
- ✅ Separate project planning from production code
- ✅ Keep the root directory clean
- ✅ Organize documentation in one place
- ✅ Make it easy to find project information
- ✅ Avoid cluttering package directories

## 📂 Directory Structure

```
.cursor/
└── docs/
    ├── README.md                 # This file
    ├── MONOREPO_STRUCTURE.md     # Monorepo guide
    ├── PROJECT_SUMMARY.md        # Project summary
    ├── DEVELOPMENT.md            # Development guide
    └── QUICKSTART.md             # Quick start
```

## 🔗 Related Documentation

- [Root README.md](../../README.md) - Main monorepo overview
- [Frontend README.md](../../front-end/README.md) - Frontend package documentation

## 💡 Adding New Documents

When adding new planning or architecture documents:

1. Create the document in `.cursor/docs/`
2. Update this README with a link and description
3. Link from root README if relevant for all users

### Examples of documents to add here:
- API design specifications
- Database schemas
- Architecture decision records (ADRs)
- Sprint planning documents
- Technical RFC proposals
- System design diagrams

## ⚙️ Git Configuration

The `.cursor` directory is typically ignored by version control, but you may want to track these docs:

```gitignore
# In .gitignore
.cursor/*
!.cursor/docs/
```

This keeps Cursor-specific files ignored while tracking documentation.

