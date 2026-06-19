// Stub for the `cloudflare:workers` virtual module used during tests.
// Vite cannot resolve `cloudflare:workers` outside the Workers runtime, so
// modules that import `env` are aliased to this stub. Tests that need real
// values should override it with `vi.mock("cloudflare:workers", ...)`.
export const env = {} as Env
