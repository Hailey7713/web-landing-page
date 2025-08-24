import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail, 
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCX3UKP-25jpr8CPfro0GnBXRIGpWIJb6M",
  authDomain: "blissfull-groundnuts.firebaseapp.com",
  projectId: "blissfull-groundnuts",
  storageBucket: "blissfull-groundnuts.firebasestorage.app",
  messagingSenderId: "745622907241",
  appId: "1:745622907241:web:c3f22569922379dc46b5f8",
  measurementId: "G-4GG5JLK08Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

// Configure Google provider
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Google Sign In
const signInWithGoogle = async () => {
  console.log('Starting Google Sign-In...');
  try {
    // Use the global provider instance
    const provider = googleProvider;
    
    // Set custom parameters for the authentication flow
    provider.setCustomParameters({
      prompt: 'select_account',
      hd: '*',  // This helps with domain selection
      login_hint: '',
      include_granted_scopes: 'true',
      access_type: 'online'
    });
    
    console.log('Initiating Google Sign-In with redirect...');
    await signInWithRedirect(auth, provider);
    // The redirect result will be handled by the component that calls getRedirectResult
    return { success: true, redirecting: true };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    
    console.error("Google Sign-In Error:", {
      errorCode,
      errorMessage,
      email,
      credential
    });
    
    // Return more specific error messages
    let userFriendlyError = 'Failed to sign in with Google. Please try again.';
    
    if (errorCode === 'auth/account-exists-with-different-credential') {
      userFriendlyError = 'An account already exists with the same email but different sign-in credentials.';
    } else if (errorCode === 'auth/popup-closed-by-user') {
      userFriendlyError = 'Sign in was cancelled. Please try again.';
    } else if (errorCode === 'auth/unauthorized-domain') {
      userFriendlyError = 'This domain is not authorized for Google Sign-In. Please contact support.';
    }
    
    return { 
      success: false, 
      error: userFriendlyError,
      code: errorCode
    };
  }
};

// Email/Password Login
const logInWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error signing in:", error);
    return { success: false, error: error.code };
  }
};

// Email/Password Sign Up
const signUpWithEmail = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    // Update user profile with display name
    await updateProfile(user, { displayName: name });
    
    return { success: true, user };
  } catch (error) {
    console.error("Error signing up:", error);
    return { success: false, error: error.message };
  }
};

// Password Reset
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error: error.message };
  }
};

// Sign Out
const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error: error.message };
  }
};

// Phone Number Sign In
const signInWithPhone = async (phoneNumber, appVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return { 
      success: true, 
      confirmationResult,
      verificationId: confirmationResult.verificationId
    };
  } catch (error) {
    console.error('Phone sign in error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to send verification code'
    };
  }
};

// Verify OTP
const verifyOTP = async (confirmationResult, otp) => {
  try {
    const result = await confirmationResult.confirm(otp);
    return { 
      success: true, 
      user: result.user 
    };
  } catch (error) {
    console.error('OTP verification error:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to verify OTP. The code might be invalid or expired.' 
    };
  }
};

// Set up reCAPTCHA
const setUpRecaptcha = (elementId) => {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      console.log('reCAPTCHA verified');
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.log('reCAPTCHA expired');
    }
  });
};

// Export all auth related functions
export {
  signInWithGoogle,
  logInWithEmail,
  signUpWithEmail,
  sendPasswordReset,
  logOut,
  signInWithPhone,
  verifyOTP,
  setUpRecaptcha,
  auth,
  googleProvider,
  getRedirectResult,
  db,
  app
};

// Export the Firebase app as default
export default app;