//Imports
import Dropdown from 'react-bootstrap/Dropdown';

//Props for dropdown
interface Props {
  onSelect: (eventKey: any) => void;
  selectedItem: string;
}

const DropDown = ({ onSelect, selectedItem }: Props) => {
  //Array of choices for dropdown
  const choices = ['All', 'Incompleted', 'Completed'];

  return (
    <Dropdown onSelect={onSelect}>
      {/* Show selected item on dropdown */}
      <Dropdown.Toggle variant='success' id='dropdown-basic'>
        {selectedItem}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* Map choices from previous array to items for the dropdown */}
        {choices.map((item) => (
          <Dropdown.Item key={item} eventKey={item}>
            {item}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DropDown;
