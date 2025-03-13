'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  FiHome, FiShoppingBag, FiUsers, FiShoppingCart, 
  FiMessageSquare, FiSettings, FiLogOut, FiMenu, 
  FiX, FiChevronDown, FiChevronUp, FiPlusCircle,
  FiBarChart2, FiGrid, FiEdit, FiLoader
} from 'react-icons/fi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Check if user is authenticated and is admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated' && !session?.user?.isAdmin) {
      router.push('/');
    }
  }, [status, session, router]);
  
  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  
  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle dropdown toggle
  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };
  
  // Check if a route is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  // Don't render anything while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <FiLoader className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Don't render the admin layout if not authenticated or not admin
  if (status === 'unauthenticated' || (status === 'authenticated' && !session?.user?.isAdmin)) {
    return null;
  }
  
  // Navigation items with dropdowns
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: FiBarChart2 
    },
    { 
      name: 'Products', 
      icon: FiShoppingBag,
      dropdown: true,
      items: [
        { name: 'All Products', path: '/admin/products' },
        { name: 'Add Product', path: '/admin/products/add' },
        { name: 'Categories', path: '/admin/products/categories' }
      ]
    },
    { 
      name: 'Orders', 
      path: '/admin/orders', 
      icon: FiShoppingCart 
    },
    { 
      name: 'Customers', 
      path: '/admin/customers', 
      icon: FiUsers 
    },
    { 
      name: 'Messages', 
      path: '/admin/messages', 
      icon: FiMessageSquare 
    },
    { 
      name: 'Settings', 
      path: '/admin/settings', 
      icon: FiSettings 
    }
  ];
  
  // Animation variants
  const sidebarVariants = {
    open: { 
      width: '16rem',
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      width: '5rem',
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };
  
  const mobileMenuVariants = {
    open: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    },
    closed: { 
      x: '-100%',
      opacity: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    }
  };
  
  const dropdownVariants = {
    open: { 
      height: 'auto',
      opacity: 1,
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      } 
    },
    closed: { 
      height: 0,
      opacity: 0,
      transition: { 
        duration: 0.3,
        ease: 'easeInOut'
      } 
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed top-0 left-0 bottom-0 w-64 bg-white z-30 lg:hidden overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <Link href="/admin/dashboard" className="flex items-center">
                <span className="text-xl font-bold text-indigo-600">StyleHub</span>
                <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(item.name)}
                          className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                            activeDropdown === item.name ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center">
                            <item.icon className="h-5 w-5 mr-3" />
                            <span>{item.name}</span>
                          </div>
                          {activeDropdown === item.name ? (
                            <FiChevronUp className="h-4 w-4" />
                          ) : (
                            <FiChevronDown className="h-4 w-4" />
                          )}
                        </button>
                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.ul
                              initial="closed"
                              animate="open"
                              exit="closed"
                              variants={dropdownVariants}
                              className="mt-1 pl-10 overflow-hidden"
                            >
                              {item.items.map((subItem) => (
                                <li key={subItem.name}>
                                  <Link
                                    href={subItem.path}
                                    className={`block px-4 py-2 text-sm rounded-md ${
                                      isActive(subItem.path) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    {subItem.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.path}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                          isActive(item.path) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
                <li>
                  <Link
                    href="/"
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <FiLogOut className="h-5 w-5 mr-3" />
                    <span>Back to Store</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Desktop Sidebar */}
      <motion.div
        variants={sidebarVariants}
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        className={`fixed top-0 left-0 bottom-0 bg-white border-r border-gray-200 z-10 hidden lg:block overflow-y-auto`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center">
            {isSidebarOpen ? (
              <>
                <span className="text-xl font-bold text-indigo-600">StyleHub</span>
                <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
              </>
            ) : (
              <span className="text-xl font-bold text-indigo-600">SH</span>
            )}
          </Link>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isSidebarOpen ? (
              <FiChevronUp className="h-5 w-5 rotate-90" />
            ) : (
              <FiChevronDown className="h-5 w-5 -rotate-90" />
            )}
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md ${
                        activeDropdown === item.name ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        {isSidebarOpen && <span>{item.name}</span>}
                      </div>
                      {isSidebarOpen && (
                        activeDropdown === item.name ? (
                          <FiChevronUp className="h-4 w-4" />
                        ) : (
                          <FiChevronDown className="h-4 w-4" />
                        )
                      )}
                    </button>
                    <AnimatePresence>
                      {activeDropdown === item.name && isSidebarOpen && (
                        <motion.ul
                          initial="closed"
                          animate="open"
                          exit="closed"
                          variants={dropdownVariants}
                          className="mt-1 pl-10 overflow-hidden"
                        >
                          {item.items.map((subItem) => (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.path}
                                className={`block px-4 py-2 text-sm rounded-md ${
                                  isActive(subItem.path) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive(item.path) ? 'text-indigo-600 bg-indigo-50' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {isSidebarOpen && <span>{item.name}</span>}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                <FiLogOut className="h-5 w-5 mr-3" />
                {isSidebarOpen && <span>Back to Store</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </motion.div>
      
      {/* Main Content */}
      <div className={`lg:ml-${isSidebarOpen ? '64' : '20'} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
                >
                  <FiMenu className="h-6 w-6" />
                </button>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                      {session?.user?.name?.[0] || 'A'}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {session?.user?.name || 'Admin User'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
} 