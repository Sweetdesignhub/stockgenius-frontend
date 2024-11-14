import { useState } from 'react';
import SignUpForm from '../components/common/SignUpForm';
import VerificationForm from '../components/common/VerificationForm';
import { Eye, EyeOff } from 'lucide-react';
import Loading from '../components/common/Loading';

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidSubmit = (nextStep) => {
    setCurrentStep(nextStep);

    setError(null); // Clear error when moving to next step
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const renderStep = () => {

    if (isLoading) {
      return <Loading />;
    }

    switch (currentStep) {
      case 1:
        return (
          <SignUpForm
            onValidSubmit={handleValidSubmit}
            onError={handleError}
            userData={userData}
            setUserData={setUserData}
            setIsLoading={setIsLoading}
          />
        );
      case 2:
        return (
          <VerificationForm
            onValidSubmit={handleValidSubmit}
            onError={handleError}
            step={currentStep}
            userData={userData}
            setUserData={setUserData}
            label='Enter Email Verification Code'
            verificationType='email'
            setIsLoading={setIsLoading}
          />
        );
      case 3:
        return (
          <VerificationForm
            onValidSubmit={handleValidSubmit}
            onError={handleError}
            step={currentStep}
            userData={userData}
            setUserData={setUserData}
            label='Enter Phone Verification Code'
            verificationType='phone'
            setIsLoading={setIsLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='max-w-xl px-20 py-10 mb-10 mx-auto auth rounded-2xl'>
      {renderStep()}
      {error && (
        <p className='text-red-500 text-center mt-5'>
          {error}
        </p>
      )}
    </div>
  );
};

export default SignUp;
