//Imports
import Button from 'react-bootstrap/Button';

//Props for button
interface Props {
  onClick: () => void;
}

const AddButton = ({ onClick }: Props) => {
  return (
    <Button variant='primary' onClick={onClick}>
      Add task
    </Button>
  );
};

export default AddButton;
