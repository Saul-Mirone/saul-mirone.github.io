# Personal Blog of Mirone

This is the Astro-powered version of Mirone's personal blog, migrated from Gatsby.

## Features

- ⚡ **Astro + TypeScript** - Modern static site generation
- 🎨 **Tailwind CSS** - Utility-first styling
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 🌍 **i18n Support** - English and Chinese (Simplified)
- 📱 **Responsive Design** - Mobile-friendly layout
- 🔍 **SEO Optimized** - Sitemap and RSS feed
- 📝 **MDX Support** - Enhanced markdown with components

## Development

To run locally:

```bash
pnpm install
pnpm run dev
```

Then open [http://localhost:4321](http://localhost:4321) in your browser.

## Building

```bash
pnpm run build
pnpm run preview
```

## Deployment

This site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the main branch.

## Migration Notes

This project was migrated from Gatsby v5 to Astro. Key improvements include:

- Better performance with island architecture
- TypeScript throughout
- Modern tooling with Vite
- Simplified content management
- Better SEO and loading speeds
- **pnpm** for faster, more efficient package management
- **Tailwind CSS 3.4.17** with Typography plugin for styling

## Package Manager

This project uses **pnpm** instead of npm for better performance and disk efficiency. Make sure you have pnpm installed:

```bash
npm install -g pnpm
```

## Styling

The project uses **Tailwind CSS 3.4.17** with the Typography plugin for content styling. The configuration is in `tailwind.config.mjs`.

**About Tailwind 4:** While [Astro's official documentation](https://docs.astro.build/en/guides/styling/#tailwind) supports Tailwind 4, practical testing revealed several issues:
- Tailwind 4 is still in beta stage with complex configuration requirements
- Integration compatibility issues with `@astrojs/tailwind`
- Basic utility classes like `text-gray-900` are not properly recognized
- Requires additional PostCSS configuration and new CSS-first configuration approach
- The `@tailwindcss/vite` plugin doesn't work seamlessly with Astro's build system

Therefore, this project uses stable **Tailwind CSS 3.4.17** with the proven `@astrojs/tailwind` integration. We'll consider upgrading to Tailwind 4 when it's officially stable and fully compatible with Astro.