import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, X, AlertCircle, Plus, FileText, Settings, Users } from 'lucide-react';
import { Link } from 'react-router-dom';


const MBRManager = () => {
  const [formData, setFormData] = useState({
    num_mbr: '',
    BR: '',
    code_fab: '',
    id_atelier: '',
    id_doc: '',
    id_uti: ''
  });

  const [fabrications, setFabrications] = useState([]);
  const [ateliers, setAteliers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [mbrList, setMbrList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('utilisateur'));
    if (user && user.id_uti) {
      setFormData(prev => ({ ...prev, id_uti: user.id_uti }));
    }

    axios.get('http://localhost:3000/api/fabrication/affichefabri')
      .then(res => setFabrications(res.data))
      .catch(err => {
        console.error('Erreur fabrications', err);
        showNotification('error', 'Erreur lors du chargement des fabrications');
      });

    axios.get('http://localhost:3000/api/atelier/afficheAtel')
      .then(res => setAteliers(res.data))
      .catch(err => {
        console.error('Erreur ateliers', err);
        showNotification('error', 'Erreur lors du chargement des ateliers');
      });

    fetchMBRAttente();
  }, []);

  useEffect(() => {
    if (formData.code_fab) {
      axios.get(`http://localhost:3000/api/document/afficheDoc/${formData.code_fab}`)
        .then(res => setDocuments(res.data))
        .catch(() => {
          setDocuments([]);
          showNotification('error', 'Aucune Document pour cette fabrication');
        });
    } else {
      setDocuments([]);
    }
  }, [formData.code_fab]);

  const fetchMBRAttente = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/mbr/afficheBr/attente');
      setMbrList(res.data);
    } catch (err) {
      console.error('Erreur chargement MBR :', err);
      showNotification('error', 'Erreur lors du chargement des MBR');
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
        code_fab: "",
        id_atelier: "",
        id_doc: "",
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
    enAttente: mbrList.filter(m => m.statut === 'En attente' || m.statut === 'attente').length,
    enCours: mbrList.filter(m => m.statut === 'En cours' || m.statut === 'en_cours').length,
    termines: mbrList.filter(m => m.statut === 'Terminé' || m.statut === 'termine').length,
    ateliers: ateliers.length
  };

  const NotificationComponent = ({ notification, onClose }) => {
    if (!notification) return null;

    const { type, message } = notification;
    const isSuccess = type === 'success';
    
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-3 px-2 sm:py-6 sm:px-4 lg:py-8 lg:px-8">
      <NotificationComponent 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />
      
      <div className="max-w-7xl mx-auto">
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
                  <p className="text-xs sm:text-sm md:text-base text-yellow-100">En Attente</p>
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
                <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 sm:p-4 md:p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm md:text-base text-purple-100">Ateliers</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold">{statsData.ateliers}</p>
                </div>
                <Settings className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-200" />
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

              {/* Colonne 2 - Sélections */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-blue-50 p-4 sm:p-6 rounded-xl border-2 border-blue-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center">
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Configuration
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1 sm:mb-2">Fabrication *</label>
                      <select
                        name="code_fab"
                        value={formData.code_fab}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        required
                        disabled={isLoading}
                      >
                        <option value="">-- Choisir une fabrication --</option>
                        {fabrications.map(fab => (
                          <option key={fab.code_fab} value={fab.code_fab}>
                            {fab.code_fab}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1 sm:mb-2">Atelier *</label>
                      <select
                        name="id_atelier"
                        value={formData.id_atelier}
                        onChange={handleChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        required
                        disabled={isLoading}
                      >
                        <option value="">-- Choisir un atelier --</option>
                        {ateliers.map(at => (
                          <option key={at.id_atelier} value={at.id_atelier}>
                            {at.nom_atelier}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne 3 - Document */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-purple-50 p-4 sm:p-6 rounded-xl border-2 border-purple-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Documentation
                  </h3>
                  
                  <div>
                    <label className="block text-sm sm:text-base text-gray-700 font-semibold mb-1 sm:mb-2">Document *</label>
                    <select
                      name="id_doc"
                      value={formData.id_doc}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
                      required
                      disabled={!formData.code_fab || isLoading}
                    >
                      <option value="">
                        {formData.code_fab 
                          ? "-- Choisir un document --" 
                          : "Sélectionnez d'abord une fabrication"}
                      </option>
                      {documents.map(doc => (
                        <option key={doc.id_doc} value={doc.id_doc}>
                          {doc.nom_doc}
                        </option>
                      ))}
                    </select>
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
          
          {mbrList.length === 0 ? (
            <div className="text-center py-8 sm:py-10 md:py-12">
              <FileText className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg md:text-xl text-gray-500">Aucun MBR en attente</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Les MBR créés apparaîtront ici</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] bg-white shadow-lg rounded-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-green-600 to-green-700 text-white">
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
                  {mbrList.map((mbr, index) => (
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
                            (mbr.statut === 'En attente' || mbr.statut === 'attente')
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
                                to={`/AQ/echantillon/${mbr.id_mbr}`}
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