import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FabricationManager = () => {
  const { id_pro } = useParams();
  const [codeFab, setCodeFab] = useState('');
  const [nomFab, setNomFab] = useState('');
  const [message, setMessage] = useState('');
  const [fabrications, setFabrications] = useState([]);
  const [nomProduit, setNomProduit] = useState('');

  const fetchFabrications = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/fabrication/affichefab/${id_pro}`);
      setFabrications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNomProduit = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/produit/affiche/${id_pro}`);
      setNomProduit(res.data.nom_pro || `Produit ID: ${nom_pro}`);
    } catch (err) {
      console.error(err);
      setNomProduit(`Produit ID: ${nom_pro}`);
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
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Erreur lors de lajout');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  useEffect(() => {
    fetchFabrications();
    fetchNomProduit();
  }, [id_pro]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Header */}
      <div className="bg-green-800 shadow-2xl border-b border-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-0">
                Gestion des Produits
              </h1>
              <p className="text-green-100 text-sm sm:text-base">
                {nomProduit}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ID: {id_pro}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulaire d'ajout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-green-800 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Nouveau Produit
                </h2>
              </div>
              
              <form onSubmit={handleAjout} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code Fabrication
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez le code"
                    value={codeFab}
                    onChange={(e) => setCodeFab(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom Fabrication
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez le nom"
                    value={nomFab}
                    onChange={(e) => setNomFab(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors placeholder-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Ajouter Fabrication
                </button>

                {message && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${
                    message.includes('Erreur') 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Liste des fabrications */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-green-800 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Fabrications Existantes
                </h2>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {fabrications.length} fabrication{fabrications.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="p-6">
                {fabrications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-lg">Aucune fabrication trouvée</p>
                    <p className="text-gray-400 text-sm mt-2">Commencez par ajouter une nouvelle fabrication</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fabrications.map((fab, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 bg-gray-50">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                              #{i + 1}
                            </span>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-600">Code</p>
                            <p className="text-lg font-semibold text-gray-900">{fab.code_fab}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-600">Nom</p>
                            <p className="text-gray-900">{fab.nom_fab}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricationManager;