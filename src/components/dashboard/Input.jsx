import React from "react";

function Input({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col">
      <label className="text-[#FFFFFFCC] text-sm">{label}</label>
      <input
        required
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        style={{ boxShadow: "0px 9px 20px 0px #0000000F" }}
        className="mt-2 py-2 text-sm px-2 rounded-md text-[#979797E5] font-[poppins] border-[#DDDDDD] border w-full"
      />
    </div>
  );
}

export default Input;
