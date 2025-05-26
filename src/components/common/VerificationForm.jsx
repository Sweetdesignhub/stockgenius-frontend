/**
 * File: VerificationForm
 * Description: This component provides a multi-step verification form for user authentication via OTP (One-Time Password). It supports both email and phone verification, displays timed resend options, and includes a loading state while waiting for API responses. Upon successful verification, it triggers a confirmation modal, managed through a state. The component also handles error feedback and integrates with Redux for user state management and navigation.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../config";
import { signInSuccess, signOut } from "../../redux/user/userSlice";
import ConfirmationModal from "./ConfirmationModal";
import Loading from "./Loading";

const VerificationForm = ({
  onValidSubmit,
  onError,
  step,
  label,
  verificationType,
  userData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedRegion = useSelector((state) => state.region);
  const [isLoading, setIsLoading] = useState(false);
  const [canResendEmail, setCanResendEmail] = useState(false);
  const [canResendPhone, setCanResendPhone] = useState(false);
  const [emailResendTimer, setEmailResendTimer] = useState(60);
  const [phoneResendTimer, setPhoneResendTimer] = useState(60);
  const [error, setError] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let timer;
    if (
      verificationType === "email" &&
      emailResendTimer > 0 &&
      !canResendEmail &&
      !isVerified
    ) {
      timer = setTimeout(() => setEmailResendTimer(emailResendTimer - 1), 1000);
    } else if (
      verificationType === "email" &&
      emailResendTimer === 0 &&
      !canResendEmail &&
      !isVerified
    ) {
      setCanResendEmail(true);
    }
    return () => clearTimeout(timer);
  }, [emailResendTimer, canResendEmail, verificationType, isVerified]);

  useEffect(() => {
    let timer;
    if (
      verificationType === "phone" &&
      phoneResendTimer > 0 &&
      !canResendPhone &&
      !isVerified
    ) {
      timer = setTimeout(() => setPhoneResendTimer(phoneResendTimer - 1), 1000);
    } else if (
      verificationType === "phone" &&
      phoneResendTimer === 0 &&
      !canResendPhone &&
      !isVerified
    ) {
      setCanResendPhone(true);
    }
    return () => clearTimeout(timer);
  }, [phoneResendTimer, canResendPhone, verificationType, isVerified]);

  const handleVerification = async (otp) => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    const endpoint = `/api/v1/auth/verify-${verificationType}`;
    const postData = {
      otp,
      [verificationType === "email" ? "email" : "phoneNumber"]:
        userData[verificationType === "email" ? "email" : "phoneNumber"],
    };
    reset();
    try {
      const response = await api.post(endpoint, postData);
      // console.log(
      //   `${verificationType} Verification Successful:`,
      //   response.data
      // );
      // console.log(step);
      setError(null); // Clear any existing errors on success

      if (step < 3) {
        if (verificationType === "email") {
          // Start phone timer when moving from email to phone verification
          setCanResendPhone(false);
          setPhoneResendTimer(60);
        }
        onValidSubmit(step + 1);
        reset();
      } else {
        const avatar =
          userData?.avatar ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAd5avdba8EiOZH8lmV3XshrXx7dKRZvhx-A&s";
        dispatch(
          signInSuccess({
            avatar: avatar,
            ...userData,
          })
        );
        setIsVerified(true);
        setIsModalOpen(true);
      }
      reset();
    } catch (error) {
      console.error(`${verificationType} Verification Error:`, error);
      const errorMessage =
        error.response?.data?.message ||
        `${verificationType} verification failed`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data) => {
    const otp = Object.values(data).join("");
    // console.log("Complete Verification Code:", otp);
    handleVerification(otp);
  };

  const handleKeyUp = (event, index) => {
    const isBackspace = event.key === "Backspace" && event.target.value === "";
    const targetIndex = isBackspace ? index : index + 2;
    const targetInput = document.querySelector(
      `input[name=digit${targetIndex}]`
    );
    if (targetInput) targetInput.focus();
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    setError(null); // Clear any existing errors when confirming
    dispatch(signOut());
    navigate("/sign-in");
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError(null); // Clear any existing errors when resending OTP
    try {
      const endpoint = `/api/v1/auth/resend-${verificationType}-otp`;
      const postData = {
        [verificationType === "email" ? "email" : "phoneNumber"]:
          userData[verificationType === "email" ? "email" : "phoneNumber"],
      };
      const response = await api.post(endpoint, postData);
      // console.log(`Resent ${verificationType} OTP:`, response.data);
      if (verificationType === "email") {
        setCanResendEmail(false);
        setEmailResendTimer(60);
      } else {
        setCanResendPhone(false);
        setPhoneResendTimer(60);
      }
    } catch (error) {
      console.error(`Error resending ${verificationType} OTP:`, error);
      setError(
        error.response?.data?.message ||
          `Failed to resend ${verificationType} OTP`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {isLoading ? (
        <Loading />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 items-center w-full max-w-md"
        >
          <p className="text-center mb-4 text-lg font-semibold">{label}</p>
          <div className="flex gap-3 justify-center">
            {Array.from({ length: 6 }, (_, index) => (
              <input
                key={index}
                type="text"
                {...register(`digit${index + 1}`)}
                maxLength={1}
                className="w-12 h-12 text-black text-center form-control border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                onKeyUp={(e) => handleKeyUp(e, index)}
              />
            ))}
          </div>
          <button
            type="submit"
            className="mt-6 bg-[#1A2C5C] text-white py-2 px-6 rounded-lg hover:bg-opacity-90 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Verify
          </button>
          {error && !isModalOpen && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}
          {!isVerified &&
            (verificationType === "email" ? (
              canResendEmail ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="mt-4 bg-white text-[#1A2C5C] border-2 border-[#1A2C5C] py-2 px-6 rounded-lg hover:bg-[#1A2C5C] hover:text-white transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Resend Email OTP
                </button>
              ) : (
                <p className="mt-4 text-gray-500 font-medium">
                  Resend Email OTP in{" "}
                  <span className="text-[#FFFFFF] font-bold">
                    {emailResendTimer}
                  </span>{" "}
                  seconds
                </p>
              )
            ) : (
              verificationType === "phone" &&
              (canResendPhone ? (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="mt-4 bg-white text-[#1A2C5C] border-2 border-[#1A2C5C] py-2 px-6 rounded-lg hover:bg-[#1A2C5C] hover:text-white transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Resend Phone OTP
                </button>
              ) : (
                <p className="mt-4 text-gray-500 font-medium">
                  Resend Phone OTP in{" "}
                  <span className="text-[#FFFFFF] font-bold">
                    {phoneResendTimer}
                  </span>{" "}
                  seconds
                </p>
              ))
            ))}
        </form>
      )}
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          title="Success"
          message="You have Registered Successfully"
          onConfirm={handleConfirm}
          onClose={handleConfirm}
        />
      )}
    </div>
  );
};

export default VerificationForm;
