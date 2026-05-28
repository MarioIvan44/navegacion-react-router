// src/components/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
//import { useAuth } from "../hooks/useAuth";
import useFakeLogin from "../hooks/useFakeLogin";
 
//This component checks if the user is authenticated (using a fake login hook) and either renders the child routes (Outlet) or redirects to the home page.
export const PrivateRoute = () => {
  //const { authCokie } = useAuth();
  const { authCokie } = useFakeLogin();
  return authCokie ? <Outlet /> : <Navigate to="/" />;
};