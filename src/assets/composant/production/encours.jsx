import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const EncoursMBRList = () => {
  const { code_fab, id_camp } = useParams();
  const [mbrs, setMbrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const statut = "en cours"; // fixé
  const navigate = useNavigate();

  // ⚡ récupère infos user connecté (depuis localStorage)
  const user = JSON.parse(localStorage.getItem("user"));
  const id_uti = user?.id_uti;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMBR = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/mbr/mbr/codefabe/encours/${id_camp}`, {
          params: { statut, code_fab},
        });
        setMbrs(res.data);
        console.log(statut, code_fab);
      } catch (error) {
        console.error("Erreur récupération MBR :", error);
        
      } finally {
        setLoading(false);
      }
    };
    fetchMBR();
  }, [statut, code_fab, id_camp]);

  // ⚡ bouton "Lancement"
const handleLancement = async (id_mbr) => {
    try {
      if (!id_uti) {
        alert("Utilisateur non connecté !");
        return;
      }

      await axios.put(
        `http://localhost:3000/api/MBR/terminerBR/${id_mbr}`,
        { id_uti }, // ✅ envoi dans le body
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("MBR lancé avec succès !");
        setMbrs((prev) => prev.filter((m) => m.id_mbr !== id_mbr));
      setMbrs((prev) =>
        prev.map((m) =>
          m.id_mbr === id_mbr ? { ...m, statut: "en cours" } : m
        )
      );
    } catch (err) {
      console.error("Erreur lancement :", err);
      alert("Erreur lors du lancement du MBR");
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-300 border-t-transparent mx-auto mb-4"></div>
          <p className="text-emerald-300 text-lg font-medium">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900">
      {/* Header avec effet glassmorphism */}
      <div className="backdrop-blur-sm bg-white/5 border-b border-emerald-700/30 sticky top-0 z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Liste des MBR
              </h1>
              <p className="text-emerald-200 text-lg">Gestion des Missions de Bon de Résultat</p>
            </div>
          </div>
          
          {/* Informations de filtrage */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-emerald-500/20">
              <span className="text-emerald-300 font-semibold text-sm">Statut:</span>
              <span className="text-white ml-2 capitalize">{statut}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-emerald-500/20">
              <span className="text-emerald-300 font-semibold text-sm">Code fabrication:</span>
              <span className="text-white ml-2 font-mono">{code_fab}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mbrs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucun MBR disponible</h3>
            <p className="text-emerald-200">Aucun MBR trouvé pour les critères sélectionnés.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mbrs.map((mbr) => (
              <div
                key={mbr.id_mbr}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 hover:transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Header de la carte */}
                <div className="bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 p-6 border-b border-emerald-500/20">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-bold text-white leading-tight">
                      {mbr.num_br}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        mbr.statut === "terminé"
                          ? "bg-emerald-500 text-white"
                          : mbr.statut === "en cours"
                          ? "bg-amber-500 text-white"
                          : "bg-slate-500 text-white"
                      }`}
                    >
                      {mbr.statut}
                    </span>
                  </div>
                  <h3 className="text-emerald-300 font-semibold text-lg">
                    {mbr.nom_fab}
                  </h3>
                  <h3 className="text-emerald-300 font-semibold text-lg">
                    {mbr.BR}
                  </h3>
                </div>

                {/* Corps de la carte */}
                <div className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <div>
                        <span className="text-emerald-300 text-sm font-medium">Atelier</span>
                        <p className="text-white font-semibold">{mbr.nom_atelier}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <div>
                        <span className="text-emerald-300 text-sm font-medium">Lancer par</span>
                        <p className="text-white font-semibold">{mbr.nom_uti_lancement}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <div>
                        <span className="text-emerald-300 text-sm font-medium">Date de lancement</span>
                        <p className="text-white font-semibold">
                          {new Date(mbr.date_lance).toLocaleDateString("fr-FR", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer avec boutons d'action */}
                <div className="p-6 pt-0">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                       navigate(`/PROD/detailencours/${mbr.id_mbr}/${code_fab}/${id_camp}`)
                      }
                      className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Détails
                    </button>
                    <button
                      onClick={() => handleLancement(mbr.id_mbr)}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 group"
                    >
                      <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12l3 3H3l3-3z" />
                      </svg>
                      Terminer
                    </button>
                  </div>
                </div>

                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer élégant */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-emerald-300/70 text-sm">
            <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
            <span>Système de gestion MBR</span>
            <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
            <span>{new Date().getFullYear()}</span>
            <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Effets d'arrière-plan décoratifs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/2 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default EncoursMBRList;