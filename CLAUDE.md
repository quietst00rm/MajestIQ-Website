# CLAUDE.md - AI Assistant Guide for MajestIQ Website

## Project Overview

**MajestIQ Website** is a premium marketing website for MajestIQ, a company building proprietary AI and automation systems for enterprise-scale brands. This is a single-page application (SPA) showcasing capabilities, philosophy, approach, and contact functionality.

**Live Site:** https://www.majestiq.io

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | 5.8.2 | Type safety |
| Vite | 6.2.0 | Build tool & dev server |
| Framer Motion | 12.23.24 | Animations |
| Tailwind CSS | CDN | Styling (configured in index.html) |
| Lucide React | 0.554.0 | Icons |

## Directory Structure

```
/
├── index.html              # HTML shell, Tailwind config, SEO meta tags
├── index.tsx               # React entry point
├── App.tsx                 # Main app component (orchestrates all sections)
├── types.ts                # TypeScript type definitions
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies & scripts
│
├── /components/
│   ├── /layout/
│   │   ├── Navbar.tsx      # Fixed navigation with theme toggle
│   │   └── Footer.tsx      # Footer with links
│   ├── /sections/
│   │   ├── Hero.tsx        # Landing section with parallax
│   │   ├── Capabilities.tsx # Three-column feature showcase
│   │   ├── Philosophy.tsx  # Brand philosophy section
│   │   ├── Approach.tsx    # 4-step process carousel
│   │   └── Contact.tsx     # Multi-step contact form
│   ├── /ui/
│   │   └── Logo.tsx        # Reusable logo component
│   └── /visuals/
│       ├── Background3D.tsx    # Canvas particle animation
│       └── CustomCursor.tsx    # Custom cursor handler
│
├── /context/
│   └── ThemeContext.tsx    # Dark/light theme provider
│
├── /public/                # Static assets (favicons, PWA manifest)
│   ├── favicon.ico
│   ├── manifest.json       # PWA configuration
│   ├── robots.txt          # SEO robots
│   └── sitemap.xml         # XML sitemap
│
└── /src/                   # Source assets (images, logos)
    └── *.png, *.jpg        # Brand images
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Build for production (outputs to /dist)
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env.local` file in the root directory:

```
GEMINI_API_KEY=your_api_key_here
```

## Key Conventions

### Component Structure

All components follow this pattern:

```typescript
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IconName } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ComponentName: React.FC = () => {
  const { theme } = useTheme();

  return (
    <section id="section-id" className="...">
      <motion.div>
        {/* Content */}
      </motion.div>
    </section>
  );
};

export default ComponentName;
```

### Styling Conventions

1. **Use Tailwind CSS classes** - No separate CSS files for components
2. **Theme-aware styling** - Use ternary for theme-dependent classes:
   ```typescript
   className={`${theme === 'dark' ? 'bg-charcoal' : 'bg-white'}`}
   ```
3. **Responsive design** - Use Tailwind breakpoints: `md:`, `lg:`, `xl:`
4. **Custom colors** (defined in index.html):
   - `gold-light`: #FFD700
   - `gold-dark`: #D4AF37
   - `charcoal`: #1C1C1C
   - `secondary`: #A0A0A0
5. **Transitions** - Always add `transition-all duration-300` for smooth effects

### Animation Patterns

Use Framer Motion for all animations:

```typescript
// Scroll-based animations
const { scrollYProgress } = useScroll();
const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

// Enter animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>

// Hover effects
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
```

### Theme System

- Theme state managed in `context/ThemeContext.tsx`
- Persisted to localStorage as `'majestiq-theme'`
- Access via `useTheme()` hook:
  ```typescript
  const { theme, toggleTheme } = useTheme();
  ```

### Import Paths

- Use relative imports: `../../context/ThemeContext`
- Path alias `@` is configured but not heavily used

## Important Files

| File | Purpose |
|------|---------|
| `index.html` | Tailwind config, SEO meta tags, fonts, PWA setup |
| `App.tsx` | Main orchestrator, imports all sections |
| `context/ThemeContext.tsx` | Theme state management |
| `components/visuals/Background3D.tsx` | Canvas-based particle animation |
| `components/sections/Contact.tsx` | Multi-step form with validation |

## Code Quality Guidelines

1. **TypeScript** - Use strict typing; define types in `types.ts` for shared types
2. **React 19** - Use modern hooks; functional components only
3. **No inline styles** - Use Tailwind classes exclusively
4. **Semantic HTML** - Use proper section, nav, header, footer elements
5. **Accessibility** - Include aria labels and alt text
6. **Performance** - Use `whileInView` for lazy animation triggers

## Common Tasks

### Adding a New Section

1. Create component in `components/sections/NewSection.tsx`
2. Import and add to `App.tsx` in the desired position
3. Add navigation link in `Navbar.tsx` with matching `href="#section-id"`

### Modifying Theme Colors

Edit the Tailwind config in `index.html`:
```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          'gold-light': '#FFD700',
          // Add or modify colors here
        }
      }
    }
  }
</script>
```

### Adding New Icons

Import from Lucide React:
```typescript
import { NewIcon } from 'lucide-react';
```

### Updating SEO

Modify meta tags in `index.html`:
- Title, description, keywords in `<head>`
- Open Graph tags for social sharing
- JSON-LD structured data for search engines

## Build & Deployment

- **Build output**: `/dist` directory
- **Static hosting**: Compatible with Vercel, Netlify, or any static host
- **PWA ready**: Manifest and service worker configuration in `/public`

## Git Workflow

- Feature branches merged via pull requests
- Branch naming: `claude/feature-name-sessionid`
- Commit messages: Descriptive, action-oriented

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Dev server not starting | Check Node.js version, run `npm install` |
| Theme not persisting | Clear localStorage, check `ThemeContext.tsx` |
| Animations not working | Ensure Framer Motion import, check `motion.div` usage |
| Tailwind classes not applying | Check CDN script in `index.html` |

## Notes for AI Assistants

1. **Tailwind is configured in index.html**, not in a separate config file
2. **No testing framework** is currently set up
3. **No linting/formatting** tools configured (consider adding ESLint/Prettier)
4. **Single-page app** - all sections render on one page with scroll navigation
5. **Canvas animations** in Background3D.tsx are performance-intensive; be careful with modifications
6. **Form submissions** in Contact.tsx currently show a success state but may need backend integration
