'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import axios from 'axios';

interface Order {
  _id: string;
  user: {
    name: string;
  };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        setLoading(true);
        
        // In a real application, you would fetch this data from your API
        // const { data } = await axios.get('/api/admin/orders?limit=5');
        // setOrders(data);
        
        // Simulated data for development
        setOrders([
          {
            _id: '1',
            user: { name: 'John Doe' },
            totalPrice: 129.99,
            isPaid: true,
            isDelivered: false,
            createdAt: '2023-05-15T10:30:00Z',
          },
          {
            _id: '2',
            user: { name: 'Jane Smith' },
            totalPrice: 89.95,
            isPaid: true,
            isDelivered: true,
            createdAt: '2023-05-14T14:20:00Z',
          },
          {
            _id: '3',
            user: { name: 'Mike Johnson' },
            totalPrice: 199.99,
            isPaid: false,
            isDelivered: false,
            createdAt: '2023-05-14T09:15:00Z',
          },
          {
            _id: '4',
            user: { name: 'Sarah Williams' },
            totalPrice: 149.50,
            isPaid: true,
            isDelivered: false,
            createdAt: '2023-05-13T16:45:00Z',
          },
          {
            _id: '5',
            user: { name: 'David Brown' },
            totalPrice: 79.99,
            isPaid: true,
            isDelivered: true,
            createdAt: '2023-05-12T11:10:00Z',
          },
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="border-b border-gray-200 py-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{order._id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${order.totalPrice.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {order.isDelivered ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                ) : order.isPaid ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Paid
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FiExternalLink className="h-5 w-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 