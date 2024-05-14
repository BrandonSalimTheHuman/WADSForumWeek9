//Imports
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

//Task type, same as the one in App.tsx
type Task = {
  id: string;
  name: string;
  completed: boolean;
};

//Props for input modal
interface Props {
  onSubmit: (taskName: string) => void;
  onHide: () => void;
  onEdit: (task: any) => void;
  editing: boolean;
  task: Task | null;
}

function InputModal({ onSubmit, onHide, onEdit, editing, task }: Props) {
  //Task name of the task being added or edited
  const [taskName, setTaskName] = useState(task ? task.name : '');

  //Handle change to the task name based on the input area
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  };

  //Handle submit button
  const handleSubmit = () => {
    if (taskName.trim() !== '') {
      //Apply onEdit or onSubmit depending on if modal is used for editing or adding
      if (editing && task) {
        onEdit({ ...task, name: taskName });
      } else {
        onSubmit(taskName);
      }
    }
  };

  //Reset input area if adding a new task
  useEffect(() => {
    if (!editing) {
      setTaskName('');
    }
  }, [editing]);

  return (
    <Modal show={true} onHide={onHide} centered>
      <Modal.Header closeButton>
        {/* Different modal title for editing or adding a task */}
        <Modal.Title>{editing ? 'Edit task' : 'Add a task'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Input area */}
        <Form>
          <Form.Group className='mb-3' controlId='formTask'>
            <Form.Label>Task name</Form.Label>
            <Form.Control
              placeholder='Enter name'
              value={taskName}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* Submit button */}
        <Button variant='primary' onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default InputModal;
