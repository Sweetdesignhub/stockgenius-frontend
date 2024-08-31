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
const CompleteProfile = () => {
  const location = useLocation();
  const { userId, email } = location.state || { userId: null, email: null };
  const [countries, setCountries] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [userData, setUserData] = useState({});
  const [step, setStep] = useState(1);

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
    const fdata = { email, ...data };
    try {
      const response = await api.patch(
        `/api/v1/auth/update-google-auth/${userId}`,
        fdata
      );
      console.log('Signup Successful:', response.data);
      setUserData(data);
      setStep(2);
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };
  if (step === 1) {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <PhoneInput
          international
          defaultCountry='US'
          value={watch('phoneNumber')}
          className='text-black'
          onChange={handlePhoneChange}
        />
        {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        <div className='flex gap-4'>
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
        <button type='submit'>Submit</button>
      </form>
    );
  } else if (step === 2) {
    return (
      <VerificationForm
        onValidSubmit={handleValidSubmit}
        step={currentStep}
        userData={userData}
        setUserData={setUserData}
        label='Enter Phone Verification Code'
        verificationType='phone'
      />
    );
  }
  
};

export default CompleteProfile;
