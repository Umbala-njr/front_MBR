import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from 'react-icons/fa';
import image1 from '../photos/AQ_MBR_Management-removebg-preview (1).png';
import { useNavigate } from 'react-router-dom';
import Spinner from './spinner';
import { jwtDecode } from "jwt-decode"; 


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validations, setValidations] = useState({
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' }
  });

  const navigate = useNavigate();

 const validateForm = useCallback(() => {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  setValidations({
    email: {
      isValid: emailValid,
      message: emailValid ? '' : 'Email invalide'
    },
    password: { isValid: true, message: '' } // Plus de vérif sur mot de passe
  });

  return emailValid;
}, [email]);

  const handleMotOublie = () => {
    navigate('/mot-de-passe-oublie');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg('');
  setSuccessMsg('');

  if (!validateForm()) return;

  setLoading(true);

  try {
    const res = await axios.post('http://localhost:3000/api/utilisateur/login', {
      email,
      password
    });

    const { token, role } = res.data;

    const decoded = jwtDecode(token); // Utilisez la fonction importée
    const id_uti = decoded.id || decoded.id_uti;

    // ✅ Stocker dans le localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("id_uti", id_uti);

    setSuccessMsg("Connexion réussie !");

    // ✅ Redirection en fonction du rôle
    const normalizedRole = role?.trim().toLowerCase();

    switch (normalizedRole) {
      case 'aq':
        navigate('/AQ/utilisateur');
        break;
      case 'operateur':
        navigate('/PROD/home');
        break;
      default:
        navigate('/assurence');
    }
  } catch (error) {
    console.error("Erreur de connexion :", error);
    setErrorMsg(error.response?.data?.error || "Erreur de connexion.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Colonne image */}
          <div className="hidden md:flex items-center justify-center bg-green-100 p-8">
            <img
              src={image1}
              alt="Logo"
              className="max-h-80 object-contain transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Colonne formulaire */}
          <div className="p-10">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Connexion</h2>
            <p className="text-sm text-gray-600 text-center mb-6">Veuillez entrer vos identifiants</p>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-center">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="exemple@domaine.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border text-base
                      focus:ring-2 focus:ring-green-500
                      ${!validations.email.isValid ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {!validations.email.isValid && (
                  <p className="text-sm text-red-500 mt-1">{validations.email.message}</p>
                )}
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border text-base
                      focus:ring-2 focus:ring-green-500
                      ${!validations.password.isValid ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {!validations.password.isValid && (
                  <p className="text-sm text-red-500 mt-1">{validations.password.message}</p>
                )}
              </div>

              {/* Footer form */}
              <div className="flex items-center justify-between">
                <a
                  onClick={handleMotOublie}
                  className="text-sm text-green-600 hover:text-green-800 cursor-pointer"
                >
                  Mot de passe oublié ?
                </a>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Spinner className="mr-2" />
                  ) : (
                    <>
                      <FaSignInAlt className="mr-2" />
                      Se connecter
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
