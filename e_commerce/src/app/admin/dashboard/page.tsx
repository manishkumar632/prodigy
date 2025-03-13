'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiShoppingBag, FiUsers, FiDollarSign, FiPackage, 
  FiTrendingUp, FiTrendingDown, FiAlertCircle, FiEye,
  FiCalendar, FiClock
} from 'react-icons/fi';
import Link from 'next/link';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for dashboard
const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Sales',
      data: [12500, 19200, 15700, 18900, 24600, 27800],
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 2,
    },
  ],
};

const categoryData = {
  labels: ['Men\'s Clothing', 'Women\'s Clothing', 'Accessories', 'Footwear', 'Home & Living'],
  datasets: [
    {
      data: [35, 30, 15, 12, 8],
      backgroundColor: [
        'rgba(99, 102, 241, 0.7)',
        'rgba(79, 70, 229, 0.7)',
        'rgba(67, 56, 202, 0.7)',
        'rgba(55, 48, 163, 0.7)',
        'rgba(49, 46, 129, 0.7)',
      ],
      borderColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(79, 70, 229, 1)',
        'rgba(67, 56, 202, 1)',
        'rgba(55, 48, 163, 1)',
        'rgba(49, 46, 129, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const visitorData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Visitors',
      data: [1200, 1900, 1700, 1600, 2100, 2500, 2200],
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

const recentOrders = [
  { id: 'ORD-7829', customer: 'John Smith', date: '2023-03-08', total: 129.99, status: 'Delivered' },
  { id: 'ORD-7830', customer: 'Emily Johnson', date: '2023-03-08', total: 79.95, status: 'Processing' },
  { id: 'ORD-7831', customer: 'Michael Brown', date: '2023-03-07', total: 249.50, status: 'Shipped' },
  { id: 'ORD-7832', customer: 'Jessica Williams', date: '2023-03-07', total: 54.99, status: 'Delivered' },
  { id: 'ORD-7833', customer: 'David Miller', date: '2023-03-06', total: 189.99, status: 'Processing' },
];

const lowStockProducts = [
  { id: 'P-1234', name: 'Classic Oxford Shirt', category: 'Men\'s Clothing', stock: 3, threshold: 5 },
  { id: 'P-2345', name: 'Slim Fit Jeans', category: 'Men\'s Clothing', stock: 2, threshold: 5 },
  { id: 'P-3456', name: 'Leather Crossbody Bag', category: 'Accessories', stock: 4, threshold: 5 },
  { id: 'P-4567', name: 'Cashmere Sweater', category: 'Women\'s Clothing', stock: 1, threshold: 5 },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('month');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };
  
  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: false,
      },
    },
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your store dashboard</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-3 py-1 text-sm rounded-md ${
                timeRange === 'year'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
              <FiDollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{formatCurrency(118900)}</div>
                  <div className="flex items-center text-sm text-green-600">
                    <FiTrendingUp className="h-4 w-4 mr-1" />
                    <span>12.5% increase</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
              <FiShoppingBag className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">1,248</div>
                  <div className="flex items-center text-sm text-green-600">
                    <FiTrendingUp className="h-4 w-4 mr-1" />
                    <span>8.2% increase</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
              <FiUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">892</div>
                  <div className="flex items-center text-sm text-green-600">
                    <FiTrendingUp className="h-4 w-4 mr-1" />
                    <span>5.7% increase</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-full p-3">
              <FiPackage className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">156</div>
                  <div className="flex items-center text-sm text-red-600">
                    <FiTrendingDown className="h-4 w-4 mr-1" />
                    <span>2.3% decrease</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Overview</h2>
          <Bar data={salesData} options={barChartOptions} height={100} />
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Visitor Statistics</h2>
          <Line data={visitorData} options={lineChartOptions} height={100} />
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6 lg:col-span-1"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h2>
          <Doughnut data={categoryData} options={doughnutChartOptions} />
        </motion.div>
        
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-lg shadow-md p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-indigo-600 hover:text-indigo-900">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      
      {/* Low Stock Alert */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Low Stock Alert</h2>
          </div>
          <Link href="/admin/products" className="text-sm text-indigo-600 hover:text-indigo-900">
            View all products
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lowStockProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    {product.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock <= 1 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link href={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                      Restock
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Recent Activity */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="flow-root">
          <ul className="-mb-8">
            <li>
              <div className="relative pb-8">
                <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center ring-8 ring-white">
                      <FiShoppingBag className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">New order</span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Order #ORD-7834 was placed by Alex Thompson
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span>10 minutes ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-white">
                      <FiUsers className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">New customer</span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Rachel Green created an account
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span>30 minutes ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative pb-8">
                <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center ring-8 ring-white">
                      <FiPackage className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">Product update</span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Inventory updated for "Slim Fit Jeans"
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span>1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="relative">
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center ring-8 ring-white">
                      <FiEye className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">Product review</span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        New 5-star review for "Leather Crossbody Bag"
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
} 