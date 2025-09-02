import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="text-8xl mb-4">📚</div>
          <h1 className="text-6xl font-bold text-blue-600 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
              >
                Go Home
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors text-center"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">🔍 Looking for something specific?</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/login" className="text-blue-700 hover:text-blue-900 hover:underline">
              • Login
            </Link>
            <Link href="/register" className="text-blue-700 hover:text-blue-900 hover:underline">
              • Register
            </Link>
            <Link href="/dashboard" className="text-blue-700 hover:text-blue-900 hover:underline">
              • Dashboard
            </Link>
            <Link href="/dashboard/books" className="text-blue-700 hover:text-blue-900 hover:underline">
              • My Books
            </Link>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Error Code: 404 | BookBazaar v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
