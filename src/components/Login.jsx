import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  auth,
  GoogleAuthProvider
} from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FcGoogle } from 'react-icons/fc';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, loadingAuth] = useAuthState(auth);
  const navigate = useNavigate();

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      // Navigation will be handled by the auth state change effect
    } catch (error) {
      console.error('Google sign in error:', error);
      setError(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setSuccess('Logged in successfully!');
      setError('');
      // Navigate to home after showing success message
      const timer = setTimeout(() => {
        navigate('/', { state: { fromLogin: true } });
      }, 1500);
      return () => clearTimeout(timer);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await logInWithEmailAndPassword(formData.email, formData.password);
      } else {
        if (!formData.name) {
          throw new Error('Name is required');
        }
        await registerWithEmailAndPassword(formData.name, formData.email, formData.password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  if (loadingAuth) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {/* Google Sign In Button */}
        <button 
          type="button"
          onClick={handleGoogleSignIn}
          className="google-signin-button"
          disabled={loading}
        >
          <FcGoogle className="google-icon" />
          <span>{isLogin ? 'Sign in with Google' : 'Sign up with Google'}</span>
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                disabled={loading}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              disabled={loading}
              required
              minLength="6"
            />
          </div>

          <button 
            type="submit"
            className="primary-button" 
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="toggle-form">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              className="text-button"
              disabled={loading}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
