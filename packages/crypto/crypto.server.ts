/**
 * Creates a cryptographic key from a secret string for HMAC operations.
 *
 * @param secret - The secret string to derive the key from
 * @param usages - The key usages to allow for the key
 * @returns A CryptoKey object configured for HMAC-SHA256 operations
 */
function createKey(secret: string, usages: KeyUsage[]) {
  const encoder = new TextEncoder()
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usages,
  )
}

/**
 * Converts an ArrayBuffer to a base64-encoded string representation.
 *
 * @param buffer - The ArrayBuffer to convert
 * @returns A base64-encoded string representation of the buffer
 */
function arrayBufferToHash(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

/**
 * Converts a base64-encoded string back to an ArrayBuffer.
 *
 * @param hash - The base64-encoded string to convert
 * @returns An ArrayBuffer containing the decoded data, or an empty buffer if decoding fails
 */
function hashToArrayBuffer(hash: string): ArrayBuffer {
  const byteString = atob(hash)
  const bufferView = new Uint8Array(byteString.length)

  for (let i = 0; i < byteString.length; i++) {
    bufferView[i] = byteString.charCodeAt(i)
  }

  return bufferView.buffer
}

/**
 * Creates an HMAC signature for the provided data using the given secret.
 *
 * @param secret - The secret key used for signing
 * @param data - The string data to sign
 * @returns A hash string representation of the signature
 */
export async function sign(secret: string, data: string) {
  const key = await createKey(secret, ["sign"])
  const encoder = new TextEncoder()
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(data),
  )
  return arrayBufferToHash(signatureBuffer)
}

/**
 * Verifies if a signature is valid for the given data and secret.
 *
 * @param secret - The secret key that was used for signing
 * @param data - The string data that was signed
 * @param signature - The hash string signature to verify
 * @returns A boolean indicating whether the signature is valid
 */
export async function verify(secret: string, data: string, signature: string) {
  const key = await createKey(secret, ["verify"])
  const encoder = new TextEncoder()
  let signatureBuffer: ArrayBuffer
  try {
    signatureBuffer = hashToArrayBuffer(signature)
  } catch {
    return false
  }
  return await crypto.subtle.verify(
    "HMAC",
    key,
    signatureBuffer,
    encoder.encode(data),
  )
}
