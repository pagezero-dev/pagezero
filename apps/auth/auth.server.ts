export function getRedirectUrl(redirectTo: string = "/") {
  const requestURLObject = new URL(redirectTo, "https://base")
  return requestURLObject.pathname + requestURLObject.search
}

export function generateOTP() {
  // creates a typed array that can hold a single 32-bit unsigned integer
  const array = new Uint32Array(1)
  // fills this array with cryptographically strong random values using the Web Crypto API
  crypto.getRandomValues(array)
  // apply modulo to generate a number between 0-999999 (6 digits at most)
  const otp = array[0] % 1000000
  // convert to string and ensure it's exactly 6 digits by padding with leading zeros if needed
  return otp.toString().padStart(6, "0")
}

export function generateOTPExpiration(minutesOffset: number = 5) {
  const now = new Date()
  now.setMinutes(now.getMinutes() + minutesOffset)
  return now.getTime()
}

export function isOTPExpired(expiresAt: number) {
  const now = new Date()
  return now.getTime() > expiresAt
}
