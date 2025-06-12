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
  clearError,
} from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import api from '../config';
import { setRegion } from '../redux/region/regionSlice';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { Eye, EyeOff } from 'lucide-react';
import Loading from '../components/common/Loading';

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
  const [showOTP, setShowOTP] = useState(false);
  const [isPhoneNumber, setIsPhoneNumber] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91'); // Default to IN
  // New states for OTP resend functionality
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

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

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // New useEffect for handling the resend timer
  useEffect(() => {
    let timer;
    if (otpSent && resendTimer > 0 && !canResendOTP) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else if (otpSent && resendTimer === 0 && !canResendOTP) {
      setCanResendOTP(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer, canResendOTP, otpSent]);


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
    if (id === 'identifier') {
      setIsPhoneNumber(/^\d/.test(value));
    }
  };

  const handleCountryCodeChange = (e) => {
    setSelectedCountryCode(e.target.value);
  };

  // const handleCountryChange = (e) => {
  //   console.log(e.target.value);
  //   setSelectedCountry(e.target.value);
  // };

  // New function to handle OTP resend

  const handleResendOTP = async () => {
    try {
      setLoad(true);
      let submissionData = { ...formData };
      if (isPhoneNumber) {
        submissionData.identifier = `${selectedCountryCode}${formData.identifier}`;
      }

      const response = await api.post('/api/v1/auth/login', {
        ...submissionData,
        useOTP: true
      });

      // Reset the timer and disable resend button
      setResendTimer(60);
      setCanResendOTP(false);

    } catch (error) {
      dispatch(signInFailure(error.response?.data?.message || error.message || 'Failed to resend OTP'));
    } finally {
      setLoad(false);
    }
  };
  const handleGetOTP = async () => {
    if (!selectedRegion) {
      setIsModalOpen(true);
      return;
    }

    if (!formData.identifier || formData.identifier.trim() === '') {
      setIsEmptyFieldModal(true);
      return;
    }

    try {
      setLoad(true);
      let submissionData = { ...formData };
      if (isPhoneNumber) {
        submissionData.identifier = `${selectedCountryCode}${formData.identifier}`;
      }

      const response = await api.post('/api/v1/auth/login', {
        ...submissionData,
        useOTP: true
      });

      // Show loading for 3 seconds before setting OTP sent
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpSent(true);
      setResendTimer(60);
      setCanResendOTP(false);

    } catch (error) {
      dispatch(signInFailure(error.response?.data?.message || error.message || 'Failed to send OTP'));
    } finally {
      setLoad(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRegion) {
      setIsModalOpen(true);
      return;
    }

    try {
      dispatch(signInStart());
      let submissionData = { ...formData };
      if (isPhoneNumber) {
        submissionData.identifier = `${selectedCountryCode}${formData.identifier}`;
      }
      if (otpSent) {
        // Verify OTP
        const response = await api.post('/api/v1/auth/verify-login-otp', 
          {
            ...submissionData,
            otp,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: true
          }
        );
        const data = await response.data.data;
        if (data.success === false) {
          dispatch(signInFailure(data.message));
          return;
        }
        // Set login timestamp when successfully signed in
        localStorage.setItem('loginTimestamp', new Date().getTime().toString());
        dispatch(signInSuccess(data));
        navigate(`/${selectedRegion}/dashboard`);
      } else {
        // Initial login attempt
        const response = await api.post('/api/v1/auth/login', 
          {
            ...submissionData,
            useOTP,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            withCredentials: true
          }
        );
        const data = await response.data.data;

        if (useOTP) {
          setOtpSent(true);
          setResendTimer(60);
          setCanResendOTP(false);
        } else if (data.success === false) {
          dispatch(signInFailure(data.message));
          return;
        } else {
          // Set login timestamp when successfully signed in
          localStorage.setItem('loginTimestamp', new Date().getTime().toString());
          dispatch(signInSuccess(data));
          navigate(`/${selectedRegion}/dashboard`);
        }
      }

    } catch (error) {
      console.error('Sign-in Error Details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      dispatch(signInFailure(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Unable to sign in. Please try again.'
      ));
    }
  };
  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleEmptyFieldConfirm = () => {
    setIsEmptyFieldModal(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleOTPVisibility = () => {
    setShowOTP(!showOTP);
  };

  // Sample country codes, you might want to expand this list
  const countryCodes = [
    { code: '+1', country: 'US' },
    { code: '+44', country: 'UK' },
    { code: '+91', country: 'IN' },
    // Add more country codes as needed
  ];
  return (
      <div className='min-h-[100px] flex items-center justify-center mt-10 px-4 sm:px-6'>
        <div className='w-full max-w-[400px] mx-auto rounded-2xl px-4 sm:px-6 py-10'
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)',
            border: '1.04px solid transparent',
            borderImage: 'linear-gradient(180deg, rgba(39, 55, 207, 0.4) 17.19%, rgba(101, 98, 251, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(39, 55, 207, 0) -4.69%, rgba(189, 252, 254, 0.3) 100%)',
            borderImageSlice: '1',
            boxShadow: '0px 10.35px 31.05px 0px rgba(73, 123, 255, 0.7) inset, 0px 10.35px 41.41px 0px rgba(63, 74, 175, 0.5)',
            backdropFilter: 'blur(20.702987670898438px)',
          }}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <img
            className="h-7 xl:h-7 lg:h-5 mr-1"
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F44c1d4cdd7274260a729d09f18bb553e"
            alt="Stockgenius.ai"
          />
          <h1 className='text-2xl text-center font-semibold'>Sign In</h1>
        </div>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <OAuth />          <div className='flex items-center justify-center my-2'>
            <div className='flex-grow border-t border-[#FFFFFF66] dark:border-[#FFFFFF66] border-gray-300'></div>
            <p className='dark:text-[#FFFFFF] text-gray-700 text-center mx-4 text-sm'>Or</p>
            <div className='flex-grow border-t border-[#FFFFFF66] dark:border-[#FFFFFF66] border-gray-300'></div>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='identifier' className='dark:text-[#FFFFFFCC] text-sm'>
              Email address / Phone Number
            </label>
            <div className='flex'>
              {isPhoneNumber && (
                <select
                  value={selectedCountryCode}
                  onChange={handleCountryCodeChange}
                  className='bg-slate-100 text-black p-2.5 rounded-l-sm text-sm'
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.code} ({country.country})
                    </option>
                  ))}
                </select>
              )}
              <input
                required
                type='text'
                placeholder='email@domain.com / Phone Number'
                id='identifier'
                className={`bg-slate-100 text-black p-2.5 ${isPhoneNumber ? 'rounded-r-sm' : 'rounded-sm'
                  } flex-grow text-sm`}
                onChange={handleChange}
              />
            </div>
          </div>          {!useOTP && (
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between items-center'>
                <label htmlFor='password' className='dark:text-[#FFFFFFCC] text-sm'>
                  Password
                </label>
                <Link to='/forgot-password' className='text-blue-500 hover:underline text-sm'>
                  Forgot Password?
                </Link>
              </div>
              <div className='relative'>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  id='password'
                  className='bg-slate-100 text-black p-2.5 rounded-sm w-full text-sm'
                  onChange={handleChange}
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 transform -translate-y-1/2'
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 text-gray-500' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-500' />
                  )}
                </button>
              </div>
            </div>
          )}

          {otpSent && (
            <div className='flex flex-col gap-2'>
              <label htmlFor='otp' className='dark:text-[#FFFFFFCC] text-sm'>
                Enter OTP
              </label>
              <div className='relative'>
                <input
                  required
                  type={showOTP ? 'text' : 'password'}
                  placeholder='Enter OTP'
                  id='otp'
                  className='bg-slate-100 text-black p-2.5 rounded-sm w-full text-sm'
                  onChange={(e) => setOTP(e.target.value)}
                />
                <button
                  type='button'
                  className='absolute right-3 top-1/2 transform -translate-y-1/2'
                  onClick={toggleOTPVisibility}
                >
                  {showOTP ? (
                    <EyeOff className='h-4 w-4 text-gray-500' />
                  ) : (
                    <Eye className='h-4 w-4 text-gray-500' />
                  )}
                </button>
              </div>
              {/* New resend OTP section */}
              {canResendOTP ? (
                <button
                  type='button'
                  onClick={handleResendOTP}
                  className='mt-1 text-blue-500 hover:text-blue-600 text-sm font-medium'
                  disabled={load}
                >
                  Resend OTP
                </button>
              ) : (
                <p className='mt-1 text-xs text-gray-500'>
                  Resend OTP in <span className="text-[#FFFFFF] font-medium">{resendTimer}</span> seconds
                </p>
              )}
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
              <label htmlFor='useOTP' className='dark:text-[#FFFFFFCC] text-sm'>
                Use OTP
              </label>
            </div>
          )}          <button
              type={useOTP && !otpSent ? 'button' : 'submit'}
              onClick={useOTP && !otpSent ? handleGetOTP : undefined}
              className='auth-btn bg-[#1A2C5C] text-white p-2.5 rounded-lg hover:opacity-85 disabled:opacity-80 min-h-[42px] flex items-center justify-center mt-2'
              disabled={load}
            >
              {load ? (
                <div className="w-5 h-5 flex items-center justify-center">
                  <Loading isSignInOTP={true} />
                </div>
              ) : (
                otpSent ? 'Verify OTP' : useOTP ? 'Get OTP' : 'Sign in'
              )}
            </button>
        </form>        <div className='mt-4 text-center'>
          <p className='dark:text-[#FFFFFF99] text-gray-500 text-sm'>
            Don&apos;t have an account?{' '}
            <Link to={'/sign-up'}>
              <span className='dark:text-white text-gray-800'>Sign up</span>
            </Link>
          </p>
        </div>

        {error && (
          <p className='text-red-500 text-center mt-4 text-sm'>
            {error}
          </p>
        )}
      </div>

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
