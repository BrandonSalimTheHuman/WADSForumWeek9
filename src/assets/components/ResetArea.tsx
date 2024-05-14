// Imports
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FormInput from './FormInput';
import { Button } from 'react-bootstrap';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDk2WC6qiWzC65GZVAvHmIvq709E7zXAr0',
  authDomain: 'to-do-list-b32de.firebaseapp.com',
  projectId: 'to-do-list-b32de',
  storageBucket: 'to-do-list-b32de.appspot.com',
  messagingSenderId: '496719882286',
  appId: '1:496719882286:web:551f89646d2ccfe20ed7bf',
};

// Initializing app and auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const ResetArea = () => {
  // useState for email and initializing navigate
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  // function to send password reset email, and moving the user back to the login page
  const sendPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset link sent!');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className='main-container'>
      <div className='forms-container'>
        {/* Form for email */}
        <FormInput
          controlId='formReset'
          label='Email'
          placeholder='Enter your email'
          type='text'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='buttons-container'>
        {/* Button for reset */}
        <Button
          className='reset-button'
          variant='primary'
          size='lg'
          onClick={() => sendPasswordReset(email)}
        >
          Send password reset email
        </Button>
        {/* Link to signup page */}
        <div>
          If you don't have an account,{' '}
          <Link className='link-color' to='/signup'>
            sign up
          </Link>{' '}
          here
        </div>
      </div>
    </div>
  );
};

export default ResetArea;
