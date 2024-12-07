import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const[accessTok, setAccessTok] = useState(sessionStorage.getItem('accessToken'));

  useEffect(() => {
    setAccessTok(sessionStorage.getItem('accessToken'));
  }, [])

  console.log(accessTok);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while session is restoring
  }

  return accessTok ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
