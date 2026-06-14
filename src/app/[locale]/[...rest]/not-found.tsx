import NotFoundPage from "@/ui/Components/NotFoundPage";

/**
 * Global 404 page rendered for unmatched routes within a locale segment.
 *
 * Delegates to the `NotFoundPage` component for the actual UI content.
 */
export default function GlobalNotFound() {
  return (
    <>
      <NotFoundPage />
    </>
  );
}
