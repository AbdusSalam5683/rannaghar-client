'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Loader from '@/components/shared/Loader';
import { FaCheckCircle, FaTrash, FaTimes } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import Link from 'next/link';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.get('/reports/all');
      setReports(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    const result = await Swal.fire({
      title: 'Dismiss Report?',
      text: 'Are you sure you want to dismiss this report?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#E07B39',
      cancelButtonColor: '#6B4A28',
      confirmButtonText: 'Yes, dismiss',
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/reports/${id}/dismiss`);
        toast.success('Report dismissed');
        fetchReports();
      } catch (error) {
        toast.error('Failed to dismiss');
      }
    }
  };

  const handleRemoveRecipe = async (id) => {
    const result = await Swal.fire({
      title: 'Remove Recipe?',
      text: 'This will permanently delete the recipe and resolve the report.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E07B39',
      cancelButtonColor: '#6B4A28',
      confirmButtonText: 'Yes, remove',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/reports/${id}/remove`);
        toast.success('Recipe removed successfully');
        fetchReports();
      } catch (error) {
        toast.error('Failed to remove');
      }
    }
  };

  if (loading) return <Loader />;

  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 min-h-screen py-8">
      <div className="container-custom max-w-5xl">
        <h1 className="text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-2">
          🚩 Reports
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {pendingReports.length} pending report{pendingReports.length !== 1 ? 's' : ''}
        </p>

        {pendingReports.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#1A0F0A] rounded-2xl border border-gray-200 dark:border-[#2C1608]">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-[#2C1A0E] dark:text-[#F5D9B0]">
              All clear!
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              No pending reports to review
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingReports.map((report) => (
              <div
                key={report._id}
                className="bg-white dark:bg-[#1A0F0A] rounded-2xl p-6 border border-gray-200 dark:border-[#2C1608]"
              >
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
                        {report.reason}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Reported by {report.reporterEmail}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {report.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        {report.description}
                      </p>
                    )}
                    {report.recipeId && (
                      <Link
                        href={`/recipe/${report.recipeId._id}`}
                        className="mt-2 inline-block text-sm text-[#E07B39] hover:underline"
                      >
                        View Recipe: {report.recipeId.recipeName}
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleRemoveRecipe(report._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 text-sm"
                    >
                      <FaTrash size={14} /> Remove Recipe
                    </button>
                    <button
                      onClick={() => handleDismiss(report._id)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-2 text-sm"
                    >
                      <FaTimes size={14} /> Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}