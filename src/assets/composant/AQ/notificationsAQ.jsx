// src/pages/Notifications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const id_uti = user?.id_uti;
  const token = localStorage.getItem("token");

  const chargerDemandes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/demandebr/demandes/envoyee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDemandes(res.data);
    } catch (err) {
      console.error("Erreur récupération demandes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDemandes();
  }, []);

  const handleCreerMBR = (id_camp, code_fab) => {
    navigate(`/AQ/mbr/${code_fab}/${id_camp}`);
  };

const handleEffectuer = async (id_dem) => {
  try {
    setLoading(true);
    const res = await axios.put(
      `http://localhost:3000/api/demandebr/setStatutRecus/${id_dem}`,
      { id_uti }, // si tu veux utiliser l'id_uti côté backend
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert(res.data.message);
    chargerDemandes(); // recharger les notifications
  } catch (err) {
    console.error("Erreur lors de l'exécution :", err);
    alert(err.response?.data?.message || "Erreur serveur");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Notifications</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : demandes.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <h3 className="mt-4 text-lg font-medium text-white">Aucune notification</h3>
          <p className="mt-1 text-gray-400">Aucune demande en attente pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {demandes.map((demande) => (
            <div
              key={demande.id_dem}
              className="p-5 border border-gray-700 rounded-lg bg-gray-800 shadow-lg transition-all hover:bg-gray-750"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium">{demande.contenue}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-300">
                    <span className="mr-3">Du: {demande.date_creation}</span>
                    <span>Fabricant: {demande.code_fab}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleCreerMBR(demande.id_camp, demande.code_fab)}
                    className="px-3 py-1 bg-emerald-600 text-white text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Créer MBR
                  </button>
                  <button
                    onClick={() => handleEffectuer(demande.id_dem)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Effectuer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
