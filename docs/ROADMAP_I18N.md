
# ROADMAP: Internationalization (I18n) v1.1 → v2.0

**Status:** LOCKED
**Goal:** Controlled expansion of "To-Do To-Did" into global markets.

---

## v1.1 — European Foundation (Next)
**Scope:** Static additions only. No logic changes.
- **Spain (ES):** National holidays.
- **France (FR):** National holidays.
- **Language Polish:** Refine translations for `es` and `fr` based on native feedback.
- **Requirement:** Must pass `e2e/holidays.spec.ts`.

## v1.2 — Regional Precision
**Scope:** Advanced regional support.
- **Germany (DE):** Implementation of Bundesländer regions (Bavaria, Berlin, etc.).
- **United Kingdom (GB):** Distinction between England, Scotland, Wales, NI holidays.
- **Feature:** Optional inline regional override in Command Palette.

## v1.3 — Americas Expansion
**Scope:** Timezone logic hardening.
- **Brazil (BR):** National + State holidays.
- **Canada (CA):** Multi-language (EN/FR) support per region.
- **Data:** Migration of all TS logic to `locales/holidays/{CODE}.json`.

## v2.0 — Global & Asian Markets
**Scope:** Complex calendar systems.
- **Markets:** Japan (JP), South Korea (KR), Australia (AU).
- **Tech:** Full decoupling of Holiday Engine.
- **Logic:** Support for non-Gregorian holiday calculations (if kept offline).

---

## CONSTRAINTS (IMMUTABLE)

1.  **One Country = One File:** All data for a country must reside in a single JSON file following `HOLIDAY_TEMPLATE.json`.
2.  **No Forced Alerts:** Holidays are informational. Users must opt-in to notifications.
3.  **No Auto-Rescheduling:** The app never moves a user's task automatically due to a holiday.
4.  **Offline Absolute:** If a holiday rule cannot be calculated locally, it is omitted. No APIs.

---
**Approved by Architecture Board**
*Date: May 2024*
