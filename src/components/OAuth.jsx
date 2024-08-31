import { useGoogleLogin } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInSuccess, signInFailure } from '../redux/user/userSlice';
import api from '../config';
import ConfirmationModal from './common/ConfirmationModal';
import { useState } from 'react';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedRegion = useSelector((state) => state.region);

  const handleGoogleSignIn = async (tokenResponse) => {
    if (!selectedRegion) {
      setIsModalOpen(true);
      return;
    }
    console.log(tokenResponse);

    try {
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${tokenResponse.credential}` },
        }
      );
      const userInfo = await userInfoResponse.json();

      const res = await api.post('/api/v1/auth/google-auth', {
        token: tokenResponse.credential,
        country: userInfo.locale ? userInfo.locale.split('_')[1] : '',
        state: '',
      });

      const { data, requiresAdditionalInfo, userId } = res.data;

      if (requiresAdditionalInfo) {
        navigate(`/complete-profile`, {
          state: { userId, email: userInfo.email },
        });
      } else {
        dispatch(signInSuccess(data));
        navigate(`/${selectedRegion}/dashboard`);
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
      console.error('Could not login with Google:', error);
    }
  };

  // const login = useGoogleLogin({
  //   onSuccess: handleGoogleSignIn,
  //   onError: () => console.log('Login Failed'),
  // });

  return (
    <>
      {/* <button
        onClick={() => login()}
        className='rounded-lg p-3 flex items-center justify-center bg-white text-black dark:border-collapse border'
      >
        <img
          src='https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc7f00d03c7224a7b97423ef6bf741a1f'
          alt='Google'
          className='h-6 mr-3'
        />
        <p>Continue with Google</p>
      </button> */}
      <GoogleLogin
        onSuccess={handleGoogleSignIn}
        onError={() => console.log('Login Failed')}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        title='Region Not Selected'
        message='Please select a region before signing in.'
        onConfirm={() => setIsModalOpen(false)}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
