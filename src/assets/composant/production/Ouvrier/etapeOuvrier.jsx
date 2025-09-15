import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EtapeOuvrier = () => {
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
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-emerald-100 text-lg font-medium">Chargement des étapes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-emerald-800/70 backdrop-blur-sm rounded-xl p-6 border border-emerald-700/50">
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Étapes de Production
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-emerald-100 mt-4">
          <span className="bg-emerald-700/50 px-4 py-2 rounded-full">
            MBR: <span className="font-semibold">{id_mbr}</span>
          </span>
          <span className="bg-emerald-700/50 px-4 py-2 rounded-full">
            Code Fab: <span className="font-semibold">{code_fab}</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div>
        {etapes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {etapes.map((etape, index) => (
              <div
                key={etape.id_eta}
                className="group relative bg-emerald-800/70 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-emerald-700/50 hover:border-emerald-500/50"
              >
                {/* Numéro d'étape */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow border border-emerald-500/50">
                  <span className="text-white font-bold text-lg">
                    {index + 1}
                  </span>
                </div>

               

                {/* Contenu */}
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-white mb-4 leading-tight">
                    {etape.nom_eta}
                  </h2>

                  <div className="bg-emerald-700/40 rounded-xl p-4 mb-6 border-l-4 border-emerald-500">
                    <div className="prose prose-sm max-w-none text-emerald-100">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: etape.Instruction || "Pas d'instruction disponible",
                        }}
                        className="text-emerald-100"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/OPROD/petiteetapeOuvrier/${id_mbr}/${etape.id_eta}/${code_fab}`)
                    }
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:from-emerald-500 hover:to-emerald-600 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
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
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-emerald-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-emerald-700/50">
              <div className="w-20 h-20 mx-auto mb-4 bg-emerald-700/50 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-emerald-200"
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
              <h3 className="text-xl font-bold text-white mb-2">
                Aucune étape trouvée
              </h3>
              <p className="text-emerald-100">
                Aucune étape n'a été trouvée pour ce MBR et code de fabrication.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EtapeOuvrier;