import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AjouterEtape = () => {
  const { code_fab } = useParams();
  const [nom_eta, setNomEta] = useState('');
  const [instruction, setInstruction] = useState('');
  const [id_atelier, setIdAtelier] = useState('');
  const [ateliers, setAteliers] = useState([]);
  const [etapes, setEtapes] = useState([]);

  // Charger les ateliers
  useEffect(() => {
    axios.get('http://localhost:3000/api/atelier/afficheAtel')
      .then(res => setAteliers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Charger les étapes liées à ce code_fab
  const loadEtapes = () => {
    axios.get(`http://localhost:3000/api/etape/afficheEtape/${code_fab}`)
      .then(res => setEtapes(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadEtapes();
  }, [code_fab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/etape/ajoutEta', {
        nom_eta,
        instruction,
        id_atelier,
        code_fab
      });
      alert('Étape ajoutée avec succès');
      setNomEta('');
      setInstruction('');
      setIdAtelier('');
      loadEtapes(); // Recharger les étapes
    } catch (err) {
      console.error(err);
      alert('Erreur lors de lajout');
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-green-600 text-white p-6">
          <h2 className="text-2xl font-bold">
            Ajouter une Étape pour la fabrication : {code_fab}
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-green-800 font-semibold mb-2">Nom de l'étape</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={nom_eta}
                  onChange={e => setNomEta(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-green-800 font-semibold mb-2">Atelier</label>
                <select
                  className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={id_atelier}
                  onChange={e => setIdAtelier(e.target.value)}
                  required
                >
                  <option value="">-- Choisir un atelier --</option>
                  {ateliers.map(at => (
                    <option key={at.id_atelier} value={at.id_atelier}>
                      {at.nom_atelier}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-green-800 font-semibold mb-2">Instruction</label>
              <textarea
                className="w-full px-4 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
                value={instruction}
                onChange={e => setInstruction(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="text-center">
              <button 
                type="submit" 
                className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Ajouter Étape
              </button>
            </div>
          </form>
        </div>

        <div className="bg-green-50 p-6">
          <h3 className="text-xl font-bold text-green-800 mb-4">Étapes existantes</h3>
          {etapes.length === 0 ? (
            <p className="text-gray-600 text-center">Aucune étape enregistrée pour cette fabrication.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                <thead className="bg-green-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-green-800">Nom de l'étape</th>
                    <th className="px-4 py-3 text-left text-green-800">Instruction</th>
                    <th className="px-4 py-3 text-left text-green-800">Atelier</th>
                    <th className="px-4 py-3 text-left text-green-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {etapes.map((etape) => (
                    <tr key={etape.id_eta} className="border-b border-green-200 hover:bg-green-50">
                      <td className="px-4 py-3">{etape.nom_eta}</td>
                      <td className="px-4 py-3">{etape.instruction}</td>
                      <td className="px-4 py-3">{etape.nom_atelier || etape.id_atelier}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => window.location.href = `/AQ/sousetape/${etape.id_eta}`}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                        >
                          Sous-étapes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AjouterEtape;