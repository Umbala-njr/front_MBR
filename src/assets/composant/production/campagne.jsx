import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CampagneManager = () => {
  const { code_fab } = useParams(); // récup depuis URL
  const [campagnes, setCampagnes] = useState([]);
  const [formData, setFormData] = useState({
    atelier: "", // requis car ton backend le demande
    date_debut_camp: "",
    date_fin_camp: "",
    nombre_mbr: "",
  });
  const [editId, setEditId] = useState(null);

  // ⚠️ id_uti doit être récupéré (par ex. depuis localStorage ou contexte)
  const id_uti = localStorage.getItem("id_uti") || 1; 

  // Charger les campagnes filtrées par code_fab et id_uti
  const fetchCampagnes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/campagne/affiche/${code_fab}`
      );
      setCampagnes(res.data);
    } catch (err) {
      console.error("Erreur chargement campagnes:", err);
    }
  };

  useEffect(() => {
    fetchCampagnes();
  }, [code_fab, id_uti]);

  // Gestion changement input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumission formulaire
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Formater les dates en YYYY-MM-DD seulement
    const dataToSend = {
      ...formData,
      date_debut_camp: formData.date_debut_camp.split("T")[0],
      date_fin_camp: formData.date_fin_camp.split("T")[0],
      code_fab,
    };

    if (editId) {
      await axios.put(
        `http://localhost:3000/api/campagne/modifier/${editId}`,
        dataToSend
      );
      alert("Campagne modifiée avec succès !");
    } else {
      await axios.post("http://localhost:3000/api/campagne/ajout", dataToSend);
      alert("Campagne ajoutée avec succès !");
    }

    setFormData({
      atelier: "",
      date_debut_camp: "",
      date_fin_camp: "",
      nombre_mbr: "",
    });
    setEditId(null);
    fetchCampagnes();
  } catch (err) {
    console.error("Erreur sauvegarde:", err);
    alert("Erreur lors de l'enregistrement");
  }
};

  // Mettre en mode édition
  const handleEdit = (campagne) => {
    setEditId(campagne.id_camp);
    setFormData({
      atelier: campagne.atelier || "",
      date_debut_camp: campagne.date_debut_camp || "",
      date_fin_camp: campagne.date_fin_camp || "",
      nombre_mbr: campagne.nombre_mbr || "",
    });
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">Gestion des Campagnes</h2>
      <p className="mb-4">
        <span className="font-semibold">Fabrication:</span> {code_fab}
      </p>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded-xl shadow-lg mb-6"
      >
        <input
          type="text"
          name="atelier"
          placeholder="Nom Atelier"
          value={formData.atelier}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600"
          required
        />
        <input
          type="date"
          name="date_debut_camp"
          value={formData.date_debut_camp}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600"
          required
        />
        <input
          type="date"
          name="date_fin_camp"
          value={formData.date_fin_camp}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600"
          required
        />
        <input
          type="number"
          name="nombre_mbr"
          placeholder="Nombre MBR"
          value={formData.nombre_mbr}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 border border-gray-600"
          required
        />
        <button
          type="submit"
          className="col-span-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl"
        >
          {editId ? "Modifier la campagne" : "Envoyer une campagne"}
        </button>
      </form>

      {/* Tableau */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2">ID</th>
            <th className="p-2">Fabrication</th>
            <th className="p-2">Atelier</th>
            <th className="p-2">Début</th>
            <th className="p-2">Fin</th>
            <th className="p-2">Nbr MBR</th>
            <th className="p-2">Statut</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {campagnes.map((c) => (
            <tr key={c.id_camp} className="border-b border-gray-700">
              <td className="p-2">{c.id_camp}</td>
              <td className="p-2">{c.nom_fab}</td>
              <td className="p-2">{c.atelier}</td>
              <td className="p-2">{c.date_debut_camp?.split("T")[0]}</td>
              <td className="p-2">{c.date_fin_camp?.split("T")[0]}</td>
              <td className="p-2">{c.nombre_mbr}</td>
              <td className="p-2">{c.statut}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Modifier
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampagneManager;
