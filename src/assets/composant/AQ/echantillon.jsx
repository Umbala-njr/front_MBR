import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EchantillonManager = () => {
  const { id_mbr } = useParams();

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
    id_mbr: id_mbr || '',
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Échantillons</h1>
          <p className="text-gray-600">MBR #{id_mbr}</p>
        </div>

        {/* Form Section */}
        <div className="mb-10 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-800 p-4">
            <h2 className="text-xl font-semibold text-white">Ajouter un Échantillon</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-6">
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
              <div key={name} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type || "text"}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                  required
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ID MBR</label>
              <input
                type="text"
                value={id_mbr}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-green-700 text-white font-medium rounded-md hover:bg-green-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
              >
                Ajouter l'échantillon
              </button>
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-800 p-4">
            <h2 className="text-xl font-semibold text-white">Liste des Échantillons</h2>
          </div>
          
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Stade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Méthode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Quantité</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Unité</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Demande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-green-800 uppercase tracking-wider">Code</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {echantillons.map((echan) => (
                    <tr key={echan.id_echan} className="hover:bg-green-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{echan.nom_echan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{echan.stade}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{echan.methode_echan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{echan.quantite_echan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{echan.unite}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{echan.destination}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{echan.demande}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{echan.code_echan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EchantillonManager;