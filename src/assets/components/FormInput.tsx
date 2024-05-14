import Form from 'react-bootstrap/Form';

// Props for input form
interface Props {
  controlId: string;
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<Props> = ({
  controlId,
  label,
  placeholder,
  type,
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  // Makes a form from the props
  return (
    <Form.Group className='mb-3 login-form' controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </Form.Group>
  );
};

export default FormInput;
