"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface Props {
  /** The error object thrown by the component tree. */
  error: Error;
  /** Callback to attempt re-rendering the failed segment. */
  reset(): void;
}

/**
 * Global error boundary for the locale segment.
 *
 * Catches runtime errors in the component tree, logs them to the console,
 * and displays a localized error message with a retry button.
 */
export default function Error({ error, reset }: Props) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <h2 title={t("errorLoading.title")}>
      <div>
        {t.rich("errorLoading.description", {
          p: (chunks) => <p className="mt-4">{chunks}</p>,
          retry: (chunks) => (
            <button
              className="text-white underline underline-offset-2"
              onClick={reset}
              type="button"
            >
              {chunks}
            </button>
          ),
        })}
      </div>
    </h2>
  );
}
