import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cours from "../../photos/images (1).jpg";
import terminer from "../../photos/images.jpg";
import attente from "../../photos/téléchargement.jpg";
import axios from "axios";

const MBRProdList = () => {
  const navigate = useNavigate();
  const { code_fab, id_camp } = useParams();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mbrList, setMbrList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Charger les MBR au montage
  useEffect(() => {
    const fetchMBRAttente = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/mbr/mbr/${code_fab}/${id_camp}`);
        setMbrList(res.data);
      } catch (err) {
        console.error("Erreur chargement MBR :", err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchMBRAttente();
  }, [code_fab]);

  const statsData = {
    enAttente: mbrList.filter((m) => m.statut === "attente").length,
    enCours: mbrList.filter((m) => m.statut === "en cours" || m.statut === "en cours").length,
    termines: mbrList.filter((m) => m.statut === "terminer").length,
  };

  const cards = [
    {
      title: "MBR Attente",
      description: "Voir tous les MBR en attente de traitement avec priorité et délais.",
      image: attente,
      link: `/PROD/attente/${code_fab}/${id_camp}`,
      status: "⏳ Attente",
      color: "from-green-800 to-green-900",
      bgGradient: "from-green-50 to-white",
      borderColor: "border-green-300",
      textColor: "text-green-900",
      count: statsData.enAttente,
      icon: "⏳",
    },
    {
      title: "MBR En Cours",
      description: "Suivez en temps réel les MBR en cours de fabrication et leur progression.",
      image: cours,
      link: `/PROD/encours/${code_fab}/${id_camp}`,
      status: "⚡ En cours",
      color: "from-green-700 to-green-900",
      bgGradient: "from-green-50 to-white",
      borderColor: "border-green-400",
      textColor: "text-green-900",
      count: statsData.enCours,
      icon: "⚡",
    },
    {
      title: "MBR Terminé",
      description: "Consultez l'historique complet des MBR terminés avec rapports détaillés.",
      image: terminer,
      link: `/PROD/terminerBR/${code_fab}/${id_camp}`,
      status: "✅ Terminé",
      color: "from-green-600 to-green-800",
      bgGradient: "from-green-50 to-white",
      borderColor: "border-green-400",
      textColor: "text-green-900",
      count: statsData.termines,
      icon: "✅",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.2) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-transparent mb-4 tracking-tight">
              Gestion MBR
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-green-700 to-green-900 mx-auto rounded-full"></div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-xl inline-block">
            <p className="text-xl text-green-800 font-medium">
              Production{" "}
              <span className="font-bold text-green-900 px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 rounded-full">
                {code_fab}
              </span>
            </p>
            <p className="text-sm text-green-700 mt-2">
              Système de gestion intégré • Suivi en temps réel
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 cursor-pointer transform hover:scale-105 hover:-translate-y-2 ${
                hoveredCard === index ? "z-20" : "z-10"
              }`}
              onClick={() => navigate(card.link)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                animationDelay: `${index * 200}ms`,
                animation: "slideInUp 0.8s ease-out forwards",
              }}
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-90`}
              ></div>

              {/* Border Glow Effect */}
              <div
                className={`absolute inset-0 rounded-3xl border-2 ${card.borderColor} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
              ></div>
              <div className="absolute inset-0 rounded-3xl border border-white/30 group-hover:border-white/50 transition-colors duration-500"></div>

              {/* Content Container */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`text-4xl transition-transform duration-500 group-hover:scale-110`}
                    >
                      {card.icon}
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${card.textColor} bg-white/80 backdrop-blur-sm`}
                    >
                      {card.count} items
                    </div>
                  </div>

                  <h2
                    className={`text-2xl font-bold ${card.textColor} group-hover:text-opacity-90 transition-colors duration-300`}
                  >
                    {card.title}
                  </h2>

                  <p className="text-green-700 text-sm leading-relaxed group-hover:text-green-800 transition-colors duration-300">
                    {card.description}
                  </p>
                </div>

                {/* Image Section */}
                <div className="relative flex-1 overflow-hidden">
                  <img
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                    src={card.image}
                    alt={card.title}
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/30 transition-all duration-500"></div>

                  {/* Floating Status Badge */}
                  <div className="absolute top-4 right-4 transform group-hover:scale-110 transition-transform duration-300">
                    <div
                      className={`px-4 py-2 rounded-full text-white font-bold text-sm bg-gradient-to-r ${card.color} shadow-lg backdrop-blur-sm`}
                    >
                      {card.status}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6">
                  <button
                    onClick={() => navigate(card.link)}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r ${card.color} hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 group-hover:shadow-2xl`}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Accéder au module</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .group:hover .floating-element {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MBRProdList;
