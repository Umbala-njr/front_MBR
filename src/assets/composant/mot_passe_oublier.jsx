import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const MotDePasseOublie = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErreur('');
    
    if (!email) {
      setErreur('Veuillez saisir votre email.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:3000/api/utilisateur/mot-oblier', { email });
      setMsg(res.data.message);
      navigate('/nouveau_mot_de_passe');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Erreur lors de l\'envoi';
      setErreur(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f3d2d66] p-4">
      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Mot de passe oublié
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Réinitialisez votre mot de passe en toute sécurité
            </p>
          </div>

          {/* Messages de succès et d'erreur */}
          {msg && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-center">
              {msg}
            </div>
          )}
          {erreur && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
              {erreur}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400 text-xl" />
              </div>
              <input
                id="email"
                type="email"
                required
                placeholder="Votre adresse email"
                className="block w-full pl-12 pr-4 py-3 text-base border border-gray-300 dark:border-gray-700 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                placeholder-gray-500 dark:placeholder-gray-400 
                focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800 
                transition duration-150 ease-in-out"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-6 
              text-base font-semibold rounded-lg 
              text-white bg-green-600 hover:bg-green-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
              transition duration-300 ease-in-out transform hover:scale-105 
              dark:bg-green-500 dark:hover:bg-green-600"
            >
              <FaPaperPlane className="mr-2" />
              Envoyer le code de réinitialisation
            </button>
          </form>

          <div className="text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Retour à la connexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MotDePasseOublie;