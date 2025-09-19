import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SousEtapeByEtape = () => {
  const { id_eta, id_peta, id_atelier } = useParams();

  const [sousEtapes, setSousEtapes] = useState([]);
  const [nomPeta, setNomPeta] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [appareils, setAppareils] = useState([]);
  const [colonnes, setColonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);

  const [form, setForm] = useState({
    id_peta: id_peta,
    parametre: "",
    appareil: "",
    unite: "",
    tolerence: "",
    criticite: "",
    valeur_std: "",
    type_input: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editSuggestions, setEditSuggestions] = useState([]);
  const [showEditSuggestions, setShowEditSuggestions] = useState(false);

  // === Fetch Data ===
  const fetchSousEtapes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/sous_etape/sous_etape/${id_eta}/${id_peta}`
      );
      setSousEtapes(res.data || []);
      if (res.data?.length > 0) {
        setNomPeta(res.data[0].nom_peta || "");
      }
    } catch (error) {
      console.error("Erreur lors du fetch sous-étapes :", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppareils = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/appareil/afficheAp/${id_atelier}`
      );
      setAppareils(res.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch appareils :", error);
    }
  };

  const fetchColonnes = async () => {
    if (!id_peta) return;
    try {
      const res = await axios.get(
        `http://localhost:3000/api/colonne/listecolonne/${id_peta}`
      );
      setColonnes(res.data || []);
    } catch (error) {
      console.error("Erreur lors du fetch colonnes :", error);
    }
  };

  useEffect(() => {
    if (id_eta) fetchSousEtapes();
  }, [id_eta]);

  useEffect(() => {
    if (id_atelier) fetchAppareils();
  }, [id_atelier]);

  useEffect(() => {
    fetchColonnes();
  }, [id_peta]);

  // Gestion du clic en dehors des suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowEditSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // === Handlers ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    if (name === "appareil") {
      if (value.length > 0) {
        const filteredSuggestions = appareils.filter(app => 
          app.nom_app.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (appareil) => {
    setForm((prev) => ({ ...prev, appareil: appareil.nom_app }));
    setShowSuggestions(false);
  };

  const handleEditAppareilChange = (e) => {
    const { value } = e.target;
    setEditData((prev) => ({ ...prev, appareil: value }));
    
    if (value.length > 0) {
      const filteredSuggestions = appareils.filter(app => 
        app.nom_app.toLowerCase().includes(value.toLowerCase())
      );
      setEditSuggestions(filteredSuggestions);
      setShowEditSuggestions(true);
    } else {
      setShowEditSuggestions(false);
    }
  };

  const handleEditSuggestionClick = (appareil) => {
    setEditData((prev) => ({ ...prev, appareil: appareil.nom_app }));
    setShowEditSuggestions(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/sous_etape/ajoutsousEtape",
        form
      );
      setForm({
        id_peta: id_peta,
        parametre: "",
        appareil: "",
        unite: "",
        tolerence: "",
        criticite: "",
        valeur_std: "",
        type_input: "",
      });
      setShowForm(false);
      fetchSousEtapes();
    } catch (error) {
      console.error("Erreur lors de l'ajout sous-étape :", error);
    }
  };

  const handleEdit = (sous) => {
    setEditingId(sous.id_sous);

    // ✅ Initialiser toutes les colonnes dynamiques pour éviter undefined
    const colonnesInit = {};
    colonnes.forEach((c) => {
      colonnesInit[c.id_col] = sous.colonnes?.[c.id_col] || { valeur: "" };
    });

    setEditData({
      parametre: sous.parametre,
      appareil: sous.appareil,
      unite: sous.unite,
      tolerence: sous.tolerence,
      criticite: sous.criticite,
      valeur_std: sous.valeur_std,
      type_input: sous.type_input || "",
      colonnes: colonnesInit,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColonneChange = (id_col, value) => {
    setEditData((prev) => ({
      ...prev,
      colonnes: {
        ...prev.colonnes,
        [id_col]: { valeur: value },
      },
    }));
  };

  const handleSave = async (id_sous) => {
    try {
      await axios.put(
        `http://localhost:3000/api/sous_etape/modifiersousEtape/${id_sous}`,
        editData
      );
      setEditingId(null);
      fetchSousEtapes();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  const handleCancel = () => setEditingId(null);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
          <h2 className="text-2xl font-bold">
            Gestion des paramètres - {nomPeta}
          </h2>
          <p className="text-green-100 mt-1">Ajouter et modifier les paramètres de cette étape</p>
        </div>

        <div className="p-6">
          {/* Add Button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300 shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              {showForm ? "Annuler" : "Ajouter Paramètre"}
            </button>
          </div>

          {/* Add Form */}
          {showForm && (
            <form
              onSubmit={handleAdd}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200 shadow-sm"
            >
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">
                  Paramètre *
                </label>
                <input
                  name="parametre"
                  value={form.parametre}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nom du paramètre"
                />
              </div>

              <div className="flex flex-col relative">
                <label className="text-gray-700 font-medium mb-2">
                  Appareil *
                </label>
                <input
                  name="appareil"
                  value={form.appareil}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Rechercher un appareil"
                  autoComplete="off"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div 
                    ref={suggestionRef}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto top-full"
                  >
                    {suggestions.map((app) => (
                      <div
                        key={app.id_app}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSuggestionClick(app)}
                      >
                        {app.nom_app}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">
                  Unité *
                </label>
                <input
                  name="unite"
                  value={form.unite}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Unité de mesure"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">
                  Tolérance
                </label>
                <input
                  name="tolerence"
                  value={form.tolerence}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Valeur de tolérance"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">
                  Criticité *
                </label>
                <input
                  name="criticite"
                  value={form.criticite}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Niveau de criticité"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">
                  Valeur Std *
                </label>
                <input
                  name="valeur_std"
                  value={form.valeur_std}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Valeur standard"
                />
              </div>
             
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-2">
                  Type Input *
                </label>
                <select
                  name="type_input"
                  value={form.type_input}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="text">Texte</option>
                  <option value="number">Nombre</option>
                  <option value="date">Date</option>
                  <option value="time">Heure</option>
                </select>
              </div>

              <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md transition duration-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Ajouter le paramètre
                </button>
              </div>
            </form>
          )}

          {/* Table Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-800">Liste des paramètres</h3>
              <p className="text-sm text-gray-600">{sousEtapes.length} paramètre(s) trouvé(s)</p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étape</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paramètre</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appareil</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unité</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tolérance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criticité</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur Std</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Input</th>
                      {colonnes.map((c) => (
                        <th key={c.id_col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {c.label}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sousEtapes.length > 0 ? (
                      sousEtapes.map((sous) => (
                        <tr
                          key={sous.id_sous}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700">{sous.id_sous}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {sous.nom_peta || nomPeta || "-"}
                          </td>

                          {editingId === sous.id_sous ? (
                            <>
                              <td className="px-4 py-3">
                                <input
                                  name="parametre"
                                  value={editData.parametre}
                                  onChange={handleEditChange}
                                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-green-500"
                                />
                              </td>
                              <td className="px-4 py-3 relative">
                                <input
                                  name="appareil"
                                  value={editData.appareil}
                                  onChange={handleEditAppareilChange}
                                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-green-500"
                                  autoComplete="off"
                                />
                                {showEditSuggestions && editSuggestions.length > 0 && (
                                  <div 
                                    ref={suggestionRef}
                                    className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto top-full"
                                  >
                                    {editSuggestions.map((app) => (
                                      <div
                                        key={app.id_app}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleEditSuggestionClick(app)}
                                      >
                                        {app.nom_app}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  name="unite"
                                  value={editData.unite}
                                  onChange={handleEditChange}
                                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-green-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  name="tolerence"
                                  value={editData.tolerence}
                                  onChange={handleEditChange}
                                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-green-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  name="criticite"
                                  value={editData.criticite}
                                  onChange={handleEditChange}
                                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-green-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  name="valeur_std"
                                  value={editData.valeur_std}
                                  onChange={handleEditChange}
                                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-green-500"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  name="type_input"
                                  value={editData.type_input}
                                  onChange={handleEditChange}
                                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-green-500"
                                >
                                  <option value="">Choisir</option>
                                  <option value="text">Texte</option>
                                  <option value="number">Nombre</option>
                                  <option value="date">Date</option>
                                  <option value="time">Heure</option>
                                </select>
                              </td>   

                              {colonnes.map((c) => (
                                <td key={c.id_col} className="px-4 py-3">
                                  <input
                                    type={c.type_input || "text"}
                                    value={
                                      editData.colonnes?.[c.id_col]?.valeur || ""
                                    }
                                    onChange={(e) =>
                                      handleColonneChange(c.id_col, e.target.value)
                                    }
                                    className="w-full border border-gray-300 rounded p-1 text-sm"
                                  />
                                </td>
                              ))}

                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleSave(sous.id_sous)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    Sauvegarder
                                  </button>
                                  <button
                                    onClick={handleCancel}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs flex items-center"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    Annuler
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-3 text-sm text-gray-700">{sous.parametre}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{sous.appareil}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{sous.unite}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{sous.tolerence || "-"}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{sous.criticite}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">{sous.valeur_std}</td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {sous.type_input || "-"}
                                </span>
                              </td>

                              {colonnes.map((c) => (
                                <td key={c.id_col} className="px-4 py-3 text-sm text-gray-700">
                                  {sous.colonnes?.[c.id_col]?.valeur || "-"}
                                </td>
                              ))}

                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleEdit(sous)}
                                  className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 px-3 py-1 rounded-md text-xs flex items-center transition-colors"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                  </svg>
                                  Modifier
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={9 + colonnes.length}
                          className="px-4 py-8 text-center text-sm text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p>Aucun paramètre trouvé pour cette étape.</p>
                            <p className="mt-1">Commencez par ajouter un nouveau paramètre.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SousEtapeByEtape;