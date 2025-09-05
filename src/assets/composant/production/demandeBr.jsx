import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

const DemandeComponent = ({ onDemandeSent }) => {
  const [contenu, setContenu] = useState('');
  const [statut, setStatut] = useState({ message: '', type: '' });
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(false);

  const { code_fab, id_camp } = useParams();

  // Charger toutes les demandes avec noms inclus
  const chargerDemandes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/demandebr/afficheDemandeById/${id_camp}`
      );
      setDemandes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      setStatut({
        message: 'Erreur lors du chargement des demandes',
        type: 'error',
      });
    }
  };

  useEffect(() => {
    if (id_camp) {
      chargerDemandes();
    }
  }, [id_camp]);

  const envoyerDemande = async (e) => {
    e.preventDefault();

    if (!contenu.trim()) {
      setStatut({
        message: 'Le contenu est obligatoire',
        type: 'error',
      });
      return;
    }

    setLoading(true);
    setStatut({
      message: 'Envoi en cours...',
      type: 'info',
    });

    try {
      const response = await axios.post(
        `http://localhost:3000/api/demandebr/Demande/${id_camp}/${code_fab}`,
        { contenue: contenu }
      );

      if (response.status === 201) {
        setStatut({
          message: 'Demande envoyée avec succès!',
          type: 'success',
        });
        setContenu('');
        await chargerDemandes(); // recharger la liste
        if (onDemandeSent) onDemandeSent(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setStatut({
        message: 'Erreur lors de l\'envoi de la demande',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'envoyée':
        return 'bg-yellow-100 text-yellow-800';
      case 'traitée':
        return 'bg-green-100 text-green-800';
      case 'rejetée':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = () => {
    switch (statut.type) {
      case 'success':
        return 'bg-green-100 border-green-400 text-green-700';
      case 'error':
        return 'bg-red-100 border-red-400 text-red-700';
      case 'info':
        return 'bg-blue-100 border-blue-400 text-blue-700';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-700';
    }
  };

  if (!code_fab || !id_camp) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 
              2.502-1.667 1.732-3L13.732 4c-.77-1.333-
              2.694-1.333-3.464 0L3.34 16c-.77 
              1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            Paramètres manquants
          </h2>
          <p className="text-gray-600 mt-2">
            Les paramètres code_fab et id_camp sont requis dans l'URL.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Envoyer une demande</h2>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Campagne:</span> {id_camp} |{' '}
          <span className="font-medium ml-2">Fabricant:</span> {code_fab}
        </div>
      </div>

      <form onSubmit={envoyerDemande} className="mb-6">
        <div className="mb-4">
          <label
            htmlFor="contenu"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Votre message
          </label>
          <textarea
            id="contenu"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Saisissez votre demande ici..."
            rows="5"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading || !contenu.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 
                    018-8V0C5.373 0 0 5.373 0 
                    12h4zm2 5.291A7.962 7.962 0 
                    014 12H0c0 3.042 1.135 
                    5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Envoi en cours...
              </span>
            ) : (
              'Envoyer la demande'
            )}
          </button>

          {contenu.length > 0 && (
            <span
              className={`text-sm ${
                contenu.length > 500 ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {contenu.length}/500 caractères
            </span>
          )}
        </div>
      </form>

      {statut.message && (
        <div className={`mb-6 px-4 py-3 rounded border ${getAlertColor()}`}>
          {statut.message}
        </div>
      )}

      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Demandes précédentes
        </h3>

        {demandes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 
                0 01-2-2V5a2 2 0 
                012-2h5.586a1 1 0 
                01.707.293l5.414 
                5.414a1 1 0 
                01.293.707V19a2 
                2 0 01-2 2z"
              />
            </svg>
            <p className="mt-2 text-gray-600">
              Aucune demande envoyée pour le moment.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {demandes.map((demande) => (
              <div
                key={demande.id_dem}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-700">
                    Fabricant: {demande.code_fab}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      demande.statut
                    )}`}
                  >
                    {demande.statut}
                  </span>
                </div>

                <div className="text-gray-800 mb-3">{demande.contenue}</div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {demande.date_creation
                      ? new Date(demande.date_creation).toLocaleDateString(
                          'fr-FR',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )
                      : 'Date non disponible'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandeComponent;
