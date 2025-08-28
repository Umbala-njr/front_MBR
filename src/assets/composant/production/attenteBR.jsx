import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const NobleMBRList = () => {
  const { code_fab } = useParams();
  const [mbrs, setMbrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const statut = "attente"; // fixé
  const navigate = useNavigate();

  // ⚡ récupère infos user connecté (depuis localStorage)
  const user = JSON.parse(localStorage.getItem("user"));
  const id_uti = user?.id_uti;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMBR = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/mbr/mbr/codefab`, {
          params: { statut, code_fab },
        });
        setMbrs(res.data);
      } catch (error) {
        console.error("Erreur récupération MBR :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMBR();
  }, [statut, code_fab]);

  // ⚡ bouton "Lancement"
  const handleLancement = async (id_mbr) => {
    try {
      if (!id_uti) {
        alert("Utilisateur non connecté !");
        return;
      }

      await axios.put(
        `http://localhost:3000/api/MBR/commencerBR/${id_mbr}`,
        { id_uti }, // ✅ envoi dans le body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("MBR lancé avec succès !");
      setMbrs((prev) =>
        prev.map((m) =>
          m.id_mbr === id_mbr ? { ...m, statut: "en cours" } : m
        )
      );
    } catch (err) {
      console.error("Erreur lancement :", err);
      alert("Erreur lors du lancement du MBR");
    }
  };

  if (loading) {
    return <div className="text-green-400 p-6">Chargement...</div>;
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-green-400 mb-6">📋 Liste des MBR</h1>
      <p className="text-gray-300 mb-4">
        <span className="font-semibold">Statut :</span> {statut} |{" "}
        <span className="font-semibold">Code fabrication :</span> {code_fab}
      </p>

      {mbrs.length === 0 ? (
        <p className="text-gray-400">Aucun MBR trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mbrs.map((mbr) => (
            <div
              key={mbr.id_mbr}
              className="bg-gray-800 rounded-2xl shadow-lg p-5 border border-green-600"
            >
              <h2 className="text-xl font-semibold text-green-300 mb-2">
                {mbr.num_br} – {mbr.nom_fab}
              </h2>
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Atelier :</span> {mbr.nom_atelier}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Émetteur :</span> {mbr.nom_uti_emission}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Date émission :</span>{" "}
                {new Date(mbr.date_emi).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-300 mb-3">
                <span className="font-semibold">Statut :</span>{" "}
                <span
                  className={`px-2 py-1 rounded-lg text-xs ${
                    mbr.statut === "terminé"
                      ? "bg-green-700 text-white"
                      : mbr.statut === "en cours"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {mbr.statut}
                </span>
              </p>

              {/* 🚀 Boutons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() =>
                    navigate(`/PROD/detailattente/${mbr.id_mbr}/${code_fab}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm"
                >
                  Voir détails
                </button>
                <button
                  onClick={() => handleLancement(mbr.id_mbr)}
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-sm"
                >
                  Lancement
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NobleMBRList;
