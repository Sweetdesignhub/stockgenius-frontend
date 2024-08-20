import React from "react";
import { useForm } from "react-hook-form";

const VerificationForm = ({ onValidSubmit, step, label }) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("Verification Data:", data);
    onValidSubmit(step + 1); 
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 items-center"
    >
      <p className="text-center mb-4">{label}</p>
      <div className="flex gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            type="text"
            {...register(`digit${index + 1}`)}
            maxLength="1"
            className="w-10 h-10 text-black text-center form-control"
            onKeyUp={(e) => handleKeyUp(e, index)}
          />
        ))}
      </div>
      <button
        type="submit"
        className="mt-4 bg-[#1A2C5C] text-white p-2 rounded-lg hover:opacity-95"
      >
        Verify
      </button>
    </form>
  );

  function handleKeyUp(e, index) {
    if (e.key !== "Backspace" && e.target.nextSibling) {
      e.target.nextSibling.focus();
    } else if (e.key === "Backspace" && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  }
};

export default VerificationForm;
