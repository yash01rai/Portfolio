import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * App-level safety net. An uncaught error during render (e.g. a browser-specific
 * throw like the Safari `InvalidCharacterError` from gsap autoAlpha) would
 * otherwise unmount the entire tree and leave a blank page for every visitor.
 * This renders a minimal on-brand fallback instead.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface to the console / any error reporting so this never fails silently.
    console.error('Uncaught error rendered fallback:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-bg px-6 text-center text-text-primary">
        <p className="font-display text-4xl italic text-text-primary/90 md:text-5xl">
          Something went sideways.
        </p>
        <p className="max-w-md text-sm text-muted">
          The page hit an unexpected error. A refresh usually sorts it out.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full border border-stroke bg-surface px-6 py-3 text-sm text-text-primary transition-colors hover:bg-bg hover:border-transparent"
        >
          Reload
        </button>
      </div>
    );
  }
}
