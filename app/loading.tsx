export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        {/* Animated BookBazaar Logo */}
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <h1 className="text-2xl font-bold text-blue-600 animate-pulse">
            BookBazaar
          </h1>
        </div>
        
        {/* Loading Spinner */}
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        
        {/* Loading Text */}
        <p className="text-gray-600 animate-pulse">
          Loading your books...
        </p>
        
        {/* Progress Dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );
}
