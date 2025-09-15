import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const HistoriqueConnexions = () => {
  const [historiques, setHistoriques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtres
  const [searchNom, setSearchNom] = useState('');
  const [searchAction, setSearchAction] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const BASE_URL = 'http://localhost:3000';

  const fetchHistoriques = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token d\'authentification manquant');
      }
      
      const response = await axios.get(`${BASE_URL}/api/utilisateur/historique`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000 // Timeout après 10 secondes
      });
      
      // Filtrer immédiatement pour ne garder que le rôle AQ
      const filteredData = response.data.filter(item => item.role === "AQ");
      setHistoriques(filteredData);
    } catch (error) {
      console.error('Error fetching connections:', error);
      
      if (error.response?.status === 401) {
        setError("Session expirée. Veuillez vous reconnecter.");
      } else if (error.code === 'ECONNABORTED') {
        setError("La requête a pris trop de temps. Veuillez réessayer.");
      } else {
        setError("Échec du chargement de l'historique des connexions.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistoriques();
  }, [fetchHistoriques]);

  // Utilisation de useMemo pour optimiser le filtrage
  const filteredHistoriques = useMemo(() => {
    return historiques.filter((item) => {
      const matchesNom = item.nom_uti?.toLowerCase().includes(searchNom.toLowerCase()) || false;
      const matchesAction = searchAction 
        ? item.type_action?.toLowerCase().includes(searchAction.toLowerCase()) || false
        : true;
      
      const itemDate = new Date(item.date_action);
      const matchesDateDebut = dateDebut ? itemDate >= new Date(dateDebut) : true;
      const matchesDateFin = dateFin ? itemDate <= new Date(dateFin + 'T23:59:59') : true; // Inclure toute la journée de fin
      
      return matchesNom && matchesAction && matchesDateDebut && matchesDateFin;
    });
  }, [historiques, searchNom, searchAction, dateDebut, dateFin]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Pagination - utilisation de useMemo pour optimiser
  const { totalPages, currentItems, startIndex, endIndex } = useMemo(() => {
    const totalPages = Math.ceil(filteredHistoriques.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredHistoriques.slice(startIndex, endIndex);
    
    return { totalPages, currentItems, startIndex, endIndex };
  }, [filteredHistoriques, currentPage, itemsPerPage]);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Génération des boutons de pagination avec limite d'affichage
  const paginationButtons = useMemo(() => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-2 text-sm font-medium rounded-lg ${
            currentPage === i 
              ? 'bg-green-700 text-white' 
              : 'bg-white text-green-600 border border-green-300'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return buttons;
  }, [currentPage, totalPages]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-green-800 font-medium">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Erreur</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchHistoriques}
            className="px-6 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">

        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-green-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Historique</h1>
              <p className="text-green-600">Toutes les actions effectuées par les utilisateurs</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-800 font-semibold">
                  {filteredHistoriques.length} enregistrements
                </span>
              </div>
              <button
                onClick={fetchHistoriques}
                className="p-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors flex items-center justify-center"
                title="Actualiser"
                aria-label="Actualiser"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-green-800 mb-4">Filtres</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Nom</label>
              <input
                type="text"
                placeholder="Nom d'utilisateur..."
                value={searchNom}
                onChange={(e) => setSearchNom(e.target.value)}
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Type d'action</label>
              <input
                type="text"
                placeholder="Ex: login, ajout..."
                value={searchAction}
                onChange={(e) => setSearchAction(e.target.value)}
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Date début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Date fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Boutons pour réinitialiser les filtres */}
          {(searchNom || searchAction || dateDebut || dateFin) && (
            <div className="mt-4">
              <button
                onClick={() => {
                  setSearchNom('');
                  setSearchAction('');
                  setDateDebut('');
                  setDateFin('');
                }}
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-green-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Rôle</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Action</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Date & Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={`${item.id || index}-${item.date_action}`} className="hover:bg-green-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={`${BASE_URL}/uploads/photos/${item.photo}`}
                            alt={item.nom_uti}
                            className="w-10 h-10 rounded-full border border-green-200 object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40/10B981/ffffff?text=U';
                              e.target.onerror = null; // Éviter les boucles d'erreur
                            }}
                          />
                          <span className="font-medium text-green-900">{item.nom_uti}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            item.type_action === 'login'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.type_action === 'logout'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.type_action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(item.date_action)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-green-600">
                      Aucun résultat trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredHistoriques.length > itemsPerPage && (
            <div className="bg-green-50 px-4 py-3 border-t border-green-100 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-green-700">
                Affichage {startIndex + 1} à {Math.min(endIndex, filteredHistoriques.length)} sur {filteredHistoriques.length}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-green-600 bg-white border border-green-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                {paginationButtons}
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-green-600 bg-white border border-green-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoriqueConnexions;