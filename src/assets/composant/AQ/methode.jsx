import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MethodeManager = () => {
  const { code_fab } = useParams(); // récupère code_fab depuis l'URL
  const [methodes, setMethodes] = useState([]);
  const [nomMet, setNomMet] = useState("");
  const [editId, setEditId] = useState(null);

  // Colonnes
  const [colonnes, setColonnes] = useState([]);
  const [selectedMet, setSelectedMet] = useState(null);
  const [label, setLabel] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [ordre, setOrdre] = useState("");

  // Charger les méthodes au montage
  useEffect(() => {
    fetchMethodes();
  }, [code_fab]);

  const fetchMethodes = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/methode/afficherMethodeParCodeFab/${code_fab}`);
      setMethodes(res.data);
    } catch (error) {
      console.error("Erreur chargement méthodes", error);
    }
  };

  const ajouterMethode = async () => {
    if (!nomMet) return alert("Nom méthode requis !");
    try {
      await axios.post("http://localhost:3000/api/methode/ajouterMethode", {
        nom_met: nomMet,
        code_fab: code_fab,
      });
      setNomMet("");
      fetchMethodes();
    } catch (error) {
      console.error("Erreur ajout méthode", error);
    }
  };

const modifierMethode = async () => {
  if (!nomMet) return alert("Nom méthode requis !");
  try {
    await axios.put(`http://localhost:3000/api/methode/modifierMethode/${editId}`, {
      nom_met: nomMet,
    });
    setNomMet("");
    setEditId(null);
    fetchMethodes();
  } catch (error) {
    console.error("Erreur modification méthode", error);
  }
};

  const startEdit = (methode) => {
    setEditId(methode.id_met);
    setNomMet(methode.nom_met);
  };

  // Colonnes
  const toggleColonnes = async (id_met) => {
    if (selectedMet === id_met) {
      // si on reclique sur la même méthode -> on ferme
      setSelectedMet(null);
      setColonnes([]);
      return;
    }
    setSelectedMet(id_met);
    try {
      const res = await axios.get(`http://localhost:3000/api/colonnemet/afficherMethodeColonne/${id_met}`);
      setColonnes(res.data);
    } catch (error) {
      console.error("Erreur chargement colonnes", error);
    }
  };

  const ajouterColonne = async () => {
    if (!label || !typeInput || !ordre) return alert("Tous les champs colonne sont requis !");
     const ordreExiste = colonnes.some((col) => col.ordre === parseInt(ordre));
  if (ordreExiste) {
    return alert(`L'ordre ${ordre} est déjà utilisé pour cette méthode`);
  }

    try {
      await axios.post("http://localhost:3000/api/colonnemet/ajoutMethodeColonne", {
        label,
        type_input_mc: typeInput,
        ordre,
        id_met: selectedMet,
      });
      setLabel("");
      setTypeInput("");
      setOrdre("");
      toggleColonnes(selectedMet); // recharge les colonnes après ajout
    } catch (error) {
      console.error("Erreur ajout colonne", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-green-600">
        Gestion des méthodes ({code_fab})
      </h1>

      {/* Formulaire ajout / modification méthode */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={nomMet}
          onChange={(e) => setNomMet(e.target.value)}
          placeholder="Nom méthode"
          className="flex-1 p-2 border rounded"
        />
        {editId ? (
          <button
            onClick={modifierMethode}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Modifier
          </button>
        ) : (
          <button
            onClick={ajouterMethode}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Ajouter
          </button>
        )}
      </div>

      {/* Liste des méthodes */}
      <ul className="space-y-2">
        {methodes.map((m) => (
          <li
            key={m.id_met}
            className="p-3 border rounded bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{m.nom_met}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(m)}
                  className="text-sm bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Éditer
                </button>
                <button
                  onClick={() => toggleColonnes(m.id_met)}
                  className="text-sm bg-purple-500 text-white px-3 py-1 rounded"
                >
                  Colonnes
                </button>
              </div>
            </div>

            {/* Colonnes de la méthode sélectionnée + formulaire ajout */}
            {selectedMet === m.id_met && (
              <div className="mt-3 pl-4 border-l">
                <h3 className="font-semibold mb-2">Colonnes</h3>

                {/* Liste colonnes */}
                <ul className="space-y-1 mb-3">
                  {colonnes.length === 0 && <p className="text-gray-500">Aucune colonne</p>}
                  {colonnes.map((col) => (
                    <li key={col.id_mc} className="p-2 border rounded bg-white">
                      {col.ordre}. <strong>{col.label}</strong> ({col.type_input_mc})
                    </li>
                  ))}
                </ul>

                {/* Formulaire ajout colonne */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Label"
                    className="flex-1 p-2 border rounded"
                  />
                  <select
                    value={typeInput}
                    onChange={(e) => setTypeInput(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="">Type input</option>
                    <option value="text">Texte</option>
                    <option value="number">Nombre</option>
                    <option value="date">Date</option>
                    <option value="time">Heure</option>
                  </select>
                  <input
                    type="number"
                    value={ordre}
                    onChange={(e) => setOrdre(e.target.value)}
                    placeholder="Ordre"
                    className="w-24 p-2 border rounded"
                  />
                  <button
                    onClick={ajouterColonne}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MethodeManager;
