import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PetiteEtapeActionWithTable = () => {
  const { id_mbr, id_eta } = useParams();
  const [petitesEtapes, setPetitesEtapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [tableData, setTableData] = useState({});
  const [savedValeurs, setSavedValeurs] = useState({});

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

  // Fonction pour charger les données d'un tableau
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
      console.error("Erreur lors du chargement des données du tableau:", err);
    }
  };

  // Fonction pour gérer les changements de valeur
  const handleChange = async (id_peta, id_sous, id_col, value, type_input) => {
    try {
      if (!id_mbr || !id_sous || !id_col) return;

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
        const updatedValeurs = [
          ...prev[id_peta].valeurs.filter(v => !(v.id_sous === id_sous && v.id_col === id_col)),
          { id_sous, id_col, valeur: valToSend }
        ];

        return {
          ...prev,
          [id_peta]: {
            ...prev[id_peta],
            valeurs: updatedValeurs
          }
        };
      });

      // Envoi au backend
      await axios.post("http://localhost:3000/api/valeuretape/valeurs", {
        id_mbr,
        id_sous,
        id_col,
        valeur: valToSend
      });

      // Marquer comme enregistré (bloquer après saisie)
      setSavedValeurs(prev => ({
        ...prev,
        [`${id_sous}_${id_col}`]: true
      }));

    } catch (err) {
      console.error("Erreur lors de l'ajout de valeur:", err.response?.data || err.message);
    }
  };

  // Fonction utilitaire pour récupérer une valeur
  const getValeur = (valeurs, id_sous, id_col) => {
    if (!valeurs) return "";
    const val = valeurs.find(v => v.id_sous === id_sous && v.id_col === id_col);
    return val ? val.valeur : "";
  };

  // Fonction pour gérer le focus sur un champ time
  const handleTimeFocus = (id_peta, id_sous, id_col, type_input, currentValue) => {
    if (type_input === "time" && !currentValue) {
      handleChange(id_peta, id_sous, id_col, "", type_input);
    }
  };

  // Fonction pour rendre les inputs selon leur type
  const renderInput = (id_peta, sous, col) => {
    const valeurs = tableData[id_peta]?.valeurs || [];
    let value = getValeur(valeurs, sous.id_sous, col.id_col);
    const isSaved = savedValeurs[`${sous.id_sous}_${col.id_col}`] || !!value;

    switch (sous.type_input) {
      case "date":
        return (
          <input
            type="date"
            value={value || ""}
            onChange={e => handleChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)}
            onFocus={() => {
              if (!value) {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                handleChange(id_peta, sous.id_sous, col.id_col, `${year}-${month}-${day}`, sous.type_input);
              }
            }}
            className={`w-full text-center border px-1 py-1 ${isSaved ? 'bg-gray-200' : ''}`}
            disabled={isSaved}
          />
        );

      case "time":
        return (
          <input
            type="time"
            value={value || ""}
            onChange={e => handleChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)}
            onFocus={() => handleTimeFocus(id_peta, sous.id_sous, col.id_col, sous.type_input, value)}
            className={`w-full text-center border px-1 py-1 ${isSaved ? 'bg-gray-200' : ''}`}
            disabled={isSaved}
          />
        );

      case "number":
      case "text":
      case "datetime-local":
        return (
          <input
            type={sous.type_input}
            value={value || ""}
            onChange={e => handleChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)}
            className="w-full text-center border px-1 py-1"
          />
        );

      case "textarea":
        return (
          <textarea
            value={value || ""}
            onChange={e => handleChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)}
            className="w-full text-center border px-1 py-1"
            rows="2"
          />
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={value === "true"}
            onChange={e => handleChange(id_peta, sous.id_sous, col.id_col, String(e.target.checked), sous.type_input)}
            className="mx-auto"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value || ""}
            onChange={e => handleChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)}
            className="w-full text-center border px-1 py-1"
          />
        );
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 p-6">Chargement...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Petites Étapes avec Édition</h1>
      
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
                {activeTable === peta.id_peta ? "Masquer le tableau" : "Voir/Éditer tableau"}
              </button>
            </div>
            
            {/* Tableau des valeurs (affiché conditionnellement) */}
            {activeTable === peta.id_peta && tableData[peta.id_peta] && (
              <div className="p-4 bg-gray-50">
                <h4 className="text-md font-semibold mb-3 text-gray-700">Tableau des valeurs - Édition</h4>
                
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
                            <td key={col.id_col} className="border px-2 py-2">
                              {renderInput(peta.id_peta, sous, col)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p className="flex items-center">
                    <span className="inline-block w-4 h-4 bg-gray-200 mr-2"></span>
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
        ))
      )}
    </div>
  );
};

export default PetiteEtapeActionWithTable;