'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiUsers, FiShoppingBag, FiPackage, FiSettings, FiMenu, FiX } from 'react-icons/fi';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: <FiHome className="h-5 w-5" /> },
    { href: '/admin/products', label: 'Products', icon: <FiShoppingBag className="h-5 w-5" /> },
    { href: '/admin/orders', label: 'Orders', icon: <FiPackage className="h-5 w-5" /> },
    { href: '/admin/users', label: 'Users', icon: <FiUsers className="h-5 w-5" /> },
    { href: '/admin/settings', label: 'Settings', icon: <FiSettings className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-indigo-800 text-white w-64 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'fixed inset-y-0 left-0 z-40' : 'fixed inset-y-0 -left-64 lg:left-0 lg:relative z-40'
        }`}
      >
        <div className="p-6 border-b border-indigo-700">
          <Link href="/admin" className="text-2xl font-bold">
            Admin Panel
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    pathname === item.href
                      ? 'bg-indigo-700 text-white'
                      : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-indigo-700">
          <Link
            href="/"
            className="flex items-center p-3 rounded-md text-indigo-200 hover:bg-indigo-700 hover:text-white transition-colors"
          >
            <span className="mr-3">🏠</span>
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
} 