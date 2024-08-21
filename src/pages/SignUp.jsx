import { useState } from "react";
import SignUpForm from "../components/common/SignUpForm";
import VerificationForm from "../components/common/VerificationForm";

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({});

  const handleValidSubmit = (nextStep) => {
    setCurrentStep(nextStep);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SignUpForm
            onValidSubmit={handleValidSubmit}
            userData={userData}
            setUserData={setUserData}
          />
        );
      case 2:
        return (
          <VerificationForm
            onValidSubmit={handleValidSubmit}
            step={currentStep}
            userData={userData}
            setUserData={setUserData}
            label="Enter Email Verification Code"
            verificationType="email"
          />
        );
      case 3:
        return (
          <VerificationForm
            onValidSubmit={handleValidSubmit}
            step={currentStep}
            userData={userData}
            setUserData={setUserData}
            label="Enter Phone Verification Code"
            verificationType="phone"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl px-20 py-10 mx-auto auth rounded-2xl">
      {renderStep()}
    </div>
  );
};

export default SignUp;
