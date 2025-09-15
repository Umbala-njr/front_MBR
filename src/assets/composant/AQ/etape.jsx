import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import { Factory, Plus, Code, Package, Search, Filter, Calendar, ChevronRight } from 'lucide-react';

const FabricationList = () => {
  const [fabrications, setFabrications] = useState([]);
  const [filteredFabrications, setFilteredFabrications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
   
    // Décommentez cette ligne pour utiliser avec axios
    
    axios.get('http://localhost:3000/api/fabrication/affichefabri')
      .then(res => {
        setFabrications(res.data);
        setFilteredFabrications(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const results = fabrications.filter(fab => 
      fab.nom_fab.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fab.code_fab.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFabrications(results);
  }, [searchTerm, fabrications]);

  const handleAfficher = (code_fab) => {
    // Décommentez cette ligne pour utiliser avec react-router-dom
    navigate(`/AQ/atelieretape/${code_fab}`);
    console.log(`Navigation vers /AQ/etape1/${code_fab}`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'En cours': return 'bg-amber-100 text-amber-800';
      case 'Terminé': return 'bg-emerald-100 text-emerald-800';
      case 'Planifié': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-emerald-800 rounded-lg flex items-center justify-center mr-4">
              <Factory className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Liste des Fabrications
              </h1>
              <p className="text-slate-600">
                Gérez et suivez vos processus de fabrication
              </p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-slate-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Rechercher par nom ou code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="px-4 py-3 border border-slate-300 rounded-lg flex items-center text-slate-700 hover:bg-slate-50">
                <Filter className="h-5 w-5 mr-2" />
                Filtres
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <span className="text-slate-600">
            {filteredFabrications.length} fabrication{filteredFabrications.length !== 1 ? 's' : ''} trouvée{filteredFabrications.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Fabrications List */}
        {filteredFabrications.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Code Fabrication
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredFabrications.map((fab) => (
                    <tr key={fab.code_fab} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Code className="h-6 w-6 text-emerald-700" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{fab.code_fab}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{fab.nom_fab}</div>
                      </td>
                  
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleAfficher(fab.code_fab)}
                          className="flex items-center justify-end w-full text-emerald-700 hover:text-emerald-900 transition-colors"
                        >
                          Ajouter étape
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-100 rounded-full mb-6">
              <Factory className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-600 mb-3">
              Aucune fabrication trouvée
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {searchTerm ? 'Aucun résultat pour votre recherche.' : 'Les fabrications apparaîtront ici une fois disponibles.'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
              >
                Réinitialiser la recherche
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FabricationList;