// Imports
import './App.css';
import Title from './assets/components/Title';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import EditUsernameModal from './assets/components/EditUsernameModal';
import EditPasswordModal from './assets/components/EditPasswordModal';

import {
  query,
  collection,
  getDocs,
  where,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  signOut,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { Button, Modal } from 'react-bootstrap';

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyDk2WC6qiWzC65GZVAvHmIvq709E7zXAr0',
  authDomain: 'to-do-list-b32de.firebaseapp.com',
  projectId: 'to-do-list-b32de',
  storageBucket: 'to-do-list-b32de.appspot.com',
  messagingSenderId: '496719882286',
  appId: '1:496719882286:web:551f89646d2ccfe20ed7bf',
};

// Initialize app, auth, database, and the storage (for profile picture)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);
const storage = getStorage(app);

const Account = () => {
  // useState for auth state, name, profile piocture, the three modals, and the selected file
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Initialize navigate
  const navigate = useNavigate();

  // Function to get user's username and their profile picture to show
  const fetchUserNameandProfilePicture = async () => {
    try {
      // Queries the correct uid
      const q = query(
        collection(database, 'users'),
        where('uid', '==', user?.uid)
      );
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      // The field containing the name ends up being different
      if (data.authProvider == 'google') {
        setName(data.name);
      } else {
        setName(data.displayName);
      }
      if (data.profilePictureUrl != null) {
        setProfilePicture(data.profilePictureUrl);
      }
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }
  };

  // useEffect to move user back to login page
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/login');
    fetchUserNameandProfilePicture();
  }, [user, loading]);

  // Function to handle logging out and moving them back to login page
  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  };

  // Six functions to handle closing the three modals and opening them
  const handleCloseUsernameModal = () => {
    setShowUsernameModal(false);
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  const handleEditUsername = () => {
    setShowUsernameModal(true);
  };

  const handleEditPassword = () => {
    setShowPasswordModal(true);
  };

  const handleUploadImage = () => {
    setShowUploadModal(true);
  };

  // Function to send user back to dashboard
  const handleReturn = () => {
    navigate('/dashboard');
  };

  const handleSaveUsername = async (newUsername: string) => {
    try {
      // Update authentication's displayName
      await updateProfile(auth.currentUser!, {
        displayName: newUsername,
      });

      // Update the database
      const userQuery = query(
        collection(database, 'users'),
        where('uid', '==', user!.uid)
      );
      const userQuerySnapshot = await getDocs(userQuery);
      const userDocRef = userQuerySnapshot.docs[0].ref;
      await updateDoc(userDocRef, {
        displayName: newUsername,
      });

      setName(newUsername);

      // Close modal
      setShowUsernameModal(false);
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  const handleSavePassword = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      // Check to see if password and password confirm are the same
      if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match');
        return;
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert('No user is currently authenticated');
        return;
      }

      // Authentication part
      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        oldPassword
      );
      try {
        // Check to make sure the inputted old password is correct
        await reauthenticateWithCredential(currentUser, credential);
      } catch (error) {
        // Handle incorrect old password
        alert('Incorrect old password');
        return;
      }

      // Reauthenticate
      await reauthenticateWithCredential(auth.currentUser!, credential);

      // Change the user's password
      await updatePassword(auth.currentUser!, newPassword);

      // Close the modal
      setShowPasswordModal(false);
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  // Function to handle selected file from file input
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSaveClick = async () => {
    if (selectedFile) {
      // Get ref from storage and the url, based on uid and selected file name
      const storageRef = ref(
        storage,
        `profilePictures/${user?.uid}/${selectedFile.name}`
      );
      try {
        // Upload image to storage
        await uploadBytes(storageRef, selectedFile);

        // Get download URL
        const imageUrl = await getDownloadURL(storageRef);

        //Updating picture for firebase authentication
        await updateProfile(auth.currentUser!, {
          photoURL: imageUrl,
        });

        // Queries correct user
        const userQuery = query(
          collection(database, 'users'),
          where('uid', '==', user!.uid)
        );
        const userQuerySnapshot = await getDocs(userQuery);

        if (!userQuerySnapshot.empty) {
          const userDocRef = userQuerySnapshot.docs[0].ref;
          // Update the user document in database
          await updateDoc(userDocRef, {
            profilePictureUrl: imageUrl,
          });
          // Update state to display the new profile picture
          setProfilePicture(imageUrl);
        } else {
          console.error('User document does not exist');
        }
      } catch (error) {
        console.error(error);
        alert('Error updating user document');
      } finally {
        // Close the modal
        setShowUploadModal(false);
        // Reset selected file
        setSelectedFile(null);
      }
    }
  };

  return (
    <>
      <Title />
      <div className='main-container'>
        {/* Button to return to dashboard */}
        <div className='top-left'>
          <Button variant='primary' onClick={handleReturn}>
            Return to dashboard
          </Button>
        </div>
        <div className='account-title'>
          <h2>Logged in as</h2>
        </div>
        {/* Profile picture */}
        <div>
          {profilePicture != null && (
            <img className='profile-picture' src={profilePicture} />
          )}
        </div>
        {/* Button to edit profile picture */}
        <div>
          <Button
            size='sm'
            className='profile-picture-button'
            onClick={handleUploadImage}
          >
            Edit profile picture
          </Button>
        </div>
        {/* Button to edit username */}
        <div className='user-info'>
          <h3>Username: {name}</h3>
          <Button size='sm' onClick={handleEditUsername}>
            Edit username
          </Button>
        </div>
        <div className='user-info'>
          <h3>Email: {user?.email}</h3>
        </div>
        {/* Button to change password */}
        <Button
          className='password-change-button'
          variant='warning'
          size='sm'
          onClick={handleEditPassword}
        >
          Change password
        </Button>
        {/* Button to logout */}
        <Button variant='danger' onClick={handleLogOut}>
          Log out
        </Button>
        {/* Modal to edit username */}
        <EditUsernameModal
          show={showUsernameModal}
          handleClose={handleCloseUsernameModal}
          currentUsername={user?.displayName}
          handleSave={handleSaveUsername}
        />
        {/* Modal to edit password */}
        <EditPasswordModal
          show={showPasswordModal}
          handleClose={handleClosePasswordModal}
          handleSave={handleSavePassword}
        />
        {/* Modal to edit profile picture */}
        <Modal show={showUploadModal} onHide={handleCloseUploadModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Upload Profile Picture</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type='file'
              accept='image/*'
              onChange={handleFileInputChange}
            />
          </Modal.Body>
          {/* Footer for two buttons: cancel and save */}
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseUploadModal}>
              Cancel
            </Button>
            <Button variant='primary' onClick={handleSaveClick}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default Account;
