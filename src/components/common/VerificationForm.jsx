import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../config';
import { signInSuccess } from '../../redux/user/userSlice';
import ConfirmationModal from './ConfirmationModal';

const VerificationForm = ({
  onValidSubmit,
  step,
  label,
  verificationType,
  userData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, watch, reset } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVerification = async (otp) => {
    const endpoint = `/api/v1/auth/verify-${verificationType}`;
    const postData = {
      otp,
      [verificationType === 'email' ? 'email' : 'phoneNumber']:
        userData[verificationType === 'email' ? 'email' : 'phoneNumber'],
    };
    reset();
    try {
      const response = await api.post(endpoint, postData);
      console.log(
        `${verificationType} Verification Successful:`,
        response.data
      );
      console.log(step);

      if (step < 3) {
        onValidSubmit(step + 1);
        reset();
      } else {
        const avatar =
          userData?.avatar ||
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAd5avdba8EiOZH8lmV3XshrXx7dKRZvhx-A&s';
        dispatch(
          signInSuccess({
            avatar: avatar,
            ...userData,
          })
        );
        setIsModalOpen(true);
      }
      reset();
    } catch (error) {
      console.error(`${verificationType} Verification Error:`, error);
    }
  };

  const onSubmit = (data) => {
    const otp = Object.values(data).join('');
    console.log('Complete Verification Code:', otp);
    handleVerification(otp);
  };

  const handleKeyUp = (event, index) => {
    const isBackspace = event.key === 'Backspace' && event.target.value === '';
    const targetIndex = isBackspace ? index : index + 2;
    const targetInput = document.querySelector(
      `input[name=digit${targetIndex}]`
    );
    if (targetInput) targetInput.focus();
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    navigate('/sign-in');
  };

  return (
    <div>
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
              maxLength={1}
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
      {isModalOpen && (
        <ConfirmationModal
          isOpen={isModalOpen}
          title='Success'
          message='You have Registered Successfully'
          onConfirm={handleConfirm}
          onClose={handleConfirm}
        />
      )}
    </div>
  );
};

export default VerificationForm;
