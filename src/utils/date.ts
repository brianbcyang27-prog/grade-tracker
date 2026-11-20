/**
 * Returns the date as YYYY-MM-DD in the user's own time zone.
 * (toISOString() uses UTC, which gives yesterday's date in Taiwan before 8 am.)
 */
export function localDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
