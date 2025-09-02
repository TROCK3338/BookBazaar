'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface Sale {
  id: number;
  quantity: number;
  total_price: string;
  sale_date: string;
  title: string;
  price: string;
}

interface SalesSummary {
  totalRevenue: string;
  totalBooksSold: number;
  totalOrders: number;
  averageOrderValue: string;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [summary, setSummary] = useState<SalesSummary>({
    totalRevenue: '0.00',
    totalBooksSold: 0,
    totalOrders: 0,
    averageOrderValue: '0.00'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const response = await fetch('/api/sales');
      const data = await response.json();

      if (response.ok) {
        setSales(data.sales || []);
        setSummary(data.summary || {
          totalRevenue: '0.00',
          totalBooksSold: 0,
          totalOrders: 0,
          averageOrderValue: '0.00'
        });
      } else {
        setError(data.error || 'Failed to fetch sales data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSales = sales.filter(sale => {
    if (timeFilter === 'all') return true;
    
    const saleDate = new Date(sale.sale_date);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));

    switch (timeFilter) {
      case '7days': return daysDiff <= 7;
      case '30days': return daysDiff <= 30;
      case '90days': return daysDiff <= 90;
      default: return true;
    }
  });

  if (loading) {
    return (
      <DashboardLayout currentPage="sales">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="sales">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
            <p className="text-gray-600 mt-2">Track your sales performance and revenue</p>
          </div>
          
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
            <label htmlFor="timeFilter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Time Period:
            </label>
            <select
              id="timeFilter"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full xs:w-auto"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                <span className="text-xl sm:text-2xl">💰</span>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600 truncate">₹{summary.totalRevenue}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <span className="text-xl sm:text-2xl">📚</span>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Books Sold</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600 truncate">{summary.totalBooksSold}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <span className="text-xl sm:text-2xl">📊</span>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-600 truncate">{summary.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                <span className="text-xl sm:text-2xl">📈</span>
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-600 truncate">₹{summary.averageOrderValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sales Table */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Sales</h2>
            <span className="text-xs sm:text-sm text-gray-600">
              Showing {filteredSales.length} of {sales.length} sales
            </span>
          </div>

          {filteredSales.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-4">📊</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No sales data</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
                {sales.length === 0 
                  ? "Start selling your books to see sales analytics here."
                  : "No sales found for the selected time period."}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile View - Card Layout */}
              <div className="block sm:hidden space-y-4">
                {filteredSales.map((sale) => (
                  <div key={sale.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 flex-1 mr-2">{sale.title}</h3>
                      <span className="text-sm font-semibold text-green-600 whitespace-nowrap">₹{sale.total_price}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="block">Unit Price</span>
                        <span className="font-medium text-gray-900">₹{sale.price}</span>
                      </div>
                      <div>
                        <span className="block">Quantity</span>
                        <span className="font-medium text-gray-900">{sale.quantity}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                      {formatDate(sale.sale_date)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View - Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book Title
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSales.map((sale) => (
                      <tr key={sale.id} className="hover:bg-gray-50">
                        <td className="px-3 lg:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900 line-clamp-2">{sale.title}</div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{sale.price}</div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{sale.quantity}</div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-600">₹{sale.total_price}</div>
                        </td>
                        <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(sale.sale_date)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Performance Insights */}
        {sales.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3">📈 Sales Insights</h3>
              <ul className="space-y-1 text-xs sm:text-sm text-blue-700">
                <li>• Your best-selling books generate consistent revenue</li>
                <li>• Average order value: ₹{summary.averageOrderValue}</li>
                <li>• Total books sold: {summary.totalBooksSold} units</li>
                <li>• Keep popular books in stock to maintain sales momentum</li>
              </ul>
            </div>

            <div className="card bg-green-50 border-green-200">
              <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-3">💡 Recommendations</h3>
              <ul className="space-y-1 text-xs sm:text-sm text-green-700">
                <li>• Monitor stock levels of popular books</li>
                <li>• Consider competitive pricing for better sales</li>
                <li>• Add more books to increase your inventory</li>
                <li>• Use high-quality images to attract more buyers</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
