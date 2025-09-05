import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const HistoriqueProd = () => {
  const [historiques, setHistoriques] = useState([]);
  const [filteredHistoriques, setFilteredHistoriques] = useState([]);
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
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/api/utilisateur/historique`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistoriques(response.data);
      setFilteredHistoriques(response.data);
      setError(null);
    } catch (error) {
      setError("Échec du chargement de l'historique des connexions.");
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistoriques();
  }, [fetchHistoriques]);

  // Filtrage dynamique
  useEffect(() => {
    let filtered = historiques;

    // exclure le rôle AQ
    filtered = filtered.filter(item => item.role !== "AQ");

    // filtrer par nom
    filtered = filtered.filter(item =>
      item.nom_uti?.toLowerCase().includes(searchNom.toLowerCase())
    );

    // filtrer par type d’action
    if (searchAction) {
      filtered = filtered.filter(item =>
        item.type_action?.toLowerCase().includes(searchAction.toLowerCase())
      );
    }

    // filtrer par date début / fin
    if (dateDebut) {
      filtered = filtered.filter(item => new Date(item.date_action) >= new Date(dateDebut));
    }
    if (dateFin) {
      filtered = filtered.filter(item => new Date(item.date_action) <= new Date(dateFin));
    }

    setFilteredHistoriques(filtered);
    setCurrentPage(1);
  }, [searchNom, searchAction, dateDebut, dateFin, historiques]);

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

  // Pagination
  const totalPages = Math.ceil(filteredHistoriques.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredHistoriques.slice(startIndex, endIndex);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);
  const goToPrevious = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));


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
      <div className="container mx-auto max-w-7xl px-6 py-8">

        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-green-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-green-800">Historique</h1>
              <p className="text-green-600">Toutes les actions effectuées par les utilisateurs</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <span className="text-green-800 font-semibold">
                  {filteredHistoriques.length} enregistrements
                </span>
              </div>
              <button
                onClick={fetchHistoriques}
                className="p-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                title="Actualiser"
              >
                🔄
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
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Type d'action</label>
              <input
                type="text"
                placeholder="Ex: login, ajout..."
                value={searchAction}
                onChange={(e) => setSearchAction(e.target.value)}
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Date début</label>
              <input
                type="date"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-2">Date fin</label>
              <input
                type="date"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                className="w-full p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-green-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Utilisateur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rôle</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Action</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Date & Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => (
                    <tr key={index} className="hover:bg-green-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={`${BASE_URL}/uploads/photos/${item.photo}`}
                            alt={item.nom_uti}
                            className="w-10 h-10 rounded-full border border-green-200 object-cover"
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/40/10B981/ffffff?text=U')}
                          />
                          <span className="font-medium text-green-900">{item.nom_uti}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {item.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
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
                      <td className="px-6 py-4 text-sm text-gray-600">
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
            <div className="bg-green-50 px-6 py-4 border-t border-green-100 flex justify-between items-center">
              <p className="text-sm text-green-700">
                Affichage {startIndex + 1} à {Math.min(endIndex, filteredHistoriques.length)} sur {filteredHistoriques.length}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-green-600 bg-white border border-green-300 rounded-lg disabled:opacity-50"
                >
                  Précédent
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === pageNumber ? 'bg-green-700 text-white' : 'bg-white text-green-600 border border-green-300'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-green-600 bg-white border border-green-300 rounded-lg disabled:opacity-50"
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

export default HistoriqueProd;
