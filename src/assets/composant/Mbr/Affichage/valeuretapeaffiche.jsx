import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ValeurEtapeTable = () => {
  const { id_peta, id_mbr, id_eta } = useParams(); 
  // id_peta = pour récupérer les sous étapes
  // id_mbr = pour récupérer les valeurs

  const [colonnes, setColonnes] = useState([]);
  const [sousEtapes, setSousEtapes] = useState([]);
  const [valeurs, setValeurs] = useState([]);

  useEffect(() => {
    // Charger colonnes
    axios.get(`http://localhost:3000/api/colonne/listecolonne/${id_peta}`)
      .then(res => setColonnes(res.data))
      .catch(err => console.error(err));

    // Charger sous_etapes
    axios.get(`http://localhost:3000/api/sous_etape/sous_etape/${id_eta}/${id_peta }`)
      .then(res => setSousEtapes(res.data))
      .catch(err => console.error(err));

    // Charger valeurs
    axios.get(`http://localhost:3000/api/valeuretape/valeurs/${id_mbr}`)
      .then(res => setValeurs(res.data))
      .catch(err => console.error(err));
  }, [id_peta, id_mbr]);

  // fonction utilitaire pour récupérer une valeur
  const getValeur = (id_sous, id_col) => {
    const val = valeurs.find(v => v.id_sous === id_sous && v.id_col === id_col);
    return val ? val.valeur : "";
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Tableau des valeurs étape</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Paramètre</th>
              <th className="border px-4 py-2">Appareil</th>
              <th className="border px-4 py-2">Unité</th>
              <th className="border px-4 py-2">Tolérence</th>
              <th className="border px-4 py-2">Criticité</th>
              <th className="border px-4 py-2">Valeur Std</th>
              {colonnes.map(col => (
                <th key={col.id_col} className="border px-4 py-2">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sousEtapes.map(sous => (
              <tr key={sous.id_sous}>
                <td className="border px-4 py-2">{sous.parametre}</td>
                <td className="border px-4 py-2">{sous.appareil}</td>
                <td className="border px-4 py-2">{sous.unite}</td>
                <td className="border px-4 py-2">{sous.tolerence}</td>
                <td className="border px-4 py-2">{sous.criticite}</td>
                <td className="border px-4 py-2">{sous.valeur_std}</td>
                {colonnes.map(col => (
                  <td key={col.id_col} className="border px-4 py-2 text-center">
                    {getValeur(sous.id_sous, col.id_col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValeurEtapeTable;
