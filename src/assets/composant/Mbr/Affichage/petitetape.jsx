import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PetiteEtapeByEta = () => {
  const { id_mbr, id_eta } = useParams();
  const navigate = useNavigate();
  const [petitesEtapes, setPetitesEtapes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les petites étapes
  useEffect(() => {
    const fetchPetitesEtapes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/petite_etape/affichepetitEtapebyeta/${id_eta}`
        );
        setPetitesEtapes(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPetitesEtapes();
  }, [id_eta]);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  return (
    <div className="p-6 space-y-4">
      {petitesEtapes.map((peta, index) => (
        <div
          key={peta.id_peta}
          className="relative border-l-4 border-green-600 pl-6 bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
        >
          <span className="absolute -left-2 top-4 bg-green-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
            {index + 1}
          </span>

          <h3 className="text-lg font-semibold text-gray-800">{peta.nom_peta}</h3>

          <button
            onClick={() =>
              navigate(`/PROD/valeuretapebr/${id_mbr}/${id_eta}/${peta.id_peta}`)
            }
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Voir tableau
          </button>
        </div>
      ))}

      {petitesEtapes.length === 0 && (
        <p className="text-center text-gray-500">
          Aucune petite étape trouvée pour cette étape.
        </p>
      )}
    </div>
  );
};

export default PetiteEtapeByEta;
