/**
 * File: Input
 * Description: This reusable `Input` component renders an input field with optional label, validation, and error handling. It accepts props for configuring the label, type, value, placeholder, and more. It is used for creating various types of input fields in forms.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */



import React from "react";

const Input = ({ label, name, type, value, onChange, min, placeholder, defaultValue, disabled, required }) => {
  return (
    <div className="mb-4">
      <label className="block dark:text-white text-black text-xs mb-2" htmlFor={name}>
        {label}{required && <span className="text-red-500 ml-1">*</span>} 
      </label>
      <input
      // defaultValue={defaultValue}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="shadow text-sm appearance-none border rounded w-full py-1 px-1 text-black leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
};

export default Input;
