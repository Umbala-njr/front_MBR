import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentUploader = () => {
  const [fabrications, setFabrications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFabrications, setFilteredFabrications] = useState([]);
  const [selectedCodeFab, setSelectedCodeFab] = useState('');
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [isListOpen, setIsListOpen] = useState(false);

  // Charger les fabrications disponibles
  useEffect(() => {
    axios.get('http://localhost:3000/api/fabrication/affichefabri')
      .then(res => {
        setFabrications(res.data);
        setFilteredFabrications(res.data);
      })
      .catch(err => {
        console.error('Erreur chargement fabrications :', err);
      });
  }, []);

  // Filtrer la liste selon la recherche
  useEffect(() => {
    const results = fabrications.filter(fab =>
      fab.nom_fab.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFabrications(results);
  }, [searchTerm, fabrications]);

  // Gérer la sélection d'une fabrication
  const handleSelectFabrication = (fab) => {
    setSelectedCodeFab(fab.code_fab);
    setSearchTerm(fab.nom_fab);
    setIsListOpen(false);
  };

  // Gérer la sélection des fichiers
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // Supprimer un fichier sélectionné
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // Gérer la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCodeFab || files.length === 0) {
      setMessage('Veuillez sélectionner une fabrication et au moins un fichier.');
      return;
    }

    const formData = new FormData();
    formData.append('code_fab', selectedCodeFab);
    
    // Ajouter chaque fichier au FormData
    files.forEach(file => {
      formData.append('documents', file); // 'documents' doit correspondre au nom dans multer
    });

    try {
      const res = await axios.post('http://localhost:3000/api/document/ajoutDocBR', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      // Réinitialiser après succès
      setSelectedCodeFab('');
      setSearchTerm('');
      setFiles([]);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Erreur lors de l\'envoi');
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl duration-300">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Ajouter des Documents</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Champ de recherche auto-complétion */}
        <div className="relative">
          <label className="block mb-2 text-lg font-medium text-gray-700">Nom de la fabrication</label>
          <input
            type="text"
            placeholder="Rechercher une fabrication..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedCodeFab('');
              setIsListOpen(true);
            }}
            onFocus={() => setIsListOpen(true)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
          {isListOpen && searchTerm && filteredFabrications.length > 0 && (
            <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
              {filteredFabrications.map((fab) => (
                <div
                  key={fab.code_fab}
                  onClick={() => handleSelectFabrication(fab)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition"
                >
                  {fab.nom_fab}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload multiple de fichiers */}
        <div>
          <label className="block mb-2 text-lg font-medium text-gray-700">
            Fichiers (PDF, DOCX, XLSX...) - Max 5 fichiers
          </label>
          <div className="relative">
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                         file:rounded-full file:border-0
                         file:bg-blue-600 file:text-white
                         hover:file:bg-blue-700 transition"
            />
            {/* Liste des fichiers sélectionnés */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded">
                    <span className="text-gray-700 truncate flex-1">{file.name}</span>
                    <span className="text-xs text-gray-500 mx-2">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700 font-semibold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bouton d'envoi */}
        <button
          type="submit"
          disabled={files.length === 0}
          className={`w-full py-3 px-6 text-white font-semibold text-lg rounded-lg shadow-md hover:shadow-lg transition transform duration-200 ${
            files.length === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:scale-105'
          }`}
        >
          {files.length > 1 ? `Envoyer ${files.length} fichiers` : 'Envoyer'}
        </button>
      </form>

      {/* Message de feedback */}
      {message && (
        <div className={`mt-6 p-4 rounded-lg border shadow-inner transition-colors duration-300 ${
          message.includes('Erreur') 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;