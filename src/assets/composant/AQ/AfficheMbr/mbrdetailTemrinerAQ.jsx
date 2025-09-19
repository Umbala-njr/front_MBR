import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Package, Settings, Search, Filter, Plus, X, ChevronDown, ArrowLeft, Download } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const MbrDetailTerminerAQ = () => {
  // États pour les matières
  const [matieres, setMatieres] = useState([]);
  const [matieresTableData, setMatieresTableData] = useState({});
  const [savedValeursMatiere, setSavedValeursMatiere] = useState({});

  // États pour les étapes
  const [etapes, setEtapes] = useState([]);
  const [petitesEtapes, setPetitesEtapes] = useState({});
  const [etapesTableData, setEtapesTableData] = useState({});
  const [savedValeursEtape, setSavedValeursEtape] = useState({});
  
  // États communs
  const { id_mbr, code_fab, id_camp } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [exporting, setExporting] = useState(false);
  const [mbrInfo, setMbrInfo] = useState({});

  // Récupération du rôle utilisateur
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) {
      setUserRole(user.role);
    }
  }, []);

  // Récupération des informations MBR
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

  // Récupération des matières
  const fetchMatieres = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/matiere/${code_fab}`);
      const matieresData = Array.isArray(response.data) ? response.data : [];
      setMatieres(matieresData);
      
      // Charger automatiquement les données de toutes les matières
      for (const matiere of matieresData) {
        await loadMatiereTableData(matiere.id_mat);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du chargement des matières");
    }
  };

  // Récupération des étapes
  const fetchEtapes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/etape/etapeBR/${id_mbr}/${code_fab}`
      );

      const sortedEtapes = [...res.data].sort((a, b) => a.id_eta - b.id_eta);
      setEtapes(sortedEtapes);

      // Charger automatiquement toutes les petites étapes et leurs données
      for (const etape of sortedEtapes) {
        await fetchPetitesEtapes(etape.id_eta);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des étapes :", err);
    }
  };

  // Chargement initial
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMatieres(),
        fetchEtapes(),
        fetchVerifications()
      ]);
      setLoading(false);
    };

    loadAllData();
  }, [id_mbr, code_fab]);

  // Charger les données d'un tableau de matière
  const loadMatiereTableData = async (id_mat) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/matiere/valeurs/${id_mbr}/${id_mat}`);
      
      setMatieresTableData(prev => ({
        ...prev,
        [id_mat]: {
          colonnes: res.data.colonnes || [],
          lignes: res.data.lignes || []
        }
      }));
    } catch (err) {
      console.error("Erreur lors du chargement des données matière:", err);
    }
  };

  // Charger les petites étapes
  const fetchPetitesEtapes = async (id_eta) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/petite_etape/affichepetitEtapebyeta/${id_eta}`
      );
      setPetitesEtapes(prev => ({
        ...prev,
        [id_eta]: res.data
      }));
      
      // Charger les données de tableau pour chaque petite étape
      for (const peta of res.data) {
        await loadEtapeTableData(peta.id_peta, id_eta);
      }
    } catch (err) {
      console.error("Erreur lors du chargement des petites étapes:", err);
    }
  };

  // Charger les données d'une étape
  const loadEtapeTableData = async (id_peta, id_eta) => {
    try {
      const [colonnesRes, sousEtapesRes, valeursRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/colonne/listecolonne/${id_peta}`),
        axios.get(`http://localhost:3000/api/sous_etape/sous_etape/${id_eta}/${id_peta}`),
        axios.get(`http://localhost:3000/api/valeuretape/valeurs/${id_mbr}`),
      ]);

      setEtapesTableData((prev) => ({
        ...prev,
        [id_peta]: {
          ...(prev[id_peta] || {}),
          colonnes: colonnesRes.data,
          sousEtapes: sousEtapesRes.data,
          valeurs: valeursRes.data,
        },
      }));
    } catch (err) {
      console.error("Erreur lors du chargement des données d'étape:", err);
    }
  };

  // Charger les vérifications
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
      setEtapesTableData((prev) => {
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

  // Gestion des changements pour les matières
  const handleMatiereInputChange = async (id_mat, row_id, id_colm, value, type_input) => {
    try {
      if (type_input === "time" && value === "") {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        value = `${hours}:${minutes}`;
      }

      if (type_input === "date" && value === "") {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        value = `${year}-${month}-${day}`;
      }

      const valToSend = value === "" ? null : value;

      setMatieresTableData(prev => {
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

      await axios.post("http://localhost:3000/api/matiere/ajoutervaleur", {
        id_mbr,
        id_mat,
        row_id,
        id_colm,
        valeur_mat: valToSend
      });

      setSavedValeursMatiere(prev => ({
        ...prev,
        [`${row_id}_${id_colm}`]: true
      }));

    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la modification");
    }
  };

  // Gestion des changements pour les étapes
  const handleEtapeChange = async (id_peta, id_sous, id_col, value, type_input) => {
    if (etapesTableData[id_peta]?.verified) {
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

      setEtapesTableData((prev) => {
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

      setSavedValeursEtape((prev) => ({
        ...prev,
        [`${id_sous}_${id_col}`]: true,
      }));
    } catch (err) {
      console.error("Erreur lors de l'ajout de valeur:", err);
    }
  };

  // Utilitaires
  const getEtapeValeur = (valeurs, id_sous, id_col) => {
    if (!valeurs) return "";
    const val = valeurs.find(
      (v) => v.id_sous === id_sous && v.id_col === id_col
    );
    return val ? val.valeur : "";
  };

  const getValueColorClass = (currentValue, stdValue, criticite) => {
    if (!currentValue || !stdValue || currentValue === "" || stdValue === "") return "";
    
    const numCurrent = parseFloat(currentValue);
    const numStd = parseFloat(stdValue);
    
    if (isNaN(numCurrent) || isNaN(numStd)) return "";
    
    if (numCurrent > numStd) {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (numCurrent < numStd) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    
    return "";
  };

  // Gestion du focus time pour matières
  const handleMatiereTimeFocus = (id_mat, row_id, id_colm, type_input, currentValue) => {
    if (type_input === "time" && !currentValue) {
      handleMatiereInputChange(id_mat, row_id, id_colm, "", type_input);
    }
  };

  // Gestion du focus time pour étapes
  const handleEtapeTimeFocus = (id_peta, id_sous, id_col, type_input, currentValue) => {
    if (etapesTableData[id_peta]?.verified) {
      return;
    }
    
    if (type_input === "time" && !currentValue) {
      handleEtapeChange(id_peta, id_sous, id_col, "", type_input);
    }
  };

  // Rendu des inputs pour matières
  const renderMatiereInput = (id_mat, row_id, col, currentValue) => {
    const isSaved = savedValeursMatiere[`${row_id}_${col.id_colm}`] || !!currentValue;

    switch (col.type_input) {
      case "date":
        return (
          <input
            type="date"
            value={currentValue || ""}
            onChange={e => handleMatiereInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            onFocus={() => {
              if (!currentValue) {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                handleMatiereInputChange(id_mat, row_id, col.id_colm, `${year}-${month}-${day}`, col.type_input);
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
            onChange={e => handleMatiereInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            onFocus={() => handleMatiereTimeFocus(id_mat, row_id, col.id_colm, col.type_input, currentValue)}
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
            onChange={e => handleMatiereInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            className="w-full text-center border px-1 py-1 rounded"
          />
        );

      case "textarea":
        return (
          <textarea
            value={currentValue || ""}
            onChange={e => handleMatiereInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            className="w-full text-center border px-1 py-1 rounded"
            rows="2"
          />
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            checked={currentValue === "true"}
            onChange={e => handleMatiereInputChange(id_mat, row_id, col.id_colm, String(e.target.checked), col.type_input)}
            className="mx-auto"
          />
        );

      default:
        return (
          <input
            type="text"
            value={currentValue || ""}
            onChange={e => handleMatiereInputChange(id_mat, row_id, col.id_colm, e.target.value, col.type_input)}
            className="w-full text-center border px-1 py-1 rounded"
          />
        );
    }
  };

  // Rendu des inputs pour étapes
  const renderEtapeInput = (id_peta, sous, col) => {
    const valeurs = etapesTableData[id_peta]?.valeurs || [];
    let value = getEtapeValeur(valeurs, sous.id_sous, col.id_col);
    const isVerified = etapesTableData[id_peta]?.verified;

    const isDateOrTime = sous.type_input === "date" || sous.type_input === "time";
    const isDisabled = isVerified || (isDateOrTime && !!value);
    
    const colorClass = getValueColorClass(value, sous.valeur_std, sous.criticite);

    switch (sous.type_input) {
      case "date":
        return (
          <input
            type="date"
            value={value || ""}
            onChange={(e) =>
              handleEtapeChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)
            }
            onFocus={() => {
              if (!value && !isVerified) {
                const now = new Date();
                handleEtapeChange(
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
              handleEtapeChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)
            }
            onFocus={() => handleEtapeTimeFocus(id_peta, sous.id_sous, col.id_col, sous.type_input, value)}
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
              handleEtapeChange(id_peta, sous.id_sous, col.id_col, e.target.value, sous.type_input)
            }
            className={`w-full text-center border border-emerald-400 rounded px-1 py-1 text-gray-800 ${
              isVerified ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-blue-50"
            } ${colorClass}`}
            disabled={isVerified}
          />
        );
    }
  };

  // Fonction d'export PDF complète
  const exportCompleteToPDF = () => {
    setExporting(true);
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // En-tête avec num_br et BR
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Rapport Complet de Production", 105, 15, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`MBR: ${mbrInfo.num_br || id_mbr}`, 20, 25);
    doc.text(`BR: ${mbrInfo.BR || 'N/A'}`, 20, 32);
    doc.text(`Code Fabrication: ${code_fab}`, 20, 39);
    doc.text(`Date d'export: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, 46);
    doc.text(`Utilisateur: ${userRole}`, 20, 53);
    
    let yPosition = 65;

    // SECTION 1: MATIÈRES
    doc.setFontSize(16);
    doc.setTextColor(34, 139, 34);
    doc.text("SECTION 1: MATIÈRES ET FABRICATION", 20, yPosition);
    yPosition += 15;

    matieres.forEach((matiere, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(30, 70, 100);
      doc.text(`${index + 1}. ${matiere.nom_mat}`, 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Caractère: ${matiere.caractere || 'N/A'}`, 25, yPosition);
      yPosition += 10;

      if (matieresTableData[matiere.id_mat]) {
        const tableData = matieresTableData[matiere.id_mat];
        
        const headers = ["Ligne", ...(tableData.colonnes?.map(col => col.nom_colm) || [])];
        const rows = tableData.lignes?.map(ligne => {
          const rowData = [ligne.row_id.toString()];
          tableData.colonnes?.forEach(col => {
            const valeur = ligne.valeurs[col.id_colm] || "";
            rowData.push(valeur.toString());
          });
          return rowData;
        }) || [];

        if (rows.length > 0) {
          doc.autoTable({
            head: [headers],
            body: rows,
            startY: yPosition,
            theme: 'grid',
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [34, 139, 34], textColor: [255, 255, 255] },
            margin: { left: 20, right: 20 }
          });
          yPosition = doc.lastAutoTable.finalY + 15;
        }
      }
    });

    // SECTION 2: ÉTAPES
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(16);
    doc.setTextColor(139, 69, 19);
    doc.text("SECTION 2: ÉTAPES DE PRODUCTION", 20, yPosition);
    yPosition += 15;

    etapes.forEach((etape, etapeIndex) => {
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(30, 70, 100);
      doc.text(`Stade ${etapeIndex + 1}: ${etape.nom_eta}`, 20, yPosition);
      yPosition += 12;
      
      if (petitesEtapes[etape.id_eta]) {
        petitesEtapes[etape.id_eta].forEach((peta, petaIndex) => {
          if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(12);
          doc.setTextColor(50, 100, 50);
          doc.text(`Etape ${petaIndex + 1}: ${peta.nom_peta}`, 25, yPosition);
          yPosition += 8;
          
          if (etapesTableData[peta.id_peta]?.verified) {
            doc.setFontSize(10);
            doc.setTextColor(0, 128, 0);
            const verificationText = `✓ Vérifié par: ${etapesTableData[peta.id_peta].verifiedBy} le ${new Date(etapesTableData[peta.id_peta].verifiedAt).toLocaleDateString('fr-FR')}`;
            doc.text(verificationText, 30, yPosition);
            yPosition += 10;
          } else {
            doc.setFontSize(10);
            doc.setTextColor(255, 140, 0);
            doc.text("⚠ Non vérifié", 30, yPosition);
            yPosition += 10;
          }
          
          if (etapesTableData[peta.id_peta] && etapesTableData[peta.id_peta].sousEtapes) {
            const tableDataItem = etapesTableData[peta.id_peta];
            
            const headers = [
              "Paramètre", "Appareil", "Unité", "Tolérance", "Criticité", "Valeur Std",
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
              
              if (tableDataItem.colonnes) {
                tableDataItem.colonnes.forEach(col => {
                  const valeur = getEtapeValeur(tableDataItem.valeurs, sous.id_sous, col.id_col);
                  rowData.push(valeur || "");
                });
              }
              
              return rowData;
            });
            
            const headerColor = etapesTableData[peta.id_peta]?.verified ? [34, 197, 94] : [251, 146, 60];
            
            doc.autoTable({
              head: [headers],
              body: rows,
              startY: yPosition,
              theme: 'grid',
              styles: { fontSize: 8, cellPadding: 2, textColor: [40, 40, 40] },
              headStyles: { fillColor: headerColor, textColor: [255, 255, 255], fontStyle: 'bold' },
              alternateRowStyles: { fillColor: [248, 250, 252] },
              margin: { left: 20, right: 20 }
            });
            
            yPosition = doc.lastAutoTable.finalY + 15;
          }
        });
      }
    });

    // Résumé final
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text("RÉSUMÉ GÉNÉRAL", 105, 20, { align: "center" });
    
    let summaryY = 40;
    
    // Statistiques matières
    doc.setFontSize(14);
    doc.setTextColor(34, 139, 34);
    doc.text("Matières:", 20, summaryY);
    summaryY += 10;
    
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total des matières: ${matieres.length}`, 25, summaryY);
    summaryY += 8;
    
    let totalMatieresEntries = 0;
    matieres.forEach(matiere => {
      if (matieresTableData[matiere.id_mat]) {
        totalMatieresEntries += matieresTableData[matiere.id_mat].lignes?.length || 0;
      }
    });
    doc.text(`Total des entrées de matières: ${totalMatieresEntries}`, 25, summaryY);
    summaryY += 15;
    
    // Statistiques étapes
    doc.setFontSize(14);
    doc.setTextColor(139, 69, 19);
    doc.text("Étapes:", 20, summaryY);
    summaryY += 10;
    
    let verifiedCount = 0;
    let totalCount = 0;
    
    etapes.forEach(etape => {
      if (petitesEtapes[etape.id_eta]) {
        petitesEtapes[etape.id_eta].forEach(peta => {
          totalCount++;
          if (etapesTableData[peta.id_peta]?.verified) verifiedCount++;
        });
      }
    });
    
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    doc.text(`Total des stades: ${etapes.length}`, 25, summaryY);
    summaryY += 8;
    doc.text(`Total des étapes: ${totalCount}`, 25, summaryY);
    summaryY += 8;
    doc.text(`Étapes vérifiées: ${verifiedCount}`, 25, summaryY);
    summaryY += 8;
    doc.text(`Étapes non vérifiées: ${totalCount - verifiedCount}`, 25, summaryY);
    summaryY += 8;
    
    const completionPercentage = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0;
    doc.text(`Taux de completion: ${completionPercentage}%`, 25, summaryY);

    // Modifiez également le nom du fichier pour inclure num_br et BR
    const fileName = `Rapport_Complet_${mbrInfo.num_br || id_mbr}_BR_${mbrInfo.BR || 'N-A'}_${code_fab}_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
    setExporting(false);
  };

  // Navigation
  const handleEchantillonClick = () => {
    navigate(`/AQ/echantillonAQ/${id_mbr}/${code_fab}`);
  };

  const handleRetour = () => {
    navigate(`/AQ/terminerBRAQ/${code_fab}/${id_camp}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 font-medium">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-green-700 shadow-xl">
        <div className="max-w-full mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRetour}
              className="flex items-center text-white bg-green-600 hover:bg-green-500 rounded-full p-2 transition-all duration-200"
              title="Retour"
            >
              <ArrowLeft className="w-6 h-6" />
            </motion.button>

            <div className="animate-slideInLeft">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    Production Complète
                  </h1>
                  <p className="text-green-100 mt-1">
                    Fabrication : <span className="font-semibold">{code_fab}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-slideInRight flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportCompleteToPDF}
                disabled={exporting || loading || !mbrInfo.num_br}
                className="flex items-center text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 transition-all duration-200 disabled:opacity-50"
                title="Exporter tout en PDF"
              >
                {exporting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                ) : (
                  <Download className="w-5 h-5 mr-2" />
                )}
                Export PDF Complet
              </motion.button>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <span className="text-green-100 text-sm">ID: {id_mbr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-full mx-auto px-6 py-8">
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

        {/* Bouton Échantillon */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={handleEchantillonClick}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-lg transition flex items-center gap-2"
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

        {/* Statistiques globales */}
        <div className="mb-8 animate-fadeInUp">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{matieres.length}</p>
                  <p className="text-gray-600">Matières</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Settings className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{etapes.length}</p>
                  <p className="text-gray-600">Stades</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Filter className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Object.keys(petitesEtapes).reduce((total, key) => total + petitesEtapes[key].length, 0)}
                  </p>
                  <p className="text-gray-600">Étapes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION MATIÈRES */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-xl p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Package className="w-8 h-8 mr-3" />
              SECTION 1: MATIÈRES ET FABRICATION
            </h2>
          </div>
          
          <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
            {matieres.length > 0 ? (
              <div className="space-y-6">
                {matieres.map((matiere, index) => (
                  <div key={matiere.id_mat} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* En-tête de matière */}
                    <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
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
                        <div className="ml-auto">
                          <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                            ID: {matiere.id_mat}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tableau de matière */}
                    {matieresTableData[matiere.id_mat] && (
                      <div className="p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Valeurs à saisir
                        </h4>

                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-300 bg-white">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="border px-4 py-2 font-semibold">Ligne</th>
                                {matieresTableData[matiere.id_mat].colonnes.map(col => (
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
                              {matieresTableData[matiere.id_mat].lignes.map(ligne => (
                                <tr key={ligne.row_id} className="hover:bg-gray-50">
                                  <td className="border px-4 py-2 font-semibold text-center">{ligne.row_id}</td>
                                  {matieresTableData[matiere.id_mat].colonnes.map(col => (
                                    <td key={col.id_colm} className="border px-2 py-2">
                                      {renderMatiereInput(matiere.id_mat, ligne.row_id, col, ligne.valeurs[col.id_colm] || "")}
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
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucune matière disponible pour cette fabrication.</p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION ÉTAPES */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-xl p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Settings className="w-8 h-8 mr-3" />
              SECTION 2: STADES DE PRODUCTION
            </h2>
          </div>
          
          <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
            {etapes.length > 0 ? (
              <div className="space-y-6">
                {etapes.map((etape, index) => (
                  <div key={etape.id_eta} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* En-tête d'étape */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{etape.nom_eta}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 p-4 border-b border-blue-200">
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: etape.Instruction || "Pas d'instruction disponible",
                          }}
                        />
                      </div>
                    </div>

                    {/* Petites étapes */}
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Étapes détaillées
                      </h4>
                      
                      {petitesEtapes[etape.id_eta]?.length > 0 ? (
                        <div className="space-y-4">
                          {petitesEtapes[etape.id_eta].map((peta, pIndex) => (
                            <div key={peta.id_peta} className="bg-gray-50 rounded-xl shadow-sm overflow-hidden border border-gray-200">
                              {/* Header Petite Étape */}
                              <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <span className="bg-blue-500 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold">
                                      {pIndex + 1}
                                    </span>
                                    <div>
                                      <h5 className="text-md font-semibold text-gray-800">
                                        {peta.nom_peta}
                                      </h5>
                                      
                                      {etapesTableData[peta.id_peta]?.verified && (
                                        <div className="mt-1 text-xs text-green-600">
                                          ✓ Vérifié par {etapesTableData[peta.id_peta]?.verifiedBy} le{" "}
                                          {new Date(etapesTableData[peta.id_peta]?.verifiedAt).toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Tableau d'étape */}
                              {etapesTableData[peta.id_peta] && (
                                <div className="p-4 bg-white">
                                  <div className="mb-4">
                                    <h6 className="text-md font-semibold text-gray-800">
                                      Tableau des valeurs
                                      {etapesTableData[peta.id_peta]?.verified && (
                                        <span className="ml-2 text-sm text-green-600">
                                          (Lecture seule - Vérifié)
                                        </span>
                                      )}
                                    </h6>
                                    
                                    {/* Légende des couleurs */}
                                    <div className="flex flex-wrap gap-3 mt-2 text-xs">
                                      <div className="flex items-center">
                                        <div className="w-3 h-3 bg-red-100 border border-red-200 mr-1"></div>
                                        <span>Valeur &gt; Standard</span>
                                      </div>
                                      <div className="flex items-center">
                                        <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 mr-1"></div>
                                        <span>Valeur &lt; Standard</span>
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
                                          {etapesTableData[peta.id_peta]?.colonnes?.map((col) => (
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
                                        {etapesTableData[peta.id_peta]?.sousEtapes?.map((sous) => {
                                          const cellColorClasses = {};
                                          etapesTableData[peta.id_peta]?.colonnes?.forEach((col) => {
                                            const valeurs = etapesTableData[peta.id_peta]?.valeurs || [];
                                            const value = getEtapeValeur(valeurs, sous.id_sous, col.id_col);
                                            cellColorClasses[col.id_col] = getValueColorClass(value, sous.valeur_std, sous.criticite);
                                          });
                                          
                                          return (
                                            <tr key={sous.id_sous} className="hover:bg-blue-50 transition">
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
                                              {etapesTableData[peta.id_peta]?.colonnes?.map((col) => (
                                                <td
                                                  key={col.id_col}
                                                  className={`border border-gray-300 px-2 py-2 ${cellColorClasses[col.id_col]}`}
                                                >
                                                  {renderEtapeInput(peta.id_peta, sous, col)}
                                                </td>
                                              ))}
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>

                                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-gray-700">
                                      <p className="flex items-center">
                                        <span className="inline-block w-3 h-3 bg-gray-300 mr-1 rounded"></span>
                                        Champs verrouillés après enregistrement
                                      </p>
                                      <p className="flex items-center">
                                        <span className="inline-block w-3 h-3 bg-blue-300 mr-1 rounded"></span>
                                        Time : remplissage automatique
                                      </p>
                                      {etapesTableData[peta.id_peta]?.verified && (
                                        <p className="flex items-center text-green-600 col-span-2">
                                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                          </svg>
                                          Étape vérifiée - Saisie désactivée
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
                          <p className="text-gray-700">
                            Aucune petite étape disponible pour ce stade.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun stade de production disponible.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Styles CSS pour les animations */}
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

export default MbrDetailTerminerAQ;