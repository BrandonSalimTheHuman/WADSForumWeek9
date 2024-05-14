//Imports
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

//Props for tasks
interface Props {
  task: { id: string; name: string; completed: boolean };
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEditPress: (taskId: string) => void;
  onMoveUp: (taskId: string) => void;
  onMoveDown: (taskId: string) => void;
}

const Task = ({
  task,
  onComplete,
  onDelete,
  onEditPress,
  onMoveUp,
  onMoveDown,
}: Props) => {
  return (
    <div
      className='modal show'
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal.Dialog style={{ minWidth: '500px' }}>
        {/* Change class depending on if task is completed or not*/}
        <Modal.Body
          className={task.completed ? 'completed-color' : 'incompleted-color'}
        >
          {/* First container for task name, down button and up button */}
          <Container style={{ marginBottom: '20px' }}>
            <Row>
              <Col lg={9}>
                {/* If task is completed, add class to strikethrough text */}
                <h2
                  className={`task-name ${
                    task.completed ? 'strikethrough' : ''
                  }`}
                >
                  {task.name}
                </h2>
              </Col>
              <Col lg={3}>
                {/* Two buttnos, first to move up, second to move down */}
                <div className='ms-auto'>
                  <Button
                    variant='outline-secondary'
                    onClick={() => onMoveUp(task.id)}
                  >
                    ▲
                  </Button>
                  <Button
                    variant='outline-secondary'
                    onClick={() => onMoveDown(task.id)}
                  >
                    ▼
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
          {/* Second container for checkbox, status, edit, and delete */}
          <Container>
            <Row>
              <Col>
                <div className='d-flex justify-content-between'>
                  {/* Checkbox */}
                  <div>
                    <input
                      type='checkbox'
                      className='custom-checkbox'
                      checked={task.completed}
                      onChange={() => onComplete(task.id)}
                    />
                  </div>
                  {/* Status */}
                  <div>
                    <h6>
                      {task.completed
                        ? 'Status: Completed'
                        : 'Status: Incompleted'}
                    </h6>
                  </div>
                </div>
              </Col>
              <Col>
                <div className='d-flex justify-content-end'>
                  {/* Edit button */}
                  <div className='mx-2'>
                    <Button
                      variant='secondary'
                      onClick={() => onEditPress(task.id)}
                    >
                      Edit
                    </Button>
                  </div>
                  {/* Delete button */}
                  <div>
                    <Button variant='danger' onClick={() => onDelete(task.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};

export default Task;
