import React from "react";
import { C } from "@/app/constants";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[LearnFun] Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultFallback onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

function DefaultFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4"
      style={{
        height: "100dvh",
        background: "#F3EEFF",
        fontFamily: "'Fredoka','Nunito',sans-serif",
        textAlign: "center",
        padding: 32,
      }}
    >
      <span style={{ fontSize: 64 }}>🦊</span>
      <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 28, color: C.navy }}>
        Oops! Something went wrong
      </h1>
      <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 16, color: C.mutedFg, maxWidth: 360 }}>
        Don't worry — let's try again!
      </p>
      <button
        onClick={onRetry}
        style={{
          padding: "12px 28px",
          background: C.green,
          border: `3px solid ${C.navy}`,
          boxShadow: `4px 5px 0 ${C.navy}`,
          borderRadius: 20,
          fontFamily: "'Fredoka',sans-serif",
          fontWeight: 700,
          fontSize: 17,
          color: C.white,
          cursor: "pointer",
        }}
      >
        Try Again 🔄
      </button>
    </div>
  );
}
