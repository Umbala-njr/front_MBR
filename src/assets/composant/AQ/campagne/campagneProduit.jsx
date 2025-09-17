import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProduitsCampagneEnCours = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/produit/produitcampagne/encours")
      .then((res) => {
        setProduits(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération produits :", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-300">Chargement...</p>;
  }

  if (produits.length === 0) {
    return <p className="text-center text-red-400">Aucun produit avec campagne en cours</p>;
  }

  return (
    <div className="p-6 bg-emerald-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4 text-emerald-300">
        Produits avec campagne en cours
      </h2>
      <ul className="space-y-4">
        {produits.map((prod) => (
          <li
            key={prod.id_pro}
            className="p-4 bg-emerald-800 rounded-lg shadow-md flex justify-between items-center"
          >
            <span>{prod.nom_pro}</span>
            <button
              onClick={() => navigate(`/AQ/campagneBR/encours/${prod.id_pro}`)}
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

export default ProduitsCampagneEnCours;
