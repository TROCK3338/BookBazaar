'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';

interface Book {
  id: number;
  title: string;
  price: string;
  stock: number;
  image_url?: string;
  created_at: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    price: '',
    stock: '',
    image_url: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();

      if (response.ok) {
        setBooks(data.books);
      } else {
        setError(data.error || 'Failed to fetch books');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBooks(books.filter(book => book.id !== bookId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete book');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setEditForm({
      title: book.title,
      price: book.price,
      stock: book.stock.toString(),
      image_url: book.image_url || ''
    });
    setError('');
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setUpdating(true);
    setError('');

    try {
      const response = await fetch(`/api/books/${editingBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editForm.title.trim(),
          price: parseFloat(editForm.price),
          stock: parseInt(editForm.stock),
          image_url: editForm.image_url.trim() || null
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBooks(books.map(book => 
          book.id === editingBook.id ? data.book : book
        ));
        setEditingBook(null);
      } else {
        setError(data.error || 'Failed to update book');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
    setError('');
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="books">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="books">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
            <p className="text-gray-600 mt-2">Manage your book inventory</p>
          </div>
          <Link
            href="/dashboard/add-book"
            className="btn-primary flex items-center"
          >
            <span className="mr-2">➕</span>
            Add New Book
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {books.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books yet</h3>
            <p className="text-gray-600 mb-6">Start building your inventory by adding your first book.</p>
            <Link href="/dashboard/add-book" className="btn-primary">
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book.id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-col h-full">
                  {book.image_url ? (
                    <img
                      src={book.image_url}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-4xl">📖</span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold text-green-600">₹{book.price}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Stock:</span>
                        <span className={`font-semibold ${
                          book.stock > 10 ? 'text-green-600' : 
                          book.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {book.stock} units
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Added:</span>
                        <span className="text-sm text-gray-900">
                          {formatDate(book.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditBook(book)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg font-medium transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg font-medium transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Book Modal */}
        {editingBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Edit Book: {editingBook.title}
                </h3>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleUpdateBook} className="space-y-4">
                  <div>
                    <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      id="edit-title"
                      type="text"
                      required
                      className="input-field"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹)
                      </label>
                      <input
                        id="edit-price"
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="input-field"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock
                      </label>
                      <input
                        id="edit-stock"
                        type="number"
                        required
                        min="0"
                        className="input-field"
                        value={editForm.stock}
                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL (optional)
                    </label>
                    <input
                      id="edit-image"
                      type="url"
                      className="input-field"
                      value={editForm.image_url}
                      onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updating}
                      className="flex-1 btn-primary disabled:opacity-50"
                    >
                      {updating ? 'Updating...' : 'Update Book'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
