import { Play, CheckCircle, ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CampaignNavigationCards = () => {
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: 1,
      title: "Campagnes En Cours",
      description: "Gérer vos campagnes actives",
      icon: Play,
      url: "/AQ/campagneProduit", // URL cible
      type: "ongoing"
    },
    {
      id: 2,
      title: "Campagnes Terminées",
      description: "Consulter vos campagnes finalisées",
      icon: CheckCircle,
      url: "/AQ/campagneBR/terminer", // URL cible
      type: "completed"
    }
  ];

  const handleNavigation = (url) => {
    navigate(url);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
          Tableau de Bord Campagnes
        </h1>
        <p className="text-xl text-emerald-700 max-w-2xl mx-auto leading-relaxed">
          Accédez rapidement à vos campagnes marketing. Suivez vos campagnes actives ou analysez les performances de celles déjà terminées.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isOngoing = item.type === 'ongoing';

          return (
            <div
              key={item.id}
              onClick={() => handleNavigation(item.url)}
              className={`
                relative p-8 rounded-xl cursor-pointer transition-all duration-300 group
                hover:shadow-xl hover:scale-105 hover:-translate-y-1
                ${isOngoing 
                  ? 'bg-gradient-to-br from-emerald-800 to-emerald-900 text-white' 
                  : 'bg-white border-2 border-emerald-200 hover:border-emerald-400 text-emerald-900'
                }
              `}
            >
              {/* Icône */}
              <div className={`
                inline-flex p-4 rounded-lg mb-6
                ${isOngoing ? 'bg-white/20' : 'bg-emerald-100'}
              `}>
                <Icon className={`w-8 h-8 ${isOngoing ? 'text-white' : 'text-emerald-700'}`} />
              </div>

              {/* Contenu */}
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-3 ${isOngoing ? 'text-white' : 'text-emerald-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-lg ${isOngoing ? 'text-emerald-100' : 'text-emerald-700'}`}>
                  {item.description}
                </p>
              </div>

              {/* Flèche de navigation */}
              <div className="flex justify-end">
                <ArrowRight className={`
                  w-6 h-6 group-hover:translate-x-2 transition-transform duration-300
                  ${isOngoing ? 'text-white' : 'text-emerald-700'}
                `} />
              </div>

              {/* Effet décoratif */}
              <div className={`
                absolute top-0 right-0 w-16 h-16 transform translate-x-6 -translate-y-6 rounded-full opacity-20
                ${isOngoing ? 'bg-white' : 'bg-emerald-300'}
              `}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CampaignNavigationCards;
