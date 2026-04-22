import { notFound } from "next/navigation";

/**
 * Catch-all route that triggers a 404 for any unmatched path under a locale.
 *
 * This ensures that unknown routes (e.g., /en/unknown-page) return a proper
 * not-found response instead of a blank page.
 */
export default function CatchAllPage() {
  notFound();
}
