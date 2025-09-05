import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Factory, User } from "lucide-react";

const ArchiverCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState({
    date_debut: "",
    date_fin: "",
    date_validation: "",
    nom_fab: "",
  });

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/campagne/camp/archiver");
        setCampaigns(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Erreur récupération campagnes archivées :", err);
      }
    };
    fetchCampaigns();
  }, []);

  // 🔎 Filtrage dynamique
  useEffect(() => {
    let result = campaigns;

    if (search.nom_fab) {
      result = result.filter((c) =>
        c.nom_fab.toLowerCase().includes(search.nom_fab.toLowerCase())
      );
    }

    if (search.date_debut) {
      result = result.filter(
        (c) =>
          new Date(c.date_debut_camp).toISOString().split("T")[0] >=
          search.date_debut
      );
    }

    if (search.date_fin) {
      result = result.filter(
        (c) =>
          new Date(c.date_fin_camp).toISOString().split("T")[0] <=
          search.date_fin
      );
    }

    if (search.date_validation) {
      result = result.filter(
        (c) =>
          c.date_validation &&
          c.date_validation.split("T")[0] === search.date_validation
      );
    }

    setFiltered(result);
  }, [search, campaigns]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl font-bold mb-6">📦 Campagnes Archivées</h2>

      {/* 🔎 Zone de recherche */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 mb-8">
        <input
          type="text"
          placeholder="Rechercher par fabrication"
          className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          value={search.nom_fab}
          onChange={(e) => setSearch({ ...search, nom_fab: e.target.value })}
        />
        <input
          type="date"
          className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          value={search.date_debut}
          onChange={(e) => setSearch({ ...search, date_debut: e.target.value })}
        />
        <input
          type="date"
          className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          value={search.date_fin}
          onChange={(e) => setSearch({ ...search, date_fin: e.target.value })}
        />
        <input
          type="date"
          className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
          value={search.date_validation}
          onChange={(e) =>
            setSearch({ ...search, date_validation: e.target.value })
          }
        />
      </div>

      {/* 🃏 Affichage des campagnes en cards */}
      {filtered.length === 0 ? (
        <p className="text-gray-400">Aucune campagne trouvée.</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {filtered.map((c) => (
            <div
              key={c.id_camp}
              className="bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-700 hover:shadow-2xl transition-all"
            >
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Factory className="w-5 h-5 text-emerald-400" />
                {c.nom_fab}
              </h3>
              <p className="text-sm text-gray-300">Atelier : {c.atelier}</p>
              <p className="text-sm text-gray-300">
                Nombre BR :{" "}
                <span className="font-bold text-emerald-400">
                  {c.nombre_br}
                </span>
              </p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  Début : {c.date_debut_camp?.split("T")[0]}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-400" />
                  Fin : {c.date_fin_camp?.split("T")[0]}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Validation : {c.date_validation?.split("T")[0] || "—"}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-yellow-400" />
                Validé par :{" "}
                <span className="font-medium">{c.nom_uti || "Non défini"}</span>
              </div>
              <div className="mt-4">
                <span className="px-3 py-1 bg-emerald-600 rounded-full text-xs">
                  {c.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiverCampaigns;
