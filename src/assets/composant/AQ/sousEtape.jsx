import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SousEtapeByEtape = () => {
  const { id_eta } = useParams();
  const [sousEtapes, setSousEtapes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    etape: '',
    parametre: '',
    appareil: '',
    unite: '',
    tolerence: '',
    criticite: '',
    valeur_std: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editRow, setEditRow] = useState({});

  const fetchSousEtapes = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/sous_etape/sous_etape/${id_eta}`);
      setSousEtapes(res.data);
    } catch (error) {
      console.error('Erreur lors du fetch :', error);
    }
  };

  useEffect(() => {
    if (id_eta) fetchSousEtapes();
  }, [id_eta]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = { ...form, id_eta };
      await axios.post('http://localhost:3000/api/sous_etape/ajoutsousEtape', dataToSend);
      setForm({ etape: '', parametre: '', appareil: '', unite: '', tolerence: '', criticite: '', valeur_std: '' });
      setShowForm(false);
      fetchSousEtapes();
    } catch (error) {
      console.error('Erreur lors de l\'ajout :', error);
    }
  };

  const handleEditChange = (e, field) => {
    setEditRow((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleEdit = (sous) => {
    setEditingId(sous.id_sous);
    setEditRow({ ...sous });
  };

  const handleSave = async (id_sous) => {
    try {
      const dataToSend = { ...editRow, id_eta };
      await axios.put(`http://localhost:3000/api/sous_etape/modifiersousEtape/${id_sous}`, dataToSend);
      setEditingId(null);
      setEditRow({});
      fetchSousEtapes();
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-green-800 text-white p-6">
          <h2 className="text-2xl font-bold">
            Sous-Étapes de l'étape n°{id_eta}
          </h2>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                setShowForm(!showForm);
                setForm({ etape: '', parametre: '', appareil: '', unite: '', tolerence: '', criticite: '', valeur_std: '' });
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              {showForm ? 'Annuler' : 'Ajouter une sous-étape'}
            </button>
          </div>

          {showForm && (
            <form 
              onSubmit={handleAdd} 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 p-6 rounded-lg mb-6"
            >
              {['etape', 'parametre', 'appareil', 'unite', 'tolerence', 'criticite', 'valeur_std'].map((field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-green-800 font-semibold mb-2 capitalize">
                    {field.replace('_', ' ')}
                  </label>
                  <input
                    name={field}
                    placeholder={`Entrez le ${field}`}
                    value={form[field]}
                    onChange={handleChange}
                    required
                    className="border border-green-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="md:col-span-3 bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Ajouter la sous-étape
              </button>
            </form>
          )}

          {sousEtapes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-green-100">
                  <tr>
                    {['Num', 'Étape', 'Paramètre', 'Appareil', 'Unité', 'Tolérance', 'Criticité', 'Valeur Std', 'Action'].map((header) => (
                      <th 
                        key={header} 
                        className="px-4 py-3 text-left text-green-800 font-semibold uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sousEtapes.map((sous) => (
                    <tr 
                      key={sous.id_sous} 
                      className="border-b border-green-200 hover:bg-green-50 transition duration-200"
                    >
                      <td className="px-4 py-3">{sous.id_sous}</td>
                      {editingId === sous.id_sous ? (
                        <>
                          {['etape', 'parametre', 'appareil', 'unite', 'tolerence', 'criticite', 'valeur_std'].map((field) => (
                            <td key={field} className="px-4 py-3">
                              <input
                                name={field}
                                value={editRow[field]}
                                onChange={(e) => handleEditChange(e, field)}
                                className="w-full border border-green-300 rounded p-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                              />
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleSave(sous.id_sous)}
                              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                            >
                              Enregistrer
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3">{sous.etape}</td>
                          <td className="px-4 py-3">{sous.parametre}</td>
                          <td className="px-4 py-3">{sous.appareil}</td>
                          <td className="px-4 py-3">{sous.unite}</td>
                          <td className="px-4 py-3">{sous.tolerence}</td>
                          <td className="px-4 py-3">{sous.criticite}</td>
                          <td className="px-4 py-3">{sous.valeur_std}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleEdit(sous)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                            >
                              Modifier
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-green-50 rounded-lg">
              <p className="text-green-800 font-semibold">
                Aucune sous-étape n'a été trouvée pour cette étape.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SousEtapeByEtape;