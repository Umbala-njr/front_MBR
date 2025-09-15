// src/production/Ouvrier/MatiereOuvrier.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, Package, Filter, Plus } from "lucide-react";
import axios from "axios";

const MatiereOuvrier = () => {
  const [matieres, setMatieres] = useState([]);
  const { id_mbr, code_fab } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [tableData, setTableData] = useState({});
  const [savedValeurs, setSavedValeurs] = useState({});

  // Charger toutes les matières
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

  // Charger les données d'une matière
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
        setError(err.response?.data?.error || "Erreur lors du chargement des données");
        return;
      }
    }

    setActiveTable(id_mat);
  };

  // Gestion des inputs
  const handleInputChange = async (id_mat, row_id, id_colm, value, type_input) => {
    try {
      // Auto time
      if (type_input === "time" && value === "") {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        value = `${h}:${m}`;
      }

      // Auto date
      if (type_input === "date" && value === "") {
        const now = new Date();
        const y = now.getFullYear();
        const mo = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        value = `${y}-${mo}-${d}`;
      }

      const valToSend = value === "" ? null : value;

      // Update local
      setTableData(prev => {
        const updated = prev[id_mat].lignes.map(l =>
          l.row_id === row_id
            ? { ...l, valeurs: { ...l.valeurs, [id_colm]: valToSend } }
            : l
        );
        return { ...prev, [id_mat]: { ...prev[id_mat], lignes: updated } };
      });

      // Send backend
      await axios.post("http://localhost:3000/api/matiere/ajoutervaleur", {
        id_mbr,
        id_mat,
        row_id,
        id_colm,
        valeur_mat: valToSend
      });

      setSavedValeurs(prev => ({ ...prev, [`${row_id}_${id_colm}`]: true }));
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la modification");
    }
  };

  const renderInput = (id_mat, row_id, col, currentValue) => {
    const isSaved = savedValeurs[`${row_id}_${col.id_colm}`] || !!currentValue;
    const baseStyle = `w-full text-center border px-1 py-2 rounded-lg text-sm md:text-base`;

    switch (col.type_input) {
      case "date":
      case "time":
      case "number":
      case "text":
      case "datetime-local":
        return (
          <input
            type={col.type_input}
            value={currentValue || ""}
            onChange={e => handleInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            className={`${baseStyle} ${isSaved ? "bg-emerald-900 text-gray-300" : "bg-white text-gray-900"}`}
            disabled={isSaved}
          />
        );
      case "textarea":
        return (
          <textarea
            value={currentValue || ""}
            onChange={e => handleInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            className={`${baseStyle} bg-white text-gray-900`}
            rows="2"
          />
        );
      case "checkbox":
        return (
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={currentValue === "true"}
              onChange={e => handleInputChange(id_mat, row_id, col.id_colm, String(e.target.checked), col.type_input)}
              className="w-5 h-5"
            />
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={currentValue || ""}
            onChange={e => handleInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            className={`${baseStyle} bg-white text-gray-900`}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-emerald-800/70 border border-emerald-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Matières Production</h1>
              <p className="text-emerald-200 text-sm">Fab: {code_fab}</p>
            </div>
          </div>
          <span className="text-emerald-300 text-sm">ID: {id_mbr}</span>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-emerald-800/70 border border-emerald-700 rounded-lg p-4 flex items-center space-x-3">
        <Filter className="w-5 h-5 text-emerald-400" />
        <div>
          <p className="text-lg font-bold text-white">{matieres.length}</p>
          <p className="text-emerald-200 text-sm">Étape(s) de fabrication</p>
        </div>
      </div>

      {/* Matières */}
      <div className="space-y-4">
        {matieres.map((matiere, index) => (
          <div key={matiere.id_mat} className="bg-emerald-800/50 border border-emerald-700 rounded-lg">
            <div
              className="px-4 py-3 border-b border-emerald-700 cursor-pointer flex items-center justify-between"
              onClick={() => loadTableData(matiere.id_mat)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-7 h-7 bg-emerald-600 text-white rounded-full font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{matiere.nom_mat}</h3>
                  <p className="text-xs text-emerald-200">{matiere.caractere}</p>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-emerald-400 transition-transform ${activeTable === matiere.id_mat ? "rotate-180" : ""}`}
              />
            </div>

            {activeTable === matiere.id_mat && tableData[matiere.id_mat] && (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-semibold text-emerald-200">Saisie des valeurs</h4>
                  <button
                    onClick={() => handleInputChange(matiere.id_mat)}
                    className="bg-emerald-600 px-3 py-1 rounded-lg text-white flex items-center space-x-1 text-sm hover:bg-emerald-700"
                  >
                    <Plus className="w-4 h-4" /> <span>Nouvelle ligne</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-emerald-700 rounded-lg overflow-hidden">
                    <thead className="bg-emerald-900">
                      <tr>
                        <th className="px-3 py-2 text-sm font-semibold text-emerald-300 border-b border-emerald-700">Ligne</th>
                        {tableData[matiere.id_mat].colonnes.map(col => (
                          <th key={col.id_colm} className="px-2 py-2 text-sm font-semibold text-emerald-300 border-b border-emerald-700">
                            {col.nom_colm}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData[matiere.id_mat].lignes.map(ligne => (
                        <tr key={ligne.row_id} className="even:bg-emerald-900/40">
                          <td className="px-3 py-2 text-sm text-center text-white border-b border-emerald-700">
                            {ligne.row_id}
                          </td>
                          {tableData[matiere.id_mat].colonnes.map(col => (
                            <td key={col.id_colm} className="px-2 py-2 border-b border-emerald-700">
                              {renderInput(matiere.id_mat, ligne.row_id, col, ligne.valeurs[col.id_colm] || "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {matieres.length === 0 && (
        <div className="text-center text-emerald-200">Aucune matière pour la fabrication {code_fab}.</div>
      )}
    </div>
  );
};

export default MatiereOuvrier;
