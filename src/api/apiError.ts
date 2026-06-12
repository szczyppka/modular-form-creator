/**
 * Normalized error for all API failures.
 * Mirrors the backend error shape: `{ message, details }`.
 * `status === 0` means the request never reached the server (network/timeout).
 */
export class ApiError extends Error {
  readonly status: number
  readonly details?: Record<string, unknown>

  constructor(status: number, message: string, details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }

  /** 4xx — deterministic failures (validation, not found); retrying cannot succeed. */
  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }
}
