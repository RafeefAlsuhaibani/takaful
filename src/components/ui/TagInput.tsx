import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export default function TagInput({ 
  label, 
  error, 
  helperText, 
  tags, 
  onTagsChange, 
  placeholder = "اضغط Enter لإضافة مهارة",
  className = '' 
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const hasError = !!error;
  const inputId = `taginput-${Math.random().toString(36).substr(2, 9)}`;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className={`
        w-full min-h-[48px] px-4 py-3 border rounded-lg transition-colors duration-200
        focus-within:outline-none focus-within:ring-2 ring-brand-600 ring-offset-2
        ${hasError 
          ? 'border-red-300 focus-within:border-red-500' 
          : 'border-gray-300 focus-within:border-brand-500'
        }
      `}>
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={`إزالة ${tag}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Input */}
        <input
          id={inputId}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="w-full border-none outline-none bg-transparent text-gray-900 placeholder-gray-500"
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        />
      </div>
      
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
