import { useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Ensure you have the correct import
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice';
import Cookies from 'js-cookie';

const useTokenExpiration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get('access_token'); // Get the token from cookies using js-cookie
    console.log("token : ", token);

    if (token) {
      try {
        const { exp } = jwtDecode(token);
        const expirationTime = exp * 1000 - Date.now();

        if (expirationTime > 0) {
          const timer = setTimeout(() => {
            dispatch(signOut());
            Cookies.remove('access_token'); // Clear the cookie using js-cookie
          }, expirationTime);

          return () => clearTimeout(timer); // Cleanup timer on component unmount
        } else {
          dispatch(signOut());
          Cookies.remove('access_token'); // Clear the cookie using js-cookie
        }
      } catch (error) {
        dispatch(signOut());
        Cookies.remove('access_token'); // Clear the cookie in case of error
      }
    }
  }, [dispatch]);
};

export default useTokenExpiration;
