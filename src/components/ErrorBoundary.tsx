import React from "react";

interface State {
  hasError: boolean;
  isChunkError: boolean;
}

/**
 * Catches React render errors including lazy chunk load failures.
 * On a chunk error (e.g., stale Vercel deploy hash mismatch), auto-reloads once.
 */
class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  private reloaded = false;

  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, isChunkError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    const isChunkError =
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Importing a module script failed") ||
      error.message.includes("Loading chunk") ||
      error.name === "ChunkLoadError";
    return { hasError: true, isChunkError };
  }

  componentDidCatch(error: Error) {
    // Auto-reload once on chunk load errors (stale deploy hash)
    const isChunkError =
      error.message.includes("Failed to fetch dynamically imported module") ||
      error.message.includes("Importing a module script failed") ||
      error.message.includes("Loading chunk") ||
      error.name === "ChunkLoadError";

    if (isChunkError && !this.reloaded) {
      this.reloaded = true;
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError && !this.state.isChunkError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
          <div className="text-center space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-xl font-bold font-heading">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              A component failed to load. Please refresh the page or contact Peter directly on WhatsApp.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors"
              >
                Refresh page
              </button>
              <a
                href="https://wa.me/254758896553"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-sm font-semibold transition-colors"
              >
                WhatsApp Peter
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
