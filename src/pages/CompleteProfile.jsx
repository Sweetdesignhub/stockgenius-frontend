import React, { useEffect, useState } from 'react';
import VerificationForm from '../components/common/VerificationForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Country, State } from 'country-state-city';
import PhoneInput from 'react-phone-number-input';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from '../components/common/InputField';
import api from '../config';
import Loading from '../components/common/Loading';

const CompleteProfile = () => {
  const location = useLocation();
  const { userId, email } = location.state || { userId: null, email: null };
  const [countries, setCountries] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [userData, setUserData] = useState({});
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setStates(State.getStatesOfCountry(selectedCountry.isoCode));
    }
  }, [selectedCountry]);
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string().required('Phone number is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handlePhoneChange = (value) => {
    setValue('phoneNumber', value, { shouldValidate: true });
  };
  const handleValidSubmit = (nextStep) => {
    setCurrentStep(nextStep);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    const fdata = { email, ...data };
    try {
      const response = await api.patch(
        `/api/v1/auth/update-google-auth/${userId}`,
        fdata
      );
      // console.log('Signup Successful:', response.data);
      setUserData(response.data);
      setStep(3);
    } catch (error) {
      console.error('Signup Error:', error);
      setError(error.response?.data?.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return <Loading />;
  }
  if (step === 1) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col mx-auto gap-4 items-center w-full max-w-2xl p-4'
      >
        <div className='w-full'>
          <PhoneInput
            international
            defaultCountry='IN'
            value={watch('phoneNumber')}
            className='bg-slate-100 text-black p-3 rounded-md w-full'
            onChange={handlePhoneChange}
          />
          {errors.phoneNumber && (
            <p className='text-red-500'>{errors.phoneNumber.message}</p>
          )}
        </div>
        <div className='flex justify-between gap-4 w-full'>
          <InputField
            label='Select Country'
            name='country'
            register={() =>
              register('country', {
                onChange: (e) =>
                  setSelectedCountry(
                    countries.find((c) => c.name === e.target.value)
                  ),
              })
            }
            options={countries.map(({ name }) => ({
              value: name,
              label: name,
            }))}
            error={errors.country?.message}
          />
          <InputField
            label='Select State'
            name='state'
            register={register}
            options={states.map(({ name }) => ({ value: name, label: name }))}
            error={errors.state?.message}
          />
        </div>

        <button
          type='submit'
          className='mt-4 bg-[#1A2C5C] text-white py-2 px-6 rounded-lg hover:opacity-95 w-full md:w-auto'
        >
          Submit
        </button>
      </form>
    );
  } else if (step === 3) {
    return (
      <>
        <VerificationForm
          onValidSubmit={handleValidSubmit}
          onError={(errorMessage) => setError(errorMessage)}
          step={3}
          userData={userData}
          setUserData={setUserData}
          label='Enter Phone Verification Code'
          verificationType='phone'
          setIsLoading={setIsLoading}
        />
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </>
    );
  }
};

export default CompleteProfile;