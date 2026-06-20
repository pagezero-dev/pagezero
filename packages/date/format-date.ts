interface FormatDateOptions {
  locale?: string
  timeZone?: string
}

/** Stable across SSR and client; UTC is the default for date-only values. */
export function formatDate(
  date: Date,
  { locale = "en-US", timeZone = "UTC" }: FormatDateOptions = {},
): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone,
  }).format(date)
}
