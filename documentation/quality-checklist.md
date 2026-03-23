# Quality Checklist

This checklist mirrors the current client submission requirements for the Northline Advisory template.

## Design And UI

- [x] Mobile-first responsive layout with mobile navigation
- [x] Shared color palette powered by CSS variables
- [x] Limited font system using Google Fonts
- [x] Shared spacing scale and reusable panel spacing tokens
- [x] Professional icon library via Material Symbols
- [x] Reusable buttons, cards, forms, and layout utilities
- [x] Dark/light mode toggle with system preference support
- [x] RTL toggle and dedicated `rtl.css`
- [x] Accessibility helpers including focus states, ARIA labels, and form messaging
- [x] Loading state support with page loader and skeleton utility classes
- [x] Shared hover transitions for interactive components
- [x] Client-side form validation with user-friendly feedback

## Technical Structure

- [x] Template organized into `assets/`, `pages/`, and `documentation/`
- [x] Semantic HTML page sections with section headers
- [x] Shared CSS variables and modular JavaScript files
- [x] SEO metadata and JSON-LD included on public pages
- [x] `robots.txt` and `sitemap.xml` included

## Placeholder Integrations

- [x] Contact form placeholder ready for Formspree or Netlify Forms
- [x] Newsletter placeholder ready for Mailchimp or ConvertKit
- [x] Booking integration hook included in shared scripts
- [x] Payment placeholders documented for Stripe and PayPal
- [x] Map placeholder documented for future Google Maps embed

## Documentation

- [x] Installation guide
- [x] Customization guide
- [x] Page structure guide
- [x] Credits
- [x] Changelog
- [x] Support guide

## Manual Release QA Still Required

- [ ] Run full W3C HTML and CSS validation before delivery
- [ ] Cross-browser test in Chrome, Firefox, Safari, and Edge
- [ ] Audit keyboard navigation and screen-reader flow on all key pages
- [ ] Replace repeated raster assets with final optimized production images where needed
- [ ] Generate WebP variants for production image delivery
- [ ] Re-test responsive layouts after final content replacement
- [ ] Verify live third-party integrations after provider credentials are added
