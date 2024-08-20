import React from "react";
import { Country, State } from "country-state-city";

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
