import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft} from "lucide-react";

const ProduitsCampagneTerminer = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/produit/produitcampagne/terminer")
      .then((res) => {
        setProduits(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération produits :", err);
        setLoading(false);
      });
  }, []);

  const handleretour = () => {
    navigate(`/AQ/campagneHome`);
  };

  if (loading) {
    return <p className="text-center text-gray-300">Chargement...</p>;
  }

  if (produits.length === 0) {
    return <p className="text-center text-red-400">Aucun produit avec campagne en cours</p>;
  }

  return (
    <div className="p-6 bg-emerald-900 min-h-screen text-white">
       <motion.button
         whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
         onClick={handleretour}
         className="flex items-center text-white bg-emerald-600 hover:bg-emerald-700 rounded-full p-2 transition-all duration-200"
         title="Retour"
        >
        <ArrowLeft className="w-6 h-6" />
        </motion.button>
      <h2 className="text-2xl font-bold mb-4 text-emerald-300">
        Produits avec campagne Terminer
      </h2>
      <ul className="space-y-4">
        {produits.map((prod) => (
          <li
            key={prod.id_pro}
            className="p-4 bg-emerald-800 rounded-lg shadow-md flex justify-between items-center"
          >
            <span>{prod.nom_pro}</span>
            <button
              onClick={() => navigate(`/AQ/campagneBR/terminer/${prod.id_pro}`)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 transition"
            >
              Voir campagnes
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProduitsCampagneTerminer;
