import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit3, Settings, CheckCircle, XCircle } from 'lucide-react';

const AtelierManager = () => {
  const [ateliers, setAteliers] = useState([]);
  const [nomAtelier, setNomAtelier] = useState('');
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchAteliers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/atelier/afficheAtel');
      setAteliers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAteliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomAtelier) return;

    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/atelier/modifierAtel/${editId}`, { nom_atelier: nomAtelier });
        setMessage("✅ Atelier modifié.");
      } else {
        await axios.post('http://localhost:3000/api/atelier/ajoutAtel', { nom_atelier: nomAtelier });
        setMessage("✅ Atelier ajouté.");
      }
      setNomAtelier('');
      setEditId(null);
      fetchAteliers();
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de l'envoi.");
    }
  };

  const handleEdit = (atelier) => {
    setNomAtelier(atelier.nom_atelier);
    setEditId(atelier.id_atelier);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-2">
            Gestion des Ateliers
          </h1>
          <p className="text-green-600 text-lg">
            Organisez et gérez vos espaces de travail
          </p>
        </div>

        {/* Form Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                {editId ? 'Modifier l\'atelier' : 'Nouvel atelier'}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-green-700 font-medium mb-3 text-sm uppercase tracking-wide">
                  Nom de l'atelier
                </label>
                <input
                  type="text"
                  value={nomAtelier}
                  onChange={(e) => setNomAtelier(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-green-900 placeholder-green-400"
                  placeholder="Entrer le nom de l'atelier..."
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {editId ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
              
              {message && (
                <div className={`mt-4 p-4 rounded-xl flex items-center ${
                  message.includes('✅') 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message.includes('✅') ? (
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  )}
                  <span className="font-medium">{message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ateliers Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
            Ateliers Enregistrés
          </h2>
          
          {ateliers.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <Settings className="w-10 h-10 text-green-400" />
              </div>
              <p className="text-xl text-green-600 mb-2">Aucun atelier enregistré</p>
              <p className="text-green-500">Commencez par ajouter votre premier atelier ci-dessus</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ateliers.map((atelier) => (
                <div
                  key={atelier.id_atelier}
                  className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden transform hover:-translate-y-1 ${
                    editId === atelier.id_atelier 
                      ? 'border-green-500 ring-4 ring-green-200' 
                      : 'border-green-100 hover:border-green-300'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                        <Settings className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-green-800 truncate">
                          {atelier.nom_atelier}
                        </h3>
                        
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleEdit(atelier)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2.5 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center group-hover:scale-105"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Modifier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-green-200">
          <p className="text-green-600">
            Gestionnaire d'Ateliers - Interface moderne et responsive
          </p>
        </div>
      </div>
    </div>
  );
};

export default AtelierManager;