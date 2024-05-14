// Imports
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import FormInput from './FormInput';

// Props for edit username modal
interface Props {
  show: boolean;
  handleClose: () => void;
  currentUsername: string | null | undefined;
  handleSave: (newUsername: string) => void;
}

const EditUsernameModal: React.FC<Props> = ({
  show,
  handleClose,
  currentUsername,
  handleSave,
}) => {
  // useState for new username
  const [newUsername, setNewUsername] = useState('');

  // Function fo handle save button click
  const handleSaveClick = () => {
    // Call handleSave from Account.tsx with the new username
    handleSave(newUsername);
    // Close the modal
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Username</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Form for the new username */}
        <FormInput
          controlId='formNewUsername'
          label='Username'
          type='text'
          placeholder={currentUsername || ''}
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
      </Modal.Body>
      {/* Footer for the two buttons */}
      <Modal.Footer>
        {/* Button for close */}
        <Button variant='secondary' onClick={handleClose}>
          Cancel
        </Button>
        {/* Button for save */}
        <Button variant='primary' onClick={handleSaveClick}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUsernameModal;
