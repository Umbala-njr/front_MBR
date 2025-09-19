import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { 
  Save, 
  Plus, 
  Eye, 
  ChevronDown,
  Type,
  Edit,
  RefreshCw,
  X,
  Trash2,
  ListOrdered
} from 'lucide-react';

const AjouterEtape = () => {
  const { code_fab, id_atelier } = useParams();
  const [nom_eta, setNomEta] = useState('');
  const [instruction, setInstruction] = useState('');
  const [ordre, setOrdre] = useState('');
  const [etapes, setEtapes] = useState([]);
  const [etapesInactives, setEtapesInactives] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingEtapeId, setEditingEtapeId] = useState(null);
  const [showInactivesPopup, setShowInactivesPopup] = useState(false);
  const editorRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Charger les étapes actives liées à ce code_fab
  const loadEtapes = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/etape/afficheEtape/${code_fab}`);
      setEtapes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Charger les étapes inactives
  const loadEtapesInactives = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/etape/afficheinactif/${code_fab}`);
      setEtapesInactives(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEtapes();
  }, [code_fab]);

  // Activer une étape inactive
  const handleActiverEtape = async (id_eta) => {
    try {
      await axios.put(`http://localhost:3000/api/etape/activer/${id_eta}`);
      
      // Recharger les listes
      loadEtapes();
      loadEtapesInactives();
      
      // Afficher message de succès
      setSuccessMessage("Étape activée avec succès");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'activation de l'étape");
    }
  };

  // Désactiver une étape active
  const handleDesactiverEtape = async (id_eta) => {
    if (window.confirm("Êtes-vous sûr de vouloir désactiver cette étape ?")) {
      try {
        await axios.put(`http://localhost:3000/api/etape/desactiver/${id_eta}`);
        
        // Recharger les listes
        loadEtapes();
        loadEtapesInactives();
        
        // Afficher message de succès
        setSuccessMessage("Étape désactivée avec succès");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setSuccessMessage('');
        }, 3000);
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la désactivation de l'étape");
      }
    }
  };

  // Ouvrir la popup des étapes inactives
  const openInactivesPopup = async () => {
    await loadEtapesInactives();
    setShowInactivesPopup(true);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation de l'ordre
    if (!ordre || isNaN(ordre) || ordre <= 0) {
      alert("Veuillez saisir un ordre valide (nombre positif)");
      setIsLoading(false);
      return;
    }

    try {
      if (editingEtapeId) {
        // Mode édition
        await axios.put(`http://localhost:3000/api/etape/modifierEta/${editingEtapeId}`, {
          nom_eta,
          instruction,
          ordre: parseInt(ordre)
        });
        setSuccessMessage("Étape modifiée avec succès");
      } else {
        // Mode ajout
        await axios.post('http://localhost:3000/api/etape/ajoutEta', {
          nom_eta,
          instruction,
          id_atelier,
          code_fab,
          ordre: parseInt(ordre)
        });
        setSuccessMessage("Étape ajoutée avec succès");
      }

      // Message de succès
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 3000);

      // Réinitialiser le formulaire
      setNomEta('');
      setInstruction('');
      setOrdre('');
      setEditingEtapeId(null);
      loadEtapes();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) {
        alert(err.response.data.message);
      } else {
        alert("Erreur lors de l'enregistrement");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Passer en mode édition
  const handleEdit = (etape) => {
    setNomEta(etape.nom_eta);
    setInstruction(etape.instruction);
    setOrdre(etape.ordre);
    if (editorRef.current) {
      editorRef.current.setContent(etape.instruction);
    }
    setEditingEtapeId(etape.id_eta);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Message succès */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <Save className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}

      {/* Popup des étapes inactives */}
      {showInactivesPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-6 rounded-t-xl flex justify-between items-center">
              <h3 className="text-2xl font-bold">Stade Inactives</h3>
              <button 
                onClick={() => setShowInactivesPopup(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {etapesInactives.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Aucune étape inactive.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {etapesInactives.map((etape) => (
                    <div key={etape.id_eta} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-800">{etape.nom_eta}</h4>
                        <p className="text-sm text-gray-600">Ordre: {etape.ordre}</p>
                      </div>
                      <button
                        onClick={() => handleActiverEtape(etape.id_eta)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Activer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-t-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center">
                <Plus className="w-8 h-8 mr-3" />
                {editingEtapeId ? "Modifier une Étape" : "Ajouter une Étape"}
              </h1>
              <p className="text-lg text-blue-100">
                Fabrication : <span className="font-semibold text-yellow-200">{code_fab}</span>
              </p>
              <p className="text-sm text-green-100">
                Atelier sélectionné : <span className="font-medium">{id_atelier}</span>
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <Type className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white shadow-2xl rounded-b-2xl overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Nom étape */}
              <div>
                <label className="block text-gray-800 font-semibold mb-3 text-lg">
                  Nom de l'étape
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 text-lg"
                  value={nom_eta}
                  onChange={e => setNomEta(e.target.value)}
                  placeholder="Entrez le nom de l'étape..."
                  required
                />
              </div>

              {/* Ordre */}
              <div>
                <label className="block text-gray-800 font-semibold mb-3 text-lg flex items-center">
                  <ListOrdered className="w-5 h-5 mr-2" />
                  Ordre de l'étape
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all duration-300 text-lg"
                  value={ordre}
                  onChange={e => setOrdre(e.target.value)}
                  placeholder="Entrez l'ordre de l'étape..."
                  required
                />
                <p className="text-sm text-gray-500 mt-2">Détermine l'ordre d'exécution des étapes (1 = première étape)</p>
              </div>

              {/* Instructions (TinyMCE) */}
              <div>
                <label className="block text-gray-800 font-semibold mb-3 text-lg">
                  Instructions détaillées
                </label>
                <div className="border-2 border-gray-300 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-green-500/30 focus-within:border-green-500 transition-all duration-300">
                  <Editor
                    apiKey='8wnmbrpgo0qomo9621cn966p37yf9uy2132xrp6lwrrchv20'
                    onInit={(evt, editor) => editorRef.current = editor}
                    value={instruction}
                    onEditorChange={(newValue) => setInstruction(newValue)}
                    init={{
                      height: 400,
                      menubar: true,
                      plugins: ['advlist','autolink','lists','link','preview','code','wordcount'],
                      toolbar: 'undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                      branding: false,
                      language: 'fr-FR'
                    }}
                  />
                </div>
              </div>

              {/* Bouton */}
              <div className="text-center pt-4">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-4 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl text-lg font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      {editingEtapeId ? "Modification en cours..." : "Ajout en cours..."}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Plus className="w-5 h-5 mr-2" />
                      {editingEtapeId ? "Modifier l'Étape" : "Ajouter l'Étape"}
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Liste des étapes */}
        <div className="mt-8 bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white p-6 flex justify-between items-center">
            <h3 className="text-2xl font-bold flex items-center">
              <Eye className="w-6 h-6 mr-3" />
              Étapes existantes ({etapes.length})
            </h3>
            <button 
              onClick={openInactivesPopup}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Voir les étapes inactives
            </button>
          </div>
          
          <div className="p-6">
            {etapes.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Type className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">Aucune étape enregistrée.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {etapes.map((etape) => (
                  <div key={etape.id_eta} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{etape.nom_eta}</h4>
                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                          Ordre: {etape.ordre}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(etape)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDesactiverEtape(etape.id_eta)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Désactiver"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none mb-4">
                      <div 
                        dangerouslySetInnerHTML={{ __html: etape.instruction.length > 150 ? `${etape.instruction.substring(0, 150)}...` : etape.instruction }} 
                        className="text-gray-700"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {etape.nom_atelier || etape.id_atelier}
                      </span>
                      <button
                        onClick={() => window.location.href = `/AQ/sousetape/${etape.id_atelier}/${etape.id_eta}`}
                        className="bg-gradient-to-r from-green-500 to-emerald-700 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center text-sm"
                      >
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Sous-étapes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjouterEtape;