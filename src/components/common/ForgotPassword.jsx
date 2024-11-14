/**
 * File: ForgotPassword
 * Description: This component allows users to request a password reset by entering their email. It includes form validation, error handling, and communicates with an API endpoint to send a password reset link.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */


import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '../../config';

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/api/v1/auth/forgot-password', data);
      toast.success(
        'If an account exists with that email, a password reset link has been sent.'
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-8'>
      <h2 className='text-2xl font-bold mb-4 dark:text-[#fffff]'>
        Forgot Password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label htmlFor='email' className='block mb-1'>
            Email
          </label>
          <input
            type='email'
            id='email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email address',
              },
            })}
            className='w-full px-3 py-2 text-black border rounded'
          />
          {errors.email && (
            <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>
          )}
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
