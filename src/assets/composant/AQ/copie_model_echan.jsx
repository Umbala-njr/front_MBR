import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModeleEchantillonCopie = () => {
  const { id_mbr, code_fab } = useParams();
  const [echantillons, setEchantillons] = useState([]);
  const [echantillonsCopies, setEchantillonsCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copieFaite, setCopieFaite] = useState(false); // ✅ basé sur BDD
  const [isLoading, setIsLoading] = useState(false);

  // Vérifier si copie déjà faite en BDD
  useEffect(() => {
    const checkCopie = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/mbr/afficheBr/${id_mbr}`
        );

        if (res.data.is_copie === 1) {
          setCopieFaite(true);

          // si déjà copié → charger les échantillons copiés
          const echanRes = await axios.get(
            `http://localhost:3000/api/echantillion/affichebymbr/${id_mbr}`
          );
          setEchantillonsCopies(echanRes.data);
        } else {
          // sinon → charger les modèles
          const modeleRes = await axios.get(
            `http://localhost:3000/api/echantillion/afficheModele/${code_fab}`
          );
          setEchantillons(modeleRes.data);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      } finally {
        setLoading(false);
      }
    };

    checkCopie();
  }, [id_mbr, code_fab]);

  // Copier tous les modèles
  const copierModele = async () => {
    try {
      await axios.post("http://localhost:3000/api/echantillion/ajouterchanmodele", {
        code_fab,
        id_mbr,
      });

      toast.success("✅ Modèles copiés avec succès !");
      setCopieFaite(true);

      // Charger les échantillons copiés
      const res = await axios.get(
        `http://localhost:3000/api/echantillion/affichebymbr/${id_mbr}`
      );
      setEchantillonsCopies(res.data);
    } catch (err) {
      console.error("Erreur lors de la copie :", err);
      toast.error("❌ Erreur lors de la copie des modèles.");
    }
  };

  // Fonction émission
  const emissionMBR = async () => {
    try {
      setIsLoading(true);

      // 🔹 Récupérer l'utilisateur connecté
      const id_uti = localStorage.getItem("id_uti");

      if (!id_uti) {
        toast.error("❌ Utilisateur non connecté !");
        setIsLoading(false);
        return;
      }

      // 🔹 Appel backend
      const res = await axios.put(
        `http://localhost:3000/api/mbr/emission/${id_mbr}`, 
        { id_uti }  // body envoyé
      );

      // 🔹 Affiche succès
      toast.success(res.data.message || "✅ BR émis avec succès !");
    } catch (error) {
      console.error("Erreur émission BR :", error);
      toast.error("❌ Erreur lors de l'émission du BR.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-bold mb-4">
        Échantillons - Code Fab : {code_fab} | MBR : {id_mbr}
      </h1>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          {copieFaite ? "Liste des échantillons copiés" : "Liste des modèles"}
        </h2>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : !copieFaite ? (
          echantillons.length === 0 ? (
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
                  <th className="p-2 border">Destination</th>
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
          )
        ) : echantillonsCopies.length === 0 ? (
          <p>Aucun échantillon copié trouvé.</p>
        ) : (
          <>
          <table className="w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-green-200">
                <th className="p-2 border">N°</th>
                <th className="p-2 border">Nom échantillon</th>
                <th className="p-2 border">N°BA</th>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Méthode</th>
                <th className="p-2 border">Stade</th>
                <th className="p-2 border">Quantité</th>
                <th className="p-2 border">Destination</th>
                <th className="p-2 border">Unité</th>
                <th className="p-2 border">Demande</th>
              </tr>
            </thead>
            <tbody>
              {echantillonsCopies.map((e, idx) => (
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
          {/* 🔹 Bouton Émission affiché UNIQUEMENT ici */}
              <button
                onClick={emissionMBR}
                disabled={isLoading}
                className={`mt-4 px-4 py-2 rounded text-white ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isLoading ? "Emission en cours..." : "Émission MBR"}
              </button>
    </>

        )}

      
      </div>

      {/* Bouton Copier */}
      {!copieFaite && (
        <div className="mt-4">
          <button
            onClick={copierModele}
            disabled={echantillons.length === 0}
            className={`px-4 py-2 rounded text-white ${
              echantillons.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Copier tous les modèles
          </button>
        </div>
      )}
    </div>
  );
};

export default ModeleEchantillonCopie;
