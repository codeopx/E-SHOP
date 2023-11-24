import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/authContext";


const ProtectedRouteAdmin = ({ children }) => {
  const { user } = UserAuth();
  if (user?.email !== "servustechnologieslimited@gmail.com" || !user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRouteAdmin;
