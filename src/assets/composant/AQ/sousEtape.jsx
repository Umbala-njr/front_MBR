import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SousEtapeByEtape = () => {
  const { id_eta, id_peta, id_atelier } = useParams();

  const [sousEtapes, setSousEtapes] = useState([]);
  const [nomPeta, setNomPeta] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [appareils, setAppareils] = useState([]);
  const [colonnes, setColonnes] = useState([]);

  const [form, setForm] = useState({
    id_peta: id_peta,
    parametre: "",
    appareil: "",
    unite: "",
    tolerence: "",
    criticite: "",
    valeur_std: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // === Fetch Data ===
  const fetchSousEtapes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/sous_etape/sous_etape/${id_eta}/${id_peta}`
      );
      setSousEtapes(res.data || []);
      if (res.data?.length > 0) {
        setNomPeta(res.data[0].nom_peta || "");
      }
    } catch (error) {
      console.error("Erreur lors du fetch sous-étapes :", error);
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

  // === Handlers ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-green-800 text-white p-6">
          <h2 className="text-2xl font-bold">
            Ajout paramètre par sous étape n°{id_peta}
          </h2>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
              {showForm ? "Annuler" : "Ajouter Paramètre"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleAdd}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 p-6 rounded-lg mb-6"
            >
              <div className="flex flex-col">
                <label className="text-green-800 font-semibold mb-2">
                  Paramètre
                </label>
                <input
                  name="parametre"
                  value={form.parametre}
                  onChange={handleChange}
                  required
                  className="border border-green-300 p-2 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-green-800 font-semibold mb-2">
                  Appareil
                </label>
                <select
                  name="appareil"
                  value={form.appareil}
                  onChange={handleChange}
                  required
                  className="border border-green-300 p-2 rounded-md"
                >
                  <option value="">-- Sélectionner un appareil --</option>
                  {appareils.map((app) => (
                    <option key={app.id_app} value={app.nom_app}>
                      {app.nom_app}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-green-800 font-semibold mb-2">
                  Unité
                </label>
                <input
                  name="unite"
                  value={form.unite}
                  onChange={handleChange}
                  required
                  className="border border-green-300 p-2 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-green-800 font-semibold mb-2">
                  Tolérance
                </label>
                <input
                  name="tolerence"
                  value={form.tolerence}
                  onChange={handleChange}
                  className="border border-green-300 p-2 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-green-800 font-semibold mb-2">
                  Criticité
                </label>
                <input
                  name="criticite"
                  value={form.criticite}
                  onChange={handleChange}
                  required
                  className="border border-green-300 p-2 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-green-800 font-semibold mb-2">
                  Valeur Std
                </label>
                <input
                  name="valeur_std"
                  value={form.valeur_std}
                  onChange={handleChange}
                  required
                  className="border border-green-300 p-2 rounded-md"
                />
              </div>
             <div className="flex flex-col">
                <label className="text-green-800 font-semibold mb-2">
                  Type Input
                </label>
                <select
                  name="type_input"
                  value={form.type_input}
                  onChange={handleChange}
                  required
                  className="border border-green-300 p-2 rounded-md"
                >
                  <option value="">-- Sélectionner un type --</option>
                  <option value="text">Texte</option>
                  <option value="number">Nombre</option>
                  <option value="date">Date</option>
                  <option value="time">Heure</option>
                </select>
              </div>


              <button
                type="submit"
                className="md:col-span-3 bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800"
              >
                Ajouter
              </button>
            </form>
          )}

          {/* === Tableau === */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Étape</th>
                  <th className="px-4 py-3">Paramètre</th>
                  <th className="px-4 py-3">Appareil</th>
                  <th className="px-4 py-3">Unité</th>
                  <th className="px-4 py-3">Tolérance</th>
                  <th className="px-4 py-3">Criticité</th>
                  <th className="px-4 py-3">Valeur Std</th>
                  <th className="px-4 py-3">Type Input</th>
                  {colonnes.map((c) => (
                    <th key={c.id_col} className="px-4 py-3">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {sousEtapes.length > 0 ? (
                  sousEtapes.map((sous) => (
                    <tr
                      key={sous.id_sous}
                      className="border-b border-green-200 hover:bg-green-50"
                    >
                      <td className="px-4 py-3">{sous.id_sous}</td>
                      <td className="px-4 py-3">
                        {sous.nom_peta || nomPeta || "-"}
                      </td>

                      {editingId === sous.id_sous ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              name="parametre"
                              value={editData.parametre}
                              onChange={handleEditChange}
                              className="w-full border rounded p-2"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              name="appareil"
                              value={editData.appareil}
                              onChange={handleEditChange}
                              className="w-full border rounded p-2"
                            >
                              <option value="">-- Choisir --</option>
                              {appareils.map((app) => (
                                <option
                                  key={app.id_app}
                                  value={app.nom_app}
                                >
                                  {app.nom_app}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              name="unite"
                              value={editData.unite}
                              onChange={handleEditChange}
                              className="w-full border rounded p-2"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              name="tolerence"
                              value={editData.tolerence}
                              onChange={handleEditChange}
                              className="w-full border rounded p-2"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              name="criticite"
                              value={editData.criticite}
                              onChange={handleEditChange}
                              className="w-full border rounded p-2"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              name="valeur_std"
                              value={editData.valeur_std}
                              onChange={handleEditChange}
                              className="w-full border rounded p-2"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select
                              name="type_input"
                              value={editData.type_input}
                              onChange={handleEditChange}
                              className="w-full border rounded p-2"
                            >
                              <option value="">-- Choisir --</option>
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
                                className="w-full border rounded p-1"
                              />
                            </td>
                          ))}

                          <td className="px-4 py-3 space-x-2">
                            <button
                              onClick={() => handleSave(sous.id_sous)}
                              className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                              Enregistrer
                            </button>
                            <button
                              onClick={handleCancel}
                              className="bg-gray-500 text-white px-3 py-1 rounded"
                            >
                              Annuler
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">{sous.parametre}</td>
                          <td className="px-4 py-3">{sous.appareil}</td>
                          <td className="px-4 py-3">{sous.unite}</td>
                          <td className="px-4 py-3">{sous.tolerence || "-"}</td>
                          <td className="px-4 py-3">{sous.criticite}</td>
                          <td className="px-4 py-3">{sous.valeur_std}</td>
                          <td className="px-4 py-3">{sous.type_input || "-"}</td>

                          {colonnes.map((c) => (
                            <td key={c.id_col} className="px-4 py-3">
                              {sous.colonnes?.[c.id_col]?.valeur || "-"}
                            </td>
                          ))}

                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleEdit(sous)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
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
                      colSpan={8 + colonnes.length}
                      className="text-center py-6 text-green-800 font-semibold"
                    >
                      Aucune sous-étape trouvée pour cette étape.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SousEtapeByEtape;
