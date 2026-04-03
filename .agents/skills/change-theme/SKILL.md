---
name: change-theme
description: >-
  Updates the shadcn/ui theme by editing OKLCH CSS custom properties in
  apps/core/styles/tailwind.css. Use when the user wants to change colors,
  theme appearance, or match a brand palette.
---

# Change Theme

Modify the shadcn/ui theme by updating CSS custom properties in `apps/core/styles/tailwind.css`.

## Gather Information

Ask the user in a single question:

> What theme style would you like? (e.g., "blue primary color", "warm and rounded", "minimal with sharp corners", or a specific hex color to match)

## Theme File Location

The theme is defined in `apps/core/styles/tailwind.css` with CSS custom properties using the OKLCH color space.

## Theme Structure

The file contains three main sections:

1. **`:root`** - Light mode colors (lines 73-106)
2. **`.dark`** - Dark mode colors (lines 110-142)
3. **`@theme inline`** - Tailwind color mappings (lines 33-69)

## Available Color Variables

| Variable | Purpose |
|----------|---------|
| `--background` | Page background |
| `--foreground` | Default text color |
| `--card` | Card backgrounds |
| `--card-foreground` | Card text |
| `--popover` | Popover/dropdown backgrounds |
| `--popover-foreground` | Popover text |
| `--primary` | Primary brand color (buttons, links) |
| `--primary-foreground` | Text on primary color |
| `--secondary` | Secondary actions |
| `--secondary-foreground` | Text on secondary |
| `--muted` | Muted backgrounds |
| `--muted-foreground` | Muted/subtle text |
| `--accent` | Accent highlights |
| `--accent-foreground` | Text on accent |
| `--destructive` | Error/danger states |
| `--border` | Border colors |
| `--input` | Input field borders |
| `--ring` | Focus ring color |
| `--radius` | Border radius base value |
| `--chart-1` to `--chart-5` | Chart colors |
| `--sidebar-*` | Sidebar-specific colors |

## Color Format

Colors use **OKLCH** format: `oklch(lightness chroma hue)`

- **Lightness**: 0 (black) to 1 (white)
- **Chroma**: 0 (gray) to ~0.4 (vivid)
- **Hue**: 0-360 degrees (red=0, green=142, blue=264, etc.)

## Instructions

When the user requests a theme change:

1. Identify which color variables need to change
2. Update values in both `:root` (light) and `.dark` sections
3. Ensure sufficient contrast between foreground/background pairs
4. Keep the OKLCH format for consistency

## Tips

- Use [oklch.com](https://oklch.com) to pick colors
- Test both light and dark modes
- Ensure accessibility (contrast ratios)
