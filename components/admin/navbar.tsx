'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Calendar, Ticket, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/concerts', label: 'จัดการงาน', icon: Ticket },
    { href: '/admin/calendar', label: 'ปฏิทิน', icon: Calendar },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Concert Admin</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="flex items-center space-x-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{session?.user?.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}