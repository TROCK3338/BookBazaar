'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function AddBookPage() {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stock: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      setLoading(false);
      return;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError('Valid stock quantity is required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          image_url: formData.image_url.trim() || null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Book added successfully!');
        setTimeout(() => {
          router.push('/dashboard/books');
        }, 2000);
      } else {
        setError(data.error || 'Failed to add book');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout currentPage="add-book">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Book</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Fill in the details to add a book to your inventory</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                className="input-field"
                placeholder="Enter book title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  required
                  min="0"
                  className="input-field"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL (optional)
              </label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                className="input-field"
                placeholder="https://example.com/book-cover.jpg"
                value={formData.image_url}
                onChange={handleChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                Provide a direct URL to the book cover image
              </p>
            </div>

            {/* Preview */}
            {formData.image_url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Preview
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <img
                    src={formData.image_url}
                    alt="Book cover preview"
                    className="w-32 h-40 object-cover rounded-lg mx-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      setError('Invalid image URL. Please check the URL and try again.');
                    }}
                    onLoad={() => setError('')}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {loading ? 'Adding Book...' : 'Add Book'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/dashboard/books')}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Tips Card */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">📝 Tips for Adding Books</h3>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Use clear, descriptive titles that customers will search for</li>
            <li>• Set competitive prices based on book condition and market value</li>
            <li>• Keep accurate stock counts to avoid overselling</li>
            <li>• Use high-quality book cover images for better visibility</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
