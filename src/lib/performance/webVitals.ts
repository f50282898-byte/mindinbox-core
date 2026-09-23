"use client";

import { useReportWebVitals as useNextReportWebVitals } from "next/web-vitals";

export function useReportWebVitals() {
  useNextReportWebVitals((metric) => {
    if (process.env.NODE_ENV === "development") {
      // In development, we allow logging to inspect performance
      const { id, name, value } = metric;
      console.log(`[Web Vitals] ${name} (${id}):`, Math.round(name === 'CLS' ? value * 1000 : value));
    } else {
      // In production, send to analytics backend instead of logging
      // Example:
      // fetch('/api/analytics/vitals', { body: JSON.stringify(metric), method: 'POST' });
    }
  });
}

