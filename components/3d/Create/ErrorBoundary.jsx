
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            className='flex flex-col items-center justify-center h-full w-full p-6 
                       bg-slate-800/50 border border-red-700/50 rounded-lg 
                       text-red-300 shadow-xl'
          >
            <div className='text-4xl mb-4' role='img' aria-label='Warning'>
              ⚠️
            </div>
            <h2 className='text-xl font-semibold mb-2 text-red-200'>
              Oops! A 3D Rendering Error Occurred.
            </h2>
            <p className='text-sm text-slate-400 mb-1 text-center'>
              Something went wrong while trying to display this 3D content.
            </p>
            {this.state.error && (
              <p className='text-xs text-red-400/80 italic mb-4 text-center max-w-md'>
                Details:{" "}
                {this.state.error.toString().length > 150
                  ? this.state.error.toString().substring(0, 150) + "..."
                  : this.state.error.toString()}
              </p>
            )}
            <p className='text-xs text-slate-500'>
              Try refreshing the component or check the console for more
              specific error messages.
            </p>
            {/* 
            You could add a refresh button here if applicable to your app structure:
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
            >
              Reload Page
            </button> 
            */}
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
