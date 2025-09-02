import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ValeurEtapeActionTable = () => {
  const { id_peta, id_mbr, id_eta } = useParams();

  const [colonnes, setColonnes] = useState([]);
  const [sousEtapes, setSousEtapes] = useState([]);
  const [valeurs, setValeurs] = useState([]);
  const [savedValeurs, setSavedValeurs] = useState({}); // pour bloquer après enregistrement

  useEffect(() => {
    axios.get(`http://localhost:3000/api/colonne/listecolonne/${id_peta}`)
      .then(res => setColonnes(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:3000/api/sous_etape/sous_etape/${id_eta}/${id_peta}`)
      .then(res => setSousEtapes(res.data))
      .catch(err => console.error(err));

    axios.get(`http://localhost:3000/api/valeuretape/valeurs/${id_mbr}`)
      .then(res => setValeurs(res.data))
      .catch(err => console.error(err));
  }, [id_peta, id_mbr, id_eta]);

  const getValeur = (id_sous, id_col) => {
    const val = valeurs.find(v => v.id_sous === id_sous && v.id_col === id_col);
    return val ? val.valeur : "";
  };

  const handleChange = async (id_sous, id_col, value) => {
    try {
      if (!id_mbr || !id_sous || !id_col) return;

      const valToSend = value === "" ? null : value;

      // Mise à jour locale
      setValeurs(prev => [
        ...prev.filter(v => !(v.id_sous === id_sous && v.id_col === id_col)),
        { id_sous, id_col, valeur: valToSend }
      ]);

      // Envoi au backend
      await axios.post("http://localhost:3000/api/valeuretape/valeurs", {
        id_mbr,
        id_sous,
        id_col,
        valeur: valToSend
      });

      // Marquer comme enregistré
      setSavedValeurs(prev => ({
        ...prev,
        [`${id_sous}_${id_col}`]: true
      }));

    } catch (err) {
      console.error("Erreur lors de l'ajout de valeur:", err.response?.data || err.message);
    }
  };

const renderInput = (sous, col) => {
  let value = getValeur(sous.id_sous, col.id_col);
  const isSaved = !!value; // vrai si la cellule a déjà une valeur

  const now = new Date();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  // valeur par défaut si vide
  let displayValue = value || (sous.type_input === "date" ? today : sous.type_input === "time" ? currentTime : "");

  switch (sous.type_input) {
    case "date":
      return (
        <input
          type="date"
          value={displayValue}
          onChange={e => handleChange(sous.id_sous, col.id_col, e.target.value)}
          className={`w-full text-center border px-1 py-1 ${isSaved ? 'bg-gray-200' : ''}`}
          disabled={isSaved} // bloque après saisie
        />
      );

    case "time":
      return (
        <input
          type="time"
          value={displayValue}
          onChange={e => handleChange(sous.id_sous, col.id_col, e.target.value)}
          className={`w-full text-center border px-1 py-1 ${isSaved ? 'bg-gray-200' : ''}`}
          disabled={isSaved} // bloque après saisie
        />
      );

    // autres types restent modifiables comme avant
    case "number":
    case "text":
    case "datetime-local":
      return (
        <input
          type={sous.type_input}
          value={displayValue}
          onChange={e => handleChange(sous.id_sous, col.id_col, e.target.value)}
          className="w-full text-center border px-1 py-1"
        />
      );

    case "textarea":
      return (
        <textarea
          value={displayValue}
          onChange={e => handleChange(sous.id_sous, col.id_col, e.target.value)}
          className="w-full text-center border px-1 py-1"
        />
      );

    case "checkbox":
      return (
        <input
          type="checkbox"
          checked={displayValue === "true"}
          onChange={e => handleChange(sous.id_sous, col.id_col, String(e.target.checked))}
          className="mx-auto"
        />
      );

    default:
      return (
        <input
          type="text"
          value={displayValue}
          onChange={e => handleChange(sous.id_sous, col.id_col, e.target.value)}
          className="w-full text-center border px-1 py-1"
        />
      );
  }
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
                    {renderInput(sous, col)}
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

export default ValeurEtapeActionTable;
