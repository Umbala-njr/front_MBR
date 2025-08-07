import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NouveauMotDePasse = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setErreur('');

    try {
      const res = await axios.post('http://localhost:3000/api/utilisateur/nouveau-mot', {
        email,
        code,
        new_password: newPassword,
      });
      setMsg(res.data.message);
      navigate('/');
    } catch (err) {
      setErreur(err.response?.data?.error || 'Erreur');
    }
  };

  return (
   <div className="w-full max-w-md mx-auto mt-8 p-4 sm:p-6 bg-green-100 shadow-md rounded-lg">
  <h2 className="text-2xl font-bold mb-4 text-center">Réinitialiser le mot de passe</h2>

  {msg && <div className="text-green-600 mb-4 text-center">{msg}</div>}
  {erreur && <div className="text-red-600 mb-4 text-center">{erreur}</div>}

  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block mb-1 font-semibold">Email</label>
      <input
        type="email"
        required
        className="w-full p-2 border rounded mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    <div>
      <label className="block mb-1 font-semibold">Code de vérification</label>
      <input
        type="text"
        required
        className="w-full p-2 border rounded mb-2"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
    </div>

    <div>
      <label className="block mb-1 font-semibold">Nouveau mot de passe</label>
      <input
        type="password"
        required
        className="w-full p-2 border rounded mb-2"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>

    <button
      type="submit"
      className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
    >
      Réinitialiser
    </button>
  </form>
</div>
  );
};

export default NouveauMotDePasse;
