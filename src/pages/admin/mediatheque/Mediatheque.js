import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//deja bon
import { useState } from 'react';
import { FiFile, FiImage, FiFilm, FiSearch, FiFolder, FiX, FiExternalLink, FiEye, FiHeart, FiMessageSquare, FiSend, FiBookmark, FiFileText } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
// Composant principal
const Mediatheque = () => {
    const [selectedFolder, setSelectedFolder] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showViewModal, setShowViewModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [showImportantDocsOnly, setShowImportantDocsOnly] = useState(false);
    // Données fictives pour les dossiers
    const folders = [
        { id: 'all', name: 'Tous les fichiers', count: 20 },
        { id: 'images', name: 'Images', count: 6 },
        { id: 'documents', name: 'Documents', count: 12 },
        { id: 'videos', name: 'Vidéos', count: 2 },
        { id: 'important', name: 'Documents importants', count: 4 },
    ];
    // Données fictives pour les documents importants
    const importantDocuments = [
        {
            id: 101,
            name: 'Canevas de mémoire.pdf',
            type: 'document',
            size: '1.2 MB',
            uploadedBy: 'Admin',
            date: '01/01/2025',
            url: 'https://example.com/canevas.pdf',
            likes: 25,
            liked: false,
            comments: [
                { id: 1, author: 'Dr. Ahmed Diop', text: 'Ce canevas est à utiliser obligatoirement pour tous les mémoires.', date: '02/01/2025' }
            ],
            important: true,
            description: 'Format officiel à utiliser pour tous les mémoires de fin d\'études.',
            category: 'Modèle'
        },
        {
            id: 102,
            name: 'Guide de rédaction.pdf',
            type: 'document',
            size: '3.5 MB',
            uploadedBy: 'Admin',
            date: '01/01/2025',
            url: 'https://example.com/guide.pdf',
            likes: 18,
            liked: false,
            comments: [],
            important: true,
            description: 'Guide complet détaillant les règles de rédaction académique pour les mémoires.',
            category: 'Guide'
        },
        {
            id: 103,
            name: 'Calendrier académique 2025.pdf',
            type: 'document',
            size: '850 KB',
            uploadedBy: 'Admin',
            date: '15/12/2024',
            url: 'https://example.com/calendrier.pdf',
            likes: 32,
            liked: true,
            comments: [
                { id: 1, author: 'Marie Faye', text: 'Merci pour le calendrier mis à jour.', date: '16/12/2024' }
            ],
            important: true,
            description: 'Calendrier officiel de l\'année académique 2025 avec toutes les dates importantes.',
            category: 'Planning'
        },
        {
            id: 104,
            name: 'Charte graphique ISI.pdf',
            type: 'document',
            size: '4.2 MB',
            uploadedBy: 'Admin',
            date: '10/01/2025',
            url: 'https://example.com/charte.pdf',
            likes: 15,
            liked: false,
            comments: [],
            important: true,
            description: 'Charte graphique officielle de l\'Institut à respecter pour tous les documents.',
            category: 'Modèle'
        }
    ];
    // Données fictives pour les médias réguliers
    const [mediaItems, setMediaItems] = useState([
        {
            id: 1,
            name: 'presentation.pdf',
            type: 'document',
            size: '2.5 MB',
            uploadedBy: 'Admin',
            date: '12/05/2025',
            url: 'https://example.com/presentation.pdf',
            likes: 8,
            liked: false,
            comments: [
                { id: 1, author: 'Dr. Ahmed Diop', text: 'Très bonne présentation, merci pour le partage.', date: '13/05/2025' },
                { id: 2, author: 'Marie Faye', text: 'Je vais l\'utiliser pour mon cours.', date: '14/05/2025' }
            ]
        },
        {
            id: 2,
            name: 'logo.png',
            type: 'image',
            size: '540 KB',
            uploadedBy: 'Admin',
            date: '10/05/2025',
            url: 'https://example.com/logo.png',
            likes: 5,
            liked: true,
            comments: [
                { id: 1, author: 'Fatou Sow', text: 'Super design !', date: '11/05/2025' }
            ]
        },
        {
            id: 3,
            name: 'rapport.docx',
            type: 'document',
            size: '1.2 MB',
            uploadedBy: 'Admin',
            date: '08/05/2025',
            url: 'https://example.com/rapport.docx',
            likes: 3,
            liked: false,
            comments: []
        },
        {
            id: 4,
            name: 'cours_intro.mp4',
            type: 'video',
            size: '45 MB',
            uploadedBy: 'Admin',
            date: '05/05/2025',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            likes: 12,
            liked: false,
            comments: [
                { id: 1, author: 'Dr. Ousmane Fall', text: 'Vidéo très instructive.', date: '06/05/2025' },
                { id: 2, author: 'Dr. Ibrahima Ndiaye', text: 'Excellente introduction, merci !', date: '07/05/2025' }
            ]
        },
        {
            id: 5,
            name: 'banner.jpg',
            type: 'image',
            size: '1.8 MB',
            uploadedBy: 'Admin',
            date: '01/05/2025',
            url: 'https://example.com/banner.jpg',
            likes: 7,
            liked: false,
            comments: [
                { id: 1, author: 'Marie Faye', text: 'Belle image !', date: '02/05/2025' }
            ]
        },
    ]);
    // Tous les médias (importants + réguliers)
    const allMediaItems = [...importantDocuments, ...mediaItems];
    const filteredItems = allMediaItems.filter(item => {
        // Filtre par dossier spécial "important"
        if (selectedFolder === 'important') {
            return item.important === true && item.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
        // Filtre par dossier
        const matchesFolder = selectedFolder === 'all' || item.type === selectedFolder.replace('s', '');
        // Filtre par recherche
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        // Filtre si on veut voir uniquement les documents importants
        const matchesImportance = showImportantDocsOnly ? item.important : true;
        return matchesFolder && matchesSearch && matchesImportance;
    });
    const handleViewItem = (item) => {
        setCurrentItem(item);
        setShowViewModal(true);
        setShowComments(false);
    };
    const toggleLike = (itemId) => {
        // Mettre à jour les médias réguliers
        setMediaItems(prev => prev.map(item => {
            if (item.id === itemId) {
                return Object.assign(Object.assign({}, item), { likes: item.liked ? item.likes - 1 : item.likes + 1, liked: !item.liked });
            }
            return item;
        }));
        // Si l'élément est actuellement en cours de visionnage, mettre à jour également currentItem
        if (currentItem && currentItem.id === itemId) {
            setCurrentItem(prev => {
                if (!prev)
                    return null;
                return Object.assign(Object.assign({}, prev), { likes: prev.liked ? prev.likes - 1 : prev.likes + 1, liked: !prev.liked });
            });
        }
    };
    const handleAddComment = () => {
        if (!currentItem || !newComment.trim())
            return;
        const newCommentObj = {
            id: Date.now(),
            author: 'Admin',
            text: newComment.trim(),
            date: new Date().toLocaleDateString('fr-FR')
        };
        // Déterminer si le document actuel est un document important
        const isImportant = importantDocuments.some(doc => doc.id === currentItem.id);
        if (!isImportant) {
            // Mettre à jour les médias réguliers
            setMediaItems(prev => prev.map(item => {
                if (item.id === currentItem.id) {
                    return Object.assign(Object.assign({}, item), { comments: [...item.comments, newCommentObj] });
                }
                return item;
            }));
        }
        // Dans tous les cas, mettre à jour currentItem
        setCurrentItem(prev => {
            if (!prev)
                return null;
            return Object.assign(Object.assign({}, prev), { comments: [...prev.comments, newCommentObj] });
        });
        setNewComment('');
    };
    const getIcon = (type, important = false) => {
        if (important) {
            return _jsx(FiBookmark, { className: "h-6 w-6 text-red-500" });
        }
        switch (type) {
            case 'image':
                return _jsx(FiImage, { className: "h-6 w-6 text-blue-500" });
            case 'video':
                return _jsx(FiFilm, { className: "h-6 w-6 text-purple-500" });
            default:
                return _jsx(FiFile, { className: "h-6 w-6 text-gray-500" });
        }
    };
    const renderModalContent = () => {
        if (!currentItem)
            return null;
        if (showComments) {
            return (_jsxs("div", { className: "p-4 h-96 flex flex-col", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Commentaires" }), _jsx("div", { className: "space-y-4 mb-6 flex-1 overflow-y-auto", children: currentItem.comments.length === 0 ? (_jsx("p", { className: "text-center text-gray-500", children: "Aucun commentaire pour le moment" })) : (currentItem.comments.map(comment => (_jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "font-medium", children: comment.author }), _jsx("span", { className: "text-xs text-gray-500", children: comment.date })] }), _jsx("p", { className: "text-gray-700", children: comment.text })] }, comment.id)))) }), _jsx("div", { className: "border-t pt-4 mt-auto", children: _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "text", placeholder: "Ajouter un commentaire...", value: newComment, onChange: (e) => setNewComment(e.target.value), className: "flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", onKeyDown: (e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddComment();
                                        }
                                    } }), _jsxs("button", { onClick: handleAddComment, disabled: !newComment.trim(), className: `py-2 px-4 rounded-r-md flex items-center justify-center ${newComment.trim()
                                        ? 'bg-primary text-white hover:bg-primary-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`, children: [_jsx("span", { className: "mr-1", children: "Envoyer" }), _jsx(FiSend, { className: "h-4 w-4" })] })] }) })] }));
        }
        switch (currentItem.type) {
            case 'image':
                return (_jsx("div", { className: "p-4 flex justify-center", children: _jsx("img", { src: currentItem.url, alt: currentItem.name, className: "max-w-full max-h-[70vh] object-contain", onError: (e) => {
                            const target = e.target;
                            target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                        } }) }));
            case 'video':
                // Pour les vidéos, extraire l'ID YouTube si c'est un lien YouTube
                const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
                const match = currentItem.url.match(youtubeRegex);
                const videoId = match ? match[1] : null;
                if (videoId) {
                    return (_jsx("div", { className: "p-4 flex justify-center", children: _jsx("iframe", { width: "560", height: "315", src: `https://www.youtube.com/embed/${videoId}`, title: currentItem.name, frameBorder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }) }));
                }
                else if (currentItem.url.includes('drive.google.com')) {
                    return (_jsx("div", { className: "p-4 flex justify-center", children: _jsx("iframe", { width: "560", height: "315", src: currentItem.url.replace('/view', '/preview'), title: currentItem.name, frameBorder: "0", allowFullScreen: true }) }));
                }
                else {
                    return (_jsxs("div", { className: "p-4 flex flex-col items-center", children: [_jsx(FiFilm, { className: "h-20 w-20 text-gray-400 mb-4" }), _jsxs("p", { className: "text-center text-gray-600", children: ["La vid\u00E9o n'est pas disponible pour la pr\u00E9visualisation directe.", _jsx("a", { href: currentItem.url, target: "_blank", rel: "noopener noreferrer", className: "text-primary hover:underline ml-1", children: "Ouvrir dans un nouvel onglet" })] })] }));
                }
            case 'document':
                return (_jsxs("div", { className: "p-4 flex flex-col items-center", children: [currentItem.important && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 max-w-md text-center", children: [_jsx("h4", { className: "font-medium mb-1", children: "Document important" }), currentItem.description && _jsx("p", { className: "text-sm", children: currentItem.description }), currentItem.category && (_jsx("div", { className: "mt-2", children: _jsx("span", { className: "bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full", children: currentItem.category }) }))] })), _jsx(FiFileText, { className: "h-20 w-20 text-gray-400 mb-4" }), _jsxs("p", { className: "text-center text-gray-600 mb-4", children: ["Document: ", currentItem.name] }), _jsxs("a", { href: currentItem.url, target: "_blank", rel: "noopener noreferrer", className: "btn-primary flex items-center", children: [_jsx(FiExternalLink, { className: "mr-2" }), " Ouvrir le document"] })] }));
            default:
                return (_jsxs("div", { className: "p-4 flex flex-col items-center", children: [_jsx(FiFile, { className: "h-20 w-20 text-gray-400 mb-4" }), _jsx("p", { className: "text-center text-gray-600", children: "Ce type de fichier ne peut pas \u00EAtre pr\u00E9visualis\u00E9" })] }));
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "M\u00E9diath\u00E8que" }), _jsx("div", { children: _jsxs("button", { onClick: () => setShowImportantDocsOnly(!showImportantDocsOnly), className: `flex items-center ${showImportantDocsOnly
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-700'} px-3 py-1.5 rounded-md hover:bg-opacity-90 transition-colors`, children: [_jsx(FiBookmark, { className: `mr-2 ${showImportantDocsOnly ? 'text-red-500' : ''}` }), "Documents importants"] }) })] }), !showImportantDocsOnly && selectedFolder === 'all' && (_jsxs("div", { className: "mb-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-navy mb-3 flex items-center", children: [_jsx(FiBookmark, { className: "mr-2 text-red-500" }), " Documents importants"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: importantDocuments.map(doc => (_jsxs("div", { className: "card p-4 hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex items-start", children: [_jsx(FiFileText, { className: "h-8 w-8 text-red-500 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-navy-800 mb-1", children: doc.name }), doc.description && (_jsx("p", { className: "text-sm text-gray-600 mb-2 line-clamp-2", children: doc.description })), doc.category && (_jsx("span", { className: "inline-block bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full", children: doc.category }))] })] }), _jsxs("div", { className: "mt-4 flex justify-between items-center", children: [_jsxs("div", { className: "text-xs text-gray-500", children: ["Ajout\u00E9 le ", doc.date] }), _jsxs("button", { onClick: () => handleViewItem(doc), className: "text-primary hover:text-primary-700 text-sm flex items-center", children: [_jsx(FiEye, { className: "mr-1 h-4 w-4" }), "Consulter"] })] })] }, doc.id))) })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5 }, className: "card p-4", children: [_jsx("h2", { className: "text-lg font-semibold text-navy mb-4", children: "Dossiers" }), _jsx("ul", { className: "space-y-2", children: folders.map(folder => (_jsx("li", { children: _jsxs("button", { onClick: () => setSelectedFolder(folder.id), className: `flex items-center justify-between w-full p-2 rounded-md transition-colors duration-200 ${selectedFolder === folder.id
                                                ? 'bg-primary text-white'
                                                : 'text-gray-700 hover:bg-gray-100'}`, children: [_jsxs("div", { className: "flex items-center", children: [folder.id === 'important' ? (_jsx(FiBookmark, { className: "mr-2 h-5 w-5" })) : (_jsx(FiFolder, { className: "mr-2 h-5 w-5" })), _jsx("span", { children: folder.name })] }), _jsx("span", { className: `${selectedFolder === folder.id
                                                        ? 'bg-white bg-opacity-20 text-white'
                                                        : 'bg-gray-100 text-gray-600'} text-xs px-2 py-1 rounded-full`, children: folder.count })] }) }, folder.id))) })] }) }), _jsx("div", { className: "lg:col-span-3", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "card", children: [_jsx("div", { className: "p-4 border-b border-gray-100", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Rechercher des fichiers...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" }), _jsx(FiSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" })] }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Nom" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "T\u00E9l\u00E9vers\u00E9 par" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Interactions" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredItems.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-10 text-center text-gray-500", children: "Aucun fichier trouv\u00E9" }) })) : (filteredItems.map(item => (_jsxs("tr", { className: `hover:bg-gray-50 ${item.important ? 'bg-red-50' : ''}`, children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 mr-3", children: getIcon(item.type, item.important) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: item.name }), _jsxs("div", { className: "text-sm text-gray-500", children: [item.size, item.category && (_jsx("span", { className: "ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full", children: item.category }))] })] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-700", children: item.uploadedBy }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-700", children: item.date }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-center", children: _jsxs("div", { className: "flex items-center justify-center space-x-4", children: [_jsxs("button", { onClick: () => toggleLike(item.id), className: `flex items-center ${item.liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`, children: [_jsx(FiHeart, { className: `h-5 w-5 mr-1 ${item.liked ? 'fill-current' : ''}` }), _jsx("span", { children: item.likes })] }), _jsxs("button", { onClick: () => {
                                                                            handleViewItem(item);
                                                                            setShowComments(true);
                                                                        }, className: "flex items-center text-gray-500 hover:text-gray-700", children: [_jsx(FiMessageSquare, { className: "h-5 w-5 mr-1" }), _jsx("span", { children: item.comments.length })] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("button", { onClick: () => handleViewItem(item), className: "text-primary hover:text-primary-700 flex items-center justify-end", children: [_jsx(FiEye, { className: "h-5 w-5 mr-1" }), _jsx("span", { children: "Consulter" })] }) })] }, item.id)))) })] }) })] }) })] }), _jsx(AnimatePresence, { children: showViewModal && currentItem && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, className: "bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-100 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("h3", { className: "text-lg font-semibold text-navy", children: currentItem.name }), currentItem.important && (_jsxs("span", { className: "ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center", children: [_jsx(FiBookmark, { className: "mr-1 h-3 w-3" }), "Important"] }))] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("button", { onClick: () => toggleLike(currentItem.id), className: `flex items-center ${currentItem.liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`, children: [_jsx(FiHeart, { className: `h-5 w-5 mr-1 ${currentItem.liked ? 'fill-current' : ''}` }), _jsx("span", { children: currentItem.likes })] }), _jsxs("button", { onClick: () => setShowComments(!showComments), className: `flex items-center ${showComments ? 'text-primary' : 'text-gray-500'} hover:text-primary`, children: [_jsx(FiMessageSquare, { className: "h-5 w-5 mr-1" }), _jsx("span", { children: currentItem.comments.length })] }), _jsx("button", { onClick: () => setShowViewModal(false), className: "text-gray-500 hover:text-gray-700", children: _jsx(FiX, { className: "h-5 w-5" }) })] })] }), _jsx("div", { className: "flex-1 overflow-auto", children: renderModalContent() }), _jsxs("div", { className: "p-4 border-t border-gray-100 flex justify-between items-center", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Ajout\u00E9 par ", currentItem.uploadedBy, " le ", currentItem.date] }), _jsx("button", { onClick: () => setShowViewModal(false), className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200", children: "Fermer" })] })] }) })) })] }));
};
export default Mediatheque;
