export function getRedirectUrl(redirectTo: string = "/") {
  const requestURLObject = new URL(redirectTo, "https://base")
  return requestURLObject.pathname + requestURLObject.search
}
