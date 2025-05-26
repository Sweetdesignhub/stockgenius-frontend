/**
 * File: InputField
 * Description: This `InputField` component renders different types of input fields such as text, password, and dropdown, with label, validation, and error handling. It also allows toggling the visibility of password inputs. It is designed to handle various form input scenarios and can be customized using different props.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */



import React, { useState } from "react";
import { Eye, EyeOff } from 'lucide-react'; 

const InputField = ({
  label,
  name,
  type,
  placeholder,
  register,
  error,
  className,
  options, // New prop for dropdown options
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderInput = () => {
    if (options) {
      return (
        <select
          id={name}
          {...register(name)}
          className={`bg-slate-100 text-black p-2 rounded-sm text-xs w-full ${className}`}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    } else if (type === "password") {
      return (
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            id={name}
            {...register(name)}
            className={`bg-slate-100 text-black p-2 rounded-sm text-xs w-full ${className}`}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      );
    } else {
      return (
        <input
          type={type}
          placeholder={placeholder}
          id={name}
          {...register(name)}
          className={`bg-slate-100 text-black p-2 rounded-sm text-xs w-full ${className}`}
        />
      );
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={name} className="dark:text-[#FFFFFFCC] text-xs">
        {label}
      </label>
      {renderInput()}
      {error && <div className="text-red-500 text-[10px]">{error}</div>}
    </div>
  );
};

export default InputField;
