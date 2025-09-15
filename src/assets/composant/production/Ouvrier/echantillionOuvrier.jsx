import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ListeEchantillonsOuvrier = () => {
  const { id_mbr } = useParams();
  const [echantillons, setEchantillons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchEchantillons = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/echantillion/affichebymbr/${id_mbr}`
        );
        setEchantillons(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEchantillons();
  }, [id_mbr]);

  const handleEdit = (index, echan) => {
    setEditIndex(index);
    setEditData({ ...echan });
  };

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditData({});
  };

  const handleSave = async (id_echan) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/echantillion/modifierechan/${id_echan}`,
        editData
      );

      const updated = [...echantillons];
      updated[editIndex] = res.data;
      setEchantillons(updated);

      setEditIndex(null);
      setEditData({});
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400">Chargement...</p>;
  }

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">
        📦 Liste des Échantillons
      </h2>

      <div className="overflow-x-auto bg-emerald-900/40 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-700/40">
        <table className="min-w-full divide-y divide-emerald-700">
          <thead className="bg-emerald-800/60 text-emerald-300">
            <tr>
              <th className="px-3 py-2 text-left">Ordre</th>
              <th className="px-3 py-2 text-left">Num BA</th>
              <th className="px-3 py-2 text-left">Nom Échantillon</th>
              <th className="px-3 py-2 text-left">Stade</th>
              <th className="px-3 py-2 text-left">Méthode</th>
              <th className="px-3 py-2 text-left">Unité</th>
              <th className="px-3 py-2 text-left">Quantité</th>
              <th className="px-3 py-2 text-left">Emballage</th>
              <th className="px-3 py-2 text-left">Destination</th>
              <th className="px-3 py-2 text-left">Neutralisation OH</th>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-800">
            {echantillons.length > 0 ? (
              echantillons.map((echan, index) => (
                <tr
                  key={index}
                  className="hover:bg-emerald-800/30 transition duration-200"
                >
                  {editIndex === index ? (
                    <>
                      <td className="px-3 py-2">{echan.ordre}</td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          name="num_BA"
                          value={editData.num_BA}
                          onChange={handleChange}
                          className="w-full px-2 py-1 rounded bg-emerald-950 text-white border border-emerald-600 focus:ring focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          name="nom_echan"
                          value={editData.nom_echan}
                          onChange={handleChange}
                          className="w-full px-2 py-1 rounded bg-emerald-950 text-white border border-emerald-600 focus:ring focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          name="stade"
                          value={editData.stade}
                          onChange={handleChange}
                          className="w-full px-2 py-1 rounded bg-emerald-950 text-white border border-emerald-600 focus:ring focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          name="methode_echan"
                          value={editData.methode_echan}
                          onChange={handleChange}
                          className="w-full px-2 py-1 rounded bg-emerald-950 text-white border border-emerald-600 focus:ring focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          name="unite"
                          value={editData.unite}
                          onChange={handleChange}
                          className="w-full px-2 py-1 rounded bg-emerald-950 text-white border border-emerald-600 focus:ring focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          name="quantite_echan"
                          value={editData.quantite_echan}
                          onChange={handleChange}
                          className="w-full px-2 py-1 rounded bg-emerald-950 text-white border border-emerald-600 focus:ring focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          name="embalage"
                          value={editData.embalage}
                          onChange={handleChange}
                          className="w-full px-2 py-1 rounded bg-emerald-950 text-white border border-emerald-600 focus:ring focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          name="destination"
                          value={editData.destination}
                          onChange={handleChange}
                          className="w-full px-2 py-1 rounded bg-emerald-950 text-white border border-emerald-600 focus:ring focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          name="neutralisation_OH"
                          value={editData.neutralisation_OH}
                          onChange={handleChange}
                          className="w-full px-2 py-1 rounded bg-emerald-950 text-white border border-emerald-600 focus:ring focus:ring-emerald-500"
                        />
                      </td>
                      <td className="px-3 py-2">
                        {new Date(echan.date_echan).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 flex gap-2 justify-center">
                        <button
                          onClick={() => handleSave(echan.id_echan)}
                          className="bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded text-white shadow"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 hover:bg-gray-400 px-3 py-1 rounded text-white shadow"
                        >
                          Annuler
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2">{echan.ordre || ""}</td>
                      <td className="px-3 py-2">{echan.num_BA || ""}</td>
                      <td className="px-3 py-2">{echan.nom_echan || ""}</td>
                      <td className="px-3 py-2">{echan.stade || ""}</td>
                      <td className="px-3 py-2">{echan.methode_echan || ""}</td>
                      <td className="px-3 py-2">{echan.unite || ""}</td>
                      <td className="px-3 py-2">{echan.quantite_echan || ""}</td>
                      <td className="px-3 py-2">{echan.embalage || ""}</td>
                      <td className="px-3 py-2">{echan.destination || ""}</td>
                      <td className="px-3 py-2">{echan.neutralisation_OH || ""}</td>
                      <td className="px-3 py-2">
                        {echan.date_echan
                          ? new Date(echan.date_echan).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => handleEdit(index, echan)}
                          className="bg-emerald-500 hover:bg-emerald-400 px-3 py-1 rounded text-white shadow"
                        >
                          Remplir
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className="text-center text-gray-400 py-6 italic"
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

export default ListeEchantillonsOuvrier;
