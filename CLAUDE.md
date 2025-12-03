# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Russian-language landing page for "Простое Сообщество" (Prosto Social) - a self-improvement community subscription service. The site is a static single-page application with popup-based content loading.

## Development

To develop locally, simply serve the files with any static server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

No build step required - this is a vanilla HTML/CSS/JS project.

## Architecture

### File Structure
- `index.html` - Main landing page with hero section, 6 content sections, and payment form
- `style.css` - All styles including dark theme, responsive design, popup system, and component styles
- `code.js` - JavaScript handling popups, sliders, payment form logic, and togglers
- `content/` - HTML fragments loaded dynamically into popups (FAQ, feedback, materials, tiers, free_material)
- `avatars/` - User avatar images for testimonials
- `favicon/` - Favicon assets and web manifest

### Key Components

**Popup System** (`code.js:12-114`)
- `openPopup(title, iconId, contentFile, action)` - Opens popup and fetches HTML content
- `switchPopupContent()` - Transitions between popup content
- `closePopup()` - Closes with animation
- Content is loaded via fetch from `content/` directory

**Payment Form** (`code.js:159-265`)
- Two payment methods: Russian card (redirects to prosto.social checkout) and foreign card (submits to pay.prostosocial.store)
- Two tiers: 3-month subscription (tier1) and lifetime access (tier2)
- `choosePaymentMethod()` and `chooseTier()` handle toggler state and form updates
- Email validation required only for foreign cards

**Toggler Component** (`code.js:132-156`)
- Reusable horizontal/vertical toggle switch
- Used for payment method and tier selection
- Dispatches `toggleChange` custom event

**Collection Slider** (`code.js:268-317`)
- Auto-advancing carousel (2.5s interval)
- Shows different content collections (Обучение, Сон, Практики здоровья, Питание)
- Pauses on hover

### CSS Organization

- CSS variables defined in `:root` for theming (dark theme only)
- Key variables: `--max-width: 500px`, `--bg-color`, `--form-color`, `--accent-color`
- Responsive breakpoints at 768px and 992px
- Full-screen sections alternate backgrounds via `:nth-child(odd/even)`

### Analytics

Yandex.Metrika (ID: 101629928) is integrated with reachGoal calls on major CTAs.
