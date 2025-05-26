/**
 * File: Loading
 * Description: This component displays a loading spinner centered on the screen. It is used to indicate a loading state during asynchronous operations.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import React from "react";

const Loading = ({ className = "", isSignInOTP = false }) => (
  <div className={`flex justify-center items-center ${isSignInOTP ? '' : 'h-screen'} ${className}`}>
    <div className={`animate-spin rounded-full ${isSignInOTP ? 'h-5 w-5 border-2 border-b-transparent' : 'h-16 w-16 border-b-2'} ${isSignInOTP ? 'border-white' : 'dark:border-white border-gray-900'}`}></div>
  </div>
);

export default Loading;
