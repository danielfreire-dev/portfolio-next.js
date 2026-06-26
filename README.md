# Daniel Freire's Portfolio

A modern, accessible portfolio website built with Next.js 15, featuring internationalization, theme switching, and smooth animations. The site showcases my work as a web developer while maintaining high performance and accessibility standards.

**Link to project:** https://daniel-freire.com/
![Portfolio Screenshot](public/images/screenshots/landingPage.webp)

## How It's Made:

**Tech used:** Next.js 15, React 18, TypeScript, Tailwind CSS, next-intl, Zustand, Resend, Turnstile

This portfolio is built with a modern tech stack prioritizing performance, accessibility, and developer experience:

### Core Architecture

- **Next.js 15 App Router**: Leveraging React Server Components for optimal performance with static rendering where possible
- **Internationalization**: Using `next-intl` for full multi-language support (English, Portuguese, Danish, Polish, German, Czech)
- **State Management**: Zustand for client-side theme and UI state
- **Styling**: Tailwind CSS v4 with custom CSS variables for theme switching
- **Type Safety**: TypeScript throughout for robust type checking

### Key Features

1. **Dynamic Theme Switching**: CSS custom properties with smooth 4-second transitions (intentionally extended for visual testing)
2. **Accessibility First**: All components built with WCAG 2.1 AA compliance, keyboard navigation, and screen reader support
3. **Contact Form**: Integrated with Resend for email delivery and Cloudflare Turnstile for spam protection
4. **Performance Optimized**: Code splitting, image optimization with Next.js Image, and minimal JavaScript bundle
5. **International Routing**: Dynamic route segments for locale handling with proper SEO metadata
6. **Comprehensive Testing**: Vitest for unit testing, Cypress for E2E and accessibility testing
7. **Email Templating**: React Email for consistent, responsive email templates

### Component Structure

- **Server Components**: Pages and layouts for maximum performance
- **Client Components**: Interactive elements like theme toggles and forms
- **SVG Components**: Custom animated rocket SVG with theme-aware colors
- **Navigation**: Smooth page transitions with accessibility considerations

## Optimizations

### Implemented

- **Image Optimization**: WebP format with responsive sizing via Next.js Image component
- **Font Loading**: Optimized font loading with proper `font-display` strategies
- **Bundle Analysis**: Regular bundle size monitoring with tree-shaking
- **CDN Integration**: Static assets served via optimized CDN
- **Caching Strategy**: Implemented appropriate cache headers for static assets

### Planned

- **Edge Runtime**: Migrate to Vercel Edge Functions for faster response times
- **GraphQL API**: Replace REST endpoints with GraphQL for more efficient data fetching
- **PWA Features**: Add service worker for offline functionality
- **Performance Monitoring**: Integrate real user monitoring (RUM) for performance insights

## Lessons Learned:

### Technical Insights

1. **CSS Custom Properties for Theming**: Using `:root:has(#theme-toggle:checked)` selector provides a pure CSS solution for theme switching without JavaScript flicker
2. **Internationalization Complexity**: Managing 6 languages requires careful planning for text expansion/contraction and RTL support considerations
3. **SVG Animation Performance**: CSS transitions on SVG properties (`fill`, `stroke`) can be GPU-accelerated for smoother animations
4. **Form Security**: Implementing Cloudflare Turnstile significantly reduced spam while maintaining accessibility

### Development Process

1. **Accessibility Testing**: Learned to integrate accessibility checks early in development, using tools like Stark for color contrast validation
2. **Performance Budgets**: Setting and maintaining performance budgets helped keep the site fast across all devices
3. **TypeScript Benefits**: The initial setup time paid off with fewer runtime errors and better developer experience
4. **Component Composition**: Building small, focused components made the codebase more maintainable and testable

### Colors Accessibility Validation

| Element        | Light Theme | Dark Theme | Status  |
| -------------- | ----------- | ---------- | ------- |
| Primary Text   | 15.6:¹      | 12.8:¹     | ✅ AAA  |
| Secondary Text | 10.5:¹      | 8.3:¹      | ✅ AAA  |
| Tertiary Text  | 7.2:¹       | 6.1:¹      | ✅ AA   |
| Error Text     | ≥7.0:¹      | ≥6.8:¹     | ✅ AA   |
| Disabled State | 4.6:¹       | 5.3:¹      | ✅ AA\* |

\*Disabled states meet enhanced contrast requirements for non-text elements

Tested with Stark simulator for color blindness compatibility. All color combinations maintain sufficient contrast for users with deuteranopia, protanopia, and tritanopia.

## Examples:

Take a look at these components that demonstrate key implementation patterns:

**Theme Toggle Component:** `/src/ui/Components/ThemeToggle.tsx` - Pure CSS theme switching using the `:has()` selector

**Internationalized Contact Form:** `/src/ui/Components/ContactForm.tsx` - Multi-language form with Turnstile integration

**Animated Rocket SVG:** `/src/ui/Components/svgs/django-rocket.tsx` - Theme-aware SVG with CSS variable integration

**Server Component Page:** `/src/app/[locale]/page.tsx` - Next.js 15 App Router with static rendering

### Adding a New Language

1. Create new `.json` file in `src/messages/` with translation keys
2. Update `routing.ts` in `src/i18n/` to include the new locale
3. Update `UserLanguageType` in `src/types.ts` for TypeScript support
4. Update `LocaleSwitcher.tsx` to display the new language option
5. Add locale-specific metadata in page components

### Running the Project Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint-fix
```

### Environment Variables

This project uses a single `.env` file as the source of truth for all environment variables. Next.js automatically inlines all `NEXT_PUBLIC_*` variables into the client bundle.

**Setup:**

```bash
# Create your env file from the template
cp .env.example .env
# Fill in real values in .env
```

All `NEXT_PUBLIC_*` variables are documented in [`.env.example`](.env.example).

### Testing Strategy

- **Unit Tests**: Vitest with React Testing Library for component testing
- **E2E Tests**: Cypress for integration and user flow testing
- **Accessibility Tests**: Cypress with axe-core for automated accessibility checks
- **Image Validation**: Custom test to ensure all images use WebP format (not JPEG)
- **Internationalization**: Tests to verify translation files are properly structured
