import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const AtelierByCodeFab = () => {
  const { code_fab } = useParams();
  const [ateliers, setAteliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAteliers = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/atelier/afficheAtelBy/${code_fab}`);
        setAteliers(res.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des ateliers");
      } finally {
        setLoading(false);
      }
    };

    fetchAteliers();
  }, [code_fab]);

  if (loading) return <p>Chargement des ateliers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Ateliers pour la fabrication : {code_fab}
      </h2>
      {ateliers.length === 0 ? (
        <p>Aucun atelier trouvé pour ce code produit.</p>
      ) : (
        <ul className="space-y-3">
          {ateliers.map((atelier) => (
            <li
              key={atelier.id_atelier}
              className="flex justify-between items-center p-3 border rounded shadow-sm"
            >
              <span>{atelier.nom_atelier}</span>
              <Link
                to={`/AQ/creer-mbr/${code_fab}/${atelier.id_atelier}`} // <-- id_atelier dans l'URL
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Créer MBR
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AtelierByCodeFab;
