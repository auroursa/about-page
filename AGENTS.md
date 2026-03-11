# AGENTS.md

This guide helps agentic coding tools work effectively in this Astro-based personal website.

## Project Overview

- **Framework**: Astro 5.17.1 (TypeScript)
- **Styling**: Tailwind CSS v4 + CSS variables in `src/styles/global.css`
- **Package Manager**: pnpm
- **Site Language**: Chinese (zh-cn)
- **Content**: Personal blog with content collections, category filtering, RSS feed, sitemap, and a component-driven home page

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

- Use Tailwind CSS v4 utility classes in `.astro` templates for layout and component styling
- Keep shared tokens, fonts, and low-level globals in `src/styles/global.css`
- Prefer promoting repeated layout/UI patterns into `src/styles/global.css` component classes once the same utility stack appears in multiple places
- Use CSS custom properties (variables) for theming
- Implement dark mode using `@media (prefers-color-scheme: dark)`
- Store custom fonts in `public/font/` directory
- Prefer editing Astro markup over re-introducing large global component stylesheets
- Keep spacing, alignment, and responsive behavior consistent across matching cards and sidebars

### Home Page Structure

- The home page is assembled from dedicated Astro components rather than one large template
- Treat `src/pages/index.astro` as a composition entry file: keep it focused on importing and ordering sections, not embedding large section markup or data loops
- Current home page pieces include `HomeHeroPanel.astro`, `HomeHeroFeature.astro`, `ArticleTimeline.astro`, `HomeInfoGrid.astro`, `HomeGalleryPanel.astro`, `HomeSeasonRecap.astro`, and `HomeGalleryShuffleScript.astro`
- Reusable home page data lives in `src/data/` (`home-gallery.ts`, `home-info.ts`)
- The masonry gallery intentionally shuffles on each refresh via a small client-side script component
- When changing the home page, preserve the desktop/tablet/mobile differences of the timeline and four-season gallery layout
- Prefer external script files in `public/js/` for home page behavior that must survive stricter CSP deployments; avoid relying on inline scripts for critical UI state such as gallery visibility or timeline positioning

### Client-Side Script Organization

- Avoid monolithic `public/js/main.js`; split scripts by feature/domain and keep each file scoped to one responsibility
- Use kebab-case file names, and prefer clear prefixes for grouped features (for example `nav-*` for navigation behavior)
- Current navigation behavior is split across `public/js/nav-indicator.js`, `public/js/nav-sticky-menu.js`, and `public/js/nav-drawer-menu.js`
- Keep page-specific interactions in dedicated files (for example `public/js/about-color-swatches.js`, `public/js/article-timeline.js`, `public/js/home-gallery-shuffle.js`)
- For Astro transitions, initialize scripts on both `DOMContentLoaded` and `astro:page-load` to ensure behavior survives client-side navigation

### File Organization

```
src/
├── components/
│   ├── ArticleTimeline.astro
│   ├── DecoratedTitle.astro
│   ├── HomeGalleryPanel.astro
│   ├── HomeGalleryShuffleScript.astro
│   ├── HomeHeroFeature.astro
│   ├── HomeHeroPanel.astro
│   ├── HomeInfoGrid.astro
│   ├── HomeInfoIcon.astro
│   ├── HomeSeasonRecap.astro
│   └── PostSidebar.astro
├── content/
│   └── blog/              # Markdown blog posts
├── data/
│   ├── home-gallery.ts    # Home gallery and four-season image data
│   └── home-info.ts       # Home skill/device card data
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
├── styles/
│   └── global.css         # Tailwind entrypoint, tokens, fonts, globals
└── content.config.ts       # Content collections configuration

public/
└── js/
    ├── nav-indicator.js
    ├── nav-sticky-menu.js
    ├── nav-drawer-menu.js
    ├── article-timeline.js
    ├── about-color-swatches.js
    ├── home-gallery-shuffle.js
    ├── post-title-transition.js
    └── post-disqus.js
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
- Home gallery images live in `public/img/gallery/`; keep `src/data/home-gallery.ts` in sync when adding or replacing files

### Internationalization

- Primary language is Chinese (zh-cn)
- Use Chinese for user-facing text
- Set `<html lang="zh-cn">` in layouts
- Add `language: zh-cn` in RSS feed custom data

### RSS Feed

- RSS endpoint is at `/rss.xml`
- Uses `@astrojs/rss` package
- Feed items include full rendered article content, not title-only entries
- Root-relative links in RSS content are converted to absolute URLs during feed generation
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
- Astro may warn about Shiki inline styles under stricter CSP; for custom home page interactions, prefer same-origin external scripts instead of inline script blocks
