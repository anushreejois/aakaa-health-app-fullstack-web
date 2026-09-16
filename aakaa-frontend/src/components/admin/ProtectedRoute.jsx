import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-aakaa-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-4 border-aakaa-green border-t-transparent rounded-full"></div>
          <p className="text-aakaa-gold font-black uppercase text-[10px] tracking-widest">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the current location to redirect back after login
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
