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

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="w-6 h-6">
    <rect width="32" height="32" rx="8" fill="#2563eb"/>
    <path d="M6 8c0-1.1.9-2 2-2h7c1.5 0 3 .5 4 1.5 1-1 2.5-1.5 4-1.5h7c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-7c-1 0-2 .3-2.7.9-.4.3-.9.3-1.3 0C18.3 24.3 17.3 24 16.3 24H9c-1.1 0-2-.9-2-2V8z" fill="white"/>
    <path d="M16 7.5v16.5" stroke="#2563eb" stroke-width="1.5"/>
    <path d="M9 12h6M9 15h6M21 12h6M21 15h6" stroke="#2563eb" stroke-width="1" stroke-linecap="round"/>
    <circle cx="24" cy="8" r="4" fill="#fbbf24"/>
    <path d="M22 6.5h4l-1 2h-2l-1-2z" fill="white"/>
    <rect x="22.5" y="8.5" width="3" height="2" fill="white" rx="0.5"/>
  </svg>
);

export default function DashboardLayout({ children, currentPage }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/profile', {
          credentials: 'include'
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
        credentials: 'include'
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/');
    }
  };

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠', page: 'dashboard' },
    { href: '/dashboard/books', label: 'My Books', icon: '📚', page: 'books' },
    { href: '/dashboard/add-book', label: 'Add Book', icon: '➕', page: 'add-book' },
    { href: '/dashboard/sales', label: 'Sales', icon: '📊', page: 'sales' },
    { href: '/dashboard/profile', label: 'Profile', icon: '👤', page: 'profile' },
  ];

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
      {/* Mobile Header */}
      <nav className="bg-white shadow-sm border-b lg:hidden safe-top">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mobile-menu-button"
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/dashboard" className="ml-2 flex items-center text-lg sm:text-xl font-bold text-primary-600">
                <BookIcon />
                <span className="ml-2 hidden xs:inline">BookBazaar</span>
                <span className="ml-2 xs:hidden">BB</span>
              </Link>
            </div>
            
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm px-3 py-2"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Desktop Header */}
      <nav className="bg-white shadow-sm border-b hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center text-2xl font-bold text-primary-600">
                <BookIcon />
                <span className="ml-2">BookBazaar</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 hidden sm:inline">Welcome, {user?.name}</span>
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

      <div className="lg:flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div 
              className="mobile-overlay" 
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            ></div>
            <div className={`mobile-sidebar custom-scrollbar safe-top safe-bottom ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <Link href="/dashboard" className="flex items-center text-xl font-bold text-primary-600">
                  <BookIcon />
                  <span className="ml-2">BookBazaar</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="mobile-menu-button"
                  aria-label="Close menu"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 mt-5 px-2 space-y-1 overflow-y-auto">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`group flex items-center px-3 py-3 text-base font-medium rounded-md touch-target transition-colors duration-200 ${
                      currentPage === item.page
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t bg-gray-50">
                <div className="text-center">
                  <p className="text-sm text-gray-600 truncate mb-2">Welcome, {user?.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full btn-secondary text-sm touch-target"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16">
          <div className="bg-white shadow-sm h-full custom-scrollbar">
            <nav className="mt-5 px-2 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-base font-medium rounded-md transition-colors duration-200 ${
                    currentPage === item.page
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex-1">
          <main className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
