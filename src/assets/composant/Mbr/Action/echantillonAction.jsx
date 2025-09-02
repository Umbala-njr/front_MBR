import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ListeEchantillonsAction = () => {
  const { id_mbr } = useParams();
  const [echantillons, setEchantillons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null); // index de la ligne en modification
  const [editData, setEditData] = useState({}); // données éditées

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
    setEditData({ ...echan }); // copier les valeurs actuelles
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
    updated[editIndex] = res.data; // ⚡ récupère la ligne mise à jour depuis l’API

    setEchantillons(updated);
    setEditIndex(null);
    setEditData({});
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
  }
};

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
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {echantillons.length > 0 ? (
              echantillons.map((echan, index) => (
                <tr key={index} className="text-center hover:bg-gray-50">
                  {editIndex === index ? (
                    <>
                      <td className="border p-2">{echan.ordre}</td>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="num_BA"
                          value={editData.num_BA}
                          onChange={handleChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="nom_echan"
                          value={editData.nom_echan}
                          onChange={handleChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="stade"
                          value={editData.stade}
                          onChange={handleChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="methode_echan"
                          value={editData.methode_echan}
                          onChange={handleChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="unite"
                          value={editData.unite}
                          onChange={handleChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          name="quantite_echan"
                          value={editData.quantite_echan}
                          onChange={handleChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="embalage"
                          value={editData.embalage}
                          onChange={handleChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="destination"
                          value={editData.destination}
                          onChange={handleChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border p-2">
                        <input
                          type="text"
                          name="neutralisation_OH"
                          value={editData.neutralisation_OH}
                          onChange={handleChange}
                          className="border p-1 w-full"
                        />
                      </td>
                      <td className="border p-2">
                        {new Date(echan.date_echan).toLocaleDateString()}
                      </td>
                      <td className="border p-2 flex gap-2">
                        <button
                          onClick={() => handleSave(echan.id_echan)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Annuler
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
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
                      <td className="border p-2">
                        <button
                          onClick={() => handleEdit(index, echan)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
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

export default ListeEchantillonsAction;
