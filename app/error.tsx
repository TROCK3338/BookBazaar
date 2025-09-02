'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', error);
    }
    
    // In production, you might want to log to an error reporting service
    // Example: Sentry, LogRocket, etc.
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. Don't worry, our team has been notified.
          </p>
        </div>
        
        <div className="card bg-white">
          <div className="space-y-4">
            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-sm font-medium text-red-800 mb-2">Error Details (Development)</h3>
                <p className="text-sm text-red-700 font-mono">
                  {error.message || 'Unknown error occurred'}
                </p>
                {error.stack && (
                  <details className="mt-2">
                    <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                      View Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 whitespace-pre-wrap overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={reset}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors text-center"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
        
        <div className="card bg-blue-50 border-blue-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🛠️ What you can do:</h3>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Try refreshing the page</li>
            <li>• Check your internet connection</li>
            <li>• Clear your browser cache and cookies</li>
            <li>• Try again in a few minutes</li>
          </ul>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            If the problem persists, please contact support with the error code: 
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {Date.now().toString(36).toUpperCase()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
