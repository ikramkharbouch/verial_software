import { FormFieldProps } from '@renderer/types/ClientSchema';

import '@/styles/forms.css'

const FormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  label,
  name,
  register,
  error,
  valueAsNumber,
}) => (
  <>
    <label htmlFor={label} className="input-label">
      <p>{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, { valueAsNumber })}
      />
    </label>

    {error && <span className="error-message">{error.message as any}</span>}
  </>
);
export default FormField;
