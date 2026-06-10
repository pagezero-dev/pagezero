export function fromFormData(data: unknown) {
  if (!(data instanceof FormData)) {
    throw new TypeError("Expected FormData")
  }

  return Object.fromEntries(data.entries())
}
