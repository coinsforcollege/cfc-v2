import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout = ({
  children,
  stats = {},
  searchPlaceholder
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const getRoleTitle = (role) => {
    switch (role) {
      case 'student':
        return 'Student Dashboard';
      case 'college_admin':
        return 'College Admin';
      case 'platform_admin':
        return 'Platform Admin';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader
        onMenuClick={() => setMobileMenuOpen(prev => !prev)}
        mobileMenuOpen={mobileMenuOpen}
        searchPlaceholder={searchPlaceholder}
      />

      <div className="flex" style={{ paddingTop: '64px' }}>
        {/* Desktop Sidebar */}
        <div className="hidden lg:block sticky h-screen" style={{ top: '64px', height: 'calc(100vh - 64px)' }}>
          <DashboardSidebar stats={stats} />
        </div>

        {/* Mobile Sidebar Drawer */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0" style={{ width: '260px', maxWidth: '80vw', paddingTop: '64px', zIndex: 1301 }}>
            <DashboardSidebar stats={stats} onNavigate={handleCloseMobileMenu} />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="container mx-auto p-4 lg:p-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
