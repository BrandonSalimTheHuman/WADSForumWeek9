//Imports
import Title from './assets/components/Title';
import DropDown from './assets/components/DropDown';
import Stack from 'react-bootstrap/Stack';
import AddButton from './assets/components/AddButton';
import InputModal from './assets/components/InputModal';
import Task from './assets/components/Task';
import './App.css';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { Button } from 'react-bootstrap';
function ToDoList() {
  // Selected item from filter dropdown
  const [selectedItem, setSelectedItem] = useState('All');
  //Whether the modal for inputting and editing is visible
  const [showModal, setShowModal] = useState(false);

  //Whether or not the modal is used for inputting or editing
  const [editing, setEditing] = useState(false);

  //Task being edited
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  // Custom type for a task
  type Task = {
    id: string;
    name: string;
    completed: boolean;
    userID: string;
  };
  const [tasks, setTasks] = useState<Task[]>([]);

  // Authentication related
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the user ID from your authentication system (e.g., Firebase Auth)
        const auth = getAuth();
        const user = auth.currentUser;

        // Check if user is not null before proceeding
        if (user) {
          const userId = user.uid; // Use user.uid as the user ID

          console.log(userId);

          const response = await fetch(
            `http://127.0.0.1:8000/api/tasks/${userId}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setTasks(data);
          } else {
            console.error('Failed to fetch tasks:', response.statusText);
          }
        } else {
          console.error('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchData();
  }, []);

  //Handle selection for dropdown
  const handleSelect = (eventKey: any) => {
    setSelectedItem(eventKey);
  };

  //Handle click on adding a task
  const handleClick = () => {
    setEditing(false);
    setShowModal(true);
  };

  //Handle submit button on modal when adding
  //Need API to create new task here
  const handleSubmit = async (taskName: string) => {
    try {
      if (taskName.trim() !== '') {
        const newTask: Task = {
          id: uuidv4(),
          name: taskName,
          completed: false,
          userID: user!.uid,
        };

        const response = await fetch(
          `http://127.0.0.1:8000/api/tasks?task_name=${taskName}&user_id=${newTask.userID}&task_id=${newTask.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          setTasks([...tasks, newTask]);
        } else {
          console.error('Failed to update task:', response.statusText);
        }
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEdit = async (input_task: Task) => {
    try {
      if (input_task.name.trim() !== '') {
        // Make an HTTP PUT request to update the task name
        const response = await fetch(
          `http://127.0.0.1:8000/api/tasks/${input_task.id}?new_task_name=${input_task.name}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          // If the request is successful, update the local state to reflect the edited task
          const updatedTask = await response.json();
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        } else {
          console.error('Failed to update task:', response.statusText);
        }
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  //Handle close button on modal
  const handleClose = () => {
    setShowModal(false);
  };

  //Handle complete/incomplete toggle using checkbox
  const handleComplete = async (taskId: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/${taskId}/toggle_completion`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setTasks(
          tasks.map((task) => {
            if (task.id === taskId) {
              return {
                ...task,
                completed: !task.completed,
              };
            }
            return task;
          })
        );
      } else {
        console.error('Failed to toggle task completion:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  // Handle task deletion
  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tasks/${taskId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      }
      // Update the local state to remove the deleted task
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  ///Handle button for editing a task
  const handleEditPress = (taskId: string) => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      setTaskToEdit(task);
      setEditing(true);
      setShowModal(true);
    }
  };

  //Handle move up button for tasks
  const handleMoveUp = (taskId: string) => {
    const index = tasks.findIndex((task) => task.id === taskId);
    if (index > 0) {
      const newTasks = [...tasks];
      const temp = newTasks[index];
      newTasks[index] = newTasks[index - 1];
      newTasks[index - 1] = temp;
      setTasks(newTasks);
    }
  };

  //Handle move down button for tasks
  const handleMoveDown = (taskId: string) => {
    const index = tasks.findIndex((task) => task.id === taskId);
    if (index < tasks.length - 1) {
      const newTasks = [...tasks];
      const temp = newTasks[index];
      newTasks[index] = newTasks[index + 1];
      newTasks[index + 1] = temp;
      setTasks(newTasks);
    }
  };

  const navigate = useNavigate();

  const handleManageAccount = () => {
    navigate('/account');
  };

  // Array of tasks to show, after filtering
  const filteredTasks = tasks.filter((task) => {
    if (selectedItem === 'All') {
      return true;
    } else if (selectedItem === 'Completed') {
      return task.completed;
    } else if (selectedItem === 'Incompleted') {
      return !task.completed;
    }
  });

  return (
    <div className='app-container'>
      <div className='top-left'>
        {user && user.photoURL && (
          <img className='dashboard-profile-picture' src={user.photoURL} />
        )}
        {/* Display current user's username */}
        {user && <span className='username'>Welcome, {user.displayName}</span>}
        {/* Button to lead to account editing page */}
        <Button
          className='edit-account-button'
          variant='primary'
          onClick={handleManageAccount}
        >
          Edit Account
        </Button>
      </div>
      {/* 'To-do-list' title */}
      <Title />

      {/* Stack for add task button and filter dropdown */}
      <div className='stack-container'>
        <Stack direction='horizontal' gap={3}>
          <div className='p-2'>
            <AddButton onClick={handleClick}></AddButton>
          </div>
          <div className='p-2 ms-auto'>
            <DropDown
              onSelect={handleSelect}
              selectedItem={selectedItem}
            ></DropDown>
          </div>
        </Stack>
      </div>

      {/* Modal for input and edit */}
      {showModal && (
        <InputModal
          onSubmit={handleSubmit}
          onHide={handleClose}
          onEdit={handleEdit}
          editing={editing}
          task={taskToEdit}
        />
      )}

      {/* Task components, mapped from the array of tasks after filter */}
      <div>
        {filteredTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onComplete={handleComplete}
            onDelete={handleDelete}
            onEditPress={handleEditPress}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        ))}
      </div>
    </div>
  );
}

export default ToDoList;
