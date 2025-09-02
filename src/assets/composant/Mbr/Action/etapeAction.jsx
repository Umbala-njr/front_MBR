import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EtapeactionByMBR = () => {
  const { id_mbr, code_fab } = useParams();
  const navigate = useNavigate();
  const [etapes, setEtapes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupération des étapes depuis l'API
  useEffect(() => {
    const fetchEtapes = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/etape/etapeBR/${id_mbr}/${code_fab}`
        );
        setEtapes(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEtapes();
  }, [id_mbr, code_fab]);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {etapes.map((etape) => (
        <div
          key={etape.id_eta}
          className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition"
        >
          <h2 className="text-lg font-bold text-gray-800">{etape.nom_eta}</h2>
          <p className="text-sm text-gray-600 mt-2">{etape.Instruction}</p>

          <button
            onClick={() => navigate(`/PROD/petiteetapeaction/${id_mbr}/${etape.id_eta}`)}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
          >
            Voir détails
          </button>
        </div>
      ))}

      {etapes.length === 0 && (
        <p className="col-span-full text-center text-gray-500">
          Aucune étape trouvée pour ce MBR.
        </p>
      )}
    </div>
  );
};

export default EtapeactionByMBR;
