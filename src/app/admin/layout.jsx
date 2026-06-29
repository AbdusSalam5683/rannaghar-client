import AdminGuard from '@/components/shared/AdminGuard';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0A0505]">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </AdminGuard>
  );
}