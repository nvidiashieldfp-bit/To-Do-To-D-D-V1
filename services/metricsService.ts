
/**
 * ============================================================================
 * FILE: services/metricsService.ts
 * PURPOSE: Invisible Friction Metrics (Privacy-Safe).
 * RESPONSIBILITY: Collects anonymous, session-based counters of UX friction points.
 * PRIVACY: No PII, no persistence (unless debugging), no network calls.
 * ============================================================================
 */

type MetricKey = 
  | 'early_typing'       // User starts typing before input has focus
  | 'focus_loss'         // Input loses focus while content exists (unintentional blur)
  | 'task_cancel'        // User explicitly clears/cancels creation (Escape)
  | 'calendar_bounce'    // User opens calendar and closes it quickly (<3s) without action
  | 'interrupted_type'   // Type-to-add was triggered but interrupted
  | 'nlp_success'        // Local parsing successfully extracted metadata
  | 'nlp_fail';          // Local parsing found no metadata

interface MetricsStore {
  [key: string]: number;
}

// In-memory storage (Session only)
let store: MetricsStore = {
  early_typing: 0,
  focus_loss: 0,
  task_cancel: 0,
  calendar_bounce: 0,
  interrupted_type: 0,
  nlp_success: 0,
  nlp_fail: 0
};

// Internal state for heuristic calculation
let calendarOpenTime: number | null = null;

export const metrics = {
  /**
   * Increment a specific metric counter.
   */
  record: (key: MetricKey) => {
    if (typeof store[key] === 'number') {
      store[key]++;
      // Optional: Log to console in dev mode only
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Metric] ${key}: ${store[key]}`);
      }
    }
  },

  /**
   * Mark the calendar as opened to track bounce rate.
   */
  markCalendarOpen: () => {
    calendarOpenTime = Date.now();
  },

  /**
   * Mark calendar closed. If duration < 3s, record as bounce.
   */
  markCalendarClosed: () => {
    if (calendarOpenTime) {
      const duration = Date.now() - calendarOpenTime;
      if (duration < 3000) {
        metrics.record('calendar_bounce');
      }
      calendarOpenTime = null;
    }
  },

  /**
   * Get current metrics snapshot.
   */
  getSnapshot: () => ({ ...store }),

  /**
   * Reset all metrics (e.g., on reload or explicit opt-out).
   */
  reset: () => {
    store = {
      early_typing: 0,
      focus_loss: 0,
      task_cancel: 0,
      calendar_bounce: 0,
      interrupted_type: 0,
      nlp_success: 0,
      nlp_fail: 0
    };
    calendarOpenTime = null;
  }
};
