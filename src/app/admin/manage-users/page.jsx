'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Loader from '@/components/shared/Loader';
import { FaSearch, FaBan, FaCheckCircle, FaCrown } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Swal from 'sweetalert2';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users/all');
      setUsers(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async (userId, currentStatus) => {
    const action = currentStatus ? 'Unblock' : 'Block';
    const result = await Swal.fire({
      title: `${action} User?`,
      text: `Are you sure you want to ${action.toLowerCase()} this user?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E07B39',
      cancelButtonColor: '#6B4A28',
      confirmButtonText: `Yes, ${action}`,
    });

    if (result.isConfirmed) {
      try {
        const endpoint = currentStatus ? 'unblock' : 'block';
        await api.patch(`/users/${userId}/${endpoint}`);
        toast.success(`User ${endpoint}ed successfully`);
        fetchUsers();
      } catch (error) {
        toast.error(`Failed to ${currentStatus ? 'unblock' : 'block'} user`);
      }
    }
  };

  const handleMakePremium = async (userId) => {
    const result = await Swal.fire({
      title: 'Make Premium?',
      text: 'Are you sure you want to make this user premium?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#E07B39',
      cancelButtonColor: '#6B4A28',
      confirmButtonText: 'Yes, make premium',
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/users/${userId}/premium`);
        toast.success('User is now premium');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to make premium');
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 min-h-screen py-8">
      <div className="container-custom max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0]">
              👥 Manage Users
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {users.length} total users
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-[#1A0F0A] border border-gray-200 dark:border-[#2C1608] rounded-lg px-4 py-2 w-full md:w-64">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent focus:outline-none text-[#2C1A0E] dark:text-[#F5D9B0] w-full"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A0F0A] rounded-2xl border border-gray-200 dark:border-[#2C1608] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0A0505] border-b border-gray-200 dark:border-[#2C1608]">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-100 dark:border-[#2C1608] hover:bg-gray-50 dark:hover:bg-[#0A0505] transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={user.image || 'https://ui-avatars.com/api/?name=User'}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-[#2C1A0E] dark:text-[#F5D9B0]">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {user.role || 'user'}
                      </span>
                      {user.isPremium && (
                        <span className="ml-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                          Premium
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isBlocked
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      }`}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {user.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                              className={`p-2 rounded-lg transition ${
                                user.isBlocked
                                  ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                                  : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                              }`}
                              title={user.isBlocked ? 'Unblock' : 'Block'}
                            >
                              {user.isBlocked ? <FaCheckCircle size={18} /> : <FaBan size={18} />}
                            </button>
                            <button
                              onClick={() => handleMakePremium(user._id)}
                              className="p-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition"
                              title="Make Premium"
                            >
                              <FaCrown size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}