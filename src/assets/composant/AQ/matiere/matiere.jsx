import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const MatiereManager = () => {
  const { code_fab } = useParams(); // Récupération du code_fab depuis l'URL
  const navigate = useNavigate();
  const [nomMat, setNomMat] = useState("");
  const [caractere, setCaractere] = useState("");
  const [matieres, setMatieres] = useState([]);
  const [error, setError] = useState("");
  

  // Fonction pour récupérer toutes les matières pour ce code_fab
 const fetchMatieres = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/matiere/${code_fab}`);
    // s'assurer que response.data est bien un tableau
    setMatieres(Array.isArray(response.data) ? response.data : []);
  } catch (err) {
    setError(err.response?.data?.error || "Erreur lors du chargement des matières");
  }
};


  useEffect(() => {
    fetchMatieres();
  }, [code_fab]);

  // Ajouter une matière
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("http://localhost:3000/api/matiere/ajoutermatiere", {
        nom_mat: nomMat,
        caractere: caractere,
        code_fab: code_fab,
      });
      setNomMat("");
      setCaractere("");
      fetchMatieres(); // Rafraîchir la liste après ajout
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'ajout");
    }
  };

  // Naviguer vers la gestion des tableaux pour une matière
  const handleGererTableaux = (id_mat) => {
    navigate(`/AQ/colonnematiere/${id_mat}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Matières pour Fabrication : {code_fab}</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block font-semibold">Nom Matière :</label>
          <input
            type="text"
            value={nomMat}
            onChange={(e) => setNomMat(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Caractère :</label>
          <input
            type="text"
            value={caractere}
            onChange={(e) => setCaractere(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Ajouter Matière
        </button>
      </form>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {Array.isArray(matieres) && matieres.map((matiere) => (
    <div key={matiere.id_mat} className="border rounded p-4 shadow-sm hover:shadow-md">
      <h3 className="font-bold text-lg">{matiere.nom_mat}</h3>
      <p><strong>Caractère :</strong> {matiere.caractere}</p>
      <p><strong>ID :</strong> {matiere.id_mat}</p>
      <button
        onClick={() => handleGererTableaux(matiere.id_mat)}
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Gérer Tableaux
      </button>
    </div>
  ))}
</div>
    </div>
  );
};

export default MatiereManager;
