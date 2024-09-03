// import  { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   signInStart,
//   signInSuccess,
//   signInFailure,
// } from "../redux/user/userSlice";

// import { useDispatch, useSelector } from "react-redux";
// import OAuth from "../components/OAuth";
// import api from "../config";

// function SignIn() {
//   const [formData, setFormData] = useState({});

//   const { loading, error } = useSelector((state) => state.user);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.id]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       dispatch(signInStart());
//       const response = await api.post(`/api/v1/auth/sign-in`, formData);
//       const data = await response.data;
//       console.log(data);

//       if (data.sucess === false) {
//         dispatch(signInFailure(data.message));
//         return;
//       }
//       dispatch(signInSuccess(data));
//       navigate("/dashboard");
//     } catch (error) {
//       dispatch(signInFailure(error));
//       console.log(error);
//     }
//   };

//   return (
//     <div className=" max-w-xl px-20 py-10 mx-auto auth rounded-2xl">
//       <h1 className="text-3xl text-center font-semibold my-8">Sign In</h1>

//       <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//         <OAuth />

//         <div className="flex items-center justify-center">
//           <div className="flex-grow border-t border-[#FFFFFF66]"></div>
//           <p className="text-[#FFFFFF] text-center mx-3">Or</p>
//           <div className="flex-grow border-t border-[#FFFFFF66]"></div>
//         </div>

//         <div className="flex flex-col gap-2">
//           <label htmlFor="email" className="dark:text-[#FFFFFFCC]">
//             Email address
//           </label>
//           <input
//             required
//             type="email"
//             placeholder="email@domain.com"
//             id="email"
//             className="bg-slate-100 text-black p-3 rounded-sm"
//             onChange={handleChange}
//           />
//         </div>

//         <div className="flex flex-col gap-2">
//           <label htmlFor="password" className="dark:text-[#FFFFFFCC]">
//             Password
//           </label>
//           <input
//             required
//             type="password"
//             placeholder="Password"
//             id="password"
//             className="bg-slate-100 text-black p-3 rounded-sm"
//             onChange={handleChange}
//           />
//         </div>

//         <button
//           disabled={loading}
//           type="submit"
//           className=" auth-btn bg-[#1A2C5C] text-white p-3 rounded-lg hover:opacity-85 disabled:opacity-80"
//         >
//           {loading ? "Loading ..." : "Sign in"}
//         </button>
//       </form>

//       <div className="mt-6 text-center">
//         <p className="dark:text-[#FFFFFF99] text-gray-500">
//           Don't have an account?{" "}
//           <Link to={"/sign-up"}>
//             <span className="dark:text-white text-gray-800">Sign up</span>
//           </Link>
//         </p>
//       </div>
//       <p className="text-red-500 text-center mt-5">
//         {error
//           ? error.message || "Something went wrong, please try again !!"
//           : ""}
//       </p>
//     </div>
//   );
// }

// export default SignIn;

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import api from '../config';
import { setRegion } from '../redux/region/regionSlice';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { Eye, EyeOff } from 'lucide-react'; 

function SignIn() {
  const [formData, setFormData] = useState({});
  const [useOTP, setUseOTP] = useState(false);
  const [load, setLoad] = useState(false);
  const [otp, setOTP] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const { error } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedRegion = useSelector((state) => state.region);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  // State to manage the selected country
  // const [selectedCountry, setSelectedCountry] = useState("");
  // console.log(selectedCountry);

  // const [selectedRegion, setSelectedRegion] = useState("");
  // console.log("selectedRegion : ", selectedRegion);

  useEffect(() => {
    const region = localStorage.getItem('region');
    if (region) {
      dispatch(setRegion(region));
    }
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // const handleCountryChange = (e) => {
  //   console.log(e.target.value);
  //   setSelectedCountry(e.target.value);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRegion) {
      setIsModalOpen(true);
      return;
    }

    try {
      dispatch(signInStart());
      // console.log("Form Data:", formData);
      if (otpSent) {
        // Verify OTP
        const response = await api.post('/api/v1/auth/verify-login-otp', {
          ...formData,
          otp,
        });
        const data = await response.data.data;
        if (data.success === false) {
          dispatch(signInFailure(data.message));
          return;
        }
        dispatch(signInSuccess(data));
        navigate(`/${selectedRegion}/dashboard`);
      } else {
        // Initial login attempt
        const response = await api.post('/api/v1/auth/login', {
          ...formData,
          useOTP,
        });
        const data = await response.data.data;

        if (useOTP) {
          setOtpSent(true);
        } else if (data.success === false) {
          dispatch(signInFailure(data.message));
          return;
        } else {
          dispatch(signInSuccess(data));
          navigate(`/${selectedRegion}/dashboard`);
        }
      }

      // Successful sign-in logic
      // const country = selectedCountry;

      // Store selected country in local storage
      // localStorage.setItem("country", country);
    } catch (error) {
      dispatch(signInFailure(error));
      console.error('Sign-in Error:', error);
    }
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='max-w-xl px-20 py-10 mx-auto auth rounded-2xl'>
      <h1 className='text-3xl text-center font-semibold my-8'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <OAuth />

        <div className='flex items-center justify-center'>
          <div className='flex-grow border-t border-[#FFFFFF66]'></div>
          <p className='text-[#FFFFFF] text-center mx-3'>Or</p>
          <div className='flex-grow border-t border-[#FFFFFF66]'></div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='email' className='dark:text-[#FFFFFFCC]'>
            Email address / Phone Number
          </label>
          <input
            required
            type='string'
            placeholder='email@domain.com / +91XXXXXXXXXX'
            id='identifier'
            className='bg-slate-100 text-black p-3 rounded-sm'
            onChange={handleChange}
          />
        </div>

        {!useOTP && (
          <div className='flex flex-col gap-2'>
            <label htmlFor='password' className='dark:text-[#FFFFFFCC]'>
              Password
            </label>
            <div className='relative'>
            <input
              required
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              id='password'
              className='bg-slate-100 text-black p-3 rounded-sm w-full'
              onChange={handleChange}
            />
                          <button
                type='button'
                className='absolute right-3 top-1/2 transform -translate-y-1/2'
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5 text-gray-500' />
                ) : (
                  <Eye className='h-5 w-5 text-gray-500' />
                )}
              </button>
            </div>
          </div>
        )}

        {otpSent && (
          <div className='flex flex-col gap-2'>
            <label htmlFor='otp' className='dark:text-[#FFFFFFCC]'>
              Enter OTP
            </label>
            <input
              required
              type='text'
              placeholder='Enter OTP'
              id='otp'
              className='bg-slate-100 text-black p-3 rounded-sm'
              onChange={(e) => setOTP(e.target.value)}
            />
          </div>
        )}

        {!otpSent && (
          <div className='flex items-center gap-2'>
            <input
              type='checkbox'
              id='useOTP'
              checked={useOTP}
              onChange={() => setUseOTP(!useOTP)}
            />
            <label htmlFor='useOTP' className='dark:text-[#FFFFFFCC]'>
              Use OTP
            </label>
          </div>
        )}

        <button
          disabled={load}
          type='submit'
          className='auth-btn bg-[#1A2C5C] text-white p-3 rounded-lg hover:opacity-85 disabled:opacity-80'
        >
          {load ? 'Loading ...' : otpSent ? 'Verify OTP' : 'Sign in'}
        </button>
      </form>

      <div className='mt-6 text-center'>
        <p className='dark:text-[#FFFFFF99] text-gray-500'>
          Don&apos;t have an account?{' '}
          <Link to={'/sign-up'}>
            <span className='dark:text-white text-gray-800'>Sign up</span>
          </Link>
        </p>
        <Link to='/forgot-password' className='text-blue-500 hover:underline'>
          Forgot Password?
        </Link>
      </div>
      <p className='text-red-500 text-center mt-5'>
        {error
          ? error.message || 'Something went wrong, please try again !!'
          : ''}
      </p>
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          title='Region not selected'
          message='Please select a region before signing in.'
          onConfirm={handleConfirm}
          onClose={handleConfirm}
        />
      )}
    </div>
  );
}

export default SignIn;
