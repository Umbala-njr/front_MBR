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

  // États pour ajout colonne
  const [colData, setColData] = useState({ code: '', label: '', type_input: '', ordre: '' });
  const [openFormId, setOpenFormId] = useState(null);

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

  useEffect(() => {
    fetchEtapes();
  }, [id_eta]);

  const [colonnes, setColonnes] = useState({});

// Fonction pour charger les colonnes d’une petite étape
const fetchColonnes = async (id_peta) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/colonne/listecolonne/${id_peta}`);
    setColonnes((prev) => ({ ...prev, [id_peta]: res.data }));
  } catch (err) {
    console.error(err);
  }
};

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
      fetchColonnes(id_peta);
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
      alert("Colonne ajoutée avec succès !");
      setColData({ code: '', label: '', type_input: '', ordre: '' });
      setOpenFormId(null);
      fetchColonnes(id_peta);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’ajout de la colonne");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-green-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
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
                              fetchColonnes(etape.id_peta); // Charger les colonnes quand on ouvre
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

                            {/* Liste déroulante pour type_input */}
                            <select
                              value={colData.type_input}
                              onChange={(e) => setColData({ ...colData, type_input: e.target.value })}
                              className="px-3 py-2 rounded-lg bg-white/20 text-black,"
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
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-green-100 text-sm">
                            <div className="font-medium">Code</div>
                            <div className="font-medium">Label</div>
                            <div className="font-medium">Type</div>
                            <div className="font-medium">Ordre</div>
                            <div className="font-medium">Actions</div>

                            {colonnes[etape.id_peta].map((col) => (
                              <React.Fragment key={col.id_col}>
                                <div>{col.code}</div>
                                <div>{col.label}</div>
                                <div>{col.type_input}</div>
                                <div>{col.ordre}</div>
                                <div>
                                  {/* Ici tu pourras ajouter un bouton modifier/supprimer plus tard */}
                                  <button className="text-green-400 hover:text-green-200">Modifier</button>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
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
