import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 border rounded-lg transition-colors duration-200
            focus:outline-none focus-visible:ring-2 ring-brand-600 ring-offset-2
            ${hasError 
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500' 
              : 'border-gray-300 text-gray-900 placeholder-gray-500 focus:border-brand-500'
            }
            ${className}
          `}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {hasError && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !hasError && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
