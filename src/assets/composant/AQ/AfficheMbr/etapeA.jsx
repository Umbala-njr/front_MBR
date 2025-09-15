import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EtapeafficheMBR = () => {
  const { id_mbr, code_fab } = useParams();
  const navigate = useNavigate();
  const [etapes, setEtapes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupération et tri des étapes depuis l'API
  useEffect(() => {
    const fetchEtapes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/etape/etapeBR/${id_mbr}/${code_fab}`
        );

        // Tri des étapes par id_eta
        const sortedEtapes = [...res.data].sort((a, b) => a.id_eta - b.id_eta);
        setEtapes(sortedEtapes);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEtapes();
  }, [id_mbr, code_fab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">Chargement des étapes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Étapes de Production
          </h1>
          <div className="flex justify-center space-x-6 text-green-100">
            <span className="bg-white/20 px-4 py-2 rounded-full">
              MBR: <span className="font-semibold">{id_mbr}</span>
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full">
              Code Fab: <span className="font-semibold">{code_fab}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        {etapes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {etapes.map((etape, index) => (
              <div
                key={etape.id_eta}
                className="group relative bg-white rounded-3xl p-6 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 border border-green-100 hover:border-green-300"
              >
                {/* Numéro d'étape */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-700 to-green-800 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <span className="text-white font-bold text-lg">
                    {index + 1}
                  </span>
                </div>

                {/* Badge ID */}
                <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ID: {etape.id_eta}
                </div>

                {/* Contenu */}
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-green-900 mb-4 leading-tight">
                    {etape.nom_eta}
                  </h2>

                  <div className="bg-green-50 rounded-2xl p-4 mb-6 border-l-4 border-green-600">
                    <div className="prose prose-sm max-w-none text-green-800">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: etape.Instruction || "Pas d'instruction disponible",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/AQ/petiteetapeAQ/${id_mbr}/${etape.id_eta}`)
                    }
                    className="w-full bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Voir détails</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Effet de bordure au hover */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Aucune étape trouvée
              </h3>
              <p className="text-green-100">
                Aucune étape n'a été trouvée pour ce MBR et code de fabrication.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EtapeafficheMBR;
