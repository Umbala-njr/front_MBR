import React, { useState, useEffect } from "react";
import { ChevronRight, Package, Settings, Search, Filter } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MatiereactionManager = () => {
  const [matieres, setMatieres] = useState([]);
  const { id_mbr, code_fab } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer toutes les matières pour ce code_fab
  const fetchMatieres = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/matiere/${code_fab}`);
      setMatieres(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du chargement des matières");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatieres();
  }, [code_fab]);

  const handleGererTableaux = (id_mat) => {
    navigate(`/PROD/tableaumatiereaction/${id_mbr}/${id_mat}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="animate-slideInLeft">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Gestionnaire de Matières
                  </h1>
                  <p className="text-green-100 mt-1">
                    Fabrication : <span className="font-semibold">{code_fab}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="animate-slideInRight">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <span className="text-green-100 text-sm">ID Membre: {id_mbr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
              <div className="mt-4 text-center">
                <p className="text-gray-600 font-medium">Chargement des matières...</p>
              </div>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg animate-shake mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">⚠</div>
              <div className="ml-3">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        {!loading && !error && (
          <div className="mb-8 animate-fadeInUp">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <Filter className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{matieres.length}</p>
                    <p className="text-gray-600">Matière(s) trouvée(s)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grille des matières */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matieres.map((matiere, index) => (
              <div
                key={matiere.id_mat}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden
                           hover:shadow-xl hover:border-green-300 hover:-translate-y-1
                           transition-all duration-300 ease-out cursor-pointer
                           animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* En-tête */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                        {matiere.id_mat}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-200">
                    {matiere.nom_mat}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Caractéristique</p>
                        <p className="text-gray-800 font-medium">{matiere.caractere}</p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton */}
                  <button
                    onClick={() => handleGererTableaux(matiere.id_mat)}
                    className="w-full bg-gradient-to-r from-green-700 to-green-600 text-white font-semibold py-3 px-4 rounded-xl
                               hover:from-green-800 hover:to-green-700 hover:shadow-lg hover:scale-[1.02]
                               focus:outline-none focus:ring-4 focus:ring-green-200
                               transition-all duration-300 ease-out
                               flex items-center justify-center space-x-2 group"
                  >
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Gérer les Tableaux</span>
                  </button>
                </div>
                <div className="h-1 bg-gradient-to-r from-green-500 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>
        )}

        {/* Message si aucune matière */}
        {!loading && !error && matieres.length === 0 && (
          <div className="text-center py-16 animate-fadeInUp">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Package className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Aucune matière disponible</h3>
              <p className="text-gray-600 leading-relaxed">
                Il n'y a actuellement aucune matière associée à la fabrication <strong>{code_fab}</strong>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Styles CSS pour les animations personnalisées */}
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MatiereactionManager;