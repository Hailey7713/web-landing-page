import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

const GoogleLoginButton = () => {
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error during Google login:', error);
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full max-w-xs px-4 py-2 space-x-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <FcGoogle className="w-5 h-5" />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleLoginButton;
