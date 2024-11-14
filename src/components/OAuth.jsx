/**
 * File: OAuth
 * Description: This component handles Google sign-in authentication for the application. It leverages the @react-oauth/google library to manage Google login functionality. Upon successful login, it sends the Google authentication token to the backend for validation and user data retrieval. If the user has not selected a region yet, a modal prompts them to do so before continuing with the sign-in process. If the sign-in is successful, the user is redirected to the dashboard page for their selected region. The component also manages loading states and displays error messages if the authentication fails.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import { GoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess, signInFailure } from "../redux/user/userSlice";
import api from "../config";
import ConfirmationModal from "./common/ConfirmationModal";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "./common/Loading";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const selectedRegion = useSelector((state) => state.region);

  const handleGoogleSignIn = async (tokenResponse) => {
    if (!selectedRegion) {
      setIsModalOpen(true);
      return;
    }
    console.log(tokenResponse);

    setIsLoading(true);

    try {
      const res = await api.post("/api/v1/auth/google-auth", {
        token: tokenResponse.credential,
        country: "",
        state: "",
      });

      const { data, requiresAdditionalInfo, userId } = res.data;

      if (requiresAdditionalInfo) {
        navigate(`/complete-profile`, {
          state: { userId, email: data?.email },
        });
      } else {
        dispatch(signInSuccess(data));
        navigate(`/${selectedRegion}/dashboard`);
      }
    } catch (error) {
      let errorMessage = "An error occurred during sign-in. Please try again.";

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage =
          "No response received from server. Please check your internet connection.";
      }

      dispatch(signInFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <GoogleLogin
            onSuccess={handleGoogleSignIn}
            onError={() => {
              const errorMessage = "Google sign-in failed. Please try again.";
              dispatch(signInFailure(errorMessage));
              toast.error(errorMessage);
            }}
            style={{ width: "100%", maxWidth: "620px" }}
            disabled={isLoading}
          />
        </div>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Region Not Selected"
        message="Please select a region before signing in."
        onConfirm={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
