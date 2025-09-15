import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Loader2, Factory } from "lucide-react"; // icônes

const AtelierEtape = () => {
  const { code_fab} = useParams();
  const [ateliers, setAteliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAteliers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/atelier/afficheAtel`
        );
        setAteliers(res.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des ateliers");
      } finally {
        setLoading(false);
      }
    };

    fetchAteliers();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Chargement des ateliers...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-semibold p-4">
        {error}
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Titre */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Ateliers pour la fabrication :
          <span className="text-green-600 ml-2">{code_fab}</span>
        </h2>

        {ateliers.length === 0 ? (
          <p className="text-center text-gray-500">
            Aucun atelier trouvé pour ce code produit.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {ateliers.map((atelier) => (
              <div
                key={atelier.id_atelier}
                className="p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <Factory className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {atelier.nom_atelier}
                  </h3>
                </div>

                <div className="flex justify-end">
                  <Link
                    to={`/AQ/etape1/${code_fab}/${atelier.id_atelier}`}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                  >
                    Etape de production
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AtelierEtape;
