import React from 'react';
import { useNavigate } from 'react-router-dom';

function FailedPayment() {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    // Navigate back to the previous page
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-4 text-red-500">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
        <p className="text-gray-600 mb-6">We couldn't process your payment. Please try again or contact support if the problem persists.</p>
        <button
          onClick={handleTryAgain}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default FailedPayment;