import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { Calendar, BarChart3, ClipboardList, Users, Factory } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    produits: 0,
    fabrications: 0,
    mbrs: 0,
    utilisateurs: 0,
    ateliers: 0
  });
  const [mbrEncours, setMbrEncours] = useState([]);
  const [mbrTermines, setMbrTermines] = useState([]);
  const [statMois, setStatMois] = useState([]);
  const [filtreFab, setFiltreFab] = useState('');
  const [filtreDate, setFiltreDate] = useState('');

  useEffect(() => {
    fetchStats();
    fetchMBREnCours();
    fetchMBRTermines();
    fetchStatMois();
  }, []);

  const fetchStats = async () => {
    try {
      const [produits, fabrications, mbrs, utilisateurs, ateliers] = await Promise.all([
        axios.get('http://localhost:3000/api/produit/count'),
        axios.get('http://localhost:3000/api/fabrication/countFab'),
        axios.get('http://localhost:3000/api/MBR/countMBR'),
        axios.get('http://localhost:3000/api/utilisateur/count'),
        axios.get('http://localhost:3000/api/atelier/countAtel')
      ]);
      setStats({
        produits: produits.data[0]['COUNT(*)'],
        fabrications: fabrications.data[0]['COUNT(*)'],
        mbrs: mbrs.data[0]['COUNT(*)'],
        utilisateurs: utilisateurs.data[0]['COUNT(*)'],
        ateliers: ateliers.data[0]['COUNT(*)']
      });
    } catch (error) {
      console.error('Erreur de récupération des stats :', error);
    }
  };

  const fetchMBREnCours = async () => {
    const res = await axios.get('http://localhost:3000/api/mbr/encours');
    setMbrEncours(res.data);
  };

  const fetchMBRTermines = async () => {
    const res = await axios.get('http://localhost:3000/api/mbr/terminer');
    setMbrTermines(res.data);
  };

  const fetchStatMois = async () => {
    const res = await axios.get('http://localhost:3000/api/mbr/statistique-mensuelle');
    setStatMois(res.data);
  };

  const filteredMBRTermines = mbrTermines.filter((mbr) => {
    const matchFab = filtreFab === '' || mbr.code_fab.includes(filtreFab);
    const matchDate = filtreDate === '' || mbr.date_emission.startsWith(filtreDate);
    return matchFab && matchDate;
  });

  return (
    // Remplacez le container par :
<div className="w-full min-h-full bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
  <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Titre principal */}
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Dashboard de Production
          </h1>
          <div className="w-24 sm:w-32 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full"></div>
        </div>
        
        {/* Statistiques globales */}
       
       <section className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {Object.entries(stats).map(([label, count]) => (
            <div key={label} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 lg:p-6 flex items-center space-x-3 lg:space-x-4 border border-white/20 hover:scale-105 group">
              <div className="p-2 lg:p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl text-green-600 group-hover:from-green-200 group-hover:to-blue-200 transition-all duration-300">
                {label === 'produits' && <Factory className="w-5 h-5 lg:w-6 lg:h-6" />}
                {label === 'fabrications' && <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6" />}
                {label === 'mbrs' && <ClipboardList className="w-5 h-5 lg:w-6 lg:h-6" />}
                {label === 'utilisateurs' && <Users className="w-5 h-5 lg:w-6 lg:h-6" />}
                {label === 'ateliers' && <Factory className="w-5 h-5 lg:w-6 lg:h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 truncate">{count}</h2>
                <p className="text-xs lg:text-sm text-gray-600 capitalize truncate">{label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* MBR en cours */}
        <section className= "w-full bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-white/20">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 lg:mb-6 flex items-center space-x-2 text-gray-800">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <span>MBR en cours</span>
          </h2>
          <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full table-auto border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                  <tr>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left">Num MBR</th>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left">Code Fabrication</th>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left hidden sm:table-cell">Nom Fabrication</th>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left hidden md:table-cell">Atelier</th>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left">Date</th>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left hidden lg:table-cell">Utilisateur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mbrEncours.map((mbr) => (
                    <tr key={mbr.id_mbr} className="hover:bg-gradient-to-r hover:from-blue-25 hover:to-green-25 transition-colors duration-200">
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-900 font-medium">{mbr.num_br}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-700">{mbr.code_fab}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-700 hidden sm:table-cell max-w-xs truncate">{mbr.nom_fab}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-700 hidden md:table-cell">{mbr.nom_atelier}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-700">{mbr.date_emission}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-700 hidden lg:table-cell">{mbr.nom_uti}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* MBR terminés + filtres */}
        <section className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-white/20">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 lg:mb-6 flex items-center space-x-2 text-gray-800">
            <div className="p-2 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
              <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <span>MBR terminés et vérifiés</span>
          </h2>
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-4 lg:mb-6">
            <input
              type="text"
              placeholder="Filtrer par code fabrication"
              className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              value={filtreFab}
              onChange={(e) => setFiltreFab(e.target.value)}
            />
            <input
              type="month"
              className="sm:w-48 w-full  border border-gray-300 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              value={filtreDate}
              onChange={(e) => setFiltreDate(e.target.value)}
            />
          </div>
          {/* Tableau filtré */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                <thead className="bg-gradient-to-r from-green-50 to-blue-50">
                  <tr>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left">Num MBR</th>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left">Code Fab</th>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left hidden sm:table-cell">Nom Fab</th>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left hidden md:table-cell">Atelier</th>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left">Date</th>
                    <th className="border-b border-gray-200 px-3 py-3 text-xs sm:text-sm font-semibold text-gray-700 text-left hidden lg:table-cell">Utilisateur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMBRTermines.map((mbr) => (
                    <tr key={mbr.id_mbr} className="hover:bg-gradient-to-r hover:from-green-25 hover:to-blue-25 transition-colors duration-200">
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-900 font-medium">{mbr.num_br}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-700">{mbr.code_fab}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-700 hidden sm:table-cell max-w-xs truncate">{mbr.nom_fab}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-700 hidden md:table-cell">{mbr.nom_atelier}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-700">{mbr.date_emission}</td>
                      <td className="px-3 py-3 text-xs sm:text-sm text-gray-700 hidden lg:table-cell">{mbr.nom_uti}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Diagramme mensuel des MBR */}
        <section className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-white/20">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 lg:mb-6 flex items-center space-x-2 text-gray-800">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <span>Diagramme mensuel des MBR</span>
          </h2>
          <div className="h-64 sm:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statMois} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="total_mbr" 
                  fill="url(#barGradient)" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;