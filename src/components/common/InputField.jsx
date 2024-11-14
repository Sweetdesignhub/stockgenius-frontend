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

  const getWidth = () => {
    switch (name) {
      case "password":
      case "confirmPassword":
      case "country":
      case "state":
        return "w-[48%]";
      default:
        return "w-full";
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderInput = () => {
    if (options) {
      return (
        <select
          id={name}
          {...register(name)}
          className={`bg-slate-100 text-black p-3 rounded-md ${className}`}
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
            className={`bg-slate-100 text-black p-3 rounded-md w-full ${className}`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <Eye className="h-5 w-5 text-gray-500" />
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
          className={`bg-slate-100 text-black p-3 rounded-md ${className}`}
        />
      );
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${getWidth()}`}>
      <label htmlFor={name} className="dark:text-[#FFFFFFCC]">
        {label}
      </label>
      {renderInput()}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default InputField;
