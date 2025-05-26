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
    <div className='min-h-[100px] flex items-center justify-center px-3 sm:px-6 py-2'>
      <div className='w-full max-w-[550px] mx-auto auth rounded-2xl px-4 sm:px-6 py-6 dark:bg-[#1a1a1a]/40 dark:backdrop-blur-md dark:border dark:border-[#ffffff1a] dark:shadow-[inset_0_1px_12px_rgba(255,255,255,0.06)] bg-white/80 backdrop-blur-sm'>
        {renderStep()}
        {error && (
          <p className='text-red-500 text-center mt-4 text-sm'>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignUp;
