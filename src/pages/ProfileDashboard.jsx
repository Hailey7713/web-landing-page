import React, { useState, useEffect, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile, updateEmail } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCheck, FaShoppingBag, FaCamera, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import './ProfileDashboard.css';

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState('');
  const [orders, setOrders] = useState([]);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Function to get Gravatar URL
  const getGravatarUrl = (email, size = 150) => {
    if (!email) return '';
    const emailHash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
    return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=identicon`;
  };

  // Fetch user data on component mount
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Get user data from localStorage or initialize if not exists
    const userData = JSON.parse(localStorage.getItem('userProfileData') || '{}');
    
    // Set Gravatar URL as default if no photoURL exists
    const defaultPhotoUrl = currentUser.photoURL || getGravatarUrl(currentUser.email, 150);
    
    setUser(currentUser);
    setPhotoURL(defaultPhotoUrl);
    setFormData({
      displayName: currentUser.displayName || '',
      email: currentUser.email || '',
      phone: userData.phone || '',
      address: userData.address || ''
    });

    // Load orders from localStorage
    const userOrders = JSON.parse(localStorage.getItem('userOrders') || '{}');
    const userOrderHistory = userOrders[currentUser.uid] || [];
    
    // Sort orders by date (newest first)
    const sortedOrders = [...userOrderHistory].sort((a, b) => 
      new Date(b.orderDate) - new Date(a.orderDate)
    );
    
    setOrders(sortedOrders);
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  // Function to compress image
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;
          
          // Calculate the new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress the image
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to Blob with quality 0.8 (80% quality)
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            0.8 // 0.8 quality (80%)
          );
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, etc.)');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setPhotoURL(previewUrl);
      
      // Compress the image
      const compressedFile = await compressImage(file);
      
      const auth = getAuth();
      const user = auth.currentUser;
      const storage = getStorage();
      const storageRef = ref(storage, `profile_photos/${user.uid}_${Date.now()}.jpg`);
      
      // Upload the compressed file with metadata
      const metadata = {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000', // Cache for 1 year
      };
      
      const uploadTask = uploadBytesResumable(storageRef, compressedFile, metadata);
      
      // Wait for upload to complete
      const snapshot = await uploadTask;
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update user profile with photo URL
      await updateProfile(user, {
        photoURL: downloadURL
      });
      
      // Update local state with the final URL
      setPhotoURL(downloadURL);
      setUser({
        ...user,
        photoURL: downloadURL
      });
      
      // Clean up the preview URL
      URL.revokeObjectURL(previewUrl);
      
      setSuccess('Profile photo updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      setError('Failed to upload profile photo. Please try again.');
      // Revert to previous photo on error
      setPhotoURL(user?.photoURL || '');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Validate address
    if (formData.address && formData.address.length < 10) {
      setError('Please enter a complete address (at least 10 characters)');
      return;
    }
    
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      // Update profile
      if (formData.displayName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: formData.displayName,
        });
      }
      
      // Update email if changed
      if (formData.email !== currentUser.email) {
        await updateEmail(currentUser, formData.email);
      }
      
      // Save phone and address to localStorage
      const userData = {
        phone: formData.phone,
        address: formData.address
      };
      localStorage.setItem('userProfileData', JSON.stringify(userData));
      
      // Update local state
      setUser({
        ...currentUser,
        displayName: formData.displayName,
        email: formData.email,
        phoneNumber: formData.phone,
        address: formData.address
      });
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile. Please try again.');
    }
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-dashboard">
      <div className="profile-container">
        <div className="profile-header">
          <div 
            className={`profile-avatar ${isEditing ? 'editable' : ''}`}
            onClick={handlePhotoClick}
            style={{ cursor: isEditing ? 'pointer' : 'default' }}
          >
            {isUploading ? (
              <div className="avatar-uploading">
                <FaSpinner className="spinner" />
              </div>
            ) : photoURL ? (
              <img 
                src={photoURL} 
                alt={user.displayName || 'User'} 
                onError={(e) => {
                  // If the image fails to load, fall back to Gravatar
                  if (user?.email) {
                    e.target.src = getGravatarUrl(user.email, 150);
                  } else {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }
                }}
              />
            ) : (
              <div className="avatar-placeholder">
                <FaUser size={48} />
              </div>
            )}
            {isEditing && (
              <div className="avatar-overlay">
                <FaCamera size={24} />
                <span>Change Photo</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <h2>{user.displayName || 'User Profile'}</h2>
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  <FaSave /> Save Changes
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data to current user data
                    setFormData({
                      displayName: user.displayName || '',
                      email: user.email || '',
                      phone: user.phoneNumber || '',
                      address: user.address || ''
                    });
                  }}
                >
                  <FaTimes /> Cancel
                </button>
              </>
            ) : (
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="profile-details">
          <div className="detail-item">
            <FaUser className="detail-icon" />
            <div className="detail-content">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <p>{user.displayName || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div className="detail-item">
            <FaEnvelope className="detail-icon" />
            <div className="detail-content">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                />
              ) : (
                <p>{user.email || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div className="detail-item">
            <FaPhone className="detail-icon" />
            <div className="detail-content">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your 10-digit phone number"
                  required
                />
              ) : (
                <p>{formData.phone || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <div className="detail-content">
              <label>Address</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your complete address"
                  required
                  rows="3"
                />
              ) : (
                <p>{formData.address ? formData.address.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              )) : 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="orders-section">
          <h3>Your Orders</h3>
          {isLoading ? (
            <div className="loading">Loading your orders...</div>
          ) : orders.length > 0 ? (
            <div className="orders-list">
              {orders.map((order, index) => (
                <div key={index} className="order-item">
                  <div className="order-header">
                    <span className="order-id">{order.orderNumber || `Order #${index + 1}`}</span>
                    <span className="order-date">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : new Date().toLocaleDateString()}
                    </span>
                    <span className="order-status successful">
                      <FaCheckCircle className="status-icon" /> Successful
                    </span>
                  </div>
                  <div className="order-details">
                    <div className="order-items">
                      {order.items && order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="order-item-detail">
                          <img 
                            src={item.image || 'https://via.placeholder.com/80'} 
                            alt={item.name} 
                            className="item-image"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/80';
                            }}
                          />
                          <div className="item-info">
                            <h4>{item.name || 'Product'}</h4>
                            <p>Quantity: {item.quantity || 1}</p>
                            <p>Price: ₹{item.price ? item.price.toFixed(2) : '0.00'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="order-summary">
                      <p>Total: <strong>₹{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</strong></p>
                      <p>Payment Method: <strong>{order.paymentMethod || 'Cash on Delivery'}</strong></p>
                      <p>Delivery Address: <br />{order.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders">
              <p>You haven't placed any orders yet.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/products')}
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="profile-actions" style={{ marginTop: '2rem', textAlign: 'center', padding: '1.5rem 0', borderTop: '1px solid #eee' }}>
          <button 
            className="btn btn-danger"
            onClick={handleLogout}
            style={{ 
              padding: '0.75rem 2rem', 
              fontSize: '1rem',
              borderRadius: '4px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
