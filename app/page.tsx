'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/profile', {
          credentials: 'include'
        });
        setIsLoggedIn(response.ok);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-600">📚 BookBazaar</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn-primary text-sm sm:text-base">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary text-sm sm:text-base px-3 sm:px-4">
                    Login
                  </Link>
                  <Link href="/register" className="btn-primary text-sm sm:text-base px-3 sm:px-4">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Welcome to <span className="text-primary-600">BookBazaar</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            The ultimate platform for book sellers to manage their inventory, track sales, 
            and grow their business. Join thousands of sellers who trust BookBazaar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 sm:mb-16">
            <button 
              onClick={handleGetStarted}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors w-full sm:w-auto max-w-xs"
            >
              Get Started Today
            </button>
            <Link 
              href="#features" 
              className="text-primary-600 hover:text-primary-700 font-semibold text-base sm:text-lg"
            >
              Learn More →
            </Link>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-20">
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📖</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Manage Books</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Add, edit, and organize your book inventory with ease. Upload images and track stock levels.
              </p>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow duration-300">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📊</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Track Sales</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Monitor your sales performance with detailed analytics and reports.
              </p>
            </div>
            
            <div className="card text-center hover:shadow-lg transition-shadow duration-300 sm:col-span-2 lg:col-span-1 lg:col-span-1">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👤</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Seller Profile</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Customize your seller profile and manage your account settings.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
