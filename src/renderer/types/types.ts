import { FieldValues, UseFormRegister } from 'react-hook-form';

export type Input = {
  type?: string;
  label?: string;
  name: string;
  placeholder: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  disabled?: boolean;
};

export type PhoneInputType = {
  label: string;
  value: [];
  required?: boolean;
  setPhone: React.Dispatch<React.SetStateAction<any[]>>;
  disabled?: boolean;
};
