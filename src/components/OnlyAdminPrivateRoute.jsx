/**
 * File: OnlyAdminPrivateRoute
 * Description: This component is a higher-order component that restricts access to certain routes for users who are not administrators. It checks the currentUser from the Redux state and verifies whether the user is an admin by checking the isAdmin flag and the role field in the user object. If the user is an admin, it renders the child components using the Outlet component. If the user is not an admin, they are redirected to a default route (in this case, /india/initial-public-offers)
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
import { Navigate, Outlet } from "react-router-dom";

function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && currentUser.isAdmin && currentUser.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to={"/india/initial-public-offers"} />
  );
}

export default OnlyAdminPrivateRoute;
