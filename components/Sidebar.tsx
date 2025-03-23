'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();

  // Divide a URL: ['', 'user', 'id', 'home']
  const segments = pathname.split('/');
  const userId = segments[2]; // Ex: '123'

  const links = [
    { name: 'Home', path: 'home' },
    { name: 'Gráficos', path: 'graficos' },
    { name: 'Tabelas', path: 'tabela' },
    { name: 'Perfil', path: 'profile'}
  ];

  return (
    <aside className="w-64 bg-green-600 text-white flex flex-col justify-between h-screen">
      <nav className="p-6 space-y-4">
        {links.map((link) => {
          const href = `/user/${userId}/${link.path}`;
          const isActive = pathname === href;

          return (
            <Link
              key={link.path}
              href={href}
              className={`block px-1 py-2 rounded hover:bg-green-700 transition ${
                isActive ? 'bg-green-700 font-semibold' : ''
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 flex justify-center">
        <Image src="/images/dinno_logo_no_bg.png" alt="Logo" width={100} height={100} />
      </div>
    </aside>
  );
}
