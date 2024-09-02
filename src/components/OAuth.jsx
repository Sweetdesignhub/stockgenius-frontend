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
      const res = await api.post('/api/v1/auth/google-auth', {
        token: tokenResponse.credential,
        country: '',
        state: '',
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
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <GoogleLogin
          onSuccess={handleGoogleSignIn}
          onError={() => console.log('Login Failed')}
          style={{ width: '100%', maxWidth: '620px' }}
        />
      </div>
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
