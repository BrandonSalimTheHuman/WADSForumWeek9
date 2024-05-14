// Imports
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormInput from './FormInput';

// Props for edit username modal
interface Props {
  show: boolean;
  handleClose: () => void;
  handleSave: (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => void;
}

const EditPasswordModal: React.FC<Props> = ({
  show,
  handleClose,
  handleSave,
}) => {
  // usestate for old password, new password and new password confirmation
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  const handleSaveClick = () => {
    // call handleSave from Accounts.tsx on these three
    handleSave(oldPassword, newPassword, confirmPassword);
    // Close modal
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Username</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* First form for old password */}
        <FormInput
          controlId='formOldPassword'
          label='Old password'
          type='password'
          placeholder={'Enter old password'}
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        {/* Second form for new password */}
        <FormInput
          controlId='formNewPassword'
          label='New password'
          type='password'
          placeholder={'Enter new password'}
          value={newPassword}
          onChange={(e) => setnewPassword(e.target.value)}
        />
        {/* Third form for new password confirmation */}
        <FormInput
          controlId='formNewPasswordConfirm'
          label='Confirm new password'
          type='password'
          placeholder={'Confirm new password'}
          value={confirmPassword}
          onChange={(e) => setconfirmPassword(e.target.value)}
        />
      </Modal.Body>
      {/* Footer for the two buttons */}
      <Modal.Footer>
        {/* Button to close */}
        <Button variant='secondary' onClick={handleClose}>
          Cancel
        </Button>
        {/* Button to save */}
        <Button variant='primary' onClick={handleSaveClick}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPasswordModal;
