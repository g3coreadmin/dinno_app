'use client';

import './globals.css';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === '/login';

  return (
    <html lang="pt-BR" className="h-full w-full">
      <body className={`h-full w-full ${!hideSidebar ? 'flex bg-gray-50' : 'bg-transparent'}`}>
        {!hideSidebar && <Sidebar />}
        <main className={`flex-1 ${!hideSidebar ? 'p-6' : ''}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
