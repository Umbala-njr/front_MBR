import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TableauValeursMatiere = () => {
  const { id_mbr, id_mat } = useParams(); // récupérés depuis l'URL
  const [colonnes, setColonnes] = useState([]);
  const [lignes, setLignes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger colonnes puis valeurs
  const fetchData = async () => {
    try {
      // 1️⃣ Récupération des colonnes
      const resCols = await axios.get(
        `http://localhost:3000/api/matiere/colonnes/${id_mat}`
      );
      setColonnes(resCols.data);

      // 2️⃣ Récupération des valeurs (par MBR)
      const resVals = await axios.get(
        `http://localhost:3000/api/matiere/valeurs/${id_mbr}/${id_mat}`
      );
      setLignes(resVals.data.lignes);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id_mbr, id_mat]);

  if (loading) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tableau Matière {id_mat} - MBR {id_mbr}
      </h1>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {colonnes.map((col) => (
              <th key={col.id_colm} className="border px-4 py-2">
                {col.nom_colm}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lignes.length === 0 ? (
            <tr>
              <td
                colSpan={colonnes.length}
                className="border px-4 py-2 text-center text-gray-500"
              >
                Aucune donnée disponible
              </td>
            </tr>
          ) : (
            lignes.map((ligne) => (
              <tr key={ligne.row_id}>
                {colonnes.map((col) => (
                  <td key={col.id_colm} className="border px-4 py-2 text-center">
                    {ligne.valeurs[col.id_colm] || ""}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableauValeursMatiere;
