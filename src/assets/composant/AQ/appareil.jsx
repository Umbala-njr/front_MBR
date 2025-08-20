import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit3, X, Settings, AlertCircle } from 'lucide-react';

const AppareilManager = () => {
  const { id_atelier } = useParams(); // récupère id_atelier depuis l'URL
  const [appareils, setAppareils] = useState([]);
  const [form, setForm] = useState({ nom_app: '' });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [nomAtelier, setNomAtelier] = useState('');


  useEffect(() => {
  if (id_atelier) {
    axios.get(`http://localhost:3000/api/appareil/nomAtelier/${id_atelier}`)
      .then(res => {
        setNomAtelier(res.data.nom_atelier);
      })
      .catch(err => {
        console.error(err);
        setNomAtelier('Atelier inconnu');
      });
  }
}, [id_atelier]);


  // Charger les appareils dès que id_atelier change
  useEffect(() => {
    if (id_atelier) {
      setLoading(true);
      axios.get(`http://localhost:3000/api/appareil/afficheAp/${id_atelier}`)
        .then(res => {
          setAppareils(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
          setMessage('Erreur lors du chargement des appareils');
        });
    }
  }, [id_atelier]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (editingId) {
        // Modifier un appareil
        await axios.put(`http://localhost:3000/api/appareil/modifierAp/${editingId}`, { 
          nom_app: form.nom_app, 
          id_atelier: id_atelier 
        });
        setMessage('Appareil modifié avec succès');
      } else {
        // Ajouter un nouvel appareil
        await axios.post('http://localhost:3000/api/appareil/ajouterAp', { 
          nom_app: form.nom_app, 
          id_atelier: id_atelier 
        });
        setMessage('Appareil ajouté avec succès');
      }
      setForm({ nom_app: '' });
      setEditingId(null);
      // Recharger la liste après ajout/modification
      const res = await axios.get(`http://localhost:3000/api/appareil/afficheAp/${id_atelier}`);
      setAppareils(res.data);
    } catch (error) {
      setMessage('Erreur : ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = appareil => {
    setEditingId(appareil.id_app);
    setForm({ nom_app: appareil.nom_app });
    setMessage('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ nom_app: '' });
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-green-900/20 backdrop-blur-sm border border-green-700/30 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-700/30 rounded-xl">
                <Settings className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Gestionnaire d'Appareils
                </h1>
                <p className="text-green-200/80 text-lg mt-1">
                  Atelier : {nomAtelier}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire */}
          <div className="bg-green-900/15 backdrop-blur-sm border border-green-700/20 rounded-2xl p-6 sm:p-8 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="w-5 h-5 text-green-300" />
              <h2 className="text-xl font-semibold text-white">
                {editingId ? "Modifier l'appareil" : 'Nouvel appareil'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nom_app" className="block text-sm font-medium text-green-200 mb-2">
                  Nom de l'appareil
                </label>
                <input
                  type="text"
                  id="nom_app"
                  name="nom_app"
                  value={form.nom_app}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Entrez le nom de l'appareil..."
                  className="w-full px-4 py-3 rounded-xl bg-green-900/30 border border-green-700/40 
                             text-white placeholder-green-300/50 focus:outline-none focus:ring-2 
                             focus:ring-green-400/50 focus:border-green-400/50 transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={loading || !form.nom_app.trim()}
                  className="flex-1 px-6 py-3 bg-green-600/80 hover:bg-green-600 
                             text-white font-medium rounded-xl transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             focus:outline-none focus:ring-2 focus:ring-green-400/50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Traitement...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {editingId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {editingId ? 'Modifier' : 'Ajouter'}
                    </div>
                  )}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 border border-green-600/50 text-green-200 
                               hover:bg-green-800/30 rounded-xl transition-all duration-200
                               focus:outline-none focus:ring-2 focus:ring-green-400/50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <X className="w-4 h-4" />
                      Annuler
                    </div>
                  </button>
                )}
              </div>
            </form>

            {/* Message */}
            {message && (
              <div
                className={`mt-6 p-4 rounded-xl border ${
                  message.includes('Erreur')
                    ? 'bg-red-900/20 border-red-700/30 text-red-200'
                    : 'bg-green-900/20 border-green-700/30 text-green-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Liste des appareils */}
          <div className="bg-green-900/15 backdrop-blur-sm border border-green-700/20 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white mb-6">
              Appareils ({appareils.length})
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin"></div>
              </div>
            ) : appareils.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-green-800/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Settings className="w-8 h-8 text-green-400/60" />
                </div>
                <p className="text-green-200/60 text-lg">Aucun appareil pour cet atelier</p>
                <p className="text-green-200/40 text-sm mt-1">Ajoutez votre premier appareil ci-dessus</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appareils.map(app => (
                  <div
                    key={app.id_app}
                    onClick={() => handleEdit(app)}
                    className={`group p-4 rounded-xl border transition-all duration-200 cursor-pointer
                             hover:bg-green-800/20 hover:border-green-600/50 ${
                               editingId === app.id_app
                                 ? 'bg-green-800/30 border-green-600/60'
                                 : 'bg-green-900/20 border-green-700/30'
                             }`}
                    title="Cliquez pour modifier"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-green-700/30 rounded-lg group-hover:bg-green-600/30 transition-colors">
                          <Settings className="w-4 h-4 text-green-300" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-white truncate">{app.nom_app}</h3>
                          <p className="text-xs text-green-200/60 mt-1">ID: {app.id_app}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleEdit(app);
                          }}
                          className="p-2 text-green-300 hover:text-white hover:bg-green-600/30 rounded-lg transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
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
  );
};

export default AppareilManager;
