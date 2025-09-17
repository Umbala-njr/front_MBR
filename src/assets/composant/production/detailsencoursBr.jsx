import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Workflow, Folder, ChevronRight, Home } from "lucide-react";
import axios from "axios";

const NavigationEncoursMBR = () => {
  const navigate = useNavigate();
  const { id_mbr, code_fab, id_camp } = useParams();
  const [mbrInfo, setMbrInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les infos du MBR
  useEffect(() => {
    const fetchMBR = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/mbr/mbr/${code_fab}/${id_camp}`);
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

  // Liste des pages avec leur chemin et icône
  const pages = [
    { label: "Fiche matière et solvant", path: `/PROD/matiereaction/${id_mbr}/${code_fab}`, icon: <FileText className="w-5 h-5" /> },
    { label: "Étape", path: `/PROD/etapeaction/${id_mbr}/${code_fab}`, icon: <Workflow className="w-5 h-5" /> },
  
  ];

  const handleHomeClick = () => {
    navigate(`/PROD/encours/${code_fab}/${id_camp}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement des informations MBR...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 p-6">
      <div className="max-w-full mx-auto">
        {/* Header avec bouton retour */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHomeClick}
            className="flex items-center text-white bg-green-700 bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 transition-all duration-200"
            title="Retour à l'accueil"
          >
            <Home className="w-5 h-5" />
          </motion.button>
          
          <h1 className="text-xl font-semibold text-white">Navigation MBR</h1>
          
          {/* Espaceur pour équilibrer le layout */}
          <div className="w-9"></div>
        </div>

        {/* Carte d'information MBR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-green-200"
        >
          {mbrInfo ? (
            <>
              <div className="text-center mb-3">
                <h2 className="text-2xl font-bold text-green-800">
                  {mbrInfo.num_br}
                </h2>
                <p className="text-green-600 mt-1">Code fab : {mbrInfo.code_fab}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <p className="text-sm text-green-700">Sélectionnez une section à consulter</p>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-red-500">Aucune information MBR disponible</p>
            </div>
          )}
        </motion.div>

        {/* Boutons de navigation */}
        <div className="space-y-4">
          {pages.map((page, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(page.path)}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl bg-white hover:bg-green-50 border border-green-100 text-green-900 font-medium transition-all duration-200"
              >
                <span className="flex items-center gap-3">
                  <span className="text-green-700">{page.icon}</span>
                  {page.label}
                </span>
                <ChevronRight className="w-5 h-5 text-green-600" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Footer décoratif */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-green-200 text-xs mt-10"
        >
          MBR Navigation System
        </motion.div>
      </div>
    </div>
  );
};

export default NavigationEncoursMBR;