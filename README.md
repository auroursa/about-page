# Cynosura

Personal website built with Astro, featuring a blog, friends page, and about page. Previously built with Pelican and pure HTML/CSS, now migrated to Astro for better performance and maintainability.

## Table of Contents
- [Cynosura](#cynosura)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Project Structure](#project-structure)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Available Scripts](#available-scripts)
  - [Content Management](#content-management)
    - [Writing Posts](#writing-posts)
    - [Adding Friends](#adding-friends)
  - [Deployment](#deployment)
  - [License](#license)
  - [Fonts License](#fonts-license)

## Introduction

Welcome to my personal website! This site serves as a platform to share my thoughts, experiences, and technical insights. It features a blog, a curated list of friend websites, and information about the site itself.

## Features

- **Home** (`/`): Personal introduction, contact information, and social links
- **Blog** (`/posts`): Collection of articles covering technology, daily life, and personal reflections
  - Dual-column layout with sidebar (categories, RSS feed)
  - Full-width article pages with metadata, copyright info, and Disqus comments
  - RSS feed support
- **Friends** (`/friends`): Links to friends' websites and a "void portal" section
- **About** (`/about`): Information about the website's design, technology stack, and color scheme

## Technologies

- [Astro](https://astro.build/) - Static site generator
- HTML5 & CSS3
- Vanilla JavaScript
- Markdown for blog posts

## Project Structure

```
.
├── src/
│   ├── content/
│   │   └── blog/           # Markdown blog posts
│   ├── layouts/
│   │   └── BaseLayout.astro    # Base layout component
│   └── pages/
│       ├── index.astro     # Home page
│       ├── about.astro     # About page
│       ├── friends.astro   # Friends page
│       └── posts/
│           ├── index.astro # Blog listing page
│           └── [slug].astro # Blog post detail page
├── public/
│   ├── css/               # Static CSS files
│   ├── img/               # Images and avatars
│   ├── font/              # Custom fonts
│   └── js/                # Static JavaScript files
├── dist/                  # Build output
├── astro.config.mjs       # Astro configuration
└── package.json
```

## Development

### Prerequisites

- Node.js 18.x or higher
- pnpm (recommended) or npm

### Setup

1. Clone the repository:
   ```bash
   git clone git@github.com:auroursa/about-page.git
   cd about-page
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:4321`

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build the site for production
- `pnpm preview` - Preview the production build locally

## Content Management

### Writing Posts

Blog posts are written in Markdown and stored in `src/content/blog/`. Each post should include frontmatter:

```markdown
---
title: Post Title
pubDate: 2024-01-22 09:41:00
description: Brief description of the post
category: Category Name
slug: post-slug
---

Your content here...
```

Categories currently used: 日常 (Daily), 杂谈 (Misc), 技术 (Tech)

### Adding Friends

To add a new friend to the friends page, edit `src/pages/friends.astro` and add an entry to the `friends` array:

```javascript
{
  name: "Friend Name",
  desc: "Description of their website",
  url: "https://example.com",
  img: "/img/friends/avatar.webp"
}
```

## Deployment

This project is designed to be deployed on static hosting platforms like:

- Cloudflare Pages
- Vercel
- Netlify
- GitHub Pages

Build command: `pnpm build`
Output directory: `dist`

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use the code for personal use. Commercial use requires permission.

## Fonts License

The "Overpass" font used in this project is licensed under the [SIL Open Font License](https://github.com/auroursa/about-page/blob/main/font/OFL.txt).

The "Overpass" font is used for titles on the website and as the font for code blocks in the article pages.
