import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EchantillonManager = () => {
  const { id_mbr } = useParams(); // ← On récupère l'id_mbr depuis l'URL

  const [formData, setFormData] = useState({
    nom_echan: '',
    stade: '',
    methode_echan: '',
    quantite_echan: '',
    unite: '',
    destination: '',
    demande: '',
    num_BA: '',
    code_echan: '',
    embalage: '',
    neutralisation_OH: '',
    id_mbr: id_mbr || '', // Initialisé depuis l'URL
  });

  const [echantillons, setEchantillons] = useState([]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/echantillion/ajoutechan', {
        ...formData,
        id_mbr: id_mbr,
      });
      alert("Échantillon ajouté avec succès");
      fetchEchantillons(id_mbr);
      setFormData({
        nom_echan: '',
        stade: '',
        methode_echan: '',
        quantite_echan: '',
        unite: '',
        destination: '',
        demande: '',
        num_BA: '',
        code_echan: '',
        embalage: '',
        neutralisation_OH: '',
        id_mbr: id_mbr,
      });
    } catch (err) {
      console.error("Erreur d'ajout:", err);
      alert("Erreur lors de l'ajout");
    }
  };

  const fetchEchantillons = async (id_mbr) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/echantillion/affichebymbr/${id_mbr}`);
      setEchantillons(res.data);
    } catch (err) {
      console.error("Erreur d'affichage:", err);
    }
  };

  useEffect(() => {
    if (id_mbr) {
      setFormData((prev) => ({ ...prev, id_mbr }));
      fetchEchantillons(id_mbr);
    }
  }, [id_mbr]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Ajouter un Échantillon pour MBR #{id_mbr}</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 shadow rounded">
        {[
          { label: "Nom échantillon", name: "nom_echan" },
          { label: "Stade", name: "stade" },
          { label: "Méthode", name: "methode_echan" },
          { label: "Quantité", name: "quantite_echan", type: "number" },
          { label: "Unité", name: "unite" },
          { label: "Destination", name: "destination" },
          { label: "Demande", name: "demande" },
          { label: "Numéro BA", name: "num_BA" },
          { label: "Code Échantillon", name: "code_echan" },
          { label: "Emballage", name: "embalage" },
          { label: "Neutralisation OH", name: "neutralisation_OH" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-semibold">{label}</label>
            <input
              type={type || "text"}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold">ID MBR</label>
          <input
            type="text"
            value={id_mbr}
            disabled
            className="w-full p-2 border border-gray-300 rounded bg-gray-100"
          />
        </div>

        <div className="col-span-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ajouter
          </button>
        </div>
      </form>

      <h2 className="text-xl font-bold mt-8 mb-4">Liste des Échantillons liés à MBR #{id_mbr}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Stade</th>
              <th className="p-2 border">Méthode</th>
              <th className="p-2 border">Quantité</th>
              <th className="p-2 border">Unité</th>
              <th className="p-2 border">Destination</th>
              <th className="p-2 border">Demande</th>
              <th className="p-2 border">Code</th>
            </tr>
          </thead>
          <tbody>
            {echantillons.map((echan) => (
              <tr key={echan.id_echan} className="hover:bg-gray-100">
                <td className="p-2 border">{echan.nom_echan}</td>
                <td className="p-2 border">{echan.stade}</td>
                <td className="p-2 border">{echan.methode_echan}</td>
                <td className="p-2 border">{echan.quantite_echan}</td>
                <td className="p-2 border">{echan.unite}</td>
                <td className="p-2 border">{echan.destination}</td>
                <td className="p-2 border">{echan.demande}</td>
                <td className="p-2 border">{echan.code_echan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EchantillonManager;
