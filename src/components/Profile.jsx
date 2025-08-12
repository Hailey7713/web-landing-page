import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const auth = getAuth();

  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) {
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(true);

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          // If document exists, update the state with the data
          const data = userDoc.data();
          setUserData({
            name: data.name || user.displayName || '',
            email: user.email || data.email || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        } else {
          // If document doesn't exist, create it with default values
          const defaultData = {
            name: user.displayName || '',
            email: user.email || '',
            phone: '',
            address: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            uid: user.uid
          };
          
          await setDoc(userDocRef, defaultData);
          setUserData(defaultData);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const userDocRef = doc(db, 'users', user.uid);
      const dataToUpdate = {
        name: userData.name.trim(),
        phone: userData.phone.trim(),
        address: userData.address.trim(),
        updatedAt: serverTimestamp()
      };

      // Update the document in Firestore
      await setDoc(userDocRef, dataToUpdate, { merge: true });
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        ...dataToUpdate
      }));
      
      // Show success message and exit edit mode after a delay
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        setSuccess('');
        setIsEditing(false);
      }, 2000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
      
      // Auto-hide error after 3 seconds
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <div className="login-prompt">
          <h2>Please Sign In</h2>
          <p>You need to be signed in to view your profile.</p>
          <button 
            className="login-button"
            onClick={() => window.location.href = '/login'}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <h1>{userData.name || 'User Profile'}</h1>
        {!isEditing && (
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  disabled
                  className="disabled-input"
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={userData.address}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter your full address"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{userData.name || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{userData.email || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{userData.phone || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{userData.address || 'Not provided'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
