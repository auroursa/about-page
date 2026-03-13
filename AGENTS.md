# AGENTS.md

This guide helps agentic coding tools work effectively in this Astro-based personal website.

## Project Overview

- **Framework**: Astro 5.17.1 (TypeScript)
- **Styling**: Tailwind CSS v4 + modular stylesheet entry at `src/styles/global.css`
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
- `src/styles/global.css` is now an entrypoint that imports modular stylesheets (`base.css`, `components.css`, `home.css`, `navigation.css`)
- `src/styles/global.css` should keep shared/base styles only (`base.css`, `components.css`, `navigation.css`); avoid importing `home.css` globally
- Load `home.css` only on the home page (`src/pages/index.astro`) via `?url` stylesheet link to reduce render-blocking CSS on non-home routes and shrink critical CSS
- Keep tokens/reset/font/base element rules in `src/styles/base.css`
- Keep reusable UI component patterns in `src/styles/components.css`
- Keep home-page-specific visual rules in `src/styles/home.css`
- Keep nav/drawer/indicator behavior styles in `src/styles/navigation.css`
- Prefer promoting repeated layout/UI patterns into component-level classes instead of repeating long utility stacks
- Use CSS custom properties (variables) for theming
- Implement dark mode using `@media (prefers-color-scheme: dark)`
- Store custom fonts in `public/font/` directory
- Prefer editing Astro markup over re-introducing large global component stylesheets
- Keep spacing, alignment, and responsive behavior consistent across matching cards and sidebars
- Home page card/grid rhythm uses `gap-2` (`0.5rem`) as the baseline spacing token for adjacent cards, dual-column panel gaps, and photo-grid/masonry gutters unless a component explicitly needs a different rhythm

### Home Page Structure

- The home page is assembled from dedicated Astro components rather than one large template
- Treat `src/pages/index.astro` as a composition entry file: keep it focused on importing and ordering sections, not embedding large section markup or data loops
- Current home page pieces include `HomeHeroPanel.astro`, `HomeHeroFeature.astro`, `ArticleTimeline.astro`, `HomeProjectPanel.astro`, `HomeInfoGrid.astro`, `HomeMusicPanel.astro`, `HomeMusicSwitcherScript.astro`, `HomeGalleryPanel.astro`, `HomeSeasonRecap.astro`, and `HomeGalleryShuffleScript.astro`
- Reusable home page data lives in `src/data/` (`home-gallery.ts`, `home-info.ts`)
- The masonry gallery intentionally shuffles on each refresh via a small client-side script component
- When changing the home page, preserve the desktop/tablet/mobile differences of the timeline and four-season gallery layout
- Prefer external script files in `public/js/` for home page behavior that must survive stricter CSP deployments; avoid relying on inline scripts for critical UI state such as gallery visibility or timeline positioning
- For styles that must remain stable across Astro client-side route transitions, prefer same-origin external CSS via `<link>` in layout (example: `public/css/project-card.css`)

### Home Music Module

- Music data source is `src/data/home-music.ts` (`homeMusicAppleLinks`), with Apple lookup and normalization in `src/components/HomeMusicPanel.astro`
- Keep music metadata parsing centralized in `HomeMusicPanel.astro` helpers and interfaces (`releaseType`, `trackNumber`, `trackCount`, `year`, `genre`, `previewUrl`)
- `releaseType` should prioritize `trackCount` when available (`<= 1` as single, `> 1` as album), then fallback to `collectionType`
- Track-count tag displays `共 x 首` and track-number tag displays `#xx` (zero-padded, Overpass Mono font) as separate adjacent tags with no gap between them; both remain hidden for singles
- Year and genre are displayed as plain text separated by `·`, not as tag chips
- The feature card link area covers only the album artwork (not the entire card); hover/active effects apply only to the cover shell
- The music list uses dynamic `overscrollBehavior` — switches to `auto` when scrolled to top or bottom so page scroll passes through naturally
- Accent color is shared at the music layout container level (`--music-accent`) so left feature card and right list stay in sync
- Cover-derived accent extraction and interactive switching logic belong in `public/js/home-music-switcher.js` (avoid inline scripts)
- Preview playback uses `previewUrl` with a single in-page `Audio` instance; keep button states synchronized when active track changes
- Keep the right music list scrollable for long lists and avoid scroll-position drift when fixing hover clipping
- Keep this section's spacing rhythm consistent with other home cards (currently aligned to `gap-2` / `0.5rem`)

### Home Hero Module

- `HomeHeroFeature.astro` uses an `<img>` tag (not CSS `background-image`) for the background photo, with `loading="eager"`, `decoding="async"`, and `fetchpriority="high"` for LCP optimization
- Photo info tooltip uses `public/js/hero-photo-info.js` — desktop shows on hover, mobile toggles on tap via `is-open` class
- `HomeHeroPanel.astro` (personal info card) is visible from 769px+ (`max-[768px]:hidden`), not just 1281px+

### Home Spacing Rhythm

- Use `0.5rem` (`gap-2`) as the default spacing baseline across home modules
- Keep paired panel gaps (for example left/right split cards) aligned to `0.5rem`
- Keep gallery spacing consistent: four-season grid gaps, season-to-masonry spacing, and masonry column/card gutters should follow the same `0.5rem` baseline
- When tweaking one module's spacing, check neighboring home modules and keep shared rhythm synchronized

### Client-Side Script Organization

- Avoid monolithic `public/js/main.js`; split scripts by feature/domain and keep each file scoped to one responsibility
- Use kebab-case file names, and prefer clear prefixes for grouped features (for example `nav-*` for navigation behavior)
- Current navigation behavior is split across `public/js/nav-indicator.js`, `public/js/nav-sticky-menu.js`, and `public/js/nav-drawer-menu.js`
- Keep page-specific interactions in dedicated files (for example `public/js/about-color-swatches.js`, `public/js/article-timeline.js`, `public/js/home-gallery-shuffle.js`)
- Home music behavior is handled in `public/js/home-music-switcher.js` (accent sync, cover updates, preview playback)
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
│   ├── HomeMusicPanel.astro
│   ├── HomeMusicSwitcherScript.astro
│   ├── HomeProjectPanel.astro
│   ├── HomeSeasonRecap.astro
│   └── PostSidebar.astro
├── content/
│   └── blog/              # Markdown blog posts
├── data/
│   ├── home-gallery.ts    # Home gallery and four-season image data
│   ├── home-info.ts       # Home skill/device card data
│   └── home-music.ts      # Home music Apple Music link data
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
│   ├── global.css         # Tailwind entrypoint + style imports
│   ├── base.css           # Tokens, reset, base typography/elements
│   ├── components.css     # Shared component-level classes
│   ├── home.css           # Home-page-specific styles
│   └── navigation.css     # Navigation and drawer transition styles
└── content.config.ts       # Content collections configuration

public/
├── css/
│   └── project-card.css
└── js/
    ├── nav-indicator.js
    ├── nav-sticky-menu.js
    ├── nav-drawer-menu.js
    ├── article-timeline.js
    ├── about-color-swatches.js
    ├── home-gallery-shuffle.js
    ├── hero-photo-info.js
    ├── home-music-switcher.js
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
- Prefer responsive images for large hero/season/avatar assets using `srcset` + `sizes` to avoid oversized downloads
- For manually maintained responsive variants, use suffix naming like `*-320.webp`, `*-640.webp`, `*-768.webp`, `*-1280.webp`
- Keep seasonal recap images wired through `src/data/home-gallery.ts` (`srcSet`/`sizes`) and render these fields in `HomeSeasonRecap.astro`
- Keep hero background responsive in `HomeHeroFeature.astro` (currently `background-768.webp`, `background-1280.webp`, original as largest fallback)
- Use small avatar variants (`profile-avatar-96.webp`, `profile-avatar-192.webp`) in UI positions that render around 64-96px
- Masonry gallery images are frequently replaced; do not require responsive variant generation there unless explicitly requested

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
