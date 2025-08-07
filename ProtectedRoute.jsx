import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setAuth(false);

      try {
        await axios.get('http://localhost:3000/api/utilisateur/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAuth(true);
      } catch (error) {
        console.error("Erreur vérification token :", error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (auth === null) return <div>Chargement...</div>; // ou un spinner
  if (!auth) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
