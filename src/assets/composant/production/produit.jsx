import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProduitList = () => {
  const [produits, setProduits] = useState([]);
  const navigate = useNavigate();

  // Charger les produits
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/produit/affiche"); // ton endpoint Express
        setProduits(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits :", error);
      }
    };
    fetchProduits();
  }, []);

  // Rediriger vers une autre page avec l'id_pro
  const handleNavigate = (id_pro) => {
    navigate(`/PROD/production/${id_pro}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-green-700">
        Liste des Matières végétales
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {produits.map((prod) => (
          <div
            key={prod.id_pro}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {prod.nom_pro}
              </h2>
              <button
                onClick={() => handleNavigate(prod.id_pro)}
                className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition"
              >
                Nouvelle Campagne
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProduitList;
