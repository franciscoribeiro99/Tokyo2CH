"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

/**
 * Last-resort boundary: catches failures in the root layout itself.
 *
 * It replaces the entire document, so it must render its own <html> and <body>
 * and cannot rely on any provider, font, or component from the layout tree.
 * Keep the styling inline for that reason.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: "2rem",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <main style={{ maxWidth: "32rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.75rem" }}>
            Something went badly wrong.
          </h1>
          <p style={{ color: "#71717a", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            The application failed to start. Please reload the page.
          </p>
          {error.digest ? (
            <p style={{ color: "#a1a1aa", fontSize: "0.75rem", marginBottom: "1.5rem" }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={reset}
            style={{
              cursor: "pointer",
              borderRadius: "0.5rem",
              border: "1px solid #d4d4d8",
              padding: "0.5rem 1.25rem",
              fontSize: "0.875rem",
              background: "transparent",
            }}
          >
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
