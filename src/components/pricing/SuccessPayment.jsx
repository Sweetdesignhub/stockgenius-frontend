import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice.js";
import api from "../../config";

function SuccessPayment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const region = useSelector((state) => state.region) || localStorage.getItem("region") || "india";
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async (retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          dispatch(updateUserStart());
          const res = await api.get("/api/v1/users/me", {
            withCredentials: true,
          });
          console.log(
            "User data in SuccessPayment:",
            JSON.stringify(res.data, null, 2)
          );

          if (!isMounted) return;

          const userData = res.data.user || res.data;
          const normalizedUser = {
            ...userData,
            id: userData._id || userData.id,
            plan: userData.plan || "basic",
            planUsa: userData.planUsa || "basic",
          };
          delete normalizedUser._id;

          dispatch(updateUserSuccess(normalizedUser));
          console.log(
            "Updated Redux currentUser in SuccessPayment:",
            JSON.stringify(normalizedUser, null, 2)
          );
          setIsLoading(false);
          return;
        } catch (error) {
          if (i < retries - 1) {
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          if (!isMounted) return;
          console.error("Fetch user error:", error.message);
          dispatch(updateUserFailure(error.message));
          setError("Failed to load user data.");
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    const redirectTimer = setTimeout(() => {
      if (isMounted && !error && !isLoading) {
        navigate(`/${region}/dashboard`, { replace: true });
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(redirectTimer);
    };
  }, [dispatch, navigate, region, error, isLoading]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate(`/${region}/dashboard`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div
        className="relative w-full max-w-md mx-4 p-8 rounded-[10px] overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #278848 132.95%)",
          border: "1px solid transparent",
          borderImage:
            "linear-gradient(180deg, rgba(39, 136, 72, 0.4) 17.19%, rgba(98, 251, 141, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(39, 136, 60, 0) -4.69%, rgba(189, 254, 196, 0.3) 100%)",
          borderImageSlice: "1",
          backdropFilter: "blur(17.95px)",
          boxShadow:
            "0px 8.97px 26.92px 0px rgba(73, 255, 91, 0.7) inset, 0px 8.97px 35.9px 0px rgba(65, 175, 63, 0.5)",
        }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[17.95px]" />
        <div className="relative z-10 text-center">
          <div className="mb-6 text-[rgba(73,255,91,1)]">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="font-['Aldrich'] text-[28px] sm:text-[32px] font-normal leading-[100%] tracking-[0.02em] text-white mb-4">
            Payment Successful!
          </h2>
          <p className="font-['Poppins'] text-[16px] sm:text-[18px] text-gray-200 mb-4">
            {isLoading
              ? "Processing your account upgrade..."
              : "Your account has been upgraded."}
          </p>
          <p className="text-sm text-gray-300 font-light">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuccessPayment;