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
      <div className='w-full max-w-[400px] mx-auto rounded-2xl px-4 sm:px-6 py-8'
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #402788 132.95%)',
            border: '1.04px solid transparent',
            borderImage: 'linear-gradient(180deg, rgba(39, 55, 207, 0.4) 17.19%, rgba(101, 98, 251, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(39, 55, 207, 0) -4.69%, rgba(189, 252, 254, 0.3) 100%)',
            borderImageSlice: '1',
            boxShadow: '0px 10.35px 31.05px 0px rgba(73, 123, 255, 0.7) inset, 0px 10.35px 41.41px 0px rgba(63, 74, 175, 0.5)',
            backdropFilter: 'blur(20.702987670898438px)',
          }}>
            <div className="flex items-center justify-center gap-2 mb-4">
          <img
            className="h-7 xl:h-7 lg:h-5 mr-1"
            src="https://cdn.builder.io/api/v1/image/assets%2F462dcf177d254e0682506e32d9145693%2F44c1d4cdd7274260a729d09f18bb553e"
            alt="Stockgenius.ai"
          />
          <h1 className='text-2xl text-center font-semibold'>Sign Up</h1>
        </div>
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
