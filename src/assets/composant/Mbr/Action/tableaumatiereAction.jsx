import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TableauMatiereaction = () => {
  const { id_mbr, id_mat } = useParams();

  const [colonnes, setColonnes] = useState([]);
  const [lignes, setLignes] = useState([]);
  const [newRow, setNewRow] = useState({});
  const [error, setError] = useState("");

  // Charger colonnes + valeurs
  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/matiere/valeurs/${id_mbr}/${id_mat}`);
      setColonnes(res.data.colonnes || []);
      setLignes(res.data.lignes || []);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du chargement des données");
    }
  };

  useEffect(() => {
    fetchData();
  }, [id_mbr, id_mat]);

  // Gérer la saisie des nouvelles valeurs
  const handleInputChange = (id_colm, value) => {
    setNewRow((prev) => ({
      ...prev,
      [id_colm]: value
    }));
  };

  // Ajouter une nouvelle ligne
  const handleAddRow = async () => {
    try {
      const row_id = lignes.length + 1; // simple incrément
      for (let col of colonnes) {
        await axios.post("http://localhost:3000/api/matiere/ajoutervaleur", {
          id_mbr,
          id_mat:id_mat,
          row_id,
          id_colm: col.id_colm,
          valeur_mat: newRow[col.id_colm] || ""
        });
      }
      setNewRow({});
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'ajout");
    }
  };

  // 🔹 Rendu dynamique d'un input selon le type
  const renderInput = (col) => {
    const value = newRow[col.id_colm] || "";

    switch (col.type_input) {
      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(col.id_colm, e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(col.id_colm, e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(col.id_colm, e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        );

      default: // text par défaut
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(col.id_colm, e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Tableau des Valeurs (Matière {id_mat})</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Tableau affichage */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Row</th>
            {colonnes.map((col) => (
              <th key={col.id_colm} className="border px-2 py-1">{col.nom_colm}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne) => (
            <tr key={ligne.row_id}>
              <td className="border px-2 py-1">{ligne.row_id}</td>
              {colonnes.map((col) => (
                <td key={col.id_colm} className="border px-2 py-1">
                  {ligne.valeurs[col.id_colm] || ""}
                </td>
              ))}
            </tr>
          ))}

          {/* Ligne saisie dynamique */}
          <tr>
            <td className="border px-2 py-1">+ (nouvelle)</td>
            {colonnes.map((col) => (
              <td key={col.id_colm} className="border px-2 py-1">
                {renderInput(col)}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <button
        onClick={handleAddRow}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Ajouter ligne
      </button>
    </div>
  );
};

export default TableauMatiereaction;
