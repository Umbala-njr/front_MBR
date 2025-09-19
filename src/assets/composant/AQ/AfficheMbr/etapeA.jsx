import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";

const EtapeafficheMBR = () => {
  const { id_mbr, code_fab, id_camp } = useParams();
  const navigate = useNavigate();
  const [etapes, setEtapes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [petitesEtapes, setPetitesEtapes] = useState({});
  const [tableData, setTableData] = useState({});
  const [savedValeurs, setSavedValeurs] = useState({});
  const [userRole, setUserRole] = useState("");
  const [exporting, setExporting] = useState(false);
//recupérer MBR
  useEffect(() => {
      const fetchMBR = async () => {
        try {
          const res = await axios.get(
            `http://localhost:3000/api/mbr/mbr/${code_fab}/${id_camp}`
          );
          if (res.data && res.data.length > 0) {
            setMbrInfo(res.data[0]); // on prend le premier résultat
          }
        } catch (err) {
          console.error("Erreur récupération MBR :", err);
        } finally {
          setLoading(false);
        }
      };
      fetchMBR();
    }, [code_fab, id_camp]);

  // Récupérer le rôle de l'utilisateur connecté
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

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

        // Charger automatiquement toutes les petites étapes pour chaque étape
        for (const etape of sortedEtapes) {
          await fetchPetitesEtapes(etape.id_eta);
        }
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEtapes();
  }, [id_mbr, code_fab]);

  // Charger les petites étapes pour une étape spécifique
  const fetchPetitesEtapes = async (id_eta) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/petite_etape/affichepetitEtapebyeta/${id_eta}`
      );
      setPetitesEtapes(prev => ({
        ...prev,
        [id_eta]: res.data
      }));
      
      // Charger automatiquement les données de tableau pour chaque petite étape
      for (const peta of res.data) {
        await loadTableData(peta.id_peta, id_eta, true); // true = chargement silencieux
      }
    } catch (err) {
      console.error("Erreur lors du chargement des petites étapes:", err);
    }
  };

  // Charger les vérifications déjà faites
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

  // Charger un tableau de valeurs
  const loadTableData = async (id_peta, id_eta, silent = false) => {
    if (!silent && tableData[id_peta]?.colonnes) {
      setTableData(prev => ({
        ...prev,
        [id_peta]: {
          ...prev[id_peta],
          activeTable: !prev[id_peta]?.activeTable
        }
      }));
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
          activeTable: silent ? true : (prev[id_peta]?.activeTable || true)
        },
      }));
    } catch (err) {
      console.error("Erreur lors du chargement des données du tableau:", err);
    }
  };

  // Gestion des changements
  const handleChange = async (id_peta, id_sous, id_col, value, type_input) => {
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

  // Navigation vers échantillon
  const handleEchantillonClick = () => {
    navigate(`/AQ/echantillonAQ/${id_mbr}/${code_fab}`);
  };

  const handleretour = () => {
    navigate(`/AQ/detailencoursAQ/${id_mbr}/${code_fab}/${id_camp}`);
  };

  // Utilitaire valeur
  const getValeur = (valeurs, id_sous, id_col) => {
    if (!valeurs) return "";
    const val = valeurs.find(
      (v) => v.id_sous === id_sous && v.id_col === id_col
    );
    return val ? val.valeur : "";
  };

  // Nouvelle fonction pour comparer les valeurs et déterminer la couleur
  const getValueColorClass = (currentValue, stdValue, criticite) => {
    if (!currentValue || !stdValue || currentValue === "" || stdValue === "") return "";
    
    // Convertir en nombres si possible
    const numCurrent = parseFloat(currentValue);
    const numStd = parseFloat(stdValue);
    
    // Si ce ne sont pas des nombres, pas de coloration
    if (isNaN(numCurrent) || isNaN(numStd)) return "";
    
    // Déterminer la couleur en fonction de la comparaison
    if (numCurrent > numStd) {
      return "bg-red-100 text-red-800 border-red-200"; // Valeur supérieure
    } else if (numCurrent < numStd) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200"; // Valeur inférieure
    }
    
    return ""; // Valeur égale - pas de coloration spéciale
  };

  // Gestion du focus sur un champ time
  const handleTimeFocus = (
    id_peta,
    id_sous,
    id_col,
    type_input,
    currentValue
  ) => {
    if (tableData[id_peta]?.verified) {
      return;
    }
    
    if (type_input === "time" && !currentValue) {
      handleChange(id_peta, id_sous, id_col, "", type_input);
    }
  };

  // Fonction pour exporter les tableaux en PDF
  const exportTablesToPDF = () => {
    setExporting(true);
    
    // Créer un nouveau document PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Ajouter les informations d'en-tête
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Rapport des Tableaux de Production", 105, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`MBR: ${id_mbr}`, 20, 25);
    doc.text(`Code Fabrication: ${code_fab}`, 20, 32);
    doc.text(`Date d'export: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, 39);
    doc.text(`Utilisateur: ${userRole}`, 20, 46);
    
    let yPosition = 60;
    let page = 1;
    
    // Parcourir toutes les étapes
    etapes.forEach((etape, etapeIndex) => {
      // Vérifier si on doit ajouter une nouvelle page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
        page++;
      }
      
      // Ajouter le titre de l'étape
      doc.setFontSize(14);
      doc.setTextColor(30, 70, 100);
      doc.text(`Stade ${etapeIndex + 1}: ${etape.nom_eta}`, 20, yPosition);
      yPosition += 12;
      
      // Vérifier si cette étape a des petites étapes
      if (petitesEtapes[etape.id_eta]) {
        petitesEtapes[etape.id_eta].forEach((peta, petaIndex) => {
          // Vérifier si on doit ajouter une nouvelle page
          if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
            page++;
          }
          
          // Ajouter le titre de la petite étape
          doc.setFontSize(12);
          doc.setTextColor(50, 100, 50);
          doc.text(`Etape ${petaIndex + 1}: ${peta.nom_peta}`, 25, yPosition);
          yPosition += 8;
          
          // Ajouter les informations de vérification si elles existent
          if (tableData[peta.id_peta]?.verified) {
            doc.setFontSize(10);
            doc.setTextColor(0, 128, 0); // Vert pour la vérification
            const verificationText = `✓ Vérifié par: ${tableData[peta.id_peta].verifiedBy} le ${new Date(tableData[peta.id_peta].verifiedAt).toLocaleDateString('fr-FR')} à ${new Date(tableData[peta.id_peta].verifiedAt).toLocaleTimeString('fr-FR')}`;
            doc.text(verificationText, 30, yPosition);
            yPosition += 10;
          } else {
            doc.setFontSize(10);
            doc.setTextColor(255, 140, 0); // Orange pour non vérifié
            doc.text("⚠ Non vérifié", 30, yPosition);
            yPosition += 10;
          }
          
          // Vérifier si cette petite étape a des données de tableau
          if (tableData[peta.id_peta] && tableData[peta.id_peta].sousEtapes) {
            const tableDataItem = tableData[peta.id_peta];
            
            // Préparer les données du tableau
            const headers = [
              "Paramètre", 
              "Appareil", 
              "Unité", 
              "Tolérance", 
              "Criticité", 
              "Valeur Std",
              ...(tableDataItem.colonnes ? tableDataItem.colonnes.map(col => col.label) : [])
            ];
            
            const rows = tableDataItem.sousEtapes.map(sous => {
              const rowData = [
                sous.parametre || "",
                sous.appareil || "",
                sous.unite || "",
                sous.tolerence || "",
                sous.criticite || "",
                sous.valeur_std || ""
              ];
              
              // Ajouter les valeurs des colonnes
              if (tableDataItem.colonnes) {
                tableDataItem.colonnes.forEach(col => {
                  const valeur = getValeur(tableDataItem.valeurs, sous.id_sous, col.id_col);
                  rowData.push(valeur || "");
                });
              }
              
              return rowData;
            });
            
            // Déterminer la couleur de fond du header selon le statut de vérification
            const headerColor = tableData[peta.id_peta]?.verified ? [34, 197, 94] : [251, 146, 60]; // Vert si vérifié, orange sinon
            
            // Générer le tableau dans le PDF
            doc.autoTable({
              head: [headers],
              body: rows,
              startY: yPosition,
              theme: 'grid',
              styles: { 
                fontSize: 8, 
                cellPadding: 2,
                textColor: [40, 40, 40]
              },
              headStyles: { 
                fillColor: headerColor,
                textColor: [255, 255, 255],
                fontStyle: 'bold'
              },
              alternateRowStyles: {
                fillColor: [248, 250, 252]
              },
              margin: { left: 20, right: 20 }
            });
            
            // Ajouter une note sur le statut de vérification après le tableau
            if (tableData[peta.id_peta]?.verified) {
              doc.setFontSize(8);
              doc.setTextColor(0, 128, 0);
              doc.text("Statut: VÉRIFIÉ - Données validées et verrouillées", 20, doc.lastAutoTable.finalY + 5);
            } else {
              doc.setFontSize(8);
              doc.setTextColor(255, 140, 0);
              doc.text("Statut: EN ATTENTE DE VÉRIFICATION - Données modifiables", 20, doc.lastAutoTable.finalY + 5);
            }
            
            // Mettre à jour la position Y pour le prochain élément
            yPosition = doc.lastAutoTable.finalY + 15;
          }
        });
      }
    });
    
    // Ajouter un pied de page avec résumé des vérifications
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("Résumé des Vérifications", 105, 20, { align: "center" });
    
    let verifiedCount = 0;
    let totalCount = 0;
    let summaryY = 40;
    
    doc.setFontSize(12);
    doc.text("État des vérifications par étape:", 20, summaryY);
    summaryY += 15;
    
    etapes.forEach((etape, etapeIndex) => {
      if (petitesEtapes[etape.id_eta]) {
        doc.setFontSize(11);
        doc.setTextColor(30, 70, 100);
        doc.text(`Stade ${etapeIndex + 1}: ${etape.nom_eta}`, 20, summaryY);
        summaryY += 10;
        
        petitesEtapes[etape.id_eta].forEach((peta, petaIndex) => {
          totalCount++;
          const isVerified = tableData[peta.id_peta]?.verified;
          if (isVerified) verifiedCount++;
          
          doc.setFontSize(10);
          if (isVerified) {
            doc.setTextColor(0, 128, 0);
            doc.text(`  ✓ Etape ${petaIndex + 1}: ${peta.nom_peta} - Vérifié par ${tableData[peta.id_peta].verifiedBy}`, 25, summaryY);
          } else {
            doc.setTextColor(255, 140, 0);
            doc.text(`  ⚠ Etape ${petaIndex + 1}: ${peta.nom_peta} - Non vérifié`, 25, summaryY);
          }
          summaryY += 8;
          
          if (summaryY > 270) {
            doc.addPage();
            summaryY = 20;
          }
        });
        summaryY += 5;
      }
    });
    
    // Ajouter les statistiques globales
    summaryY += 10;
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text("Statistiques globales:", 20, summaryY);
    summaryY += 12;
    
    doc.setFontSize(11);
    doc.text(`Total des étapes: ${totalCount}`, 25, summaryY);
    summaryY += 8;
    doc.text(`Étapes vérifiées: ${verifiedCount}`, 25, summaryY);
    summaryY += 8;
    doc.text(`Étapes non vérifiées: ${totalCount - verifiedCount}`, 25, summaryY);
    summaryY += 8;
    
    const completionPercentage = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;
    doc.text(`Taux de completion: ${completionPercentage}%`, 25, summaryY);
    
    // Sauvegarder le PDF
    doc.save(`Rapport_Production_MBR_${id_mbr}_${code_fab}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`);
    setExporting(false);
  };

  // Rendu des inputs - MODIFIÉ POUR AJOUTER LA COLORATION
  const renderInput = (id_peta, sous, col) => {
    const valeurs = tableData[id_peta]?.valeurs || [];
    let value = getValeur(valeurs, sous.id_sous, col.id_col);
    const isVerified = tableData[id_peta]?.verified;

    const isDateOrTime = sous.type_input === "date" || sous.type_input === "time";
    const isDisabled = isVerified || (isDateOrTime && !!value);
    
    // Déterminer la classe de couleur
    const colorClass = getValueColorClass(value, sous.valeur_std, sous.criticite);

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
            className={`w-full text-center border border-blue-400 rounded px-1 py-1 text-gray-800 ${
              isDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-blue-50"
            } ${colorClass}`}
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
            className={`w-full text-center border border-emerald-400 rounded px-1 py-1 text-gray-800 ${
              isDisabled ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-blue-50"
            } ${colorClass}`}
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
            className={`w-full text-center border border-emerald-400 rounded px-1 py-1 text-gray-800 ${
              isVerified ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-blue-50"
            } ${colorClass}`}
            disabled={isVerified}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Chargement des étapes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleretour}
            className="flex items-center text-white bg-emerald-600 hover:bg-emerald-700 rounded-full p-2 transition-all duration-200"
            title="Retour"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportTablesToPDF}
            disabled={exporting}
            className="flex items-center text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50"
            title="Exporter les tableaux en PDF"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
            ) : (
              <Download className="w-5 h-5 mr-2" />
            )}
            Exporter PDF
          </motion.button>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Stade de Production
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-gray-700 mt-4">
          <span className="bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
            Code Fab: <span className="font-semibold">{code_fab}</span>
          </span>
          <span className="bg-blue-100 px-4 py-2 rounded-full border border-blue-200">
            Rôle: <span className="font-semibold">{userRole}</span>
          </span>
        </div>
        
        {/* Bouton Échantillon ajouté ici */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleEchantillonClick}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow transition flex items-center gap-2"
          >
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Gérer les Échantillons
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        {etapes.length > 0 ? (
          <div className="space-y-6">
            {etapes.map((etape, index) => (
              <div
                key={etape.id_eta}
                className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transform transition-all duration-300 border border-gray-200 hover:border-blue-300"
              >
                {/* Numéro d'étape et titre */}
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow border border-emerald-400 mr-4">
                    <span className="text-white font-bold text-lg">
                      {index + 1}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {etape.nom_eta}
                  </h2>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6 border-l-4 border-blue-500">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: etape.Instruction || "Pas d'instruction disponible",
                      }}
                      className="text-gray-700"
                    />
                  </div>
                </div>

                {/* Petites étapes - TOUJOURS AFFICHÉES */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Étapes
                  </h3>
                  
                  {petitesEtapes[etape.id_eta]?.length > 0 ? (
                    <div className="space-y-4">
                      {petitesEtapes[etape.id_eta].map((peta, pIndex) => (
                        <div
                          key={peta.id_peta}
                          className="bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200"
                        >
                          {/* Header Petite Étape */}
                          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                              <span className="bg-emerald-500 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
                                {pIndex + 1}
                              </span>
                              <div>
                                <h4 className="text-md font-semibold text-gray-800">
                                  {peta.nom_peta}
                                </h4>
                                
                                {/* Affichage de l'information de vérification */}
                                {tableData[peta.id_peta]?.verified && (
                                  <div className="mt-1 text-xs text-green-600">
                                    Vérifié par {tableData[peta.id_peta]?.verifiedBy} le{" "}
                                    {new Date(tableData[peta.id_peta]?.verifiedAt).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Tableau - TOUJOURS AFFICHÉ */}
                          {tableData[peta.id_peta] && (
                            <div className="p-4 bg-white">
                              <div className="mb-4">
                                <h5 className="text-md font-semibold text-gray-800">
                                  Tableau des valeurs
                                  {tableData[peta.id_peta]?.verified && (
                                    <span className="ml-2 text-sm text-green-600">
                                      (Lecture seule - Vérifié)
                                    </span>
                                  )}
                                </h5>
                                {/* Ajout d'une légende pour les couleurs */}
                                <div className="flex flex-wrap gap-3 mt-2 text-xs">
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-red-100 border border-red-200 mr-1"></div>
                                    <span>Valeur supérieure à la valeur standard</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 mr-1"></div>
                                    <span>Valeur inférieure à la valeur standard</span>
                                  </div>
                                </div>
                              </div>

                              <div className="overflow-x-auto rounded-lg border border-gray-300">
                                <table className="min-w-full bg-white text-gray-800">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="border border-gray-300 px-3 py-2 text-sm font-semibold">
                                        Paramètre
                                      </th>
                                      <th className="border border-gray-300 px-3 py-2 text-sm font-semibold">
                                        Appareil
                                      </th>
                                      <th className="border border-gray-300 px-3 py-2 text-sm font-semibold">
                                        Unité
                                      </th>
                                      <th className="border border-gray-300 px-3 py-2 text-sm font-semibold">
                                        Tolérance
                                      </th>
                                      <th className="border border-gray-300 px-3 py-2 text-sm font-semibold">
                                        Criticité
                                      </th>
                                      <th className="border border-gray-300 px-3 py-2 text-sm font-semibold">
                                        Valeur Std
                                      </th>
                                      {tableData[peta.id_peta]?.colonnes?.map((col) => (
                                        <th
                                          key={col.id_col}
                                          className="border border-gray-300 px-3 py-2 text-sm font-semibold"
                                        >
                                          {col.label}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {tableData[peta.id_peta]?.sousEtapes?.map((sous) => {
                                      // Pré-calculer les classes de couleur pour chaque cellule
                                      const cellColorClasses = {};
                                      tableData[peta.id_peta]?.colonnes?.forEach((col) => {
                                        const valeurs = tableData[peta.id_peta]?.valeurs || [];
                                        const value = getValeur(valeurs, sous.id_sous, col.id_col);
                                        cellColorClasses[col.id_col] = getValueColorClass(value, sous.valeur_std, sous.criticite);
                                      });
                                      
                                      return (
                                        <tr
                                          key={sous.id_sous}
                                          className="hover:bg-blue-50 transition"
                                        >
                                          <td className="border border-gray-300 px-3 py-2 text-sm font-medium">
                                            {sous.parametre}
                                          </td>
                                          <td className="border border-gray-300 px-3 py-2 text-sm">
                                            {sous.appareil}
                                          </td>
                                          <td className="border border-gray-300 px-3 py-2 text-sm">
                                            {sous.unite}
                                          </td>
                                          <td className="border border-gray-300 px-3 py-2 text-sm">
                                            {sous.tolerence}
                                          </td>
                                          <td className="border border-gray-300 px-3 py-2 text-sm">
                                            <span
                                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                sous.criticite === "Haute"
                                                  ? "bg-red-100 text-red-800"
                                                  : sous.criticite === "Moyenne"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-green-100 text-green-800"
                                              }`}
                                            >
                                              {sous.criticite}
                                            </span>
                                          </td>
                                          <td className="border border-gray-300 px-3 py-2 text-sm font-mono">
                                            {sous.valeur_std}
                                          </td>
                                          {tableData[peta.id_peta]?.colonnes?.map((col) => (
                                            <td
                                              key={col.id_col}
                                              className={`border border-gray-300 px-2 py-2 ${cellColorClasses[col.id_col]}`}
                                            >
                                              {renderInput(peta.id_peta, sous, col)}
                                            </td>
                                          ))}
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>

                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs">
                                <h6 className="font-semibold text-blue-800 mb-1">
                                  Informations de saisie
                                </h6>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-gray-700">
                                  <p className="flex items-center">
                                    <span className="inline-block w-3 h-3 bg-gray-300 mr-1 rounded"></span>
                                    Les champs verrouillés après enregistrement
                                  </p>
                                  <p className="flex items-center">
                                    <span className="inline-block w-3 h-3 bg-blue-300 mr-1 rounded"></span>
                                    Champs time : remplissage automatique avec l'heure actuelle
                                  </p>
                                  {tableData[peta.id_peta]?.verified && (
                                    <p className="flex items-center text-green-600 col-span-2">
                                      <svg
                                        className="w-3 h-3 mr-1"
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
                      ))}
                    </div>
                  ) : (
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <svg
                        className="mx-auto h-8 w-8 text-blue-400 mb-2"
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
                      <p className="text-gray-700">
                        Aucune petite étape n'est disponible pour cette étape de production.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-auto border border-gray-200 shadow-sm">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-emerald-500"
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
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Aucune étape trouvée
              </h3>
              <p className="text-gray-600">
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