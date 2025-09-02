'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  created_at: string;
  bookCount: number;
  saleCount: number;
  totalRevenue: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  });
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setEditForm({
          name: data.user.name,
          email: data.user.email
        });
      } else {
        setError(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      name: profile?.name || '',
      email: profile?.email || ''
    });
    setUpdateError('');
    setUpdateSuccess('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile({ ...profile!, ...editForm });
        setIsEditing(false);
        setUpdateSuccess('Profile updated successfully!');
      } else {
        setUpdateError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setUpdateError('Network error. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="profile">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout currentPage="profile">
        <div className="text-center py-12">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading profile</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="profile">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and view your seller statistics</p>
        </div>

        {updateSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {updateSuccess}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Account Information</h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Edit
                </button>
              )}
            </div>

            {updateError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {updateError}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="input-field"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    className="input-field"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>

                <div className="flex flex-col xs:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col xs:flex-row xs:items-center gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{profile.name}</h3>
                    <p className="text-gray-600 truncate">{profile.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Member since:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(profile.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Statistics */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Seller Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">📚</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-blue-900 text-sm sm:text-base">Total Books</p>
                    <p className="text-xs sm:text-sm text-blue-600">Books in your inventory</p>
                  </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-blue-600 flex-shrink-0 ml-2">{profile.bookCount}</span>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">💰</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-green-900 text-sm sm:text-base">Total Revenue</p>
                    <p className="text-xs sm:text-sm text-green-600">All-time sales revenue</p>
                  </div>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-green-600 flex-shrink-0 ml-2">
                  ₹{profile.totalRevenue.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center min-w-0 flex-1">
                  <span className="text-xl sm:text-2xl mr-3 flex-shrink-0">📊</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-purple-900 text-sm sm:text-base">Total Sales</p>
                    <p className="text-xs sm:text-sm text-purple-600">Number of sales made</p>
                  </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-purple-600 flex-shrink-0 ml-2">{profile.saleCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Change Password</h3>
              <p className="text-sm text-gray-600 mb-4">
                Update your account password for better security
              </p>
              <button className="btn-secondary text-sm">
                Change Password
              </button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Account Security</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review your account security settings
              </p>
              <button className="btn-secondary text-sm">
                Security Settings
              </button>
            </div>
          </div>
        </div>

        {/* Success Tips */}
        <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <h2 className="text-base sm:text-xl font-semibold text-blue-900 mb-4">💡 Tips for Success</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
            <div>
              <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Grow Your Inventory</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• Add more books to increase sales opportunities</li>
                <li>• Use high-quality images for better visibility</li>
                <li>• Keep your book descriptions detailed and accurate</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">Optimize Performance</h3>
              <ul className="space-y-1 text-blue-700">
                <li>• Monitor your sales analytics regularly</li>
                <li>• Update stock levels to avoid overselling</li>
                <li>• Respond quickly to customer inquiries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}