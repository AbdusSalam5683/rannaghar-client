import UserGuard from '@/components/shared/UserGuard';
import UserSidebar from '@/components/layout/UserSidebar';

export default function DashboardLayout({ children }) {
  return (
    <UserGuard>
      <div className="flex min-h-screen bg-gray-50 dark:bg-[#0A0505]">
        <UserSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </UserGuard>
  );
}