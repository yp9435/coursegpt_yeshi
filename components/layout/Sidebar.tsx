'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard'},
    { name: 'My Courses', href: '/dashboard/courses'},
    { name: 'Create Course', href: '/create-course'},
    { name: 'Settings', href: '/dashboard/settings' }
  ];

  return (
    <aside className="w-64 bg-white border-r-4 border-black hidden md:block">
      <div className="h-full px-3 py-6 overflow-y-auto">
        <div className="nes-container with-title pixel-shadow mb-6">
          <p className="title">Menu</p>
          <ul className="space-y-4 py-2">
            {navItems.map(item => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center text-xs space-x-2 hover:opacity-70 pixel-transition ${
                    isActive(item.href) ? 'text-black' : 'text-gray-700'
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <i className="nes-icon is-small star"></i>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
    </div>
    </aside>
  );
}