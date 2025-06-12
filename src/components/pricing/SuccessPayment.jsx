import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuccessPayment() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // Get the stored region or default to 'india'
      const region = localStorage.getItem('region') || 'india';
      navigate(`/${region}/dashboard`);
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-4 text-green-500">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">Thank you for your purchase. Your account has been upgraded successfully.</p>
        <p className="text-sm text-gray-500">You will be redirected to the dashboard in a few seconds...</p>
      </div>
    </div>
  );
}

export default SuccessPayment;