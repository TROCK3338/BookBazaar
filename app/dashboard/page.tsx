'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

interface DashboardStats {
  totalBooks: number;
  totalSales: number;
  totalRevenue: number;
  averagePrice: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalSales: 0,
    totalRevenue: 0,
    averagePrice: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch books data
        const booksResponse = await fetch('/api/books');
        const booksData = await booksResponse.json();
        
        // Fetch sales data
        const salesResponse = await fetch('/api/sales');
        const salesData = await salesResponse.json();

        if (booksResponse.ok && salesResponse.ok) {
          const books = booksData.books || [];
          const totalRevenue = parseFloat(salesData.summary?.totalRevenue || '0');
          const averagePrice = books.length > 0 
            ? books.reduce((sum: number, book: any) => sum + parseFloat(book.price), 0) / books.length
            : 0;

          setStats({
            totalBooks: books.length,
            totalSales: parseInt(salesData.summary?.totalOrders || '0'),
            totalRevenue,
            averagePrice
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your BookBazaar seller panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalBooks}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : `₹${stats.totalRevenue.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalSales}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">💵</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Book Price</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : `₹${stats.averagePrice.toFixed(2)}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/add-book"
              className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <p className="font-medium text-primary-700">Add New Book</p>
                <p className="text-sm text-primary-600">Expand your inventory</p>
              </div>
            </Link>

            <Link
              href="/dashboard/books"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3">📚</span>
              <div>
                <p className="font-medium text-blue-700">Manage Books</p>
                <p className="text-sm text-blue-600">Edit your listings</p>
              </div>
            </Link>

            <Link
              href="/dashboard/sales"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mr-3">📊</span>
              <div>
                <p className="font-medium text-green-700">View Sales</p>
                <p className="text-sm text-green-600">Track performance</p>
              </div>
            </Link>

            <Link
              href="/dashboard/profile"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mr-3">👤</span>
              <div>
                <p className="font-medium text-purple-700">Profile</p>
                <p className="text-sm text-purple-600">Account settings</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-green-500 mr-3">✅</span>
              <span className="text-gray-700">Account created successfully</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-blue-500 mr-3">📝</span>
              <span className="text-gray-700">Add your first book to get started selling</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-purple-500 mr-3">🚀</span>
              <span className="text-gray-700">Complete your profile for better visibility</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
