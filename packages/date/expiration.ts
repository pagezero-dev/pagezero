export function expiresInMinutes(
  minutesOffset: number,
  from: Date = new Date(),
): number {
  const date = new Date(from)
  date.setMinutes(date.getMinutes() + minutesOffset)
  return date.getTime()
}

export function isExpired(
  expiresAt: number,
  now: number = Date.now(),
): boolean {
  return now > expiresAt
}
