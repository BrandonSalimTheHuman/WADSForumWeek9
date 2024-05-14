// Imports
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormInput from './FormInput';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDk2WC6qiWzC65GZVAvHmIvq709E7zXAr0',
  authDomain: 'to-do-list-b32de.firebaseapp.com',
  projectId: 'to-do-list-b32de',
  storageBucket: 'to-do-list-b32de.appspot.com',
  messagingSenderId: '496719882286',
  appId: '1:496719882286:web:551f89646d2ccfe20ed7bf',
};

// Initializing app, auth, and the database
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

const SignUpArea = () => {
  // useState for email, password, password confirmation, name, and auth state, as well as initializing navigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const signUpWithEmailAndPassword = async (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    try {
      // Check to see if the password and the confirmation are the same
      if (password !== passwordConfirm) {
        throw new Error('Passwords do not match');
      }

      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // Add displayName for firebase authentication
      await updateProfile(user, {
        displayName: name,
      });

      // Add document to the collection
      await addDoc(collection(database, 'users'), {
        uid: user.uid,
        displayName: name,
        authProvider: 'local',
        email,
      });
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // Function to sign up
  const handleSignUp = () => {
    if (!name) alert('Please enter name');
    signUpWithEmailAndPassword(name, email, password, passwordConfirm);
  };

  // useEffect to move user to login page
  useEffect(() => {
    if (loading) return;
    if (user) navigate('/login');
  }, [user, loading]);

  return (
    <div className='main-container'>
      <div className='forms-container'>
        <Form>
          {/* First form for username */}
          <FormInput
            controlId='signUpFormBasicUsername'
            label='Username'
            placeholder='Choose your username'
            type=''
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></FormInput>
          {/* second form for email */}
          <FormInput
            controlId='signUpFormBasicEmail'
            label='Email'
            placeholder='Enter your email'
            type=''
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></FormInput>
          {/* Third form for password */}
          <FormInput
            controlId='signUpFormBasicPassword'
            label='Password'
            placeholder='Choose your password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></FormInput>
          {/* Fourth form for password confirmation */}
          <FormInput
            controlId='signUpformConfirmPassword'
            label='Password'
            placeholder='Confirm your password'
            type='password'
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          ></FormInput>
        </Form>
      </div>
      <div className='buttons-container'>
        {/* button to sign up */}
        <Button
          className='signup-button'
          variant='primary'
          size='lg'
          onClick={handleSignUp}
        >
          Sign up!
        </Button>
      </div>
    </div>
  );
};

export default SignUpArea;
