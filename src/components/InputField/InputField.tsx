import React from 'react';
import './InputField.scss';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  value,
  onChange,
  className = '',
  placeholder = '',
  ...rest
}) => {
  return (
    <input
      className={`search-input ${className}`}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
    />
  );
};
