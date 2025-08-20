import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ModeleEchantillon = () => {
  const { code_fab } = useParams(); // récupère le code_fab depuis l'URL
  const [echantillons, setEchantillons] = useState([]);
  const [formData, setFormData] = useState({
    nom_echan: "",
    stade: "",
    methode_echan: "",
    quantite_echan: "",
    unite: "",
    destination: "",
    demande: "",
    num_BA: "",
    code_echan: "",
    embalage: "",
    neutralisation_OH: "",
    ordre: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les modèles existants
  useEffect(() => {
    fetchEchantillons();
  }, [code_fab]);

  const fetchEchantillons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/echantillion/afficheModele/${code_fab}`
      );
      setEchantillons(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des modèles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gérer les changements d’input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/echantillion/creermodele", {
        ...formData,
        code_fab,
      });
      setFormData({
        nom_echan: "",
        stade: "",
        methode_echan: "",
        quantite_echan: "",
        unite: "",
        destination: "",
        demande: "",
        num_BA: "",
        code_echan: "",
        embalage: "",
        neutralisation_OH: "",
        ordre: "",
      });
      fetchEchantillons(); // recharge la liste
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'ajout du modèle");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Modèles d'échantillons – {code_fab}
      </h1>

      {/* Formulaire d’ajout */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          name="nom_echan"
          value={formData.nom_echan}
          onChange={handleChange}
          placeholder="Nom échantillon"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="stade"
          value={formData.stade}
          onChange={handleChange}
          placeholder="Stade"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="methode_echan"
          value={formData.methode_echan}
          onChange={handleChange}
          placeholder="Méthode"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="quantite_echan"
          value={formData.quantite_echan}
          onChange={handleChange}
          placeholder="Quantité"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="unite"
          value={formData.unite}
          onChange={handleChange}
          placeholder="Unité"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          placeholder="Destination"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="demande"
          value={formData.demande}
          onChange={handleChange}
          placeholder="Demande"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="num_BA"
          value={formData.num_BA}
          onChange={handleChange}
          placeholder="Num BA"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="code_echan"
          value={formData.code_echan}
          onChange={handleChange}
          placeholder="Code échantillon"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="embalage"
          value={formData.embalage}
          onChange={handleChange}
          placeholder="Emballage"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="neutralisation_OH"
          value={formData.neutralisation_OH}
          onChange={handleChange}
          placeholder="Neutralisation OH"
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="ordre"
          value={formData.ordre}
          onChange={handleChange}
          placeholder="Ordre"
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Ajouter
        </button>
      </form>

      {/* Liste affichage */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Liste des modèles</h2>
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : echantillons.length === 0 ? (
          <p>Aucun modèle trouvé.</p>
        ) : (
          <table className="w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">N°</th>
                <th className="p-2 border">Nom échantillon</th>
                <th className="p-2 border">N°BA</th>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Méthode</th>
                <th className="p-2 border">Stade</th>
                <th className="p-2 border">Quantité</th>
                <th className="p-2 border">Déstination</th>
                <th className="p-2 border">Unité</th>
                <th className="p-2 border">Demande</th>
                
              </tr>
            </thead>
            <tbody>
              {echantillons.map((e, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{e.ordre}</td>
                  <td className="border p-2">{e.nom_echan}</td>
                  <td className="border p-2">{e.num_BA}</td>
                  <td className="border p-2">{e.code_echan}</td>
                  <td className="border p-2">{e.methode_echan}</td>
                  <td className="border p-2">{e.stade}</td>
                  <td className="border p-2">{e.quantite_echan}</td>
                  <td className="border p-2">{e.destination}</td>
                  <td className="border p-2">{e.unite}</td>
                  <td className="border p-2">{e.demande}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ModeleEchantillon;
