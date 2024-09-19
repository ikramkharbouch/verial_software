import { PhoneInput } from 'react-international-phone';

import { PhoneInputType } from '@renderer/types/types';
  const InputPhone = ({ label, value,required, setPhone, disabled }: PhoneInputType) => {
    return (
      <label htmlFor="phoneNumber">
        <p className={required ? 'required' : ''}>{label}</p>
        <PhoneInput
          defaultCountry="ua"
          value={'PhoneNumber'}
          onChange={(phone) => setPhone([...phone, value])}
          disabled={disabled}
        />
      </label>
    );
  };

  export default InputPhone;