import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FabricationManager = () => {
  const { id_pro } = useParams();
  const [codeFab, setCodeFab] = useState('');
  const [nomFab, setNomFab] = useState('');
  const [message, setMessage] = useState('');
  const [fabrications, setFabrications] = useState([]);

  const fetchFabrications = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/fabrication/affichefab/${id_pro}`);
    setFabrications(res.data);
  } catch (err) {
    console.error(err);
  }
};

  const handleAjout = async (e) => {
    e.preventDefault();
    if (!codeFab || !nomFab) return;

    try {
      await axios.post('http://localhost:3000/api/fabrication/ajoutFab', {
        code_fab: codeFab,
        nom_fab: nomFab,
        id_pro: id_pro,
      });
      setMessage('Ajout réussi');
      setCodeFab('');
      setNomFab('');
      fetchFabrications();
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors de l’ajout');
    }
  };

  useEffect(() => {
    fetchFabrications();
  }, [id_pro]);

  return (
    <div className="min-h-screen bg-emerald-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Fabrication pour le produit ID: {id_pro}</h2>

        <form onSubmit={handleAjout} className="flex flex-col gap-4 mb-6 bg-emerald-800 p-4 rounded-lg">
          <input
            type="text"
            placeholder="Code fabrication"
            value={codeFab}
            onChange={(e) => setCodeFab(e.target.value)}
            className="px-4 py-2 rounded bg-emerald-700 border border-emerald-600 placeholder:text-emerald-300"
          />
          <input
            type="text"
            placeholder="Nom fabrication"
            value={nomFab}
            onChange={(e) => setNomFab(e.target.value)}
            className="px-4 py-2 rounded bg-emerald-700 border border-emerald-600 placeholder:text-emerald-300"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-white font-semibold"
          >
            Ajouter fabrication
          </button>
          {message && <p className="text-emerald-300">{message}</p>}
        </form>

        <h3 className="text-xl font-semibold mb-3">Fabrications existantes :</h3>
        <div className="space-y-4">
          {fabrications.map((fab, i) => (
            <div key={i} className="bg-emerald-800 p-4 rounded border border-emerald-700">
              <p><strong>Code :</strong> {fab.code_fab}</p>
              <p><strong>Nom :</strong> {fab.nom_fab}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FabricationManager;
