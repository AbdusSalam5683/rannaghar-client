'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import Loader from '@/components/shared/Loader';
import Pagination from '@/components/shared/Pagination';
import { toast } from 'react-hot-toast';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/payments/transactions?page=${pagination.page}&limit=${pagination.limit}`);
      setTransactions(data.data.transactions || []);
      setPagination({
        ...pagination,
        total: data.data.pagination.total,
        pages: data.data.pagination.pages,
      });
    } catch (error) {
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-[#FDF8F2] dark:bg-[#0A0505] transition-colors duration-300 min-h-screen py-8">
      <div className="container-custom max-w-6xl">
        <h1 className="text-3xl font-bold font-['Playfair_Display'] text-[#2C1A0E] dark:text-[#F5D9B0] mb-2">
          💰 Transactions
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          {pagination.total} total transactions
        </p>

        <div className="bg-white dark:bg-[#1A0F0A] rounded-2xl border border-gray-200 dark:border-[#2C1608] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0A0505] border-b border-gray-200 dark:border-[#2C1608]">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">User</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Transaction ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-gray-100 dark:border-[#2C1608] hover:bg-gray-50 dark:hover:bg-[#0A0505] transition"
                  >
                    <td className="px-4 py-3 text-sm text-[#2C1A0E] dark:text-[#F5D9B0]">
                      {tx.userId?.name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-[#2C1A0E] dark:text-[#F5D9B0]">
                      ${tx.amount}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                        {tx.paymentType === 'premium_membership' ? 'Premium' : 'Recipe'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.paymentStatus === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}>
                        {tx.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {tx.transactionId?.slice(0, 12)}...
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(tx.paidAt || tx.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {transactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
            </div>
          )}
        </div>

        {pagination.pages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
          />
        )}
      </div>
    </div>
  );
}