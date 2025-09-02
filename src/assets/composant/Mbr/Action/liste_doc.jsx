import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ListeDocument = () => {
  const { id_mbr } = useParams();
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({ liste: "", num_doc: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⚡ Récupération infos user connecté
  const user = JSON.parse(localStorage.getItem("user"));
  const id_uti = user?.id_uti;
  const token = localStorage.getItem("token");

  // Récupération des documents avec le nom de l'utilisateur
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/liste_document/afficheDocument/${id_mbr}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // si tes routes sont protégées
        }
      );
      setDocuments(res.data);
    } catch (err) {
      console.error("❌ Erreur récupération documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [id_mbr]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!id_uti) {
        alert("Utilisateur non connecté !");
        return;
      }

      if (editId) {
        // modification
        await axios.put(
          `http://localhost:3000/api/liste_document/modifierDocument/${editId}`,
          { ...formData, id_uti, id_mbr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // ajout
        await axios.post(
          "http://localhost:3000/api/liste_document/ajoutDocument",
          { ...formData, id_uti, id_mbr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setFormData({ liste: "", num_doc: "" });
      setEditId(null);
      fetchDocuments();
    } catch (err) {
      console.error("❌ Erreur enregistrement:", err);
    }
  };

  const handleEdit = (doc) => {
    setFormData({ liste: doc.liste, num_doc: doc.num_doc });
    setEditId(doc.id_list);
  };

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-4">
        📑 Liste des documents du MBR {id_mbr}
      </h2>

      {/* Formulaire ajout/modif */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-4 rounded-lg shadow-md mb-6"
      >
        <input
          type="text"
          name="liste"
          placeholder="Nom du document"
          value={formData.liste}
          onChange={handleChange}
          required
          className="p-2 rounded mr-2 text-black"
        />
        <input
          type="text"
          name="num_doc"
          placeholder="Numéro du document"
          value={formData.num_doc}
          onChange={handleChange}
          required
          className="p-2 rounded mr-2 text-black"
        />
        <button
          type="submit"
          className={`${
            editId ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
          } px-4 py-2 rounded`}
        >
          {editId ? "Modifier" : "Ajouter"}
        </button>
      </form>

      {/* Tableau documents */}
      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-700">
              <th className="border border-gray-600 px-3 py-2">ID</th>
              <th className="border border-gray-600 px-3 py-2">Nom</th>
              <th className="border border-gray-600 px-3 py-2">Numéro</th>
              <th className="border border-gray-600 px-3 py-2">Utilisateur</th>
              <th className="border border-gray-600 px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id_list} className="text-center">
                <td className="border border-gray-600 px-3 py-2">{doc.id_list}</td>
                <td className="border border-gray-600 px-3 py-2">{doc.liste}</td>
                <td className="border border-gray-600 px-3 py-2">{doc.num_doc}</td>
                <td className="border border-gray-600 px-3 py-2">{doc.nom_uti}</td>
                <td className="border border-gray-600 px-3 py-2">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-gray-400">
                  Aucun document trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListeDocument;
