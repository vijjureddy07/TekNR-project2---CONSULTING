# Customization Guide

This guide provides instructions on how to customize the visual design and content of your template.

## Colors

The template uses a structured color system based on CSS variables. You can customize the color palette by editing the following files:

*   **`assets/css/style.css`:** This file contains the primary color palette for the light theme.
*   **`assets/css/dark-mode.css`:** This file contains the color palette for the dark theme.

To change the colors, simply update the values of the CSS variables in the `:root` block of `style.css` and the `html[data-theme="dark"]` block of `dark-mode.css`.

## Fonts

The template uses Google Fonts for typography. To change the fonts, you will need to:

1.  **Choose new fonts:** Select your desired fonts from [Google Fonts](https://fonts.google.com/).
2.  **Update the stylesheet link:** In each HTML file, replace the existing Google Fonts `<link>` tag in the `<head>` with the new one provided by Google Fonts.
3.  **Update the CSS:** In `assets/css/style.css`, update the `font-family` properties in the `body` and heading tags to use your new font names.

## Spacing And Layout

The shared layout now uses a spacing scale and panel tokens in `assets/css/style.css` so sections and cards stay visually consistent across pages.

*   **Spacing scale:** `--space-1` through `--space-10`
*   **Shared panel padding:** `--panel-pad` and `--panel-pad-lg`
*   **Shared layout gaps:** `--layout-gap` and `--layout-gap-lg`
*   **Container width:** `--container-width`

When adjusting page proportions, prefer updating these tokens before editing single components one by one.

## Content

All of the content is located in the HTML files within the `pages` directory. You can edit these files to replace the placeholder text and images with your own content.

## Integrations

The template is ready to be integrated with a variety of third-party services.

*   **Contact Form:** The contact form is compatible with [Formspree](https://formspree.io/) and [Netlify Forms](https://www.netlify.com/products/forms/). To use one of these services, update the `action` attribute of the `<form>` tag in `pages/contact-us.html`.
*   **Newsletter:** The newsletter form is compatible with [Mailchimp](https://mailchimp.com/) and [ConvertKit](https://convertkit.com/). To use one of these services, update the `action` attribute of the `<form>` tag in the footer.
*   **Maps:** The map on the contact page is a placeholder. To add your own map, you can embed a map from [Google Maps](https://www.google.com/maps).
*   **Calendar:** The booking system is ready for integration with services like [Calendly](https://calendly.com/) or [SavvyCal](https://savvycal.com/).
*   **Payment:** The pricing plans include placeholders for [Stripe](https://stripe.com/) and [PayPal](https://www.paypal.com/) buttons. You will need to replace these placeholders with your own payment integration.
