import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ClipboardList, Workflow, ListChecks, Folder } from "lucide-react";       

const NavigationMBR = () => {
  const navigate = useNavigate();
  const { id_mbr, code_fab } = useParams();


  // Liste des pages avec leur chemin et icône
  const pages = [
    { label: "Fiche matière et solvant", path: `/PROD/matiereaffiche/${code_fab}`, icon: <FileText className="w-5 h-5" /> },
    { label: "Check list des échantillons", path: `/PROD/echantillonaffiche/${id_mbr}/${code_fab}`, icon: <ClipboardList className="w-5 h-5" /> },
    { label: "Étape", path: "/etape", icon: <Workflow className="w-5 h-5" /> },
    { label: "Autre démarche", path: "/autre-demarche", icon: <ListChecks className="w-5 h-5" /> },
    { label: "Liste document associé au MBR", path: "/documents-mbr", icon: <Folder className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col gap-4 p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-center text-green-600 mb-4">
        Navigation MBR
      </h2>

      {pages.map((page, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(page.path)}
          className="flex items-center justify-between px-4 py-3 rounded-2xl shadow-md bg-white hover:bg-green-50 border border-green-200 text-green-700 font-medium"
        >
          <span className="flex items-center gap-2">
            {page.icon}
            {page.label}
          </span>
          <span className="text-green-500">→</span>
        </motion.button>
      ))}
    </div>
  );
};

export default NavigationMBR;
