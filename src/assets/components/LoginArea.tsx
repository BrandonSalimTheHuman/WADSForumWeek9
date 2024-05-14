// Imports
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormInput from './FormInput';
import { Link, useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  query,
  collection,
  where,
  getDocs,
  addDoc,
  getFirestore,
} from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDk2WC6qiWzC65GZVAvHmIvq709E7zXAr0',
  authDomain: 'to-do-list-b32de.firebaseapp.com',
  projectId: 'to-do-list-b32de',
  storageBucket: 'to-do-list-b32de.appspot.com',
  messagingSenderId: '496719882286',
  appId: '1:496719882286:web:551f89646d2ccfe20ed7bf',
};

// Initialize firebase, auth, the database, and google provider for login
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Function for logging in with email and password
const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

// Function for signing in with Google
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    // Querying the appropriate user based on their id
    const q = query(
      collection(database, 'users'),
      where('userID', '==', user.uid)
    );

    // Get docs, if the user doesn't exist, add it to the collection
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(database, 'users'), {
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
      });
    }
  } catch (err: any) {
    console.error(err);
    alert(err.message);
  }
};

const LoginArea = () => {
  // useState for email, password, users, and initializing navigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // useEffect to navigate back to dashboard
  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      navigate('/dashboard');
    }
  }, [user, loading]);

  // Move user to signup page
  const handleSignUpButton = () => {
    navigate('/signup');
  };

  return (
    <div className='main-container'>
      <div className='forms-container'>
        <Form>
          {/* First form for email */}
          <FormInput
            controlId='loginFormBasicEmail'
            label='Email'
            placeholder='Enter your email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></FormInput>
          {/* Second form for password */}
          <FormInput
            controlId='loginFormBasicPassword'
            label='Password'
            placeholder='Enter your password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></FormInput>
        </Form>
      </div>
      <div className='buttons-container'>
        {/* Login button */}
        <Button
          className='login-button'
          variant='primary'
          size='lg'
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </Button>
        {/* Google sign in button */}
        <Button
          className='login-button'
          variant='warning'
          size='lg'
          onClick={signInWithGoogle}
        >
          Login with Google
        </Button>
        {/* Button to register a new account */}
        <h4>Don't have an account?</h4>
        <Button
          className='signup-button google-login'
          variant='info'
          onClick={handleSignUpButton}
        >
          Sign up!
        </Button>
      </div>
      {/* Link to reset password */}
      <div>
        <Link className='link-color' to='/reset'>
          Forgot password
        </Link>
      </div>
    </div>
  );
};

export default LoginArea;
