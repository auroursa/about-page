# AGENTS.md

This guide helps agentic coding tools work effectively in this Astro-based personal website.

## Project Overview

- **Framework**: Astro 5.17.1 (TypeScript)
- **Package Manager**: pnpm
- **Site Language**: Chinese (zh-cn)
- **Content**: Personal blog with content collections, category filtering, RSS feed, and sitemap

## Build Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run Astro CLI
pnpm astro
```

## Code Style Guidelines

### TypeScript & Astro

- Use strict TypeScript configuration (extends `astro/tsconfigs/strict`)
- All `.astro` files with TypeScript frontmatter must have proper type definitions
- Use TypeScript interfaces for component props in `.astro` files

Example:
```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  currentPath?: string;
}
const { title, description = "默认描述" } = Astro.props;
---
```

### Import Style

- Use ES module imports (this is an ESM project)
- Group imports in order: 1) Astro imports, 2) Third-party, 3) Local imports
- Use absolute imports for Astro-specific modules
- Use relative imports for local components

```astro
---
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import BaseLayout from '../layouts/BaseLayout.astro';
---
```

### Content Collections

- Define collections in `src/content.config.ts` using Zod schemas
- All blog posts use the `blog` collection
- Required fields: `title`
- Optional fields: `description`, `date`, `pubDate`, `category`, `tags`, `slug`
- Use `z.preprocess` for date handling to convert Date objects to strings
- Categories are auto-generated from blog posts and used for filtering

### Naming Conventions

- **Components**: PascalCase (e.g., `BaseLayout.astro`, `BlogLayout.astro`)
- **Files**: kebab-case for pages, PascalCase for layouts and components
- **Variables**: camelCase
- **CSS Classes**: kebab-case (e.g., `menu-button`, `card-title`)
- **CSS Variables**: kebab-case with `--` prefix (e.g., `--text-color`, `--main-color`)

### CSS & Styling

- Use CSS custom properties (variables) for theming
- Implement dark mode using `@media (prefers-color-scheme: dark)`
- Store custom fonts in `public/font/` directory
- Keep main styles in `public/css/main.css`
- Use semantic class names that reflect purpose, not appearance

### File Organization

```
src/
├── content/
│   └── blog/              # Markdown blog posts
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro        # Home page
│   ├── about.astro        # About page
│   ├── friends.astro      # Friends page
│   ├── posts/
│   │   ├── index.astro    # Blog listing page with category sidebar
│   │   ├── [slug].astro   # Individual blog post page
│   │   ├── category/
│   │   │   └── [category].astro  # Category filtering page
│   │   └── rss.xml.ts    # RSS feed endpoint
└── content.config.ts       # Content collections configuration
```

### Error Handling

- Use TypeScript's type system to prevent runtime errors
- Validate content collection schemas with Zod
- Provide sensible defaults for optional props
- Handle missing data gracefully in components

### Images & Assets

- Use WebP format for images (`*.webp`)
- Store images in `public/img/` directory
- Always provide `width`, `height`, and `alt` attributes for accessibility
- Use `loading="lazy"` for below-the-fold images

### Internationalization

- Primary language is Chinese (zh-cn)
- Use Chinese for user-facing text
- Set `<html lang="zh-cn">` in layouts
- Add `language: zh-cn` in RSS feed custom data

### RSS Feed

- RSS endpoint is at `/rss.xml`
- Uses `@astrojs/rss` package
- Filters posts that have `pubDate` or `date` field
- Sorts posts by publication date (newest first)

### Category Pages

- Category pages are dynamically generated at `/posts/category/[category]`
- Use Astro's `getStaticPaths()` to pre-build pages for each category
- Categories are extracted from blog post frontmatter
- Category pages use the same sidebar layout as the main blog listing
- Filter posts by `category` field in the collection

### Accessibility

- Use proper semantic HTML elements (`header`, `main`, `footer`, `nav`, `article`)
- Include `aria-label` or `aria-labelledby` for interactive elements
- Ensure all images have descriptive alt text
- Use proper heading hierarchy (h1, h2, h3)

### No Testing Framework

This project does not currently have a testing framework configured. If you need to add tests, consult with the user first about their preferred testing approach.

## Special Notes

- Site URL: `https://cynosura.one`
- Site name: "Cynosura" (赤茶)
- No linting tools configured - focus on writing clean, readable code
- The project uses pnpm workspaces and has specific onlyBuiltDependencies
- Avoid modifying `pnpm-lock.yaml` directly; let pnpm manage it
