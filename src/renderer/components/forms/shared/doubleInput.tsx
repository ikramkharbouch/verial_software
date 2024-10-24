import Select from 'react-select';
import { useState } from 'react';
import '../../../styles/forms.css';

interface IOptions {
  options: Array<Object>;
  label: string;
}

const DoubleInput = ({ options, label }: IOptions) => {
  const [option, setOption] = useState('Entreprise');

  const handleChange = (selectedOption: string) => {
    setOption(selectedOption);
  };

  return (
    <div>
      <p className='input-label'>{label}</p>
      <div className="d-input">
        {/* limit to a maximum of 3 numbers per input */}
        <input type="number" onInput={(e: any) => e.target.value = e.target.value.slice(0, 3)} placeholder="444"></input>
        <label htmlFor={'clientType'} className="input-label">
          <Select
            name={option}
            value={option}
            onChange={(e: any) => handleChange(e.value)}
            options={options as any}
            placeholder={option == '' ? 'Select' : option}
          />
        </label>
      </div>
    </div>
  );
};

export default DoubleInput;
