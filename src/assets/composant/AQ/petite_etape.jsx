// src/production/Admin/PetitEtapeManager.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit2, Save, X, Settings } from 'lucide-react';

const PetitEtapeManager = () => {
  const { id_atelier, id_eta } = useParams();
  const [petitesEtapes, setPetitesEtapes] = useState([]);
  const [newNom, setNewNom] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNom, setEditNom] = useState('');
  const [colonnes, setColonnes] = useState({});

  // États pour ajout colonne
  const [colData, setColData] = useState({ code: '', label: '', type_input: '', ordre: '' });
  const [openFormId, setOpenFormId] = useState(null);
  
  // États pour édition colonne
  const [editingColId, setEditingColId] = useState(null);
  const [editColData, setEditColData] = useState({
    code: "",
    label: "",
    type_input: "",
    ordre: "",
  });

  const navigate = useNavigate();

  // Charger les petites étapes
  const fetchEtapes = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/petite_etape/affichepetitEtapebyeta/${id_eta}`);
      setPetitesEtapes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fonction pour charger les colonnes d'une petite étape
  const fetchColonnes = async (id_peta) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/colonne/listecolonne1/${id_peta}`);
      setColonnes((prev) => ({ ...prev, [id_peta]: res.data }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEtapes();
  }, [id_eta]);

  // Ajouter une nouvelle petite étape
  const handleAdd = async () => {
    if (!newNom.trim()) return;
    try {
      await axios.post('http://localhost:3000/api/petite_etape/ajoutPetitEtape', {
        nom_peta: newNom,
        id_eta: id_eta,
      });
      setNewNom('');
      fetchEtapes();
    } catch (err) {
      console.error(err);
    }
  };

  // Modifier une petite étape
  const handleUpdate = async (id_peta) => {
    try {
      await axios.put(`http://localhost:3000/api/petite_etape/modifierPetitEtape/${id_peta}`, {
        nom_peta: editNom,
      });
      setEditingId(null);
      setEditNom('');
      fetchEtapes();
    } catch (err) {
      console.error(err);
    }
  };

  // Ajouter une colonne
  const handleAddColonne = async (id_peta) => {
    try {
      await axios.post("http://localhost:3000/api/colonne/ajouter", {
        id_peta,
        ...colData,
      });
      setColData({ code: '', label: '', type_input: '', ordre: '' });
      setOpenFormId(null);
      fetchColonnes(id_peta);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Modifier une colonne (fonction du premier code)
  const handleUpdateColonne = async (id_col, id_peta) => {
    try {
      await axios.put(
        `http://localhost:3000/api/colonne/modifier/${id_col}`,
        editColData
      );
      setEditingColId(null);
      setEditColData({ code: "", label: "", type_input: "", ordre: "" });
      fetchColonnes(id_peta);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Activer / désactiver une colonne (fonction du premier code)
  const handleToggleColonne = async (id_col, statut, id_peta) => {
    try {
      await axios.put(`http://localhost:3000/api/colonne/toggle/${id_col}`, {
        statut,
      });
      fetchColonnes(id_peta);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 mb-8 border border-white/20">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            Gestion des Petites Étapes
          </h1>
          <p className="text-green-100 text-sm sm:text-base opacity-90">
            Organisez et gérez vos petites étapes de production
          </p>
        </div>

        {/* Form d'ajout étape */}
        <div className="bg-white/15 backdrop-blur-md rounded-xl p-6 mb-8 border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4">
            Ajouter une nouvelle étape
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newNom}
              onChange={(e) => setNewNom(e.target.value)}
              placeholder="Nom de la petite étape"
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-green-100/70 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
            />
            <button
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
          </div>
        </div>

        {/* Liste des étapes */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h2 className="text-lg font-semibold text-white">
              Petites Étapes ({petitesEtapes.length})
            </h2>
          </div>

          {petitesEtapes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-green-100/60 text-lg mb-2">Aucune petite étape</div>
              <p className="text-green-100/40 text-sm">
                Commencez par ajouter votre première petite étape
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {petitesEtapes.map((etape) => (
                <div
                  key={etape.id_peta}
                  className="p-4 sm:p-6 hover:bg-white/5 transition-colors duration-200"
                >
                  {/* Édition */}
                  {editingId === etape.id_peta ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={editNom}
                        onChange={(e) => setEditNom(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(etape.id_peta)}
                          className="bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2"
                        >
                          <Save size={18} /> <span>Enregistrer</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditNom('');
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg flex items-center gap-2 border border-white/20"
                        >
                          <X size={18} /> <span>Annuler</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-white font-medium text-lg">{etape.nom_peta}</h3>
                          <p className="text-green-100/70 text-sm mt-1">ID: {etape.id_peta}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(etape.id_peta);
                              setEditNom(etape.nom_peta);
                            }}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 border border-white/20"
                          >
                            <Edit2 size={16} /> <span>Modifier</span>
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/AQ/ajout-parametre/${id_atelier}/${id_eta}/${etape.id_peta}`)
                            }
                            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                          >
                            <Settings size={16} /> <span>Paramètre</span>
                          </button>
                          <button
                            onClick={() => {
                              const newOpenId = openFormId === etape.id_peta ? null : etape.id_peta;
                              setOpenFormId(newOpenId);
                              if (newOpenId) {
                                fetchColonnes(etape.id_peta);
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md"
                          >
                            <Plus size={16} /> <span>Colonne</span>
                          </button>
                        </div>
                      </div>

                      {openFormId === etape.id_peta && (
                        <div className="mt-4 p-4 bg-white/10 rounded-lg">
                          <h4 className="text-white font-semibold mb-3">Ajouter une colonne</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                            <input
                              type="text"
                              placeholder="Code"
                              value={colData.code}
                              onChange={(e) => setColData({ ...colData, code: e.target.value })}
                              className="px-3 py-2 rounded-lg bg-white/20 text-white"
                            />
                            <input
                              type="text"
                              placeholder="Label"
                              value={colData.label}
                              onChange={(e) => setColData({ ...colData, label: e.target.value })}
                              className="px-3 py-2 rounded-lg bg-white/20 text-white"
                            />
                            <select
                              value={colData.type_input}
                              onChange={(e) => setColData({ ...colData, type_input: e.target.value })}
                              className="px-3 py-2 rounded-lg bg-white/20 text-black"
                            >
                              <option value="">-- Type de champ --</option>
                              <option value="text">Texte</option>
                              <option value="number">Nombre</option>
                              <option value="date">Date</option>
                              <option value="time">Heure</option>                         
                            </select>
                            <input
                              type="number"
                              placeholder="Ordre"
                              value={colData.ordre}
                              onChange={(e) => setColData({ ...colData, ordre: e.target.value })}
                              className="px-3 py-2 rounded-lg bg-white/20 text-white"
                            />
                          </div>
                          <button
                            onClick={() => handleAddColonne(etape.id_peta)}
                            className="mt-3 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                          >
                            <Save size={16} /> <span>Enregistrer</span>
                          </button>
                        </div>
                      )}

                      {/* Affichage des colonnes existantes */}
                      {colonnes[etape.id_peta] && colonnes[etape.id_peta].length > 0 && (
                        <div className="mt-4 bg-white/10 p-3 rounded-lg">
                          <h5 className="text-white font-semibold mb-2">Colonnes existantes</h5>
                          <div className="grid grid-cols-5 gap-2 text-green-100 text-sm mb-2 border-b border-white/20 pb-2">
                            <div className="font-medium">Code</div>
                            <div className="font-medium">Label</div>
                            <div className="font-medium">Type</div>
                            <div className="font-medium">Ordre</div>
                            <div className="font-medium">Actions</div>
                          </div>
                          
                          {colonnes[etape.id_peta].map((col) => (
                            <div key={col.id_col} className="grid grid-cols-5 gap-2 items-center py-2 border-b border-white/10">
                              {editingColId === col.id_col ? (
                                <>
                                  <input
                                    type="text"
                                    value={editColData.code}
                                    onChange={(e) =>
                                      setEditColData({
                                        ...editColData,
                                        code: e.target.value,
                                      })
                                    }
                                    className="px-2 py-1 rounded bg-white/20 text-white"
                                  />
                                  <input
                                    type="text"
                                    value={editColData.label}
                                    onChange={(e) =>
                                      setEditColData({
                                        ...editColData,
                                        label: e.target.value,
                                      })
                                    }
                                    className="px-2 py-1 rounded bg-white/20 text-white"
                                  />
                                  <select
                                    value={editColData.type_input}
                                    onChange={(e) =>
                                      setEditColData({
                                        ...editColData,
                                        type_input: e.target.value,
                                      })
                                    }
                                    className="px-2 py-1 rounded bg-white/20 text-black"
                                  >
                                    <option value="text">Texte</option>
                                    <option value="number">Nombre</option>
                                    <option value="date">Date</option>
                                    <option value="time">Heure</option>
                                  </select>
                                  <input
                                    type="number"
                                    value={editColData.ordre}
                                    onChange={(e) =>
                                      setEditColData({
                                        ...editColData,
                                        ordre: e.target.value,
                                      })
                                    }
                                    className="px-2 py-1 rounded bg-white/20 text-white"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleUpdateColonne(col.id_col, etape.id_peta)}
                                      className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                      Enregistrer
                                    </button>
                                    <button
                                      onClick={() => setEditingColId(null)}
                                      className="bg-gray-500 hover:bg-gray-400 text-white px-2 py-1 rounded text-xs"
                                    >
                                      Annuler
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>{col.code}</div>
                                  <div>{col.label}</div>
                                  <div>{col.type_input}</div>
                                  <div>{col.ordre}</div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingColId(col.id_col);
                                        setEditColData({
                                          code: col.code,
                                          label: col.label,
                                          type_input: col.type_input,
                                          ordre: col.ordre,
                                        });
                                      }}
                                      className="text-blue-400 hover:text-blue-200 text-sm"
                                    >
                                      Modifier
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleToggleColonne(
                                          col.id_col,
                                          col.statut === 1 ? 0 : 1,
                                          etape.id_peta
                                        )
                                      }
                                      className={`${
                                        col.statut === 1
                                          ? "text-red-400 hover:text-red-200"
                                          : "text-green-400 hover:text-green-200"
                                      } text-sm`}
                                    >
                                      {col.statut === 1 ? "Désactiver" : "Activer"}
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer stats */}
        <div className="mt-8 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-green-100/80 text-sm">
            <span>Total des petites étapes: {petitesEtapes.length}</span>
            <span>Atelier ID: {id_atelier} • Étape ID: {id_eta}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetitEtapeManager;