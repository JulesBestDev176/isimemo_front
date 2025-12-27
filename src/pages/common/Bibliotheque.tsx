import React, { useState, useMemo } from 'react';
import { 
  FiSearch, 
  FiFolder, 
  FiX, 
  FiExternalLink, 
  FiEye, 
  FiBookmark,
  FiFileText,
  FiDownload,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Types pour les données
interface Document {
  id: number;
  name: string;
  fileName: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
  url: string;
  important?: boolean;
  description?: string;
  category?: string;
  niveau?: 'Licence';
  departement?: string;
  annee?: string;
}

// Composant principal
const Bibliotheque: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<Document | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Document important unique (Canevas 2024)
  const importantDocuments: Document[] = [
    {
      id: 101,
      name: 'Canevas de mémoire officiel 2024-2025',
      fileName: 'canevas_memoire_2024.pdf',
      type: 'document',
      size: '1.2 MB',
      uploadedBy: 'Administration ISI',
      date: '01/09/2024',
      url: '/assets/documents/canevas_memoire.pdf',
      important: true,
      description: 'Format officiel à utiliser pour tous les mémoires de fin d\'études pour l\'année académique 2024-2025.',
      category: 'Modèle',
      annee: '2024-2025'
    }
  ];
  
  // Documents réels depuis le dossier public/assets/documents (tous Licence)
  const [documents] = useState<Document[]>([
    {
      id: 1,
      name: 'Mémoire - Abdou Fatah Ndiaye',
      fileName: 'Abdou Fatah Ndiaye.pdf',
      type: 'document',
      size: '1.8 MB',
      uploadedBy: 'Abdou Fatah Ndiaye',
      date: '15/06/2024',
      url: '/assets/documents/Abdou Fatah Ndiaye.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 2,
      name: 'Portail Web pour la Gestion Dématérialisée des Services Municipaux',
      fileName: 'Conception et Réalisation d\'un Portail Web pour la Gestion Dématérialisée des Services Municipaux.pptx.pdf',
      type: 'document',
      size: '1.6 MB',
      uploadedBy: 'Étudiant',
      date: '20/06/2024',
      url: '/assets/documents/Conception et Réalisation d\'un Portail Web pour la Gestion Dématérialisée des Services Municipaux.pptx.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 3,
      name: 'Mémoire - Fall Ndour',
      fileName: 'FallNdour.pdf',
      type: 'document',
      size: '2.5 MB',
      uploadedBy: 'Fall Ndour',
      date: '10/06/2024',
      url: '/assets/documents/FallNdour.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 4,
      name: 'Mémoire - Ibrahim Bocoum',
      fileName: 'Ibrahim Bocoum[4].pdf',
      type: 'document',
      size: '1.5 MB',
      uploadedBy: 'Ibrahim Bocoum',
      date: '05/06/2024',
      url: '/assets/documents/Ibrahim Bocoum[4].pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 5,
      name: 'Mémoire - Cheikh Houleymatou',
      fileName: 'MEMOIRE_CHEIKH_HOULEYMATOU.pdf',
      type: 'document',
      size: '2.8 MB',
      uploadedBy: 'Cheikh Houleymatou',
      date: '25/05/2024',
      url: '/assets/documents/MEMOIRE_CHEIKH_HOULEYMATOU.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 6,
      name: 'Mémoire - Awa Thiam',
      fileName: 'Memoire Awa THIAM.pdf',
      type: 'document',
      size: '1.9 MB',
      uploadedBy: 'Awa Thiam',
      date: '18/05/2024',
      url: '/assets/documents/Memoire Awa THIAM.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 7,
      name: 'Mémoire - Bassine Diallo',
      fileName: 'Memoire Bassine DIALLO2.pdf',
      type: 'document',
      size: '1.3 MB',
      uploadedBy: 'Bassine Diallo',
      date: '12/05/2024',
      url: '/assets/documents/Memoire Bassine DIALLO2.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 8,
      name: 'Mémoire - Mama Aichatou Sakho',
      fileName: 'Memoire MAMA AICHATOU SAKHO L3.pdf',
      type: 'document',
      size: '1.8 MB',
      uploadedBy: 'Mama Aichatou Sakho',
      date: '08/05/2024',
      url: '/assets/documents/Memoire MAMA AICHATOU SAKHO L3.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 9,
      name: 'Mémoire - Reco4i',
      fileName: 'Memoire-Reco4i(1).pdf',
      type: 'document',
      size: '1.9 MB',
      uploadedBy: 'Étudiant',
      date: '02/05/2024',
      url: '/assets/documents/Memoire-Reco4i(1).pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 10,
      name: 'Mémoire - Sokhna Dieye',
      fileName: 'MemoireSokhnaDieye.pdf',
      type: 'document',
      size: '1.9 MB',
      uploadedBy: 'Sokhna Dieye',
      date: '28/04/2024',
      url: '/assets/documents/MemoireSokhnaDieye.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 11,
      name: 'PFE - Moussa Abakar',
      fileName: 'PFE-MoussaAbakar.pdf',
      type: 'document',
      size: '2.9 MB',
      uploadedBy: 'Moussa Abakar',
      date: '22/04/2024',
      url: '/assets/documents/PFE-MoussaAbakar.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 12,
      name: 'Rapport - Harsy Barry',
      fileName: 'Rapport de Harsy Barry.pdf',
      type: 'document',
      size: '1.6 MB',
      uploadedBy: 'Harsy Barry',
      date: '15/04/2024',
      url: '/assets/documents/Rapport de Harsy Barry.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 13,
      name: 'Rapport final - Cheikh Djidere Diao',
      fileName: 'Rapport final Cheikh Djidere DIAO.pdf',
      type: 'document',
      size: '2.7 MB',
      uploadedBy: 'Cheikh Djidere Diao',
      date: '10/04/2024',
      url: '/assets/documents/Rapport final Cheikh Djidere DIAO.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 14,
      name: 'Mémoire - Samba Gueye',
      fileName: 'Samba_Gueye (1).pdf',
      type: 'document',
      size: '3.9 MB',
      uploadedBy: 'Samba Gueye',
      date: '05/04/2024',
      url: '/assets/documents/Samba_Gueye (1).pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 15,
      name: 'Mémoire - Soudaiss Elfayadine',
      fileName: 'Soudaiss-ELFAYADINE-Memoire-L3GL  (Récupération automatique).pdf',
      type: 'document',
      size: '1.5 MB',
      uploadedBy: 'Soudaiss Elfayadine',
      date: '01/04/2024',
      url: '/assets/documents/Soudaiss-ELFAYADINE-Memoire-L3GL  (Récupération automatique).pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 16,
      name: 'Mémoire de Licence',
      fileName: 'memoire_licence.pdf',
      type: 'document',
      size: '2.7 MB',
      uploadedBy: 'Étudiant',
      date: '25/03/2024',
      url: '/assets/documents/memoire_licence.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 17,
      name: 'My Memory Final',
      fileName: 'my_memory_final.pdf',
      type: 'document',
      size: '1.6 MB',
      uploadedBy: 'Étudiant',
      date: '20/03/2024',
      url: '/assets/documents/my_memory_final.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 18,
      name: 'Mémoire - Ndeye Ngoundje',
      fileName: 'ndeye ngoundje og (4).pdf',
      type: 'document',
      size: '1.5 MB',
      uploadedBy: 'Ndeye Ngoundje',
      date: '15/03/2024',
      url: '/assets/documents/ndeye ngoundje og (4).pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 19,
      name: 'Rapport de stage - Baye Bara Diop',
      fileName: 'rapport_de_stage _baye_bara_diop.pdf',
      type: 'document',
      size: '1.9 MB',
      uploadedBy: 'Baye Bara Diop',
      date: '10/03/2024',
      url: '/assets/documents/rapport_de_stage _baye_bara_diop.pdf',
      niveau: 'Licence',
      departement: 'Génie Logiciel',
      annee: '2024'
    },
    {
      id: 20,
      name: 'Document République du Sénégal',
      fileName: 'REPUBLIQUE DU SENEGAL.pdf',
      type: 'document',
      size: '3.4 MB',
      uploadedBy: 'Administration',
      date: '01/03/2024',
      url: '/assets/documents/REPUBLIQUE DU SENEGAL.pdf',
      niveau: 'Licence',
      annee: '2024'
    }
  ]);
  
  // Dossiers de filtrage avec statistiques correctes
  const folders = useMemo(() => {
    const allCount = documents.length + importantDocuments.length;
    const importantCount = importantDocuments.length;
    const licenceCount = documents.length; // Tous sont Licence
    
    return [
      { id: 'all', name: 'Tous les documents', count: allCount },
      { id: 'important', name: 'Documents importants', count: importantCount },
      { id: 'licence', name: 'Mémoires Licence', count: licenceCount },
    ];
  }, [documents, importantDocuments]);
  
  // Tous les documents
  const allDocuments = useMemo(() => [...importantDocuments, ...documents], [documents, importantDocuments]);
  
  // Filtrage des documents
  const filteredItems = useMemo(() => {
    return allDocuments.filter(item => {
      // Filtre par dossier
      if (selectedFolder === 'important' && !item.important) return false;
      if (selectedFolder === 'licence' && item.niveau !== 'Licence') return false;
      
      // Filtre par recherche
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [allDocuments, selectedFolder, searchQuery]);
  
  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);
  
  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedFolder, searchQuery]);
  
  const handleViewItem = (item: Document) => {
    setCurrentItem(item);
    setShowViewModal(true);
  };
  
  const getIcon = (important: boolean = false) => {
    if (important) {
      return <FiBookmark className="h-5 w-5 text-red-500" />;
    }
    return <FiFileText className="h-5 w-5 text-blue-500" />;
  };
  
  const renderModalContent = () => {
    if (!currentItem) return null;
    
    return (
      <div className="flex flex-col h-full">
        {currentItem.important && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
            <h4 className="font-medium mb-1 text-sm">Document important</h4>
            {currentItem.description && <p className="text-xs">{currentItem.description}</p>}
            {currentItem.category && (
              <div className="mt-2">
                <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                  {currentItem.category}
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src={currentItem.url}
            className="w-full h-full"
            title={currentItem.name}
          />
        </div>
        
        <div className="flex gap-3 mt-4 justify-center">
          <a 
            href={currentItem.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center text-sm"
          >
            <FiExternalLink className="mr-2 h-4 w-4" /> Ouvrir dans un nouvel onglet
          </a>
          <a 
            href={currentItem.url} 
            download={currentItem.fileName}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
          >
            <FiDownload className="mr-2 h-4 w-4" /> Télécharger
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white border border-gray-200 p-4 mb-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Bibliothèque Numérique</h1>
              <p className="text-xs text-gray-600">Consultez les mémoires et documents académiques</p>
            </div>
          </div>
        </div>
        
        {/* Section du document important */}
        {selectedFolder === 'all' && importantDocuments.length > 0 && (
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-900 mb-2 flex items-center">
              <FiBookmark className="mr-2 text-red-500 h-4 w-4" /> Document important
            </h2>
            <div className="bg-white border border-red-200 p-4 rounded-lg hover:shadow-md transition-shadow duration-200">
              {importantDocuments.map(doc => (
                <div key={doc.id} className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <FiFileText className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm mb-1">{doc.name}</h3>
                      {doc.description && (
                        <p className="text-xs text-gray-600 mb-2">{doc.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{doc.date}</span>
                        {doc.category && (
                          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                            {doc.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleViewItem(doc)}
                    className="ml-4 text-primary hover:text-primary-700 text-xs flex items-center whitespace-nowrap"
                  >
                    <FiEye className="mr-1 h-3 w-3" />
                    Consulter
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-200 p-3 rounded-lg"
            >
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Catégories</h2>
              
              <ul className="space-y-1">
                {folders.map(folder => (
                  <li key={folder.id}>
                    <button
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`flex items-center justify-between w-full p-2 rounded-md transition-colors duration-200 text-sm ${
                        selectedFolder === folder.id 
                          ? 'bg-primary text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center">
                        {folder.id === 'important' ? (
                          <FiBookmark className="mr-2 h-4 w-4" />
                        ) : (
                          <FiFolder className="mr-2 h-4 w-4" />
                        )}
                        <span className="text-xs">{folder.name}</span>
                      </div>
                      <span className={`${
                        selectedFolder === folder.id 
                          ? 'bg-white bg-opacity-20 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      } text-xs px-2 py-0.5 rounded-full`}>
                        {folder.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          
          {/* Contenu principal */}
          <div className="lg:col-span-3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-gray-200 rounded-lg"
            >
              <div className="p-3 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher des documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Auteur
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedItems.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                          Aucun document trouvé
                        </td>
                      </tr>
                    ) : (
                      paginatedItems.map(item => (
                        <tr key={item.id} className={`hover:bg-gray-50 ${item.important ? 'bg-red-50' : ''}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 mr-2">
                                {getIcon(item.important)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                  {item.size}
                                  {item.niveau && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      {item.niveau}
                                    </span>
                                  )}
                                  {item.category && (
                                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                      {item.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-xs text-gray-700">{item.uploadedBy}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-xs text-gray-700">{item.date}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
                            <button 
                              onClick={() => handleViewItem(item)}
                              className="text-primary hover:text-primary-700 flex items-center justify-end ml-auto"
                            >
                              <FiEye className="h-4 w-4 mr-1" />
                              <span>Consulter</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-xs text-gray-700">
                    Page {currentPage} sur {totalPages} ({filteredItems.length} documents)
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-xs flex items-center ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-700'
                      }`}
                    >
                      <FiChevronLeft className="h-3 w-3 mr-1" />
                      Précédent
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md text-xs flex items-center ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-700'
                      }`}
                    >
                      Suivant
                      <FiChevronRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Modal de consultation */}
      <AnimatePresence>
        {showViewModal && currentItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-5xl w-full h-[90vh] flex flex-col"
            >
              <div className="p-3 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center">
                  <h3 className="text-base font-semibold text-gray-900">{currentItem.name}</h3>
                  {currentItem.important && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                      <FiBookmark className="mr-1 h-3 w-3" />
                      Important
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-4">
                {renderModalContent()}
              </div>
              
              <div className="p-3 border-t border-gray-100 flex justify-between items-center flex-shrink-0">
                <div className="text-xs text-gray-600">
                  Ajouté par {currentItem.uploadedBy} le {currentItem.date}
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Bibliotheque;
