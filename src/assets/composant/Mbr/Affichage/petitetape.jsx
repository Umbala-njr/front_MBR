import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const  PetiteEtapeWithTable = () => {
  const { id_mbr, id_eta, code_fab } = useParams();
  const navigate = useNavigate();
  const [petitesEtapes, setPetitesEtapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [tableData, setTableData] = useState({});

  // Charger les petites étapes
  useEffect(() => {
    const fetchPetitesEtapes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/petite_etape/affichepetitEtapebyeta/${id_eta}`
        );
        setPetitesEtapes(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des petites étapes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPetitesEtapes();
  }, [id_eta]);

  // Charger les données du tableau
  const loadTableData = async (id_peta) => {
    if (tableData[id_peta]) {
      setActiveTable(activeTable === id_peta ? null : id_peta);
      return;
    }

    try {
      const [colonnesRes, sousEtapesRes, valeursRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/colonne/listecolonne/${id_peta}`),
        axios.get(`http://localhost:3000/api/sous_etape/sous_etape/${id_eta}/${id_peta}`),
        axios.get(`http://localhost:3000/api/valeuretape/valeurs/${id_mbr}`)
      ]);

      setTableData(prev => ({
        ...prev,
        [id_peta]: {
          colonnes: colonnesRes.data,
          sousEtapes: sousEtapesRes.data,
          valeurs: valeursRes.data
        }
      }));

      setActiveTable(id_peta);
    } catch (err) {
      console.error("Erreur lors du chargement du tableau:", err);
    }
  };

  // Fonction utilitaire pour récupérer une valeur
  const getValeur = (valeurs, id_sous, id_col) => {
    if (!valeurs) return "";
    const val = valeurs.find(v => v.id_sous === id_sous && v.id_col === id_col);
    return val ? val.valeur : "";
  };

  // Navigation vers page échantillon
  const handleEchantillonClick = () => {
    navigate(`/PROD/echantillonaction/${id_mbr}/${code_fab}`);
  };

  if (loading) {
    return <p className="text-center text-gray-500 p-6">Chargement...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Petites Étapes</h1>
      
      {petitesEtapes.length === 0 ? (
        <p className="text-center text-gray-500 p-6 bg-white rounded-lg shadow">
          Aucune petite étape trouvée pour cette étape.
        </p>
      ) : (
        petitesEtapes.map((peta, index) => (
          <div key={peta.id_peta} className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* En-tête de la petite étape */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="bg-green-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                <h3 className="text-lg font-semibold text-gray-800">{peta.nom_peta}</h3>
              </div>
              
              <button
                onClick={() => loadTableData(peta.id_peta)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                {activeTable === peta.id_peta ? "Masquer le tableau" : "Voir tableau"}
              </button>
            </div>
            
            {/* Tableau d'affichage des valeurs */}
            {activeTable === peta.id_peta && tableData[peta.id_peta] && (
              <div className="p-4 bg-gray-50">
                <h4 className="text-md font-semibold mb-3 text-gray-700">Tableau des valeurs</h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2">Paramètre</th>
                        <th className="border px-4 py-2">Appareil</th>
                        <th className="border px-4 py-2">Unité</th>
                        <th className="border px-4 py-2">Tolérance</th>
                        <th className="border px-4 py-2">Criticité</th>
                        <th className="border px-4 py-2">Valeur Std</th>
                        {tableData[peta.id_peta].colonnes.map(col => (
                          <th key={col.id_col} className="border px-4 py-2">{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData[peta.id_peta].sousEtapes.map(sous => (
                        <tr key={sous.id_sous}>
                          <td className="border px-4 py-2">{sous.parametre}</td>
                          <td className="border px-4 py-2">{sous.appareil}</td>
                          <td className="border px-4 py-2">{sous.unite}</td>
                          <td className="border px-4 py-2">{sous.tolerence}</td>
                          <td className="border px-4 py-2">{sous.criticite}</td>
                          <td className="border px-4 py-2">{sous.valeur_std}</td>
                          {tableData[peta.id_peta].colonnes.map(col => (
                            <td key={col.id_col} className="border px-2 py-2 text-center">
                              {getValeur(tableData[peta.id_peta].valeurs, sous.id_sous, col.id_col) || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Bouton Échantillon */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleEchantillonClick}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
                  >
                    Échantillon
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default  PetiteEtapeWithTable;
