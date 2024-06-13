import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";

import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

function SignIn() {
  const [formData, setFormData] = useState({});

  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const response = await axios.post(`/api/v1/auth/sign-in`, formData);
      const data = await response.data;
      console.log(data);

      if (data.sucess === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error));
      console.log(error);
    }
  };

  return (
    <div className=" max-w-xl px-20 py-10 mx-auto auth rounded-2xl">
      <h1 className="text-3xl text-center font-semibold my-8">Sign In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <OAuth />

        <div className="flex items-center justify-center">
          <div className="flex-grow border-t border-[#FFFFFF66]"></div>
          <p className="text-[#FFFFFF] text-center mx-3">Or</p>
          <div className="flex-grow border-t border-[#FFFFFF66]"></div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="dark:text-[#FFFFFFCC]">
            Email address
          </label>
          <input
            required
            type="email"
            placeholder="email@domain.com"
            id="email"
            className="bg-slate-100 text-black p-3 rounded-sm"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="dark:text-[#FFFFFFCC]">
            Password
          </label>
          <input
            required
            type="password"
            placeholder="Password"
            id="password"
            className="bg-slate-100 text-black p-3 rounded-sm"
            onChange={handleChange}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className=" auth-btn bg-[#1A2C5C] text-white p-3 rounded-lg hover:opacity-85 disabled:opacity-80"
        >
          {loading ? "Loading ..." : "Sign in"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="dark:text-[#FFFFFF99] text-gray-500">
          Don't have an account?{" "}
          <Link to={"/sign-up"}>
            <span className="dark:text-white text-gray-800">Sign up</span>
          </Link>
        </p>
      </div>
      <p className="text-red-500 text-center mt-5">
        {error
          ? error.message || "Something went wrong, please try again !!"
          : ""}
      </p>
    </div>
  );
}

export default SignIn;
