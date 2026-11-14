"use client";

import "./globals.css";

export default function GlobalError({
  error,
  retry,
  reset,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
  reset: () => void;
}) {
  const handleRetry = () => {
    if (retry) {
      retry();
    } else {
      reset();
    }
  };

  return (
    <html lang="en" className="h-full antialiased bg-background">
      <body className="min-h-full flex flex-col">
        <title>Something went wrong — Feedo</title>
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-xl text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20 text-primary-foreground font-bold text-xl mb-6">
              F
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight mb-2.5">
              Something went wrong!
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {error?. digest
                ? `A critical application error occurred (Ref: ${error.digest}).`
                : "A critical error occurred while rendering the application."}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="w-full rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
