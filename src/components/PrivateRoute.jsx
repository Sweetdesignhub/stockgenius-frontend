/**
 * File: PrivateRoute
 * Description:This component is a higher-order component used to protect routes by ensuring that only authenticated users can access certain parts of the application. It checks if the currentUser exists in the Redux state (indicating the user is logged in). If the user is authenticated, it renders the child components using the Outlet component. If the user is not authenticated, they are redirected to the /sign-in page
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  if (!currentUser) {
    // Redirect to the sign-in page with the attempted location
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
