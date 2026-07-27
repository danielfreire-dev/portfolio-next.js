/**
 * Turnstile API route handler.
 *
 * Re-exports the POST handler from the Turnstile server-side provider so that
 * Next.js App Router can route `/api/turnstile` POST requests to the
 * validation logic. This thin re-export keeps the route file clean and the
 * actual validation logic testable in isolation from the file-system routing
 * layer.
 */
import { POST } from "@/providers/TurnstileServer";

export { POST };
