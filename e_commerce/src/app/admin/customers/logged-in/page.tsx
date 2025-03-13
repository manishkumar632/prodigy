'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, FiClock, FiMail, FiArrowLeft,
  FiLogOut, FiRefreshCw, FiCheck
} from 'react-icons/fi';
import Link from 'next/link';

// Mock active sessions data
const mockActiveSessions = [
  {
    id: 'session1',
    userId: 'u1',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'user',
    lastActive: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    device: 'Chrome on Windows',
    ip: '192.168.1.1',
  },
  {
    id: 'session2',
    userId: 'u2',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    role: 'user',
    lastActive: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    device: 'Safari on macOS',
    ip: '192.168.1.2',
  },
  {
    id: 'session3',
    userId: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    lastActive: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
    device: 'Firefox on Windows',
    ip: '192.168.1.3',
  },
  {
    id: 'session4',
    userId: 'u3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'user',
    lastActive: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    device: 'Chrome on Android',
    ip: '192.168.1.4',
  },
];

export default function LoggedInUsersPage() {
  const [activeSessions, setActiveSessions] = useState(mockActiveSessions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Simulate refreshing the active sessions
  const refreshSessions = () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Update last active times
      setActiveSessions(prev => 
        prev.map(session => ({
          ...session,
          lastActive: new Date().toISOString(),
        }))
      );
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Simulate ending a user session
  const endUserSession = (sessionId: string) => {
    if (window.confirm('Are you sure you want to end this user session?')) {
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    }
  };
  
  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    
    if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
      return `${diffMin} minutes ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Link
            href="/admin/customers"
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Users</h1>
            <p className="text-gray-600">Currently logged-in users on the platform</p>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={refreshSessions}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isRefreshing ? (
              <>
                <FiRefreshCw className="animate-spin mr-2 -ml-1 h-5 w-5" />
                Refreshing...
              </>
            ) : (
              <>
                <FiRefreshCw className="mr-2 -ml-1 h-5 w-5" />
                Refresh
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Active Sessions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {activeSessions.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No active user sessions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeSessions.map((session) => (
                  <motion.tr key={session.id} variants={itemVariants} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 rounded-full flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{session.name}</div>
                          <div className="text-sm text-gray-500">{session.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        session.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {session.role === 'admin' ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {session.device}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {session.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-1.5 h-4 w-4 text-gray-400" />
                        {formatTimeAgo(session.lastActive)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => endUserSession(session.id)}
                        className="text-red-600 hover:text-red-900"
                        title="End Session"
                      >
                        <FiLogOut className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      
      {/* Session Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Total Active Sessions</h2>
          <p className="text-3xl font-bold text-indigo-600">{activeSessions.length}</p>
          <div className="mt-2 flex items-center text-sm text-green-600">
            <FiCheck className="mr-1.5 h-4 w-4" />
            <span>All sessions active</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Admin Users</h2>
          <p className="text-3xl font-bold text-purple-600">
            {activeSessions.filter(session => session.role === 'admin').length}
          </p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <FiUser className="mr-1.5 h-4 w-4" />
            <span>Active administrators</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Customer Users</h2>
          <p className="text-3xl font-bold text-blue-600">
            {activeSessions.filter(session => session.role === 'user').length}
          </p>
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <FiUser className="mr-1.5 h-4 w-4" />
            <span>Active customers</span>
          </div>
        </div>
      </div>
    </div>
  );
} 