import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, X, AlertCircle, Plus, FileText, Settings, Users, Search, Filter } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';


const MBRManager = () => {
  const { code_fab, id_atelier } = useParams();

  const [formData, setFormData] = useState({
    num_mbr: '',
    BR: '',
    code_fab: code_fab,
    id_atelier: id_atelier,
    id_doc: '',
    id_uti: ''
  });

  const [ateliers, setAteliers] = useState([]);
  const [mbrList, setMbrList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('utilisateur'));
    if (user && user.id_uti) {
      setFormData(prev => ({ ...prev, id_uti: user.id_uti }));
    }
   

    fetchMBRAttente();
  }, [code_fab]);


  const fetchMBRAttente = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/mbr/afficheBr/attente/${code_fab}`);
      setMbrList(res.data);
    } catch (err) {
      console.error('Erreur chargement MBR :', err);
      showNotification('error', 'Erreur lors du chargement des MBR');
    } finally {
      setIsFetching(false);
    }
  };

  const fetchMBR = async () => {
    setIsFetching(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/mbr/mbr`);
      setMbrList(res.data);
    } catch (err) {
      console.error('Erreur chargement MBR :', err);
      showNotification('error', 'Erreur lors du chargement des MBR');
    } finally {
      setIsFetching(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const id_uti = localStorage.getItem("id_uti");

      if (!id_uti) {
        showNotification("error", "Utilisateur non connecté");
        setIsLoading(false);
        return;
      }

      const dataToSend = {
        ...formData,
        id_uti: id_uti,
      };

      await axios.post("http://localhost:3000/api/mbr/ajoutBR", dataToSend);

      setFormData({
        num_mbr: "",
        BR: "",
        code_fab: code_fab,
        id_atelier: id_atelier,
        id_uti: id_uti,
      });

      await fetchMBRAttente();
      showNotification("success", `MBR "${dataToSend.num_mbr}" créé avec succès !`);
    } catch (err) {
      console.error("Erreur création MBR :", err);
      showNotification("error", err.response?.data?.message || "Erreur lors de la création du MBR");
    } finally {
      setIsLoading(false);
    }
  };

  const statsData = {
    total: mbrList.length,
    enAttente: mbrList.filter(m => m.statut === 'En preparation' || m.statut === 'mbr_creer').length,
    enCours: mbrList.filter(m => m.statut === 'En cours' || m.statut === 'en_cours').length,
    termines: mbrList.filter(m => m.statut === 'Terminé' || m.statut === 'termine').length,
    ateliers: ateliers.length
  };

  const normalizeStatus = (s) => (s || '').toString().toLowerCase().replace(/\s/g, '_');
  const filteredMbrs = mbrList.filter((m) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch = !search || [m.num_br, m.code_fab, m.nom_uti]
      .some((val) => (val || '').toString().toLowerCase().includes(search));
    const statusNorm = normalizeStatus(m.statut);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'attente' && (statusNorm.includes('attente') || statusNorm.includes('prepar'))) ||
      (statusFilter === 'en_cours' && statusNorm.includes('en_cours')) ||
      (statusFilter === 'termine' && statusNorm.includes('termin'));
    return matchesSearch && matchesStatus;
  });

  const NotificationComponent = ({ notification, onClose }) => {
  if (!notification) return null;

  const { type, message } = notification;
  const isSuccess = type === "success";

    return (
      <div className={`fixed top-4 right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg max-w-xs sm:max-w-sm animate-in slide-in-from-right duration-300 ${
        isSuccess ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isSuccess ? (
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            )}
            <span className={`text-xs sm:text-sm font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
              {message}
            </span>
          </div>
          <button
            onClick={onClose}
            className={`ml-2 ${isSuccess ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'}`}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-3 px-2 sm:py-6 sm:px-4 lg:py-8 lg:px-8 ">
      <NotificationComponent 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />
      
      <div className="w-full h-full p-4 sm:p-6 flex flex-col gap-6">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-green-800 to-green-600 text-white rounded-t-2xl shadow-2xl p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Gestionnaire MBR</h1>
              <p className="text-green-100 text-sm sm:text-base md:text-lg">Création et suivi des Bons de Réalisation</p>
            </div>
            <div className="bg-white/20 p-2 sm:p-3 md:p-4 rounded-xl">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white border-x-2 border-green-200 p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4 lg:gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm md:text-base text-blue-100">Total MBR</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold">{statsData.total}</p>
                </div>
                <FileText className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm md:text-base text-yellow-100">En preparation</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold">{statsData.enAttente}</p>
                </div>
                <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm md:text-base text-green-100">En Cours</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold">{statsData.enCours}</p>
                </div>
                <Settings className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm md:text-base text-emerald-100">Terminés</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold">{statsData.termines}</p>
                </div>
                <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-emerald-200" />
              </div>
            </div>
          
          </div>
        </div>

        {/* Formulaire de création */}
        <div className="bg-white border-x-2 border-green-200 p-4 sm:p-6 md:p-8">
          <div className="flex items-center mb-4 sm:mb-6 md:mb-8">
            <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2 sm:mr-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Créer un nouveau MBR</h2>
          </div>

          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
              {/* Colonne 1 - Informations de base */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border-2 border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Informations de base
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1 sm:mb-2">Numéro MBR *</label>
                      <input
                        type="text"
                        name="num_mbr"
                        placeholder="Ex: MBR-2025-001"
                        value={formData.num_mbr}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1 sm:mb-2">Nom BR *</label>
                      <input
                        type="text"
                        name="BR"
                        placeholder="Nom du bon de réalisation"
                        value={formData.BR}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bouton de soumission */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105'
                } text-white px-6 py-2 sm:px-8 sm:py-3 md:px-10 md:py-3 lg:px-12 lg:py-4 rounded-xl transition duration-300 ease-in-out transform focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg text-sm sm:text-base md:text-lg font-semibold`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                    <span className="text-xs sm:text-sm md:text-base">Création en cours...</span>
                  </div>
                ) : (
                  <>
                    <Plus className="inline h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm md:text-base">Créer le MBR</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Liste des MBR */}
        <div className="bg-white rounded-b-2xl shadow-2xl border-2 border-green-200 border-t-0 p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center mb-3 sm:mb-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2 sm:mr-3" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800">MBR en Attente</h3>
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              {mbrList.length} MBR au total
            </div>
          </div>
          
          {/* Barre de recherche et filtres */}
          <div className="w-full mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par MBR, code fabrication ou responsable..."
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="relative w-full sm:w-56">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2 sm:py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="attente">En attente / préparation</option>
                  <option value="en_cours">En cours</option>
                  <option value="termine">Terminés</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
              </div>
            </div>
          </div>

          {isFetching ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-10 bg-gray-100 rounded" />
              ))}
            </div>
          ) : mbrList.length === 0 ? (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <FileText className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg md:text-xl text-gray-500">Aucun MBR en attente</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Les MBR créés apparaîtront ici</p>
            </div>
          ) : filteredMbrs.length === 0 ? (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <FileText className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg md:text-xl text-gray-500">Aucun résultat pour vos filtres</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Modifiez votre recherche ou statut pour voir des éléments</p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[60vh]">
              <table className="w-full min-w-[600px] bg-white shadow-lg rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white sticky top-0 z-10">
                  <tr>
                    {['ID', 'Numéro MBR', 'Code Fab.', 'Responsable', 'Statut', 'Echantillionage'].map((header) => (
                      <th 
                        key={header} 
                        className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-bold uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMbrs.map((mbr, index) => (
                    <tr 
                      key={mbr.id_mbr} 
                      className={`hover:bg-gray-50 transition duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-900">{mbr.id_mbr}</td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-blue-600">
                        {window.innerWidth < 640 ? `${mbr.num_br.substring(0, 10)}...` : mbr.num_br}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-700">
                        {window.innerWidth < 640 ? `${mbr.code_fab.substring(0, 5)}...` : mbr.code_fab}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-gray-700">
                        {window.innerWidth < 640 ? `${mbr.nom_uti.split(' ')[0]}` : mbr.nom_uti}
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3">
                        <span 
                          className={`inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm ${
                            (mbr.statut === 'En attente' || mbr.statut === 'attente' || normalizeStatus(mbr.statut).includes('prepar'))
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                              : (mbr.statut === 'En cours' || mbr.statut === 'en_cours')
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-green-100 text-green-800 border border-green-300'
                          }`}
                        >
                          {mbr.statut}
                        </span>
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3">
                           <button className="flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                             <Link
                                to={`/AQ/echantillon/${mbr.id_mbr}/${mbr.code_fab}`}
                                className="flex items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mx-1" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M19 3H5v2h14V3zM16 6v3.79c0 .91-.36 1.79-1 2.45V21H9V12.24c-.64-.66-1-1.54-1-2.45V6h8zm-8 2v2h4V8H8z" />
                                </svg>
                                <span className="mx-1">Échantillon</span>
                              </Link>
                          </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MBRManager;