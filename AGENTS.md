# AGENTS.md

This guide helps agentic coding tools work effectively in this Astro-based personal website.

## Project Overview

- **Framework**: Astro 6.x (TypeScript)
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
- Date preprocessing in `content.config.ts` converts Date objects to UTC strings to avoid timezone drift

### Naming Conventions

- **Components**: PascalCase (e.g., `BaseLayout.astro`, `PostCard.astro`)
- **Files**: kebab-case for pages, PascalCase for layouts and components
- **Variables**: camelCase
- **CSS Classes**: kebab-case (e.g., `menu-button`, `card-title`)
- **CSS Variables**: kebab-case with `--` prefix (e.g., `--text-color`, `--main-color`)

### CSS & Styling

- Use Tailwind CSS v4 utility classes in `.astro` templates for layout and component styling
- `src/styles/global.css` is an entrypoint for shared styles only (`base.css`, `components.css`, `navigation.css`)
- Home-page styles live in `home-deferred.css`, loaded via `?url` import in `src/pages/index.astro`
- Keep tokens/reset/font/base element rules in `src/styles/base.css`
- Keep reusable UI component patterns in `src/styles/components.css` (includes `drawer-interactive`, `drawer-section`, `drawer-action-icon` for drawer elements)
- Keep home-page specific rules in `src/styles/home-deferred.css`
- Keep nav/drawer/indicator behavior styles in `src/styles/navigation.css`
- Prefer promoting repeated layout/UI patterns into component-level classes instead of repeating long utility stacks
- Use CSS custom properties (variables) for theming
- Implement dark mode using `@media (prefers-color-scheme: dark)`
- Store custom fonts in `src/assets/fonts/` directory (managed via `astro:fonts`)
- Prefer editing Astro markup over re-introducing large global component stylesheets
- Keep spacing, alignment, and responsive behavior consistent across matching cards and sidebars
- Home page card/grid rhythm uses `gap-2` (`0.5rem`) as the baseline spacing token for adjacent cards, dual-column panel gaps, and photo-grid/masonry gutters unless a component explicitly needs a different rhythm

### Home Page Structure

- The home page is assembled from dedicated Astro components rather than one large template
- Treat `src/pages/index.astro` as a composition entry file: keep it focused on importing and ordering sections, not embedding large section markup or data loops
- Current home page pieces include `HomeHeroPanel.astro`, `HomeHeroFeature.astro`, `ArticleTimeline.astro`, `HomeProjectPanel.astro`, `HomeInfoGrid.astro`, `HomeMusicPanel.astro`, `HomeMusicSwitcherScript.astro`, `HomeGalleryPanel.astro`, `HomeSeasonRecap.astro`, and `HomeGalleryShuffleScript.astro`
- Reusable home page data lives in `src/data/` (`home-gallery.ts`, `home-info.ts`, `home-music.ts`, `social-links.ts`, `friends.ts`)
- The masonry gallery intentionally shuffles on each refresh via a small client-side script component
- When changing the home page, preserve the desktop/tablet/mobile differences of the timeline and four-season gallery layout
- Prefer external script files in `public/js/` for home page behavior that must survive stricter CSP deployments; avoid relying on inline scripts for critical UI state such as gallery visibility or timeline positioning
- For styles that must remain stable across Astro client-side route transitions, prefer same-origin external CSS via `<link>` in layout

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

- `HomeHeroFeature.astro` uses an `<Image>` component (from `astro:assets`, not CSS `background-image`) for the background photo, with `loading="eager"`, `decoding="async"`, and `fetchpriority="high"` for LCP optimization
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
- Keep page-specific interactions in dedicated files (for example `public/js/about-color-swatches.js`, `public/js/article-timeline.js`, `public/js/home-gallery-shuffle.js`) and load them only on the pages that need them (not globally in BaseLayout)
- Home music behavior is handled in `public/js/home-music-switcher.js` (accent sync, cover updates, preview playback)
- For Astro transitions, initialize scripts on both `DOMContentLoaded` and `astro:page-load` to ensure behavior survives client-side navigation
- Prefer proper cleanup patterns (store a cleanup function, call it on re-init) over `window.__*` global flags to prevent duplicate event listeners
- For audio/media resources, listen to `astro:before-swap` to pause and release resources before page transitions
- Social icon data (SVG body, viewBox, URLs) is centralized in `src/data/social-links.ts` and shared between `HomeHeroPanel` and `BaseLayout` drawer

### File Organization

```
src/
├── assets/
│   ├── fonts/            # Local font files (Overpass, Overpass Mono)
│   └── img/              # Source images (processed by astro:assets at build time)
│       ├── gallery/      # Masonry gallery photos
│       │   └── 2025/     # Year-specific season photos
│       ├── friends/      # Friend avatar images
│       ├── avatar.webp
│       ├── profile-avatar.webp
│       └── background.webp
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
│   ├── PostCard.astro        # Shared post card component
│   └── PostSidebar.astro
├── content/
│   └── blog/              # Markdown blog posts
├── data/
│   ├── friends.ts         # Friends page link data
│   ├── home-gallery.ts    # Home gallery and four-season image data
│   ├── home-info.ts       # Home skill/device card data
│   ├── home-music.ts      # Home music Apple Music link data
│   └── social-links.ts    # Shared social icon link data
├── utils/
│   ├── categories.ts      # Category extraction and counting helper
│   ├── date.ts            # Shared date formatting, sorting, and ISO datetime helpers
│   └── og.ts              # OG image generation (satori + sharp)
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro        # Home page
│   ├── about.astro        # About page
│   ├── friends.astro      # Friends page
│   ├── rss.xml.ts         # RSS feed endpoint
│   ├── og/                # OG image generation endpoints (build-time, satori + sharp)
│   │   ├── [slug].png.ts          # Per-post OG images
│   │   ├── page/[page].png.ts     # Static page OG images
│   │   └── category/[category].png.ts  # Category page OG images
│   ├── posts/
│   │   ├── index.astro    # Blog listing page with category sidebar
│   │   ├── [slug].astro   # Individual blog post page
│   │   └── category/
│   │       └── [category].astro  # Category filtering page
├── styles/
│   ├── global.css         # Tailwind entrypoint + style imports
│   ├── base.css           # Tokens, reset, base typography/elements
│   ├── components.css     # Shared component-level classes
│   ├── home-deferred.css  # Home page styles
│   └── navigation.css     # Navigation and drawer transition styles
└── content.config.ts       # Content collections configuration

public/
├── img/                # Static assets only (favicon, avatars that require fixed URLs)
└── js/
    ├── nav-indicator.js
    ├── nav-sticky-menu.js
    ├── nav-drawer-menu.js
    ├── article-timeline.js
    ├── about-color-swatches.js
    ├── home-gallery-shuffle.js
    ├── hero-photo-info.js
    ├── home-music-switcher.js
    └── post-disqus.js
```

### Error Handling

- Use TypeScript's type system to prevent runtime errors
- Validate content collection schemas with Zod
- Provide sensible defaults for optional props
- Handle missing data gracefully in components

### Images & Assets

- **Image optimization** uses Astro's `astro:assets` `<Image>` component with Sharp for build-time processing
- Global image behavior is configured in `astro.config.mjs` with `image.layout: 'constrained'` and `image.responsiveStyles: false` (Tailwind v4 keeps style control)
- Prefer `src/components/AppImage.astro` over direct `<Image>` in Astro components to share defaults (`loading`, `decoding`) and semantic presets (`avatar`, `cover`)
- Source images live in `src/assets/img/` (not `public/img/`); Astro auto-generates responsive variants and optimized formats at build time
- Blog post inline images should live next to content under `src/content/blog/<slug>/` and be referenced with relative paths in Markdown (for example `![alt](./2022-mid-year-summary/photo.jpg)`)
- Only static assets that need fixed URLs (favicon, etc.) remain in `public/img/`
- Use `<Image>` component with `widths` and `sizes` props for responsive images — do NOT manually create `-320`, `-640` size variants
- Home gallery images are imported in `src/data/home-gallery.ts` with `ImageMetadata` types; components use `<Image src={item.src} widths={item.widths} sizes={item.sizes} />`
- Friend avatars use `import.meta.glob` in `src/data/friends.ts` to batch-import all `src/assets/img/friends/*.webp` files
- Avatar `widths` should match actual display needs: use `[96, 192, 288]` for ~88px display (up to 3x), not oversized values like 512
- Always provide `alt` attributes for accessibility; use `alt=""` for purely decorative images
- Use `loading="lazy"` for below-the-fold images; use `loading="eager"` with `fetchpriority="high"` for LCP images (hero background)
- Keep `src/data/home-gallery.ts` in sync when adding or replacing gallery files in `src/assets/img/gallery/`
- Keep year-specific gallery sets in subfolders (e.g., `src/assets/img/gallery/2025/`) so seasonal recaps stay separate from the masonry pool
- For remote, client-switched media (for example Home Music cover art), keep using native `<img>` where Astro asset processing is not suitable
- After large image-asset migrations, clear `.astro/` and rebuild once to avoid stale dev/build cache issues

### OpenGraph Images

- OG images are generated at build time for every page using satori (SVG) + sharp (PNG)
- Shared generation logic lives in `src/utils/og.ts` (`generateOgImage(title, subtitle?, description?)`)
- Three endpoint files under `src/pages/og/` cover blog posts, static pages, and category pages
- Chinese text uses Noto Sans SC (fetched from jsDelivr CDN at build time, cached in-process)
- Latin text ("Cynosura" branding) uses Overpass Bold from local TTF at `src/assets/fonts/Overpass-Bold.ttf`
- Avatar is read from `public/img/avatar.webp` and converted to PNG data URI for embedding
- Each page passes its `ogImage` prop to `BaseLayout`; the default fallback is `/og/page/index.png`
- When adding new static pages, register them in `src/pages/og/page/[page].png.ts`

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
- Sorts posts by publication date (newest first) via shared `sortPostsByDate` from `src/utils/date.ts`
- Guards against missing `post.body` to avoid runtime errors

### Category Pages

- Category pages are dynamically generated at `/posts/category/[category]`
- Use Astro's `getStaticPaths()` to pre-build pages for each category
- Categories are extracted from blog post frontmatter using `getCategoryItems()` from `src/utils/categories.ts`
- Category pages use the same sidebar layout and `PostCard` component as the main blog listing
- Filter posts by `category` field in the collection
- Pages that already have category data pass it to `BaseLayout` via `drawerCategories` prop to avoid redundant `getCollection` calls

### Accessibility

- Use proper semantic HTML elements (`header`, `main`, `footer`, `nav`, `article`)
- Include `aria-label` or `aria-labelledby` for interactive elements
- Ensure all images have descriptive alt text
- Use proper heading hierarchy (h1, h2, h3)
- Use `alt=""` for purely decorative images (avatars in nav/header); use descriptive alt text for content images
- External links (social, messaging) should include `target="_blank" rel="noopener noreferrer"`

### No Testing Framework

This project does not currently have a testing framework configured. If you need to add tests, consult with the user first about their preferred testing approach.

## Special Notes

- Site URL: `https://cynosura.one`
- Site name: "Cynosura" (赤茶)
- No linting tools configured - focus on writing clean, readable code
- The project uses pnpm workspaces and has specific onlyBuiltDependencies
- Avoid modifying `pnpm-lock.yaml` directly; let pnpm manage it
- Astro may warn about Shiki inline styles under stricter CSP; for custom home page interactions, prefer same-origin external scripts instead of inline script blocks
