import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TableauColonnes = () => {
  const { id_mat } = useParams(); // Récupère l'id_mat depuis l'URL
  const [colonnes, setColonnes] = useState([]);
  const [formData, setFormData] = useState({
    nom_colm: "",
    type_input: "",
    ordre: "",
  });
  const [loading, setLoading] = useState(false);

  // Récupérer les colonnes existantes
  const fetchColonnes = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/matiere/colonnes/${id_mat}`);
      setColonnes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchColonnes();
  }, [id_mat]);

  // Gérer le formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/matiere/ajouterColonnematiere", {
        ...formData,
        id_mat,
      });
      alert(res.data.message);
      setFormData({ nom_colm: "", type_input: "", ordre: "" });
      fetchColonnes(); // Recharge les colonnes pour mettre à jour le tableau
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tableau Matière {id_mat}</h1>

      {/* Formulaire pour ajouter une colonne */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Ajouter une colonne</h2>
        <div>
          <label className="block font-medium">Nom de la colonne</label>
          <input
            type="text"
            name="nom_colm"
            value={formData.nom_colm}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Type d'input</label>
          <input
            type="text"
            name="type_input"
            value={formData.type_input}
            onChange={handleChange}
            placeholder="ex: text, number, date..."
            required
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Ordre</label>
          <input
            type="number"
            name="ordre"
            value={formData.ordre}
            onChange={handleChange}
            required
            className="border p-2 w-full rounded"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Ajout en cours..." : "Ajouter la colonne"}
        </button>
      </form>

      {/* Tableau des colonnes (forme du tableau) */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {colonnes
              .sort((a, b) => a.ordre - b.ordre)
              .map((col) => (
                <th key={col.id_col} className="border px-4 py-2">
                  {col.nom_colm}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {colonnes
              .sort((a, b) => a.ordre - b.ordre)
              .map((col) => (
                <td key={col.id_col} className="border px-4 py-2 text-center">
                  {/* Cellule vide pour montrer la forme */}
                </td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableauColonnes;
