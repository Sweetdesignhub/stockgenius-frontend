import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuccessPayment() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const region = localStorage.getItem('region') || 'india';
      navigate(`/${region}/dashboard`);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div 
        className="relative w-full max-w-md mx-4 p-8 rounded-[10px] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #278848 132.95%)',
          border: '1px solid transparent',
          borderImage: 'linear-gradient(180deg, rgba(39, 136, 72, 0.4) 17.19%, rgba(98, 251, 141, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(39, 136, 60, 0) -4.69%, rgba(189, 254, 196, 0.3) 100%)',
          borderImageSlice: '1',
          backdropFilter: 'blur(17.95px)',
          boxShadow: '0px 8.97px 26.92px 0px rgba(73, 255, 91, 0.7) inset, 0px 8.97px 35.9px 0px rgba(65, 175, 63, 0.5)'
        }}
      >
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[17.95px]" />
        <div className="relative z-10 text-center">
          <div className="mb-6 text-[rgba(73,255,91,1)]">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-['Aldrich'] text-[28px] sm:text-[32px] font-normal leading-[100%] tracking-[0.02em] text-white mb-4">
            Payment Successful!
          </h2>
          <p className="font-['Poppins'] text-[16px] sm:text-[18px] text-gray-200 mb-4">
            Thank you for your purchase. Your account has been upgraded successfully.
          </p>
          <p className="text-sm text-gray-300 font-light">
            Redirecting to dashboard in a few seconds...
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuccessPayment;