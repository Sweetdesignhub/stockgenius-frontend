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
