import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ListeEchantillons = () => {
  const { id_mbr } = useParams(); // récupération de l'id_mbr depuis l'URL
  const [echantillons, setEchantillons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEchantillons = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/echantillion/affichebymbr/${id_mbr}`);
        setEchantillons(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEchantillons();
  }, [id_mbr]);

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Liste des Échantillons</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Ordre</th>
              <th className="border p-2">Num BA</th>
              <th className="border p-2">Nom Échantillon</th>
              <th className="border p-2">Stade</th>
              <th className="border p-2">Méthode</th>
              <th className="border p-2">Unité</th>
              <th className="border p-2">Quantité</th>
              <th className="border p-2">Emballage</th>
              <th className="border p-2">Destination</th>
              <th className="border p-2">Neutralisation OH</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {echantillons.length > 0 ? (
              echantillons.map((echan, index) => (
                <tr key={index} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{echan.ordre || ""}</td>
                  <td className="border p-2">{echan.num_BA || ""}</td>
                  <td className="border p-2">{echan.nom_echan || ""}</td>
                  <td className="border p-2">{echan.stade || ""}</td>
                  <td className="border p-2">{echan.methode_echan || ""}</td>
                  <td className="border p-2">{echan.unite || ""}</td>
                  <td className="border p-2">{echan.quantite_echan || ""}</td>
                  <td className="border p-2">{echan.embalage || ""}</td>
                  <td className="border p-2">{echan.destination || ""}</td>
                  <td className="border p-2">{echan.neutralisation_OH || ""}</td>
                  <td className="border p-2">
                    {echan.date_echan
                      ? new Date(echan.date_echan).toLocaleDateString()
                      : ""}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="text-center text-gray-500 p-4 italic"
                >
                  Aucun échantillon trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListeEchantillons;
