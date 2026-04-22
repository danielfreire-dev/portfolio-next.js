/** Application port — falls back to 3000 when `PORT` is not set. */
export const port = process.env.PORT || 3000;

/**
 * Base URL for the application.
 * Uses the Vercel production URL when available, otherwise falls back to localhost.
 */
export const host = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${port}`;
