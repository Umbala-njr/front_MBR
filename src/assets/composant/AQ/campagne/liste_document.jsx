import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ import useNavigate
import axios from "axios";

const ListeDocumentCamp = () => {
  const { id_camp } = useParams(); 
  const navigate = useNavigate(); // ✅ pour redirection
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({ nom_doc: "", num_doc: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // User connecté
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); 
  const id_uti = user?.id_uti;

  // Récupérer documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/documentCamp/documentcamp/${id_camp}`,
        { headers: { Authorization: `Bearer ${token}` } }
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
  }, [id_camp]);

  // Inputs texte
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fichier
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Soumettre
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier");
      return;
    }

    try {
      const data = new FormData();
      data.append("nom_doc", formData.nom_doc);
      data.append("num_doc", formData.num_doc);
      data.append("id_camp", id_camp);
      data.append("fichier", selectedFile);

      await axios.post("http://localhost:3000/api/documentCamp/ajout", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({ nom_doc: "", num_doc: "" });
      setSelectedFile(null);
      document.getElementById("fileInput").value = "";

      fetchDocuments();
    } catch (err) {
      console.error("❌ Erreur enregistrement:", err);
    }
  };

  // Voir fichier
  const handleView = (id_doc) => {
    window.open(
      `http://localhost:3000/api/documentCamp/read/${id_doc}`,
      "_blank"
    );
  };

  // Télécharger
  const handleDownload = (filename) => {
    window.open(
      `http://localhost:3000/uploads/DocumentCampagne/${filename}`,
      "_blank"
    );
  };

  // ✅ Valider + Archiver + Redirection
  const handleValidation = async () => {
    if (!id_uti) {
      alert("Utilisateur non reconnu !");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/campagne/validation",
        { id_camp, id_uti },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(res.data.message || "Validation effectuée ✅");

      // ✅ Redirection vers la liste des campagnes terminées
      navigate("/AQ/campagneBR/terminer");
    } catch (err) {
      console.error("❌ Erreur validation:", err);
      alert("Erreur lors de la validation");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* ✅ Bouton validation en haut */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleValidation}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded shadow-md"
        >
          ✅ Valider et Archiver la Campagne
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6">
        📑 Documents liés à la campagne {id_camp}
      </h2>

      {/* Formulaire upload */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          type="text"
          name="nom_doc"
          placeholder="Nom du document"
          value={formData.nom_doc}
          onChange={handleChange}
          required
          className="p-2 rounded text-black"
        />
        <input
          type="text"
          name="num_doc"
          placeholder="Numéro du document"
          value={formData.num_doc}
          onChange={handleChange}
          required
          className="p-2 rounded text-black"
        />
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          required
          className="p-2 rounded text-white"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </form>

      {/* Tableau documents */}
      {loading ? (
        <p className="text-gray-400">⏳ Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-700 text-left">
                <th className="px-4 py-2 border-b border-gray-600">ID</th>
                <th className="px-4 py-2 border-b border-gray-600">Nom</th>
                <th className="px-4 py-2 border-b border-gray-600">Numéro</th>
                <th className="px-4 py-2 border-b border-gray-600">Fichier</th>
                <th className="px-4 py-2 border-b border-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id_doc}
                  className="hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-2 border-b border-gray-700">
                    {doc.id_doc}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {doc.nom_doc}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {doc.num_doc}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {doc.fichier}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 flex gap-2">
                    <button
                      onClick={() => handleView(doc.id_doc)}
                      className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Voir
                    </button>
                    <button
                      onClick={() => handleDownload(doc.fichier)}
                      className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Télécharger
                    </button>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-400">
                    Aucun document trouvé 📭
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListeDocumentCamp;
