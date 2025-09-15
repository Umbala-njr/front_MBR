import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronRight, Package, Settings, Search, Filter, Plus, X, ChevronDown } from "lucide-react";
import axios from "axios";

const  MatiereafficheAQ = () => {
  const [matieres, setMatieres] = useState([]);
  const { id_mbr, code_fab } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [tableData, setTableData] = useState({});
  const [savedValeurs, setSavedValeurs] = useState({});

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

  // Fonction pour charger les données d'un tableau de matière
  const loadTableData = async (id_mat) => {
    if (activeTable === id_mat) {
      setActiveTable(null);
      return;
    }

    if (!tableData[id_mat]) {
      try {
        const res = await axios.get(`http://localhost:3000/api/matiere/valeurs/${id_mbr}/${id_mat}`);
        
        setTableData(prev => ({
          ...prev,
          [id_mat]: {
            colonnes: res.data.colonnes || [],
            lignes: res.data.lignes || []
          }
        }));
      } catch (err) {
        setError(err.response?.data?.error || "Erreur lors du chargement des données du tableau");
        return;
      }
    }

    setActiveTable(id_mat);
  };

  // Fonction pour gérer les changements de valeur
  const handleInputChange = async (id_mat, row_id, id_colm, value, type_input) => {
    try {
      // Pour les champs time, on récupère l'heure actuelle et on bloque
      if (type_input === "time" && value === "") {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        value = `${hours}:${minutes}`;
      }

      // Pour les champs date, on utilise la date du jour si vide
      if (type_input === "date" && value === "") {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        value = `${year}-${month}-${day}`;
      }

      const valToSend = value === "" ? null : value;

      // Mise à jour locale
      setTableData(prev => {
        const updatedLignes = prev[id_mat].lignes.map(ligne => {
          if (ligne.row_id === row_id) {
            return {
              ...ligne,
              valeurs: {
                ...ligne.valeurs,
                [id_colm]: valToSend
              }
            };
          }
          return ligne;
        });

        return {
          ...prev,
          [id_mat]: {
            ...prev[id_mat],
            lignes: updatedLignes
          }
        };
      });

      // Envoi au backend
      await axios.post("http://localhost:3000/api/matiere/ajoutervaleur", {
        id_mbr,
        id_mat,
        row_id,
        id_colm,
        valeur_mat: valToSend
      });

      // Marquer comme enregistré (bloquer après saisie)
      setSavedValeurs(prev => ({
        ...prev,
        [`${row_id}_${id_colm}`]: true
      }));

    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la modification");
    }
  };

  // Fonction pour gérer le focus sur un champ time
  const handleTimeFocus = (id_mat, row_id, id_colm, type_input, currentValue) => {
    if (type_input === "time" && !currentValue) {
      handleInputChange(id_mat, row_id, id_colm, "", type_input);
    }
  };

  // Fonction pour rendre les inputs selon leur type
  const renderInput = (id_mat, row_id, col, currentValue) => {
    const isSaved = savedValeurs[`${row_id}_${col.id_colm}`] || !!currentValue;

    switch (col.type_input) {
      case "date":
        return (
          <input
            type="date"
            value={currentValue || ""}
            onChange={e => handleInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            onFocus={() => {
              if (!currentValue) {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                handleInputChange(id_mat, row_id, col.id_colm, `${year}-${month}-${day}`, col.type_input);
              }
            }}
            className={`w-full text-center border px-1 py-1 rounded ${isSaved ? 'bg-gray-200' : ''}`}
            disabled={isSaved}
          />
        );

      case "time":
        return (
          <input
            type="time"
            value={currentValue || ""}
            onChange={e => handleInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            onFocus={() => handleTimeFocus(id_mat, row_id, col.id_colm, col.type_input, currentValue)}
            className={`w-full text-center border px-1 py-1 rounded ${isSaved ? 'bg-gray-200' : ''}`}
            disabled={isSaved}
          />
        );

      case "number":
      case "text":
      case "datetime-local":
        return (
          <input
            type={col.type_input}
            value={currentValue || ""}
            onChange={e => handleInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            className="w-full text-center border px-1 py-1 rounded"
          />
        );

      case "textarea":
        return (
          <textarea
            value={currentValue || ""}
            onChange={e => handleInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            className="w-full text-center border px-1 py-1 rounded"
            rows="2"
          />
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={currentValue === "true"}
            onChange={e => handleInputChange(id_mat, row_id, col.id_colm, String(e.target.checked), col.type_input)}
            className="mx-auto"
          />
        );

      default:
        return (
          <input
            type="text"
            value={currentValue || ""}
            onChange={e => handleInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            className="w-full text-center border px-1 py-1 rounded"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 font-medium">Chargement des matières...</p>
          </div>
        </div>
      </div>
    );
  }

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
        {/* Message d'erreur */}
        {error && (
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
        <div className="mb-8 animate-fadeInUp">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Filter className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{matieres.length}</p>
                  <p className="text-gray-600">Étape(s) de fabrication</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des matières en étapes */}
        <div className="space-y-6">
          {matieres.map((matiere, index) => (
            <div key={matiere.id_mat} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* En-tête de l'étape */}
              <div 
                className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200 cursor-pointer"
                onClick={() => loadTableData(matiere.id_mat)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {matiere.nom_mat}
                      </h3>
                      <p className="text-sm text-gray-600">{matiere.caractere}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                      ID: {matiere.id_mat}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-green-600 transition-transform duration-200 ${activeTable === matiere.id_mat ? 'rotate-180' : ''}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Tableau (affiché conditionnellement) */}
              {activeTable === matiere.id_mat && tableData[matiere.id_mat] && (
                <div className="p-6 border-t border-gray-100 animate-fadeIn">
                  <h4 className="text-lg font-semibold text-gray-900 mb-6">
                    Valeurs à saisir pour cette étape
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 bg-white">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-4 py-2">Ligne</th>
                          {tableData[matiere.id_mat].colonnes.map(col => (
                            <th key={col.id_colm} className="border px-4 py-2">
                              <div>
                                <div className="font-semibold">{col.nom_colm}</div>
                                <div className="text-xs text-gray-500 mt-1">{col.type_input}</div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData[matiere.id_mat].lignes.map(ligne => (
                          <tr key={ligne.row_id}>
                            <td className="border px-4 py-2 font-semibold text-center">{ligne.row_id}</td>
                            {tableData[matiere.id_mat].colonnes.map(col => (
                              <td key={col.id_colm} className="border px-2 py-2">
                                {renderInput(matiere.id_mat, ligne.row_id, col, ligne.valeurs[col.id_colm] || "")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 text-sm text-gray-600">
                    <p className="flex items-center">
                      <span className="inline-block w-4 h-4 bg-gray-200 mr-2 rounded"></span>
                      Les champs en gris sont verrouillés après enregistrement
                    </p>
                    <p className="mt-1 text-xs">
                      • Les champs time se remplissent automatiquement avec l'heure actuelle au clic
                    </p>
                    <p className="text-xs">
                      • Les champs date se remplissent automatiquement avec la date du jour au focus
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message si aucune matière */}
        {matieres.length === 0 && (
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default  MatiereafficheAQ;