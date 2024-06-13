import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice";
import api from "../config";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const res = await api.post(`/api/v1/auth/google-signin`, {
        name: result.user.displayName,
        email: result.user.email,
        avatar: result.user.photoURL,
      });

      const data = res.data;
      dispatch(signInSuccess(data));
      navigate("/dashboard");
    } catch (error) {
      console.log("could not login with google", error);
    }
  };
  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="rounded-lg p-3 flex items-center justify-center bg-white text-black dark:border-collapse border"
    >
      
      <img
        src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2Fc7f00d03c7224a7b97423ef6bf741a1f"
        alt="google"
        className="h-6 mr-3"
      />

      <p>Continue with Google</p>
    </button>
  );
}
