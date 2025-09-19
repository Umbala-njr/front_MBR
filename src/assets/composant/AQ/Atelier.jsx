import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit3, Settings, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AtelierManager = () => {
  const [ateliers, setAteliers] = useState([]);
  const [nomAtelier, setNomAtelier] = useState('');
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAddAppareil = (atelier) => {
    // Navigate vers la page d'ajout pour cet atelier
    navigate(`/AQ/appareil/${atelier.id_atelier}`, { state: { atelierNom: atelier.nom_atelier } });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl mb-6 shadow-2xl">
            <Settings className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Gestion des Ateliers
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-slate-300 text-xl font-light">
            Organisez et gérez vos espaces de travail
          </p>
        </div>

        {/* Form Section */}
        <div className="max-w-full mx-auto mb-16">
          <div className="bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                {editId ? 'Modifier l\'atelier' : 'Nouvel atelier'}
              </h2>
            </div>
            
            <div className="p-8">
              <div className="mb-8">
                <label className="block text-slate-300 font-semibold mb-4 text-sm uppercase tracking-wider">
                  Nom de l'atelier
                </label>
                <input
                  type="text"
                  value={nomAtelier}
                  onChange={(e) => setNomAtelier(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-700/50 border-2 border-slate-600 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 text-white placeholder-slate-400 text-lg"
                  placeholder="Entrer le nom de l'atelier..."
                />
              </div>
              
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02]"
              >
                {editId ? 'Modifier' : 'Ajouter'}
              </button>
              
              {message && (
                <div className={`mt-6 p-5 rounded-2xl flex items-center shadow-lg ${
                  message.includes('✅') 
                    ? 'bg-emerald-900/50 text-emerald-100 border-2 border-emerald-700/50' 
                    : 'bg-red-900/50 text-red-100 border-2 border-red-700/50'
                }`}>
                  {message.includes('✅') ? (
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 mr-3 flex-shrink-0 text-red-400" />
                  )}
                  <span className="font-semibold text-lg">{message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ateliers Grid */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white mb-4">
              Ateliers Enregistrés
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto rounded-full"></div>
          </div>
          
          {ateliers.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-700/50 rounded-2xl mb-6">
                <Settings className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-2xl text-slate-300 mb-3 font-semibold">Aucun atelier enregistré</p>
              <p className="text-slate-400 text-lg">Commencez par ajouter votre premier atelier ci-dessus</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {ateliers.map((atelier) => (
                <div
                  key={atelier.id_atelier}
                  className={`group bg-slate-800/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 overflow-hidden transform hover:-translate-y-2 hover:scale-105 ${
                    editId === atelier.id_atelier 
                      ? 'border-emerald-500 ring-4 ring-emerald-500/30 bg-emerald-900/20' 
                      : 'border-slate-600/50 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="p-7">
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <Settings className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-white truncate mb-1">
                          {atelier.nom_atelier}
                        </h3>
                        <div className="w-8 h-0.5 bg-emerald-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => handleEdit(atelier)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-5 py-3.5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center group-hover:scale-105"
                      >
                        <Edit3 className="w-5 h-5 mr-2" />
                        Modifier
                      </button>

                      <button
                        onClick={() => handleAddAppareil(atelier)}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white px-5 py-3.5 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center border-2 border-slate-600 hover:border-emerald-500/50"
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Ajouter appareil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-12 border-t border-slate-700/50">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            <p className="text-slate-400 font-medium">
              Gestionnaire d'Ateliers - Interface moderne et responsive
            </p>
            <div className="w-2 h-2 bg-emerald-500 rounded-full ml-3"></div>
          </div>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-slate-600 to-transparent mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default AtelierManager;