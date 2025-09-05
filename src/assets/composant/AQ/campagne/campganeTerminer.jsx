import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CampagneTerminer = () => {
  const [campagnes, setCampagnes] = useState([]);
  const navigate = useNavigate();

  // Charger les campagnes depuis l'API
const fetchCampagnes = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/campagne/voir/terminer");
    console.log("Réponse API:", res.data);
    setCampagnes(res.data);
  } catch (err) {
    console.error("Erreur récupération campagnes:", err);
  }
};

  useEffect(() => {
    fetchCampagnes();
  }, []);


  // Redirection vers création MBR
  const handleCreerMBR = (code_fab, id_camp) => {
    navigate(`/AQ/documentCamp/${code_fab}/${id_camp}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-green-900 mb-8 text-center">Campagnes Disponibles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campagnes.map((camp) => (
          <div
            key={camp.id_camp}
            className="bg-white shadow-xl rounded-xl p-5 border border-green-800 transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            <h2 className="text-xl font-bold text-green-900 border-b border-green-700 pb-2">{camp.nom_fab}</h2>
            <div className="mt-4 space-y-2">
              <p className="text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m4 0h4m4 0h4M9 7h6m-6 4h6m-6 4h6" />
                </svg>
                Atelier : <span className="font-medium ml-1">{camp.atelier}</span>
              </p>
              <p className="text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Période :{new Date(camp.date_debut_camp).toLocaleDateString("fr-FR")} → {new Date(camp.date_fin_camp).toLocaleDateString("fr-FR")}
              </p>
              <p className="text-gray-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-800 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Nombre MBR : <span className="font-medium ml-1">{camp.nombre_br}</span>
              </p>
              <p className={`mt-3 font-semibold flex items-center ${
                 camp.statut === "En cours" || camp.statut === "En_cours"
                ? "text-blue-600"
                : camp.statut === "Terminé"
                ? "text-red-600"
                : "text-green-700"
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Statut : {camp.statut}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleCreerMBR(camp.code_fab, camp.id_camp)}
                className="flex-1 px-4 py-2 bg-white text-green-800 border border-green-800 rounded-lg shadow hover:bg-green-50 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Validation Campagne
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampagneTerminer;
