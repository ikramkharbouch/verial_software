import { Input } from "../../../types/types";

const Input = ({
  type,
  label,
  name,
  register,
  placeholder,
  required,
  disabled
}: Input) => {
  return (
    <>
      <label htmlFor={label} className={'input-label'}>
        <p className={required ? 'required' : ''}>{label}</p>
        <input
          type={type}
          id={label}
          {...register(name)}
          placeholder={placeholder}
          disabled={disabled}
        />
      </label>
    </>
  );
};

export default Input;