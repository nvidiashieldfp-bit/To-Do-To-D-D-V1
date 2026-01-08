
# VISUAL BASELINE: v1.0.1

**Status:** APPROVED
**Date:** May 2024
**Theme Strategy:** Flat / Matte / Grey
**Compliance:** WCAG 2.1 AA + Eye Comfort Locked

---

## 1. Light Mode Palette (Eye-Safe Locked)
All surfaces must be matte grey. No white. No gradients. No noise.

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Background** | `#D1D5DB` | Main application background (Tailwind Gray 300). |
| **Panel / Card** | `#E5E7EB` | Main Panel & Task Rows (Tailwind Gray 200). |
| **Surface** | `#CBD5E1` | Inputs, Buttons (Tailwind Slate 300). |
| **Border** | `#9CA3AF` | Subtle dividers (Tailwind Gray 400). |
| **Primary Text** | `#111827` | Main content (Tailwind Gray 900). |
| **Secondary Text** | `#374151` | Metadata (Tailwind Gray 700). |
| **Placeholder** | `#6B7280` | Input Placeholders (Tailwind Gray 500). |

## 2. Gradient Rules
- **Top Lighting:** FORBIDDEN.
- **Atmosphere:** FORBIDDEN.
- **Texture:** FORBIDDEN.
- **Light Mode must be completely flat.**

## 3. Dark Mode Palette (Unchanged)
- **Background:** `#000000`
- **Text:** `#E5E7EB`
- **Surface:** `rgba(255,255,255,0.05)`

## 4. Typography
- **Font:** Inter
- **Weights:** 300 (Light), 400 (Regular), 600 (SemiBold), 700 (Bold)
- **Tracking:** Tight (-0.02em) for headings, Wide (0.2em) for uppercase labels.

## 5. Visual Invariants
1. **No Glare:** Surfaces must be matte and significantly darker than white paper.
2. **Editor-Like:** High contrast text on calm grey backgrounds.
3. **One Active Input:** Visual focus is exclusive.

---
*Captures stored in /docs/visual-baseline/v1.0.1-light-mode/*
