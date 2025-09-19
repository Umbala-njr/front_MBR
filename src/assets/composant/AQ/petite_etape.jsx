// src/production/Admin/PetitEtapeManager.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit2, Save, X, Settings, ChevronDown, ChevronUp, Trash2, Columns, Eye, EyeOff, ArrowLeft } from 'lucide-react';

const PetitEtapeManager = () => {
  const { id_atelier, id_eta } = useParams();
  const [petitesEtapes, setPetitesEtapes] = useState([]);
  const [newNom, setNewNom] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNom, setEditNom] = useState('');
  const [colonnes, setColonnes] = useState({});
  const [expandedEtapes, setExpandedEtapes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

  // Afficher les messages temporairement
  const showMessage = (message, type = 'success') => {
    if (type === 'success') {
      setSuccess(message);
    } else {
      setError(message);
    }
    
    setTimeout(() => {
      if (type === 'success') {
        setSuccess(null);
      } else {
        setError(null);
      }
    }, 3000);
  };

  // Charger les petites étapes
  const fetchEtapes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/petite_etape/affichepetitEtapebyeta/${id_eta}`);
      setPetitesEtapes(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des étapes');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les colonnes d'une petite étape
  const fetchColonnes = async (id_peta) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/colonne/listecolonne1/${id_peta}`);
      setColonnes((prev) => ({ ...prev, [id_peta]: res.data }));
    } catch (err) {
      console.error(err);
      showMessage('Erreur lors du chargement des colonnes', 'error');
    }
  };

  useEffect(() => {
    fetchEtapes();
  }, [id_eta]);

  // Basculer l'affichage des détails d'une étape
  const toggleEtapeDetails = async (id_peta) => {
    const newExpandedState = !expandedEtapes[id_peta];
    setExpandedEtapes({ ...expandedEtapes, [id_peta]: newExpandedState });
    
    if (newExpandedState) {
      await fetchColonnes(id_peta);
    }
  };

  // Ajouter une nouvelle petite étape
  const handleAdd = async () => {
    if (!newNom.trim()) {
      showMessage('Veuillez saisir un nom pour l\'étape', 'error');
      return;
    }
    
    try {
      await axios.post('http://localhost:3000/api/petite_etape/ajoutPetitEtape', {
        nom_peta: newNom,
        id_eta: id_eta,
      });
      setNewNom('');
      fetchEtapes();
      showMessage('Étape ajoutée avec succès');
    } catch (err) {
      console.error(err);
      showMessage('Erreur lors de l\'ajout de l\'étape', 'error');
    }
  };

  // Modifier une petite étape
  const handleUpdate = async (id_peta) => {
    if (!editNom.trim()) {
      showMessage('Le nom ne peut pas être vide', 'error');
      return;
    }
    
    try {
      await axios.put(`http://localhost:3000/api/petite_etape/modifierPetitEtape/${id_peta}`, {
        nom_peta: editNom,
      });
      setEditingId(null);
      setEditNom('');
      fetchEtapes();
      showMessage('Étape modifiée avec succès');
    } catch (err) {
      console.error(err);
      showMessage('Erreur lors de la modification', 'error');
    }
  };


  // Ajouter une colonne
  const handleAddColonne = async (id_peta) => {
    if (!colData.code || !colData.label || !colData.type_input) {
      showMessage('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }
    
    try {
      await axios.post("http://localhost:3000/api/colonne/ajouter", {
        id_peta,
        ...colData,
      });
      setColData({ code: '', label: '', type_input: '', ordre: '' });
      setOpenFormId(null);
      fetchColonnes(id_peta);
      showMessage('Colonne ajoutée avec succès');
    } catch (err) {
      console.error(err);
      showMessage('Erreur lors de l\'ajout de la colonne', 'error');
    }
  };

  // Modifier une colonne
  const handleUpdateColonne = async (id_col, id_peta) => {
    try {
      await axios.put(
        `http://localhost:3000/api/colonne/modifier/${id_col}`,
        editColData
      );
      setEditingColId(null);
      setEditColData({ code: "", label: "", type_input: "", ordre: "" });
      fetchColonnes(id_peta);
      showMessage('Colonne modifiée avec succès');
    } catch (err) {
      console.error(err);
      showMessage('Erreur lors de la modification de la colonne', 'error');
    }
  };

  // Activer / désactiver une colonne
  const handleToggleColonne = async (id_col, statut, id_peta) => {
    try {
      await axios.put(`http://localhost:3000/api/colonne/toggle/${id_col}`, {
        statut,
      });
      fetchColonnes(id_peta);
      showMessage(`Colonne ${statut === 1 ? 'activée' : 'désactivée'} avec succès`);
    } catch (err) {
      console.error(err);
      showMessage('Erreur lors du changement de statut', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Messages d'alerte */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <X size={20} />
            </button>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span>{success}</span>
            <button onClick={() => setSuccess(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Header avec bouton de retour */}
        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-emerald-600 hover:text-emerald-800 mb-4 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Retour
              </button>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Gestion des Petites Étapes
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Organisez et gérez vos petites étapes de production
              </p>
            </div>
          </div>
        </div>

        {/* Form d'ajout étape */}
        <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Plus size={20} />
            Ajouter une nouvelle étape
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newNom}
              onChange={(e) => setNewNom(e.target.value)}
              placeholder="Nom de la petite étape"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              {loading ? 'Ajout...' : (
                <>
                  <Plus size={20} />
                  <span className="hidden sm:inline">Ajouter</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Liste des étapes */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Petites Étapes ({petitesEtapes.length})
            </h2>
            <div className="text-gray-600 text-sm">
              {petitesEtapes.length} élément{petitesEtapes.length !== 1 ? 's' : ''}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-gray-600 mt-2">Chargement des étapes...</p>
            </div>
          ) : petitesEtapes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 text-lg mb-2">Aucune petite étape</div>
              <p className="text-gray-400 text-sm">
                Commencez par ajouter votre première petite étape
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {petitesEtapes.map((etape) => (
                <div
                  key={etape.id_peta}
                  className="p-4 sm:p-6 hover:bg-gray-50 transition-colors duration-200"
                >
                  {/* Édition */}
                  {editingId === etape.id_peta ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={editNom}
                        onChange={(e) => setEditNom(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nom de l'étape"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdate(etape.id_peta)}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(etape.id_peta)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2"
                        >
                          <Save size={18} /> <span>Enregistrer</span>
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditNom('');
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg flex items-center gap-2 border border-gray-300"
                        >
                          <X size={18} /> <span>Annuler</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-gray-800 font-medium text-lg">{etape.nom_peta}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => toggleEtapeDetails(etape.id_peta)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg flex items-center gap-2 border border-gray-300 text-sm"
                          >
                            {expandedEtapes[etape.id_peta] ? (
                              <>
                                <ChevronUp size={16} /> <span>Réduire</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} /> <span>Détails</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(etape.id_peta);
                              setEditNom(etape.nom_peta);
                            }}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg flex items-center gap-2 text-sm border border-blue-200"
                          >
                            <Edit2 size={16} /> <span>Modifier</span>
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/AQ/ajout-parametre/${id_atelier}/${id_eta}/${etape.id_peta}`)
                            }
                            className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg flex items-center gap-2 text-sm border border-green-200"
                          >
                            <Settings size={16} /> <span>Paramètre</span>
                          </button>
                          <button
                            onClick={() => {
                              const newOpenId = openFormId === etape.id_peta ? null : etape.id_peta;
                              setOpenFormId(newOpenId);
                              if (newOpenId && !colonnes[etape.id_peta]) {
                                fetchColonnes(etape.id_peta);
                              }
                            }}
                            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 px-3 py-2 rounded-lg flex items-center gap-2 text-sm border border-indigo-200"
                          >
                            <Columns size={16} /> <span>Colonne</span>
                          </button>
                        </div>
                      </div>

                      {/* Section détails de l'étape (colonnes) */}
                      {expandedEtapes[etape.id_peta] && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <h4 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
                            <Columns size={18} />
                            Colonnes de cette étape
                            {colonnes[etape.id_peta] && (
                              <span className="text-gray-600 text-sm font-normal">
                                ({colonnes[etape.id_peta].length} colonne{colonnes[etape.id_peta].length !== 1 ? 's' : ''})
                              </span>
                            )}
                          </h4>

                          {openFormId === etape.id_peta && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="text-gray-800 font-semibold mb-3">Ajouter une colonne</h5>
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                <div>
                                  <label className="block text-gray-700 text-sm mb-1">Code *</label>
                                  <input
                                    type="text"
                                    placeholder="Code"
                                    value={colData.code}
                                    onChange={(e) => setColData({ ...colData, code: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-800"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-700 text-sm mb-1">Label *</label>
                                  <input
                                    type="text"
                                    placeholder="Label"
                                    value={colData.label}
                                    onChange={(e) => setColData({ ...colData, label: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-800"
                                  />
                                </div>
                                <div>
                                  <label className="block text-gray-700 text-sm mb-1">Type *</label>
                                  <select
                                    value={colData.type_input}
                                    onChange={(e) => setColData({ ...colData, type_input: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-800"
                                  >
                                    <option value="">-- Sélectionner --</option>
                                    <option value="text">Texte</option>
                                    <option value="number">Nombre</option>
                                    <option value="date">Date</option>
                                    <option value="time">Heure</option>                         
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-gray-700 text-sm mb-1">Ordre</label>
                                  <input
                                    type="number"
                                    placeholder="Ordre"
                                    value={colData.ordre}
                                    onChange={(e) => setColData({ ...colData, ordre: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-800"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <button
                                    onClick={() => handleAddColonne(etape.id_peta)}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                                  >
                                    <Save size={16} /> <span>Ajouter</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Affichage des colonnes existantes */}
                          {colonnes[etape.id_peta] && colonnes[etape.id_peta].length > 0 ? (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <div className="grid grid-cols-6 gap-2 text-gray-700 text-sm mb-2 border-b border-gray-300 pb-2 font-medium">
                                <div>Code</div>
                                <div>Label</div>
                                <div>Type</div>
                                <div>Ordre</div>
                                <div>Statut</div>
                                <div>Actions</div>
                              </div>
                              
                              {colonnes[etape.id_peta].map((col) => (
                                <div key={col.id_col} className="grid grid-cols-6 gap-2 items-center py-2 border-b border-gray-100">
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
                                        className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-800"
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
                                        className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-800"
                                      />
                                      <select
                                        value={editColData.type_input}
                                        onChange={(e) =>
                                          setEditColData({
                                            ...editColData,
                                            type_input: e.target.value,
                                          })
                                        }
                                        className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-800"
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
                                        className="px-2 py-1 rounded bg-white border border-gray-300 text-gray-800"
                                      />
                                      <div className="flex items-center">
                                        <span className={col.statut === 1 ? "text-green-600" : "text-red-600"}>
                                          {col.statut === 1 ? "Activé" : "Désactivé"}
                                        </span>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleUpdateColonne(col.id_col, etape.id_peta)}
                                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
                                        >
                                          Enregistrer
                                        </button>
                                        <button
                                          onClick={() => setEditingColId(null)}
                                          className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                                        >
                                          Annuler
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="font-medium">{col.code}</div>
                                      <div>{col.label}</div>
                                      <div>{col.type_input}</div>
                                      <div>{col.ordre}</div>
                                      <div className={col.statut === 1 ? "text-green-600" : "text-red-600"}>
                                        {col.statut === 1 ? "Activé" : "Désactivé"}
                                      </div>
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
                                          className="text-blue-600 hover:text-blue-800 text-sm"
                                          title="Modifier"
                                        >
                                          <Edit2 size={16} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleToggleColonne(
                                              col.id_col,
                                              col.statut === 1 ? 0 : 1,
                                              etape.id_peta
                                            )
                                          }
                                          className={col.statut === 1 ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}
                                          title={col.statut === 1 ? "Désactiver" : "Activer"}
                                        >
                                          {col.statut === 1 ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center p-4 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                              Aucune colonne définie pour cette étape
                            </div>
                          )}
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
        <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-gray-600 text-sm">
            <span>Total des petites étapes: {petitesEtapes.length}</span>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetitEtapeManager;