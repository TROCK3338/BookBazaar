'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export default function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch profile - if successful, user is authenticated
        const response = await fetch('/api/profile', {
          credentials: 'include' // Include HTTP-only cookies
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' // Include HTTP-only cookies
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/'); // Redirect anyway
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
                📚 BookBazaar
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <div className="space-y-1">
              <Link
                href="/dashboard"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  currentPage === 'dashboard'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">🏠</span>
                Dashboard
              </Link>
              
              <Link
                href="/dashboard/books"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  currentPage === 'books'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">📚</span>
                My Books
              </Link>
              
              <Link
                href="/dashboard/add-book"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  currentPage === 'add-book'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">➕</span>
                Add Book
              </Link>
              
              <Link
                href="/dashboard/sales"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  currentPage === 'sales'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">📊</span>
                Sales
              </Link>
              
              <Link
                href="/dashboard/profile"
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  currentPage === 'profile'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3">👤</span>
                Profile
              </Link>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
