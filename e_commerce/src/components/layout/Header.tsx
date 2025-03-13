'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/providers/CartProvider';
import { useFavorites } from '@/providers/FavoritesProvider';

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
    closeMenu();
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/men', label: 'Men' },
    { href: '/women', label: 'Women' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            StyleHub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                  pathname === link.href ? 'text-indigo-600' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/favorites"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <div className="relative">
                <FiHeart className="h-6 w-6" />
                {totalFavorites > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalFavorites}
                  </span>
                )}
              </div>
            </Link>
            
            <Link
              href="/cart"
              className="text-gray-700 hover:text-indigo-600 transition-colors"
            >
              <div className="relative">
                <FiShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {session ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors">
                  <FiUser className="h-6 w-6" />
                  <span className="text-sm font-medium">
                    {session.user.name?.split(' ')[0]}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    Orders
                  </Link>
                  <Link
                    href="/favorites"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    Favorites
                  </Link>
                  {session.user.isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-indigo-600 ${
                      pathname === link.href ? 'text-indigo-600' : 'text-gray-700'
                    }`}
                    onClick={closeMenu}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/favorites"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-2"
                  onClick={closeMenu}
                >
                  <FiHeart className="h-5 w-5" />
                  <span>Favorites ({totalFavorites})</span>
                </Link>
                <Link
                  href="/cart"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-2"
                  onClick={closeMenu}
                >
                  <FiShoppingCart className="h-5 w-5" />
                  <span>Cart ({totalItems})</span>
                </Link>
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                      onClick={closeMenu}
                    >
                      Orders
                    </Link>
                    {session.user.isAdmin && (
                      <Link
                        href="/admin"
                        className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={closeMenu}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={closeMenu}
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 