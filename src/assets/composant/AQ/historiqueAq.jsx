import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const HistoriqueConnexions = () => {
  const [historiques, setHistoriques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:3000';

  // Fonction isolée pour pouvoir la réutiliser dans le bouton "Réessayer"
  const fetchHistoriques = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Récupération du token JWT
      const response = await axios.get(`${BASE_URL}/api/utilisateur/historique`, {
        headers: {
          Authorization: `Bearer ${token}`, // Passage du token
        },
      });
      setHistoriques(response.data);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
  };

  if (loading) {
    return (
      <section className="container px-4 mx-auto mt-10">
        <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container px-4 mx-auto mt-10">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchHistoriques}
          className="mt-2 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </section>
    );
  }

  return (
    <section className="container px-4 mx-auto mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Historique des Connexions
        </h2>
        <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">
          {historiques.length} connexions
        </span>
      </div>

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="py-3.5 px-4 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Utilisateur</th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Rôle</th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Action</th>
                    <th className="px-4 py-3.5 text-sm font-normal text-left text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {historiques.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="object-cover w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 shrink-0 mr-3"
                            src={`${BASE_URL}/uploads/photos/${item.photo}`}
                            alt={item.nom_uti}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/32';
                            }}
                          />
                          <h2 className="font-medium text-gray-800 dark:text-white">{item.nom_uti}</h2>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-700 dark:text-gray-200">{item.role}</td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <span className={`inline px-3 py-1 text-sm font-normal rounded-full ${
                          item.type_action === 'login'
                            ? 'text-emerald-500 bg-emerald-100/60 dark:bg-gray-800'
                            : 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {item.type_action}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-700 dark:text-gray-200">
                        {formatDate(item.date_action)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistoriqueConnexions;
