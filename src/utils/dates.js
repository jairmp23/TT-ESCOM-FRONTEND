/**
 * Returns a date formatted as "YYYY-MM-DD" using the LOCAL timezone.
 * Use this instead of date.toISOString().split("T")[0], which uses UTC
 * and can return the wrong date for timezones behind UTC (e.g. Mexico UTC-6).
 */
export function localDateStr(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
