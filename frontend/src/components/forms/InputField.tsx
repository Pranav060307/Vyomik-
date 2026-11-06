import React, { useState } from 'react';

interface InputFieldProps {
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyDown,
  error,
  icon,
  isPassword = false,
  className = '',
  style,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div
      style={style}
      className={`f ${error ? 'bad' : ''} ${className}`}
    >
      {icon && <span className="ico">{icon}</span>}
      <input
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      {isPassword && (
        <span
          className="ico eye"
          onClick={() => setShowPassword((prev) => !prev)}
          role="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </span>
      )}
      <em className="msg">{error || ''}</em>
    </div>
  );
};
