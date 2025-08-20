import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Zap, Package, CheckCircle, AlertCircle, Clock, BarChart, Edit3 } from 'lucide-react';

const ProduitManager = () => {
  const [produits, setProduits] = useState([]);
  const [nomPro, setNomPro] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [showForm, setShowForm] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const navigate = useNavigate();

  const fetchProduits = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/produit/affiche');
      setProduits(res.data);
    } catch (error) {
      console.error('Erreur de récupération des produits :', error);
      setMessage("Impossible de charger les produits");
      setMessageType('error');
    }
  };

  useEffect(() => {
    fetchProduits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomPro.trim()) return;

    setLoading(true);
    try {
      if (selectedProduit) {
        await axios.put(`http://localhost:3000/api/produit/modifier/${selectedProduit.id_pro}`, {
          nom_pro: nomPro,
        });
        setMessage('Produit modifié avec succès');
      } else {
        await axios.post('http://localhost:3000/api/produit/ajout', { nom_pro: nomPro });
        setMessage('Produit ajouté avec succès');
      }
      setMessageType('success');
      setNomPro('');
      setSelectedProduit(null);
      fetchProduits();
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'enregistrement");
      setMessageType('error');
    }
    setLoading(false);
  };

  const handleEdit = (produit) => {
    setSelectedProduit(produit);
    setNomPro(produit.nom_pro);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setSelectedProduit(null);
    setNomPro('');
    setShowForm(false);
  };

  const handleFabriquer = (id_pro) => {
    navigate(`/AQ/fabrication/${id_pro}`);
  };

  const closeMessage = () => setMessage('');

  return (
    <div className="min-h-screen bg-white">
      {/* Header Noble */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Gestion des Matières Végétales
                </h1>
                <p className="text-emerald-200 mt-1">Administration des articles</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{produits.length}</div>
                <div className="text-emerald-200 text-sm">Produits</div>
              </div>
              <div className="text-center">
                <div className="text-white text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date().toLocaleDateString()}
                </div>
                <div className="text-emerald-200 text-xs">Dernière MAJ</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Panneau de contrôle */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">Contrôles</h2>
              
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  if (!showForm) {
                    setSelectedProduit(null);
                    setNomPro('');
                  }
                }}
                className="w-full bg-gradient-to-r from-emerald-800 to-slate-800 hover:from-emerald-700 hover:to-slate-700 text-white px-6 py-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-center space-x-2">
                  {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  <span>{showForm ? 'Fermer' : 'Nouveau Produit'}</span>
                </div>
              </button>

              {showForm && (
                <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-medium text-slate-800 mb-4">
                    {selectedProduit ? 'Modifier le produit' : 'Ajouter un produit'}
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom du produit
                      </label>
                      <input
                        type="text"
                        value={nomPro}
                        onChange={(e) => setNomPro(e.target.value)}
                        placeholder="Saisir le nom du produit"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-emerald-800 hover:bg-emerald-700 disabled:bg-slate-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                      >
                        {loading
                          ? (selectedProduit ? 'Modification...' : 'Ajout...')
                          : (selectedProduit ? 'Modifier' : 'Ajouter')
                        }
                      </button>
                      
                      {selectedProduit && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Liste des produits */}
          <div className="lg:col-span-3">
            {produits.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-16 text-center">
                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Aucun produit disponible</h3>
                <p className="text-slate-600">Commencez par ajouter votre premier produit</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {produits.map((prod) => (
                  <div
                    key={prod.id_pro}
                    className="bg-white border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-800 transition-colors">
                            {prod.nom_pro}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            ID: {prod.id_pro}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                          <Package className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                      
                      <div className="border-t border-slate-100 pt-4 flex space-x-3">
                        <button
                          onClick={() => handleFabriquer(prod.id_pro)}
                          className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition-colors"
                        >
                          <Zap className="w-4 h-4" />
                          <span>Fabriquer</span>
                        </button>
                        
                        <button
                          onClick={() => handleEdit(prod)}
                          className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center justify-center transition-colors"
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

      {/* Notification */}
      {message && (
        <div className="fixed top-6 right-6 z-50 max-w-md">
          <div
            className={`backdrop-blur-lg border rounded-xl p-4 shadow-2xl ${
              messageType === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{message}</span>
              </div>
              <button 
                onClick={closeMessage} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduitManager;