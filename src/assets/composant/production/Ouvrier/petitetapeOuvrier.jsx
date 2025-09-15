// src/production/Ouvrier/PetiteEtapeOuvrier.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PetiteEtapeOuvrier = () => {
  const { id_mbr, id_eta, code_fab } = useParams();
  const navigate = useNavigate();
  const [petitesEtapes, setPetitesEtapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [tableData, setTableData] = useState({});
  const [savedValeurs, setSavedValeurs] = useState({});
  const [userRole, setUserRole] = useState("");

  // Récupérer le rôle de l'utilisateur connecté
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  /** Charger les petites étapes **/
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

  /** Charger les vérifications déjà faites **/
  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/verificationEtape/afficheVerification/${id_mbr}`
        );
        const verifMap = {};
        res.data.forEach((v) => {
          verifMap[v.id_peta] = {
            verified: true,
            verifiedBy: v.nom_uti,
            verifiedAt: v.date_verification,
          };
        });
        setTableData((prev) => {
          const updated = { ...prev };
          for (let id_peta in verifMap) {
            updated[id_peta] = {
              ...(updated[id_peta] || {}),
              ...verifMap[id_peta],
            };
          }
          return updated;
        });
      } catch (err) {
        console.error("Erreur lors du chargement des vérifications:", err);
      }
    };
    fetchVerifications();
  }, [id_mbr]);

  /** Vérification d'une petite étape **/
  const handleVerification = async (id_peta) => {
    // Vérifier que l'utilisateur a le bon rôle
    if (userRole !== "CE") {
      alert("Seuls les contrôleurs de qualité (CE) peuvent vérifier les étapes.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return alert("Utilisateur non connecté");

      await axios.post(
        `http://localhost:3000/api/verificationEtape/verifier/${id_peta}/${id_mbr}`,
        { id_uti: user.id_uti }
      );

      setTableData((prev) => ({
        ...prev,
        [id_peta]: {
          ...(prev[id_peta] || {}),
          verified: true,
          verifiedBy: user.nom_uti,
          verifiedAt: new Date().toISOString(),
        },
      }));
    } catch (err) {
      console.error("Erreur lors de la vérification:", err.response?.data || err.message);
    }
  };

  /** Charger un tableau de valeurs **/
  const loadTableData = async (id_peta) => {
    if (tableData[id_peta]?.colonnes) {
      setActiveTable(activeTable === id_peta ? null : id_peta);
      return;
    }

    try {
      const [colonnesRes, sousEtapesRes, valeursRes] = await Promise.all([
        axios.get(
          `http://localhost:3000/api/colonne/listecolonne/${id_peta}`
        ),
        axios.get(
          `http://localhost:3000/api/sous_etape/sous_etape/${id_eta}/${id_peta}`
        ),
        axios.get(`http://localhost:3000/api/valeuretape/valeurs/${id_mbr}`),
      ]);

      setTableData((prev) => ({
        ...prev,
        [id_peta]: {
          ...(prev[id_peta] || {}),
          colonnes: colonnesRes.data,
          sousEtapes: sousEtapesRes.data,
          valeurs: valeursRes.data,
        },
      }));

      setActiveTable(id_peta);
    } catch (err) {
      console.error("Erreur lors du chargement des données du tableau:", err);
    }
  };

  /** Gestion des changements **/
  const handleChange = async (id_peta, id_sous, id_col, value, type_input) => {
    // Bloquer la modification si la petite étape est vérifiée
    if (tableData[id_peta]?.verified) {
      return;
    }

    try {
      if (!id_mbr || !id_sous || !id_col) return;

      if (type_input === "time" && value === "") {
        const now = new Date();
        value = `${String(now.getHours()).padStart(2, "0")}:${String(
          now.getMinutes()
        ).padStart(2, "0")}`;
      }

      if (type_input === "date" && value === "") {
        const now = new Date();
        value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(now.getDate()).padStart(2, "0")}`;
      }

      const valToSend = value === "" ? null : value;

      setTableData((prev) => {
        const updatedValeurs = [
          ...(prev[id_peta]?.valeurs || []).filter(
            (v) => !(v.id_sous === id_sous && v.id_col === id_col)
          ),
          { id_sous, id_col, valeur: valToSend },
        ];

        return {
          ...prev,
          [id_peta]: {
            ...(prev[id_peta] || {}),
            valeurs: updatedValeurs,
          },
        };
      });

      await axios.post("http://localhost:3000/api/valeuretape/valeurs", {
        id_mbr,
        id_sous,
        id_col,
        valeur: valToSend,
      });

      setSavedValeurs((prev) => ({
        ...prev,
        [`${id_sous}_${id_col}`]: true,
      }));
    } catch (err) {
      console.error(
        "Erreur lors de l'ajout de valeur:",
        err.response?.data || err.message
      );
    }
  };

  /** Navigation vers échantillon **/
  const handleEchantillonClick = () => {
    navigate(`/OPROD/listeEchantillonsOuvrier/${id_mbr}/${code_fab}`);
  };

  /** Utilitaire valeur **/
  const getValeur = (valeurs, id_sous, id_col) => {
    if (!valeurs) return "";
    const val = valeurs.find(
      (v) => v.id_sous === id_sous && v.id_col === id_col
    );
    return val ? val.valeur : "";
  };

  /** Gestion du focus sur un champ time **/
  const handleTimeFocus = (
    id_peta,
    id_sous,
    id_col,
    type_input,
    currentValue
  ) => {
    // Bloquer si vérifié
    if (tableData[id_peta]?.verified) {
      return;
    }
    
    if (type_input === "time" && !currentValue) {
      handleChange(id_peta, id_sous, id_col, "", type_input);
    }
  };

  /** Rendu des inputs - Modifié pour désactiver si vérifié **/
  const renderInput = (id_peta, sous, col) => {
    const valeurs = tableData[id_peta]?.valeurs || [];
    let value = getValeur(valeurs, sous.id_sous, col.id_col);
    const isVerified = tableData[id_peta]?.verified;

    const isDateOrTime = sous.type_input === "date" || sous.type_input === "time";

    const isDisabled = isVerified || (isDateOrTime && !!value);

    switch (sous.type_input) {
      case "date":
        return (
          <input
            type="date"
            value={value || ""}
            onChange={(e) =>
              handleChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)
            }
            onFocus={() => {
              if (!value && !isVerified) {
                const now = new Date();
                handleChange(
                  id_peta,
                  sous.id_sous,
                  col.id_col,
                  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`,
                  sous.type_input
                );
              }
            }}
            className={`w-full text-center border border-emerald-600 rounded px-1 py-1 text-white ${
              isDisabled ? "bg-emerald-800 cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-600"
            }`}
            disabled={isDisabled}
          />
        );
      case "time":
        return (
          <input
            type="time"
            value={value || ""}
            onChange={(e) =>
              handleChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)
            }
            onFocus={() => handleTimeFocus(id_peta, sous.id_sous, col.id_col, sous.type_input, value)}
            className={`w-full text-center border border-emerald-600 rounded px-1 py-1 text-white ${
              isDisabled ? "bg-emerald-800 cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-600"
            }`}
            disabled={isDisabled}
          />
        );
      default:
        return (
          <input
            type={sous.type_input}
            value={value || ""}
            onChange={(e) =>
              handleChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)
            }
            className={`w-full text-center border border-emerald-600 rounded px-1 py-1 text-white ${
              isVerified ? "bg-emerald-800 cursor-not-allowed" : "bg-emerald-700 hover:bg-emerald-600"
            }`}
            disabled={isVerified}
          />
        );
    }
  };

  /** Loading state **/
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
        <span className="ml-3 text-emerald-100">
          Chargement des données...
        </span>
      </div>
    );
  }

  /** Rendu principal **/
  return (
    <div className="space-y-6">
      <div className="bg-emerald-800/70 rounded-xl p-6 shadow-lg border border-emerald-700/50">
        <h1 className="text-2xl font-bold text-white mb-2">
          Gestion des Petites Étapes
        </h1>
        <p className="text-emerald-100">Code fabrication: {code_fab}</p>
        <p className="text-emerald-100 mt-2">
          Rôle utilisateur: {userRole} 
          {userRole === "CE" && " (Contrôleur de qualité)"}
        </p>
      </div>

      {petitesEtapes.length === 0 ? (
        <div className="bg-emerald-800/70 rounded-xl p-8 text-center shadow-lg border border-emerald-700/50">
          <svg
            className="mx-auto h-12 w-12 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-white">
            Aucune petite étape trouvée
          </h3>
          <p className="mt-2 text-emerald-100">
            Aucune petite étape n'est disponible pour cette étape de
            production.
          </p>
        </div>
      ) : (
        petitesEtapes.map((peta, index) => (
          <div
            key={peta.id_peta}
            className="bg-emerald-800/70 rounded-xl shadow-lg overflow-hidden border border-emerald-700/50"
          >
            {/* Header */}
            <div className="p-5 border-b border-emerald-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <span className="bg-emerald-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {peta.nom_peta}
                  </h3>
                  
                  {/* Affichage de l'information de vérification */}
                  {tableData[peta.id_peta]?.verified && (
                    <div className="mt-1 text-xs text-blue-300">
                      Vérifié par {tableData[peta.id_peta]?.verifiedBy} le{" "}
                      {new Date(tableData[peta.id_peta]?.verifiedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {/* Vérification - Afficher seulement pour les utilisateurs CE */}
                {userRole === "CE" && (
                  <button
                    onClick={() => handleVerification(peta.id_peta)}
                    disabled={tableData[peta.id_peta]?.verified}
                    className={`px-4 py-2 rounded-lg shadow transition flex items-center gap-2 ${
                      tableData[peta.id_peta]?.verified
                        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                  >
                    {tableData[peta.id_peta]?.verified
                      ? "Vérifié ✅"
                      : "Vérifier"}
                  </button>
                )}

                {/* Voir tableau */}
                <button
                  onClick={() => loadTableData(peta.id_peta)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow transition flex items-center gap-2"
                >
                  {activeTable === peta.id_peta ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      Masquer le tableau
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      Voir/Éditer tableau
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tableau */}
            {activeTable === peta.id_peta && tableData[peta.id_peta] && (
              <div className="p-5 bg-emerald-700/30">
                <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h4 className="text-lg font-semibold text-white">
                    Tableau des valeurs - Édition
                    {tableData[peta.id_peta]?.verified && (
                      <span className="ml-2 text-sm text-blue-300">
                        (Lecture seule - Vérifié)
                      </span>
                    )}
                  </h4>
                  <button
                    onClick={handleEchantillonClick}
                    className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg shadow transition flex items-center gap-2 border border-emerald-600"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Échantillon
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-emerald-600">
                  <table className="min-w-full bg-emerald-800/80 text-white">
                    <thead className="bg-emerald-900">
                      <tr>
                        <th className="border border-emerald-600 px-4 py-3">
                          Paramètre
                        </th>
                        <th className="border border-emerald-600 px-4 py-3">
                          Appareil
                        </th>
                        <th className="border border-emerald-600 px-4 py-3">
                          Unité
                        </th>
                        <th className="border border-emerald-600 px-4 py-3">
                          Tolérance
                        </th>
                        <th className="border border-emerald-600 px-4 py-3">
                          Criticité
                        </th>
                        <th className="border border-emerald-600 px-4 py-3">
                          Valeur Std
                        </th>
                        {tableData[peta.id_peta]?.colonnes?.map((col) => (
                          <th
                            key={col.id_col}
                            className="border border-emerald-600 px-4 py-3"
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData[peta.id_peta]?.sousEtapes?.map((sous) => (
                        <tr
                          key={sous.id_sous}
                          className="hover:bg-emerald-700/50 transition"
                        >
                          <td className="border border-emerald-600 px-4 py-2 font-medium">
                            {sous.parametre}
                          </td>
                          <td className="border border-emerald-600 px-4 py-2">
                            {sous.appareil}
                          </td>
                          <td className="border border-emerald-600 px-4 py-2">
                            {sous.unite}
                          </td>
                          <td className="border border-emerald-600 px-4 py-2">
                            {sous.tolerence}
                          </td>
                          <td className="border border-emerald-600 px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                sous.criticite === "Haute"
                                  ? "bg-red-500/20 text-red-200"
                                  : sous.criticite === "Moyenne"
                                  ? "bg-yellow-500/20 text-yellow-200"
                                  : "bg-green-500/20 text-green-200"
                              }`}
                            >
                              {sous.criticite}
                            </span>
                          </td>
                          <td className="border border-emerald-600 px-4 py-2 font-mono">
                            {sous.valeur_std}
                          </td>
                          {tableData[peta.id_peta]?.colonnes?.map((col) => (
                            <td
                              key={col.id_col}
                              className="border border-emerald-600 px-2 py-2"
                            >
                              {renderInput(peta.id_peta, sous, col)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-5 p-4 bg-emerald-800/50 rounded-lg border border-emerald-700/50">
                  <h5 className="font-semibold text-emerald-200 mb-2">
                    Informations de saisie
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-emerald-100">
                    <p className="flex items-center">
                      <span className="inline-block w-4 h-4 bg-emerald-600 mr-2 rounded"></span>
                      Les champs verrouillés après enregistrement
                    </p>
                    <p className="flex items-center">
                      <span className="inline-block w-4 h-4 bg-emerald-700 mr-2 rounded"></span>
                      Champs time : remplissage automatique avec l'heure
                      actuelle
                    </p>
                    <p className="flex items-center">
                      <span className="inline-block w-4 h-4 bg-emerald-700 mr-2 rounded"></span>
                      Champs date : remplissage automatique avec la date du jour
                    </p>
                    <p className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Les modifications sont sauvegardées automatiquement
                    </p>
                    {tableData[peta.id_peta]?.verified && (
                      <p className="flex items-center text-blue-300">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        Cette étape est vérifiée - Saisie désactivée
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PetiteEtapeOuvrier;