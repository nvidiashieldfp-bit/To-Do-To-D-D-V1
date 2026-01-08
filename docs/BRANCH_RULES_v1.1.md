
# BRANCH RULES: v1.1

**Base:** v1.0.1  
**Status:** OPEN  

---

## 1. Core Logic Frozen
The fundamental architecture defined in `LOCKED_MANIFEST_v1.0.md` remains authoritative. No changes allowed to:
- Single-screen layout.
- LocalStorage persistence model.
- One Active Input rule.
- "Silent UX" philosophy.

## 2. Allowed Scope for v1.1
This branch is open for **non-intrusive enhancements** only:
- Accessibility (A11y) improvements (ARIA labels, keyboard navigation tweaks).
- Performance optimizations (rendering, state batching).
- Subtle animation refinements (must respect `prefers-reduced-motion`).
- Translation corrections.

## 3. Forbidden Changes
- **NO** new features (e.g., subtasks, tags, projects).
- **NO** external integrations (e.g., Google Calendar API sync, Cloud databases).
- **NO** UI clutter (e.g., onboarding tours, tooltips, modals).

## 4. Manifest Authority
Any proposed change that contradicts `LOCKED_MANIFEST_v1.0.md` requires a formal version bump to v2.0 and a complete re-audit.

---
**Approved by Architecture Board**  
*Date: May 2024*
