import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../config';
import { signInSuccess } from '../../redux/user/userSlice';
const VerificationForm = ({
  onValidSubmit,
  step,
  label,
  verificationType,
  userData,
  setUserData,
}) => {
  const { register, handleSubmit, watch } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedRegion = useSelector((state) => state.region);
  const onSubmit = (data) => {
    const otp =
      watch('digit1') +
      watch('digit2') +
      watch('digit3') +
      watch('digit4') +
      watch('digit5') +
      watch('digit6');
    console.log('Complete Verification Code:', otp);
    const endpoint =
      verificationType === 'email'
        ? '/api/v1/auth/verify-email'
        : '/api/v1/auth/verify-phone';
    const postData = {
      otp,
    };

    if (verificationType === 'email') {
      postData.email = userData?.email; // Include email only if verification type is email
    } else {
      postData.phoneNumber = userData?.phoneNumber; // Include phoneNumber only if verification type is phone
    }

    // Post request to the server
    api
      .post(endpoint, postData)
      .then((response) => {
        console.log(
          `${verificationType} Verification Successful:`,
          response.data
        );
        if (step < 3) {
          onValidSubmit(step + 1);
        }
        if (step == 3) {
          dispatch(
            signInSuccess({
              avatar:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAd5avdba8EiOZH8lmV3XshrXx7dKRZvhx-A&s',
              ...userData,
            })
          );
          navigate(`/sign-in`);
        }
      })
      .catch((error) => {
        console.error(`${verificationType} Verification Error:`, error);
      });
  };

  const handleKeyUp = (event, index) => {
    if (event.key === 'Backspace' && event.target.value === '') {
      const prevInput = document.querySelector(`input[name=digit${index}]`);
      if (prevInput) {
        prevInput.focus();
      }
    } else {
      const nextInput = document.querySelector(`input[name=digit${index + 2}]`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 items-center'
    >
      <p className='text-center mb-4'>{label}</p>
      <div className='flex gap-3'>
        {Array.from({ length: 6 }, (_, index) => (
          <input
            key={index}
            type='text'
            {...register(`digit${index + 1}`)}
            maxLength='1'
            className='w-10 h-10 text-black text-center form-control'
            onKeyUp={(e) => handleKeyUp(e, index)}
          />
        ))}
      </div>
      <button
        type='submit'
        className='mt-4 bg-[#1A2C5C] text-white p-2 rounded-lg hover:opacity-95'
      >
        Verify
      </button>
    </form>
  );
};

export default VerificationForm;
