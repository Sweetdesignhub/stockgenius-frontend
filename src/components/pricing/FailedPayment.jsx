import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setShowPlanSelectDialog } from '../../redux/pricing/pricingSlice';

function FailedPayment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleTryAgain = () => {
    // First set the pricing dialog to show
    dispatch(setShowPlanSelectDialog(true));
    // Then navigate to home
    navigate('/');
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div
          className="relative w-full max-w-md mx-4 p-8 rounded-[10px] overflow-hidden"
          style={{
            background:
              'linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #88272D 132.95%)',
            border: '1px solid transparent',
            borderImage:
              'linear-gradient(180deg, rgba(136, 39, 45, 0.4) 17.19%, rgba(251, 98, 107, 0.77) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), linear-gradient(180deg, rgba(136, 39, 45, 0) -4.69%, rgba(254, 189, 189, 0.3) 100%)',
            borderImageSlice: '1',
            backdropFilter: 'blur(17.95px)',
            boxShadow:
              '0px 8.97px 26.92px 0px rgba(255, 73, 106, 0.7) inset, 0px 8.97px 35.9px 0px rgba(175, 63, 83, 0.5)',
          }}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[17.95px]" />
          <div className="relative z-10 text-center">
            <div className="mb-6 text-[rgba(255,73,106,1)]">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="font-['Aldrich'] text-[28px] sm:text-[32px] font-normal leading-[100%] tracking-[0.02em] text-white mb-4">
              Payment Failed
            </h2>
            <p className="font-['Poppins'] text-[16px] sm:text-[18px] text-gray-200 mb-6">
              We couldn't process your payment. Please try again or contact support
              if the problem persists.
            </p>
            <button
              onClick={handleTryAgain}
              className="px-8 py-2 rounded-[7.18px] font-semibold text-white transition-all duration-300"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0, 0, 0, 0) -40.91%, #88272D 132.95%)',
                borderImage:
                  'linear-gradient(180deg, rgba(136, 39, 45, 0.4) 17.19%, rgba(251, 98, 107, 0.77) 100%)',
                borderImageSlice: '1',
                backdropFilter: 'blur(17.95px)',
                boxShadow:
                  '0px 8.97px 26.92px 0px rgba(255, 73, 106, 0.7) inset, 0px 8.97px 35.9px 0px rgba(175, 63, 83, 0.5)',
              }}
            >
              <span className="relative z-10">Try Again</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default FailedPayment;