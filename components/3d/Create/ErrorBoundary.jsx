import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo }); // Store errorInfo for more details if needed
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: "20px",
              color: "#dc2626", // Tailwind's red-600
              backgroundColor: "#fef2f2", // Tailwind's red-50
              border: "1px solid #fecaca", // Tailwind's red-200
              borderRadius: "8px",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Oops! Something went wrong.
            </h2>
            <p style={{ marginBottom: "0.25rem" }}>
              A 3D asset or component failed to load or render.
            </p>
            {this.state.error && (
              <p
                style={{
                  fontSize: "0.875rem",
                  fontStyle: "italic",
                  marginBottom: "1rem",
                }}
              >
                Error: {this.state.error.toString()}
              </p>
            )}
            {/* You could add a button to try reloading the component or page */}
            {/* <button onClick={() => window.location.reload()}>Reload Page</button> */}
            {/* For more detailed debugging during development:
          {this.state.errorInfo && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem', fontSize: '0.75rem' }}>
              <summary>Error Details</summary>
              {this.state.errorInfo.componentStack}
            </details>
          )}
          */}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
