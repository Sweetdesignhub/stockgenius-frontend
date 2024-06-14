import React from "react";

const Input = ({ label, name, type, value, onChange, min }) => {
  return (
    <div className="mb-4">
      <label className="block text-white text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        min={min}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
};

export default Input;
