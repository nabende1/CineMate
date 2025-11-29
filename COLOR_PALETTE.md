# 🎬 CineMate - Cinematic Color Palette

## Color System Overview

Your project now uses a professionally crafted cinematic color palette designed for a dark, elegant movie-watching experience.

---

## Color Definitions

| Name                   | Hex Code  | RGB             | Usage                                               |
| ---------------------- | --------- | --------------- | --------------------------------------------------- |
| 🎬 **Dark Base**       | `#131d2e` | `19, 29, 46`    | Primary dark background, sidebar, headers           |
| ✨ **Accent**          | `#bb4230` | `187, 66, 48`   | Buttons, highlights, interactive elements           |
| 🌅 **Secondary**       | `#daa36b` | `218, 163, 107` | Hover states, secondary buttons, borders            |
| 🌸 **Soft Background** | `#e5b2a0` | `229, 178, 160` | Text on dark, card accents, alternative backgrounds |

---

## CSS Variables Available

### Light Mode (`:root`)

```css
:root {
  --dark-base: #131d2e; /* Primary dark color */
  --accent: #bb4230; /* Primary accent */
  --secondary: #daa36b; /* Secondary accent */
  --soft-bg: #e5b2a0; /* Soft backgrounds */

  --bg: #f5f5f5; /* Light background */
  --card: #ffffff; /* Light card */
  --text: #131d2e; /* Dark text */
  --muted: #666; /* Muted text */
  --header-bg: #ffffff; /* Light header */
}
```

### Dark Mode (`[data-theme="dark"]`)

```css
[data-theme='dark'] {
  --bg: #131d2e; /* Dark background */
  --card: #1a2332; /* Dark card */
  --text: #e5b2a0; /* Light text */
  --muted: #daa36b; /* Muted text (secondary) */
  --accent: #bb4230; /* Primary accent */
  --header-bg: #0d1420; /* Dark header */
}
```

---

## Where Colors Are Applied

### 🎬 Dark Base (`#131d2e`)

- Sidebar background
- Mobile header background
- Primary text color (light mode)
- Banner overlay gradient
- Dark mode page background

### ✨ Accent (`#bb4230`)

- Primary buttons
- Link colors
- Hover state for sidebar items
- Search suggestions hover
- Border accents

### 🌅 Secondary (`#daa36b`)

- Button hover state
- Trend button border
- Search input border
- Secondary text colors
- Highlights in search results

### 🌸 Soft Background (`#e5b2a0`)

- Trending buttons background
- Search suggestion titles
- Banner text color
- Dark mode text

---

## Color Combinations

### Primary Action (CTAs)

```css
.btn {
  background: var(--accent); /* #bb4230 */
  color: #fff; /* White text */
}

.btn:hover {
  background: var(--secondary); /* #daa36b */
}
```

### Interactive Elements

```css
.sidebar li:hover {
  background: var(--accent); /* #bb4230 */
}

.trend-btn.active {
  background: var(--accent); /* #bb4230 */
}
```

### Search Dropdowns

```css
.suggestions {
  background: var(--dark-base); /* #131d2e */
  border: 2px solid var(--accent); /* #bb4230 */
}

.suggestions li:hover {
  background: var(--accent); /* #bb4230 */
}
```

### Banners & Overlays

```css
.banner {
  background: linear-gradient(
    135deg,
    var(--dark-base),
    /* #131d2e */ var(--accent) /* #bb4230 */
  );
}

.banner-info {
  background: linear-gradient(
    transparent,
    rgba(19, 29, 46, 0.95) /* Dark base with opacity */
  );
  color: var(--soft-bg); /* #e5b2a0 */
}
```

---

## Usage Examples

### Using in CSS

```css
/* Use CSS variables for consistency */
.custom-element {
  background: var(--accent);
  color: var(--soft-bg);
  border: 2px solid var(--secondary);
}

/* For dark backgrounds, use soft-bg text */
.dark-section {
  background: var(--dark-base);
  color: var(--soft-bg);
}

/* For hover states, use secondary */
.interactive:hover {
  background: var(--secondary);
}
```

### Light Mode (Default)

- **Background:** `#f5f5f5` (light gray)
- **Cards:** `#ffffff` (white)
- **Text:** `#131d2e` (dark base - for readability)
- **Accents:** Cinematic colors for interactive elements

### Dark Mode

- **Background:** `#131d2e` (dark base)
- **Cards:** `#1a2332` (slightly lighter dark)
- **Text:** `#e5b2a0` (soft background - warm, readable)
- **Accents:** Same cinematic palette for consistency

---

## Contrast & Accessibility

### WCAG AA Compliant Ratios

- Dark Base + Soft Background: **High contrast** ✅
- Accent + White: **High contrast** ✅
- Secondary + Dark Base: **Medium contrast** ✅

---

## Implementation in Files

### Updated CSS Files

- ✅ `globals.css` - CSS variables and base styles
- ✅ `layout.css` - Sidebar, header, and navigation colors
- ✅ `components.css` - Movie cards and search suggestions
- ✅ `home.css` - Banner and grid styles
- ✅ `movie.css` - Movie detail page colors

### How to Use Cinematic Colors

All colors are now managed through CSS variables. To use them in your HTML or components:

```html
<!-- Use classes with predefined colors -->
<button class="btn">Watch Now</button>
<div class="banner">...</div>
<div class="suggestions">...</div>
```

Or extend in CSS:

```css
.my-custom-element {
  background: var(--dark-base);
  color: var(--soft-bg);
  border: 1px solid var(--accent);
}

.my-custom-element:hover {
  border-color: var(--secondary);
}
```

---

## Theme Toggle Implementation

The project supports dark/light mode via `[data-theme="dark"]`:

```javascript
// Toggle dark mode
document.documentElement.setAttribute('data-theme', 'dark')

// Remove dark mode
document.documentElement.removeAttribute('data-theme')
```

---

## Color Psychology

🎬 **Dark Base** (`#131d2e`)

- Creates a cinematic, premium atmosphere
- Reduces eye strain in dark environments
- Professional and sophisticated feel

✨ **Accent** (`#bb4230`)

- Warm, earthy tone (brick/terracotta)
- Draws attention naturally
- Associated with warmth and cinema

🌅 **Secondary** (`#daa36b`)

- Golden, sunset-like tone
- Creates hierarchy and depth
- Complements the primary accent

🌸 **Soft Background** (`#e5b2a0`)

- Warm, welcoming peach tone
- Excellent contrast on dark backgrounds
- Humanizes the interface

---

## Tips for Consistency

1. **Always use CSS variables** - Don't hardcode color hex values
2. **Maintain contrast ratios** - Test text/background combinations
3. **Use semantic naming** - `var(--accent)` for primary actions
4. **Test in both themes** - Verify colors work in light and dark modes
5. **Update this file** - When adding new colors or changing values

---

**Last Updated:** November 29, 2025
