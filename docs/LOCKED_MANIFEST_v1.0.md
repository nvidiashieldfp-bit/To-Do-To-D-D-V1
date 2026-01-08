
# [ARCHIVED] TO-DO TO-DID MANIFEST v1.0
> **STATUS:** ARCHIVED / READ-ONLY
> **TAG:** v1.0.1
> **DATE:** May 2024
> **AUTHORITY:** This document is frozen. Refer to v1.1 rules for future development.

---

# To-Do To-Did PRO — LOCKED MANIFEST v1.0

## Version Metadata
- **Product Name:** To-Do To-Did PRO (Free Edition)
- **Version:** 1.0
- **Status:** FROZEN
- **Date of Lock:** May 20, 2024
- **Authority:** This document defines the immutable core of v1.0.

---

## Product Philosophy (Locked)
- **Single Screen:** The entire application resides on one viewport. No page navigation.
- **Inline-Only:** All modifications (editing, prioritizing, scheduling) occur within the primary UI context. No modals, side panels, or secondary views.
- **Silent UX:** No UI noise, marketing popups, tooltips, or feature discovery prompts. Minimal cognitive load is the priority.
- **Local-First:** Data is stored exclusively in the user's environment. Privacy and speed are non-negotiable.

---

## Locked Core Rules
1. **No Dashboards:** Task management is immediate, not observational.
2. **No Menus:** Interaction is direct and context-aware.
3. **No Popups:** Modals and intrusive overlays are strictly prohibited.
4. **Calendar as Projection:** The calendar is a secondary view for visualizing the task list. It is never the primary interface.
5. **One Active Input:** Only one input context (Main, Calendar-Inline, or Task-Edit) can be active at any time.

---

## Locked UI Components
- **Main Task Input:** Top-aligned, supports natural language parsing (Gemini-backed).
- **Task List Sections:** Fixed order: Now, Today, Tomorrow, Future, Did. Automatic movement based on time/status.
- **Calendar View:** Supports Weekly and Monthly projections with inline task creation.
- **Focus Mode:** Pomodoro timer (25/5) with total UI suppression (Footer hidden).
- **Footer:** Persistent global metadata container.
  - **Content:** `TD {Year} · To-Do To-Did` | `Localized Date` | `Localized Time` | `Credits: Designed & built by Fabio Papoila`.
  - **Constraint:** Zero emojis. Minimal opacity unless hovered.

---

## Locked Behaviors (Critical)
- **Automatic Transition:** Focusing the Main Input or engaging Focus Mode must instantly close/unmount the Calendar View.
- **Footer Invariant:** The footer is always visible in List and Calendar views. It is only hidden during active Focus Mode sessions.
- **Safe Exit:** The `Esc` key cancels the current action and resets focus. It never saves partial or ambiguous states.
- **Deterministic Focus:** Focus Mode overrides all other inputs and view states.

---

## Emoji Policy (Locked)
- **Functional Use:** Emojis are permitted for iconographic utility (e.g., 📅 for calendar, ⏱️ for focus).
- **Placement:** Allowed everywhere EXCEPT the Footer.
- **Density:** Maximum of 1 emoji per UI element/button. No decorative clusters.

---

## Locked Technical Constraints
- **State Management:** `localStorage` is the single source of truth.
- **Persistence:** All states (collapsed sections, theme, language) must persist locally.
- **Connectivity:** App must function 100% offline. No external dependencies required post-load.
- **Privacy:** No backend, no accounts, no analytics, and no tracking cookies.

---

## Locked Platforms
- **Mobile-First:** Touch targets must be ≥ 44px. Layout must scale to 4K.
- **Desktop:** Keyboard shortcuts (`F` for Focus, `Esc` for Cancel, `Cmd/Ctrl+Z` for Undo) are mandatory.
- **HTML-THEME:** A standalone, single-folder version must be maintained with feature parity to the React build.

---

## Allowed Changes Post v1.0
- Critical bug fixes (security or data integrity).
- Performance optimizations for large task lists.
- Accessibility (A11y) improvements for screen readers.

## Forbidden Changes Post v1.0
- New features or "Pro" modules.
- Changes to layout structure or section order.
- Introduction of cloud sync, accounts, or external integrations.
- Modifications to the State Model or Philosophical Invariants.

---

## Authority Clause
This document freezes To-Do To-Did PRO v1.0. Any deviation without a formal version bump to v2.0 is invalid and considered a regression of the v1.0 standard.

**This document freezes To-Do To-Did PRO v1.0. Any deviation without a new version is invalid.**
