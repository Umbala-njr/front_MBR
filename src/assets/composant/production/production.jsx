import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { Factory, Plus, Code, Package } from 'lucide-react';
import { useParams } from 'react-router-dom';

const FabricationProdList = () => {
  const [fabrications, setFabrications] = useState([]);
  const navigate = useNavigate();
  const { id_pro } = useParams();
  useEffect(() => {
    //Décommentez cette ligne pour utiliser avec axios
    axios.get(`http://localhost:3000/api/fabrication/affichefab/${id_pro}`)
    .then(res => setFabrications(res.data))
    .catch(err => console.error(err));
    
    // Données de démonstration - supprimez cette partie
  }, []);

  const handleAfficher = (code_fab) => {
    // Décommentez cette ligne pour utiliser avec react-router-dom
    navigate(`/PROD/mbr/${code_fab}`);
    console.log(`Navigation vers /PROD/mbr/${code_fab}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-800 rounded-full mb-6 shadow-lg">
            <Factory className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Liste des Fabrications
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Gérez et organisez vos processus de fabrication avec tendraisse et efficacité.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-700 to-emerald-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Fabrications Grid */}
        {fabrications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fabrications.map(fab => (
              <div
                key={fab.code_fab}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 hover:border-emerald-200"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-emerald-100 text-sm font-medium">
                        Fabrication
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {fab.nom_fab}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex items-center mb-6 p-3 bg-slate-50 rounded-lg">
                    <Code className="w-5 h-5 text-emerald-700 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Code Fabrication</p>
                      <p className="text-slate-800 font-bold text-lg">{fab.code_fab}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleAfficher(fab.code_fab)}
                    className="w-full bg-gradient-to-r from-emerald-700 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-emerald-800 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl group-hover:scale-105 transform"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Voir MBR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-200 rounded-full mb-6">
              <Factory className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-600 mb-3">
              Aucune fabrication trouvée
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Les fabrications apparaîtront ici une fois qu'elles seront disponibles dans le système.
            </p>
          </div>
        )}

        {/* Stats Footer */}
        {fabrications.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg border border-slate-200">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 font-medium">
                {fabrications.length} fabrication{fabrications.length > 1 ? 's' : ''} disponible{fabrications.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FabricationProdList;