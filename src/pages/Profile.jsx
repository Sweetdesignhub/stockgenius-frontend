import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import api from '../config';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  // console.log('current user : ',currentUser);

  const navigate = useNavigate();

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prev) => ({ ...prev, avatar: downloadURL }))
        );
      }
    );
  };

  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [id]: value }));
  // };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      const res = await api.post(
        `/api/v1/users/update/${currentUser.id}`,
        formData
      );
      const data = res.data;

      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  // console.log(currentUser);
  const handleDeleteAccount = async () => {
    dispatch(deleteUserStart());
    try {
      const res = await api.delete(`/api/v1/users/delete/${currentUser.id}`);
      const data = res.data;

      dispatch(deleteUserSuccess(data));
      alert('user deleted successfully..!!');
      navigate('/');
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  return (
    <div className='min-h-[100px] flex items-center justify-center mt-10 px-4 sm:px-6'>
      <div className='w-full max-w-[400px] mx-auto auth rounded-2xl px-4 sm:px-6 py-3 dark:bg-[#1a1a1a]/40 dark:backdrop-blur-md dark:border dark:border-[#ffffff1a] dark:shadow-[inset_0_1px_12px_rgba(255,255,255,0.06)] bg-white/80 backdrop-blur-sm'>
        <h1 className='text-2xl text-center font-semibold mb-4'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
            onChange={(e) => setImage(e.target.files[0])}
          />
          <div className="flex flex-col items-center gap-2">
            <img
              src={formData.avatar || currentUser.avatar}
              alt='profile'
              className='h-20 w-20 cursor-pointer rounded-full object-cover'
              onClick={() => fileRef.current.click()}
            />
            <p className='text-xs text-center'>
              {imageError ? (
                <span className='text-red-500'>
                  Error uploading image (file size must be less than 2 MB)
                </span>
              ) : imagePercent > 0 && imagePercent < 100 ? (
                <span className='text-slate-400'>{`Uploading: ${imagePercent} %`}</span>
              ) : imagePercent === 100 ? (
                <span className='text-green-500'>Image uploaded successfully</span>
              ) : (
                ''
              )}
            </p>
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='name' className='dark:text-[#FFFFFFCC] text-sm'>
              Full Name
            </label>
            <input
              defaultValue={currentUser.name}
              type='text'
              id='name'
              placeholder='Full Name'
              className='bg-slate-100 text-black p-2.5 rounded-sm w-full text-sm'
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='email' className='dark:text-[#FFFFFFCC] text-sm'>
              Email
            </label>
            <input
              defaultValue={currentUser.email}
              type='email'
              id='email'
              placeholder='Email'
              className='bg-slate-100 text-black p-2.5 rounded-sm w-full text-sm'
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='password' className='dark:text-[#FFFFFFCC] text-sm'>
              Password
            </label>
            <input
              type='password'
              id='password'
              placeholder='Password'
              className='bg-slate-100 text-black p-2.5 rounded-sm w-full text-sm'
              onChange={handleChange}
            />
          </div>

          <button
            type='submit'
            className='auth-btn bg-[#1A2C5C] text-white p-2.5 rounded-lg hover:opacity-85 disabled:opacity-80 min-h-[42px] flex items-center justify-center mt-2'
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>

        {error && (
          <p className='text-red-500 text-center mt-4 text-sm'>
            Something went wrong!
          </p>
        )}
        {updateSuccess && (
          <p className='text-green-500 text-center mt-4 text-sm'>
            User is updated successfully!
          </p>
        )}
      </div>
    </div>
  );
}
