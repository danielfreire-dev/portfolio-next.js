"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

interface Props {
  /** The error object thrown by the component tree, including optional digest in production. */
  error: Error & { digest?: string };
  /** Callback to attempt re-rendering the failed segment. */
  reset(): void;
}

/**
 * Global error boundary for the locale segment.
 *
 * Catches runtime errors in the component tree, logs them to the console,
 * and displays a localized error message with a retry button and error digest for debugging.
 */
export default function ErrorBoundary({ error, reset }: Props) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center text-center px-4">
      <h2
        className="text-2xl font-bold capitalize text-(--text)"
        title={t("errorLoading.title")}
      >
        {t("errorLoading.title")}
      </h2>
      <div className="text-(--text)">
        {t.rich("errorLoading.description", {
          p: (chunks) => <p className="mt-4">{chunks}</p>,
          retry: (chunks) => (
            <button
              className="text-(--primary) underline underline-offset-2 hover:opacity-80 cursor-pointer font-medium"
              onClick={reset}
              type="button"
            >
              {chunks}
            </button>
          ),
        })}
      </div>
      {error?.digest && (
        // eslint-disable-next-line i18next/no-literal-string
        <p className="mt-4 text-xs font-mono text-(--text-tertiary)">
          Error Digest: {error.digest}
        </p>
      )}
      {process.env.NODE_ENV === "development" && error?.message && (
        <pre className="mt-4 p-3 text-xs bg-(--surface) text-(--error) rounded max-w-xl overflow-x-auto text-left font-mono">
          {error.message}
        </pre>
      )}
    </div>
  );
}

