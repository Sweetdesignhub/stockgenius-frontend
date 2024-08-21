import React from "react";
import { useForm } from "react-hook-form";
import api from "../../config";

const VerificationForm = ({
  onValidSubmit,
  step,
  label,
  verificationType,
  userData,
  setUserData,
}) => {
  const { register, handleSubmit, watch } = useForm();

  const onSubmit = (data) => {
    // Extract and combine digits into a single verification code
    const otp =
      watch("digit1") +
      watch("digit2") +
      watch("digit3") +
      watch("digit4") +
      watch("digit5") +
      watch("digit6");

    console.log("Complete Verification Code:", otp);

    // Determine the endpoint based on the verification type
    const endpoint =
      verificationType === "email"
        ? "/api/v1/auth/verify-email"
        : "/api/v1/auth/verify-phone";

    // Prepare data to be sent to the server, only include relevant user data
    const postData = {
      otp,
    };

    if (verificationType === "email") {
      postData.email = userData.email; // Include email only if verification type is email
    } else {
      postData.phoneNumber = userData.phoneNumber; // Include phoneNumber only if verification type is phone
    }

    // Post request to the server
    api
      .post(endpoint, postData)
      .then((response) => {
        console.log(
          `${verificationType} Verification Successful:`,
          response.data
        );
        onValidSubmit(step + 1);
      })
      .catch((error) => {
        console.error(`${verificationType} Verification Error:`, error);
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 items-center"
    >
      <p className="text-center mb-4">{label}</p>
      <div className="flex gap-3">
        {Array.from({ length: 6 }, (_, index) => (
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
};

export default VerificationForm;
