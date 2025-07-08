import './InputField.scss';

interface InputFieldProps {
  className?: string;
  placeholder?: string;
}

export const InputField = ({ className, placeholder = '' }: InputFieldProps) => {
  return <input className={`search-input ${className}`} type="text" placeholder={placeholder} />;
};
