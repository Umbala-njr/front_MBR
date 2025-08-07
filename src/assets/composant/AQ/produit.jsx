import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, X, Zap, Package, CheckCircle, AlertCircle, 
Clock, BarChart 
} from 'lucide-react';

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
      await axios.post('http://localhost:3000/api/produit/ajout', { nom_pro: nomPro });
      setMessage('Produit ajouté avec succès');
      setMessageType('success');
      setNomPro('');
      fetchProduits();
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'ajout");
      setMessageType('error');
    }
    setLoading(false);
  };

  const handleFabriquer = (id_pro) => {
    navigate(`/AQ/fabrication/${id_pro}`);
  };

  

 
  const closeMessage = () => setMessage('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-900 text-white">
      {/* Header avec statistiques */}
      <div className="backdrop-blur-sm bg-white/5 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-7 h-7 text-green-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
              Gestion des Produits
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/70 hover:text-white transition">
              <BarChart className="w-5 h-5" />
              <span className="text-sm">Total Produits: {produits.length}</span>
            </div>
            <div className="flex items-center gap-2 text-white/70 hover:text-white transition">
              <Clock className="w-5 h-5" />
              <span className="text-sm">Dernière mise à jour: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Section Ajout de Produit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne Formulaire */}
          <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col space-y-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="group bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-600 hover:to-emerald-500 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center gap-2 justify-center">
                  {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  <span>{showForm ? 'Annuler' : 'Ajouter un produit'}</span>
                </div>
              </button>

              {showForm && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={nomPro}
                    onChange={(e) => setNomPro(e.target.value)}
                    placeholder="Nom du produit"
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {loading ? 'Ajout...' : 'Confirmer'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Colonne Liste des Produits */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {produits.map((prod, index) => (
                <div
                  key={prod.id_pro}
                  className="group bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-green-300">{prod.nom_pro}</h3>
                      <p className="text-sm text-white/60">ID: {prod.id_pro}</p>
                    </div>
                    <div className="mt-6 flex space-x-2">
                      <button
                        onClick={() => handleFabriquer(prod.id_pro)}
                        className="flex-1 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 px-4 py-2 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition transform hover:scale-105 shadow"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Fabriquer</span>
                      </button>
                     
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Aucun produit */}
            {produits.length === 0 && (
              <div className="text-center py-20 text-white/70">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <h3 className="text-xl font-semibold mb-2">Aucun produit</h3>
                <p>Ajoutez un produit pour commencer</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message de succès ou erreur */}
      {message && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full transform transition-all duration-500">
          <div className={`backdrop-blur-lg border rounded-xl p-4 shadow-2xl ${
            messageType === 'success'
              ? 'bg-green-500/20 border-green-400/30 text-green-300'
              : 'bg-red-500/20 border-red-400/30 text-red-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
              <button onClick={closeMessage} className="text-white/60 hover:text-white">
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