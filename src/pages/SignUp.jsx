import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import api from "../config";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post(`/api/v1/auth/sign-up`, formData);
      const data = await response.data;

      setLoading(false);

      if (data.success === false) {
        setError(true);
        return;
      }
      setError(false);
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="max-w-xl px-20 py-10 mx-auto auth rounded-2xl">
      <h1 className="text-3xl text-center font-semibold my-8">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <OAuth />

        <div className="flex items-center justify-center">
          <div className="flex-grow border-t border-[#FFFFFF66]"></div>
          <p className="text-[#FFFFFF] text-center mx-3">Or</p>
          <div className="flex-grow border-t border-[#FFFFFF66]"></div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="dark:text-[#FFFFFFCC]">
            Username
          </label>
          <input
            required
            type="text"
            placeholder="Username"
            id="username"
            className="bg-slate-100 text-black p-3 rounded-sm"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="dark:text-[#FFFFFFCC]">
            Email address
          </label>
          <input
            required
            type="email"
            placeholder="Email"
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
          className="auth-btn bg-[#1A2C5C] text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading ..." : "Sign up"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="dark:text-[#FFFFFF99] text-gray-500">
          Have an account?{" "}
          <Link to={"/sign-in"}>
            <span className="dark:text-white text-gray-800">Sign in</span>
          </Link>
        </p>
      </div>
      <p className="text-red-500 text-center mt-5">
        {error && "Something went wrong !!"}
      </p>
    </div>
  );
}

export default SignUp;
