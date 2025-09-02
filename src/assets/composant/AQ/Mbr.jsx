import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, FileText, X, Factory, Users, Eye } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

// Notification (inchangé)
const NotificationComponent = ({ notification, onClose }) => {
  if (!notification) return null;
  const { type, message } = notification;
  const isSuccess = type === "success";

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white ${
        isSuccess ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 font-bold">X</button>
      </div>
    </div>
  );
};

const MBRManager = () => {
  const { code_fab, id_atelier } = useParams();

  const [formData, setFormData] = useState({
    num_mbr: '',
    BR: '',
    code_fab: code_fab,
    id_atelier: id_atelier,
    id_uti: ''
  });
  const [mbrList, setMbrList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
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
      const user = JSON.parse(localStorage.getItem("user"));
      const id_uti = user?.id_uti;
      const token = localStorage.getItem("token");

      if (!id_uti || !token) {
        showNotification("error", "Utilisateur non connecté");
        setIsLoading(false);
        return;
      }

      const dataToSend = { ...formData, id_uti };

      await axios.post("http://localhost:3000/api/mbr/ajoutBR", dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Notification */}
      <NotificationComponent notification={notification} onClose={() => setNotification(null)} />

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Gestion MBR</h1>
            <p className="text-emerald-100 mt-2 text-sm sm:text-base">
              Système de gestion des Matières Brutes Réalisées
            </p>
          </div>
          <div className="flex items-center space-x-4 text-emerald-100">
            <div className="flex items-center space-x-2">
              <Factory className="h-5 w-5" />
              <span className="text-sm font-medium">{formData.code_fab}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">{mbrList.length} MBR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulaire création (inchangé) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 sticky top-8">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-t-2xl flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Nouveau MBR</h2>
                <p className="text-emerald-100 text-sm">Créer un bon de réalisation</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Numéro MBR <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="num_mbr"
                  placeholder="Ex: MBR-2025-001"
                  value={formData.num_mbr}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Nom BR <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="BR"
                  placeholder="Nom du bon de réalisation"
                  value={formData.BR}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.num_mbr || !formData.BR}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  isLoading || !formData.num_mbr || !formData.BR
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? 'Création...' : 'Créer le MBR'}
              </button>
            </form>
          </div>
        </div>

        {/* Liste MBR - Partie modifiée */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">MBR en Attente</h3>
                  <p className="text-emerald-100 text-sm">{mbrList.length} éléments</p>
                </div>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">{mbrList.filter(m => m.statut === 'En attente').length} en attente</span>
              </div>
            </div>

            <div className="p-6">
              {isFetching ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-16 bg-gray-100 rounded-xl"></div>
                    </div>
                  ))}
                </div>
              ) : mbrList.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-10 w-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">Aucun MBR en attente</p>
                  <p className="text-gray-400 text-sm mt-2">Créez votre premier MBR pour commencer</p>
                </div>
              ) : (
                <>
                  {/* Vue mobile améliorée */}
                  <div className="lg:hidden space-y-4">
                    {mbrList.map(mbr => (
                      <div key={mbr.id_mbr} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-emerald-700 text-lg">{mbr.num_br}</h4>
                            <p className="text-sm text-gray-600">ID: {mbr.id_mbr}</p>
                            <p className="text-sm text-gray-600 mt-1">Code Fab: {mbr.code_fab}</p>
                            <p className="text-sm text-gray-600">Responsable: {mbr.nom_uti}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            mbr.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {mbr.statut}
                          </span>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Link
                            to={`/AQ/detailmbr/${mbr.id_mbr}/${mbr.code_fab}`}
                            className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir détails
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Vue desktop améliorée avec tableau responsive */}
                  <div className="hidden lg:block overflow-auto rounded-xl border border-gray-200 max-w-full">
                    <table className="w-full min-w-max">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">ID</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Numéro MBR</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Code Fab.</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Responsable</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Statut</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mbrList.map(mbr => (
                          <tr key={mbr.id_mbr} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-4 py-3 text-sm text-gray-900 whitespace-normal">{mbr.id_mbr}</td>
                            <td className="px-4 py-3 whitespace-normal">
                              <span className="text-sm font-semibold text-emerald-700 break-words">{mbr.num_br}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-normal">{mbr.code_fab}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 whitespace-normal break-words">{mbr.nom_uti}</td>
                            <td className="px-4 py-3 whitespace-normal">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                mbr.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {mbr.statut}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-normal">
                              <Link
                                to={`/AQ/detailmbr/${mbr.id_mbr}/${mbr.code_fab}`}
                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Détails
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MBRManager;