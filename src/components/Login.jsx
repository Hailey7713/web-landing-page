import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithGoogle, 
  signUpWithEmail, 
  logInWithEmail, 
  auth, 
  signOut as logOut,
  signInWithPhone,
  verifyOTP,
  setUpRecaptcha
} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true); // Default to login view
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, loadingAuth] = useAuthState(auth);
  const recaptchaContainer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Pass state to indicate successful login
      navigate('/', { state: { fromLogin: true } });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  // Set up reCAPTCHA on component mount
  useEffect(() => {
    if (loginMethod === 'phone' && recaptchaContainer.current) {
      try {
        // Clear any existing reCAPTCHA
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
        }
        // Set up new reCAPTCHA
        setUpRecaptcha('recaptcha-container');
      } catch (error) {
        console.error('reCAPTCHA setup error:', error);
        setError('Failed to load reCAPTCHA. Please refresh the page and try again.');
      }
    }
  }, [loginMethod]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.phone) {
      setError('Please enter your phone number');
      setLoading(false);
      return;
    }

    try {
      const phoneNumber = `+${formData.phone.replace(/\D/g, '')}`; // Ensure proper phone number format
      const appVerifier = window.recaptchaVerifier;
      
      const { success, error } = await signInWithPhone(phoneNumber, appVerifier);
      
      if (success) {
        setConfirmationResult(confirmationResult);
        setShowOtpInput(true);
      } else {
        throw new Error(error || 'Failed to send verification code');
      }
    } catch (err) {
      console.error('Phone authentication error:', err);
      setError(err.message || 'Failed to send verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.otp || formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      setLoading(false);
      return;
    }

    try {
      const { success, error } = await verifyOTP(confirmationResult, formData.otp);
      
      if (!success) {
        throw new Error(error || 'Failed to verify OTP');
      }
      // Success - user will be redirected via the useEffect hook
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login with email and password
        const { success, error } = await logInWithEmail(formData.email, formData.password);
        if (!success) {
          // More specific error messages
          if (error.includes('user-not-found') || error.includes('wrong-password')) {
            throw new Error('Invalid email or password');
          } else if (error.includes('too-many-requests')) {
            throw new Error('Too many attempts. Please try again later.');
          } else {
            throw new Error(error || 'Failed to sign in');
          }
        }
        // Success - user will be redirected via the useEffect hook
      } else {
        // Sign up with email, password, and name
        if (!formData.name) {
          throw new Error('Name is required for sign up');
        }
        const { success, error } = await signUpWithEmail(formData.name, formData.email, formData.password);
        if (!success) {
          if (error.includes('email-already-in-use')) {
            throw new Error('This email is already registered. Please log in instead.');
          } else if (error.includes('weak-password')) {
            throw new Error('Password should be at least 6 characters');
          } else {
            throw new Error(error || 'Failed to create account');
          }
        }
      }
      // Redirect is handled by the useEffect that watches the user state
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = loginMethod === 'email' ? handleEmailSubmit : handlePhoneSubmit;

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setError('');
      console.log('Initiating Google Sign-In...');
      
      const { success, error, code } = await signInWithGoogle();
      
      if (!success) {
        // Don't show error if user closed the popup
        if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
          throw new Error(error || 'Failed to sign in with Google');
        }
        return;
      }
      
      // If we get here, sign-in was successful
      console.log('Google Sign-In completed successfully');
      
    } catch (err) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  if (loadingAuth) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {/* Login Method Tabs */}
        <div className="login-method-tabs">
          <button 
            className={`tab-button ${loginMethod === 'email' ? 'active' : ''}`}
            onClick={() => setLoginMethod('email')}
            type="button"
          >
            Email
          </button>
          <button 
            className={`tab-button ${loginMethod === 'phone' ? 'active' : ''}`}
            onClick={() => setLoginMethod('phone')}
            type="button"
          >
            Phone
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        {loginMethod === 'email' ? (
          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength="6"
              />
            </div>
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
            </button>
            
            <div className="divider">or</div>
            
            <button 
              type="button" 
              className="google-button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="google-icon" />
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>
            
            <div className="switch-auth">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button 
                type="button" 
                className="switch-button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={showOtpInput ? handleOtpSubmit : handleSubmit} className="login-form">
            {!showOtpInput ? (
              <>
                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="phone-input-container">
                    <span className="phone-prefix">+</span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="1234567890"
                      pattern="[0-9]{10,15}"
                      required
                    />
                  </div>
                  <p className="hint-text">We'll send a verification code to this number</p>
                </div>
                
                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
                
                <div className="divider">or</div>
                
                <button 
                  type="button" 
                  className="google-button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <>
                      <div className="spinner"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <img 
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                        alt="Google" 
                        className="google-icon" 
                      />
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
                
                <div className="switch-auth">
                  <button 
                    type="button" 
                    className="switch-button"
                    onClick={() => setLoginMethod('email')}
                  >
                    Use Email Instead
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Enter Verification Code</label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit code"
                    pattern="\d{6}"
                    required
                  />
                  <p className="hint-text">Enter the 6-digit code sent to +{formData.phone}</p>
                </div>
                
                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                
                <button 
                  type="button" 
                  className="text-button"
                  onClick={() => setShowOtpInput(false)}
                  disabled={loading}
                >
                  Back to Phone Number
                </button>
              </>
            )}
            
            {/* reCAPTCHA container - must be in the DOM but can be hidden */}
            <div id="recaptcha-container" ref={recaptchaContainer} style={{ display: 'none' }}></div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login;
