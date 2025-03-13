'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail, FiMessageSquare, FiSend, FiTrash2, 
  FiChevronDown, FiChevronUp, FiSearch, FiFilter, FiCheck 
} from 'react-icons/fi';
import Link from 'next/link';

// Mock messages data
const mockMessages = [
  {
    id: 1,
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    subject: 'Product Inquiry',
    message: 'Hello, I was wondering if the Classic Oxford Shirt comes in navy blue? The website only shows white, blue, and black options. Thanks!',
    date: '2023-03-08T14:30:00',
    read: false,
    replied: false
  },
  {
    id: 2,
    name: 'David Lee',
    email: 'david@example.com',
    subject: 'Return Request',
    message: 'I received my order yesterday but the size is too small. I ordered a medium but I think I need a large. What is your return policy and how can I exchange it?',
    date: '2023-03-07T10:15:00',
    read: true,
    replied: true
  },
  {
    id: 3,
    name: 'Lisa Chen',
    email: 'lisa@example.com',
    subject: 'Shipping Question',
    message: 'I placed an order 3 days ago but haven\'t received a shipping confirmation. Can you please check the status of my order #ORD-5678? Thank you!',
    date: '2023-03-07T09:45:00',
    read: false,
    replied: false
  },
  {
    id: 4,
    name: 'Michael Johnson',
    email: 'michael@example.com',
    subject: 'Website Feedback',
    message: 'I just wanted to say that your new website design is fantastic! It\'s much easier to navigate and find products. Great job to your team!',
    date: '2023-03-06T16:20:00',
    read: true,
    replied: false
  },
  {
    id: 5,
    name: 'Emma Davis',
    email: 'emma@example.com',
    subject: 'Discount Code Issue',
    message: 'I tried using the SUMMER20 discount code at checkout but it says it\'s invalid. Your email promotion said it\'s valid until the end of the month. Can you help?',
    date: '2023-03-05T11:30:00',
    read: true,
    replied: true
  }
];

export default function AdminMessages() {
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'unread', 'replied', 'unreplied'
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Filter and sort messages
  const filteredMessages = messages
    .filter(message => {
      // Apply search filter
      const searchMatch = 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply status filter
      let statusMatch = true;
      if (filterStatus === 'unread') statusMatch = !message.read;
      else if (filterStatus === 'replied') statusMatch = message.replied;
      else if (filterStatus === 'unreplied') statusMatch = !message.replied;
      
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        // Default sort by date
        return sortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleMessageClick = (id: number) => {
    setSelectedMessage(id);
    
    // Mark as read if it wasn't already
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === id ? { ...message, read: true } : message
      )
    );
    
    // Clear reply text when selecting a new message
    setReplyText('');
  };
  
  const handleReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    // In a real app, you would send the reply to an API
    // For this demo, we'll just mark the message as replied
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === selectedMessage ? { ...message, replied: true } : message
      )
    );
    
    // Clear reply text
    setReplyText('');
    
    // Show success message (in a real app)
    alert('Reply sent successfully!');
  };
  
  const handleDeleteMessage = (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prevMessages => prevMessages.filter(message => message.id !== id));
      if (selectedMessage === id) {
        setSelectedMessage(null);
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Manage customer inquiries and messages</p>
        </div>
      </div>
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="w-full md:w-1/3">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search messages..."
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setFilterStatus(
                    filterStatus === 'all' ? 'unread' : 
                    filterStatus === 'unread' ? 'replied' : 
                    filterStatus === 'replied' ? 'unreplied' : 'all'
                  )}
                >
                  <FiFilter className="mr-2 h-5 w-5 text-gray-400" />
                  {filterStatus === 'all' ? 'All Messages' : 
                   filterStatus === 'unread' ? 'Unread' : 
                   filterStatus === 'replied' ? 'Replied' : 'Unreplied'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Messages List */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Inbox</h2>
                <span className="text-sm text-gray-500">{filteredMessages.length} messages</span>
              </div>
            </div>
            
            {filteredMessages.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No messages found
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto"
              >
                {filteredMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={itemVariants}
                    className={`p-4 cursor-pointer ${
                      selectedMessage === message.id ? 'bg-indigo-50' : 'hover:bg-gray-50'
                    } ${!message.read ? 'border-l-4 border-indigo-500' : ''}`}
                    onClick={() => handleMessageClick(message.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${!message.read ? 'text-indigo-600' : 'text-gray-900'}`}>
                          {message.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{message.subject}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex flex-col items-end">
                        <p className="text-xs text-gray-500">
                          {new Date(message.date).toLocaleDateString()}
                        </p>
                        {message.replied && (
                          <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <FiCheck className="mr-1 h-3 w-3" />
                            Replied
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {message.message}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Message Detail */}
        <div className="lg:w-2/3">
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
              {/* Message Header */}
              {messages.filter(m => m.id === selectedMessage).map(message => (
                <div key={message.id} className="flex flex-col h-full">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">{message.subject}</h2>
                        <p className="text-sm text-gray-600">
                          From: {message.name} &lt;{message.email}&gt;
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(message.date)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Message Body */}
                  <div className="px-6 py-4 flex-grow overflow-y-auto">
                    <p className="text-gray-800 whitespace-pre-line">{message.message}</p>
                  </div>
                  
                  {/* Reply Section */}
                  <div className="px-6 py-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Reply</h3>
                    <div className="mb-3">
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply here..."
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          !replyText.trim() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        <FiSend className="mr-2 -ml-1 h-5 w-5" />
                        Send Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <FiMessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No message selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a message from the list to view its details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 