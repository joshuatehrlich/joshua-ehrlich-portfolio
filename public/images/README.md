# Public Images

**Usually, you should use `src/assets/` instead.**

This folder is only for special cases where images need to be served exactly as-is without any processing.

## When to Use This (Rare Cases)

- Social media Open Graph preview images
- Images that need exact URLs for external linking
- Already-optimized images that shouldn't be reprocessed
- SVG files that need to be referenced by URL string

## Most Images Go in `src/assets/`

For your portfolio artwork, project screenshots, and most images:
→ Use `src/assets/` instead so Astro can optimize them automatically.

## URL Access

Images here are accessible at `/images/[filename]`
Example: `/images/og/preview.jpg`
