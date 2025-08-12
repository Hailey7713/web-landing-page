import React, { useState } from 'react';
import { FiEdit, FiChevronRight, FiShoppingBag, FiLock, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../App.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample user data
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
  });

  const [addresses] = useState([
    {
      id: 1,
      name: 'Home',
      address: '123 Main St, Apt 4B, Bangalore, Karnataka 560001',
      isDefault: true,
      phone: '+91 98765 43210'
    },
    {
      id: 2,
      name: 'Work',
      address: '456 Business Ave, Whitefield, Bangalore, Karnataka 560066',
      isDefault: false,
      phone: '+91 98765 43210'
    }
  ]);

  const [orders] = useState([
    {
      id: 'OD123456789',
      date: '15 May 2023',
      status: 'Delivered',
      items: [
        { name: 'Wireless Earbuds', price: 1799, quantity: 1, image: 'https://via.placeholder.com/60' },
      ],
      total: 1799
    },
    {
      id: 'OD123456788',
      date: '10 May 2023',
      status: 'Shipped',
      items: [
        { name: 'Smart Watch', price: 4999, quantity: 1, image: 'https://via.placeholder.com/60' }
      ],
      total: 4999
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically make an API call to update the user's information
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white py-3 px-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center">
          <Link to="/" className="mr-4">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-medium">My Account</h1>
        </div>
      </div>

      {/* Profile Summary */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700">
                <FiPlus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-800">Hello, {user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="text-gray-500 text-xs">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-4 px-2 text-center font-medium text-sm ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 px-2 text-center font-medium text-sm ${activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Orders
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`flex-1 py-4 px-2 text-center font-medium text-sm ${activeTab === 'addresses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Addresses
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded shadow-sm p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 text-sm font-medium flex items-center"
                >
                  <FiEdit className="mr-1" size={16} />
                  Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md shadow-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                    <input
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex py-2">
                  <span className="w-32 text-gray-500 text-sm">Name</span>
                  <span className="text-gray-800">{user.name}</span>
                </div>
                <div className="flex py-2">
                  <span className="w-32 text-gray-500 text-sm">Email</span>
                  <span className="text-gray-800">{user.email}</span>
                </div>
                <div className="flex py-2">
                  <span className="w-32 text-gray-500 text-sm">Mobile</span>
                  <span className="text-gray-800">{user.phone}</span>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <FiLock className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Password</h3>
                    <p className="text-xs text-gray-500">Last changed 3 months ago</p>
                  </div>
                </div>
                <button className="text-blue-600 text-sm font-medium">
                  Change
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-lg font-medium text-gray-800 mb-4">My Orders</h2>
            
            {orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded shadow-sm p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">Placed on {order.date}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 py-2">
                          <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                      <p className="text-sm">
                        <span className="text-gray-500">Total: </span>
                        <span className="font-medium">₹{order.total.toLocaleString()}</span>
                      </p>
                      <button className="text-blue-600 text-sm font-medium flex items-center">
                        View Details <FiChevronRight className="ml-1" size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded shadow">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiShoppingBag className="text-gray-400" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No Orders Yet</h3>
                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-800">Saved Addresses</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 flex items-center">
                <FiPlus className="mr-1" size={16} />
                Add New Address
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(address => (
                <div key={address.id} className={`border rounded-lg p-4 ${address.isDefault ? 'border-blue-500 border-2' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-800">{address.name}</h4>
                      {address.isDefault && (
                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit size={16} />
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{address.address}</p>
                  <p className="mt-1 text-sm text-gray-500">Phone: {address.phone}</p>
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    {!address.isDefault && (
                      <button className="text-blue-600 text-sm font-medium">
                        Set as Default
                      </button>
                    )}
                    <button className="ml-4 text-red-600 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
