import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFile, FiImage, FiFilm, FiSearch, FiFolder, FiX, FiExternalLink, FiEye, FiHeart, FiMessageSquare, FiSend, FiBookmark, FiFileText, FiDownload, FiUpload, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
// Tab Button Component (même style que ClassesChef)
const TabButton = ({ children, isActive, onClick, icon }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-navy text-navy'
            : 'border-transparent text-gray-500 hover:text-gray-700'}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
const SimpleButton = ({ children, onClick, variant = 'primary', type = 'button', disabled = false }) => {
    const styles = {
        primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    };
    return (_jsx("button", { onClick: disabled ? undefined : onClick, disabled: disabled, type: type, className: `px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center rounded-sm ${styles[variant]}`, children: children }));
};
// Composant Médiathèque
const Mediatheque = ({ mediaItems, setMediaItems }) => {
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
    const [localMediaItems, setLocalMediaItems] = useState([
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
    const allMediaItems = [...importantDocuments, ...localMediaItems];
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
        setLocalMediaItems((prev) => prev.map((item) => {
            if (item.id === itemId) {
                return Object.assign(Object.assign({}, item), { likes: item.liked ? item.likes - 1 : item.likes + 1, liked: !item.liked });
            }
            return item;
        }));
        if (currentItem && currentItem.id === itemId) {
            setCurrentItem((prev) => {
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
        const isImportant = importantDocuments.some(doc => doc.id === currentItem.id);
        if (!isImportant) {
            setLocalMediaItems((prev) => prev.map((item) => {
                if (item.id === currentItem.id) {
                    return Object.assign(Object.assign({}, item), { comments: [...item.comments, newCommentObj] });
                }
                return item;
            }));
        }
        setCurrentItem((prev) => {
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
                return _jsx(FiImage, { className: "h-6 w-6 text-navy-500" });
            case 'video':
                return _jsx(FiFilm, { className: "h-6 w-6 text-navy-500" });
            default:
                return _jsx(FiFile, { className: "h-6 w-6 text-gray-500" });
        }
    };
    const renderModalContent = () => {
        if (!currentItem)
            return null;
        if (showComments) {
            return (_jsxs("div", { className: "p-4 h-96 flex flex-col", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Commentaires" }), _jsx("div", { className: "space-y-4 mb-6 flex-1 overflow-y-auto", children: currentItem.comments.length === 0 ? (_jsx("p", { className: "text-center text-gray-500", children: "Aucun commentaire pour le moment" })) : (currentItem.comments.map((comment) => (_jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("span", { className: "font-medium", children: comment.author }), _jsx("span", { className: "text-xs text-gray-500", children: comment.date })] }), _jsx("p", { className: "text-gray-700", children: comment.text })] }, comment.id)))) }), _jsx("div", { className: "border-t pt-4 mt-auto", children: _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "text", placeholder: "Ajouter un commentaire...", value: newComment, onChange: (e) => setNewComment(e.target.value), className: "flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy", onKeyDown: (e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddComment();
                                        }
                                    } }), _jsxs("button", { onClick: handleAddComment, disabled: !newComment.trim(), className: `py-2 px-4 rounded-r-md flex items-center justify-center ${newComment.trim()
                                        ? 'bg-navy text-white hover:bg-navy-dark'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`, children: [_jsx("span", { className: "mr-1", children: "Envoyer" }), _jsx(FiSend, { className: "h-4 w-4" })] })] }) })] }));
        }
        switch (currentItem.type) {
            case 'image':
                return (_jsx("div", { className: "p-4 flex justify-center", children: _jsx("img", { src: currentItem.url, alt: currentItem.name, className: "max-w-full max-h-[70vh] object-contain", onError: (e) => {
                            const target = e.target;
                            target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                        } }) }));
            case 'video':
                const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
                const match = currentItem.url.match(youtubeRegex);
                const videoId = match ? match[1] : null;
                if (videoId) {
                    return (_jsx("div", { className: "p-4 flex justify-center", children: _jsx("iframe", { width: "560", height: "315", src: `https://www.youtube.com/embed/${videoId}`, title: currentItem.name, frameBorder: "0", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }) }));
                }
                else {
                    return (_jsxs("div", { className: "p-4 flex flex-col items-center", children: [_jsx(FiFilm, { className: "h-20 w-20 text-gray-400 mb-4" }), _jsxs("p", { className: "text-center text-gray-600", children: ["La vid\u00E9o n'est pas disponible pour la pr\u00E9visualisation directe.", _jsx("a", { href: currentItem.url, target: "_blank", rel: "noopener noreferrer", className: "text-navy-600 hover:underline ml-1", children: "Ouvrir dans un nouvel onglet" })] })] }));
                }
            case 'document':
                return (_jsxs("div", { className: "p-4 flex flex-col items-center", children: [currentItem.important && (_jsxs("div", { className: "bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 max-w-md text-center", children: [_jsx("h4", { className: "font-medium mb-1", children: "Document important" }), currentItem.description && _jsx("p", { className: "text-sm", children: currentItem.description }), currentItem.category && (_jsx("div", { className: "mt-2", children: _jsx("span", { className: "bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full", children: currentItem.category }) }))] })), _jsx(FiFileText, { className: "h-20 w-20 text-gray-400 mb-4" }), _jsxs("p", { className: "text-center text-gray-600 mb-4", children: ["Document: ", currentItem.name] }), _jsxs("a", { href: currentItem.url, target: "_blank", rel: "noopener noreferrer", className: "bg-navy text-white px-4 py-2 rounded-sm flex items-center hover:bg-navy-dark transition-colors", children: [_jsx(FiExternalLink, { className: "mr-2" }), " Ouvrir le document"] })] }));
            default:
                return (_jsxs("div", { className: "p-4 flex flex-col items-center", children: [_jsx(FiFile, { className: "h-20 w-20 text-gray-400 mb-4" }), _jsx("p", { className: "text-center text-gray-600", children: "Ce type de fichier ne peut pas \u00EAtre pr\u00E9visualis\u00E9" })] }));
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "M\u00E9diath\u00E8que" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Consultez et g\u00E9rez les ressources partag\u00E9es" })] }), _jsxs(SimpleButton, { onClick: () => setShowImportantDocsOnly(!showImportantDocsOnly), variant: showImportantDocsOnly ? 'primary' : 'secondary', children: [_jsx(FiBookmark, { className: "mr-2 h-4 w-4" }), "Documents importants"] })] }), !showImportantDocsOnly && selectedFolder === 'all' && (_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-3 flex items-center", children: [_jsx(FiBookmark, { className: "mr-2 text-red-500" }), " Documents importants"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: importantDocuments.map(doc => (_jsxs("div", { className: "bg-white border border-gray-200 p-4 rounded-sm hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex items-start", children: [_jsx(FiFileText, { className: "h-8 w-8 text-red-500 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-1", children: doc.name }), doc.description && (_jsx("p", { className: "text-sm text-gray-600 mb-2 line-clamp-2", children: doc.description })), doc.category && (_jsx("span", { className: "inline-block bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full", children: doc.category }))] })] }), _jsxs("div", { className: "mt-4 flex justify-between items-center", children: [_jsxs("div", { className: "text-xs text-gray-500", children: ["Ajout\u00E9 le ", doc.date] }), _jsxs("button", { onClick: () => handleViewItem(doc), className: "text-navy hover:text-navy-dark text-sm flex items-center", children: [_jsx(FiEye, { className: "mr-1 h-4 w-4" }), "Consulter"] })] })] }, doc.id))) })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white border border-gray-200 p-4 rounded-sm", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Dossiers" }), _jsx("ul", { className: "space-y-2", children: folders.map(folder => (_jsx("li", { children: _jsxs("button", { onClick: () => setSelectedFolder(folder.id), className: `flex items-center justify-between w-full p-2 rounded-sm transition-colors duration-200 ${selectedFolder === folder.id
                                                ? 'bg-navy text-white'
                                                : 'text-gray-700 hover:bg-gray-100'}`, children: [_jsxs("div", { className: "flex items-center", children: [folder.id === 'important' ? (_jsx(FiBookmark, { className: "mr-2 h-5 w-5" })) : (_jsx(FiFolder, { className: "mr-2 h-5 w-5" })), _jsx("span", { className: "whitespace-nowrap", children: folder.name })] }), _jsx("span", { className: `${selectedFolder === folder.id
                                                        ? 'bg-white bg-opacity-20 text-white'
                                                        : 'bg-gray-100 text-gray-600'} text-xs px-2 py-1 rounded-full`, children: folder.count })] }) }, folder.id))) })] }) }), _jsx("div", { className: "lg:col-span-3", children: _jsxs("div", { className: "bg-white border border-gray-200 rounded-sm", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Rechercher des fichiers...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy" }), _jsx(FiSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" })] }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap", children: "Nom" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap", children: "T\u00E9l\u00E9vers\u00E9 par" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap", children: "Date" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap", children: "Interactions" }), _jsx("th", { className: "px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: filteredItems.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-10 text-center text-gray-500", children: "Aucun fichier trouv\u00E9" }) })) : (filteredItems.map(item => (_jsxs("tr", { className: `hover:bg-gray-50 transition-colors ${item.important ? 'bg-red-50' : ''}`, children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 mr-3", children: getIcon(item.type, item.important) }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: item.name }), _jsxs("div", { className: "text-sm text-gray-500 flex items-center", children: [item.size, item.category && (_jsx("span", { className: "ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full", children: item.category }))] })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-700", children: item.uploadedBy }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-700", children: item.date }) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsxs("div", { className: "flex items-center justify-center space-x-4", children: [_jsxs("button", { onClick: () => toggleLike(item.id), className: `flex items-center ${item.liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`, children: [_jsx(FiHeart, { className: `h-5 w-5 mr-1 ${item.liked ? 'fill-current' : ''}` }), _jsx("span", { children: item.likes })] }), _jsxs("button", { onClick: () => {
                                                                            handleViewItem(item);
                                                                            setShowComments(true);
                                                                        }, className: "flex items-center text-gray-500 hover:text-gray-700", children: [_jsx(FiMessageSquare, { className: "h-5 w-5 mr-1" }), _jsx("span", { children: item.comments.length })] })] }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("button", { onClick: () => handleViewItem(item), className: "text-navy hover:text-navy-dark flex items-center justify-end", children: [_jsx(FiEye, { className: "h-5 w-5 mr-1" }), _jsx("span", { children: "Consulter" })] }) })] }, item.id)))) })] }) })] }) })] }), _jsx(AnimatePresence, { children: showViewModal && currentItem && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, className: "bg-white rounded-sm shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-200 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: currentItem.name }), currentItem.important && (_jsxs("span", { className: "ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center", children: [_jsx(FiBookmark, { className: "mr-1 h-3 w-3" }), "Important"] }))] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("button", { onClick: () => toggleLike(currentItem.id), className: `flex items-center ${currentItem.liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`, children: [_jsx(FiHeart, { className: `h-5 w-5 mr-1 ${currentItem.liked ? 'fill-current' : ''}` }), _jsx("span", { children: currentItem.likes })] }), _jsxs("button", { onClick: () => setShowComments(!showComments), className: `flex items-center ${showComments ? 'text-navy' : 'text-gray-500'} hover:text-navy`, children: [_jsx(FiMessageSquare, { className: "h-5 w-5 mr-1" }), _jsx("span", { children: currentItem.comments.length })] }), _jsx("button", { onClick: () => setShowViewModal(false), className: "text-gray-500 hover:text-gray-700", children: _jsx(FiX, { className: "h-5 w-5" }) })] })] }), _jsx("div", { className: "flex-1 overflow-auto", children: renderModalContent() }), _jsxs("div", { className: "p-4 border-t border-gray-200 flex justify-between items-center", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Ajout\u00E9 par ", currentItem.uploadedBy, " le ", currentItem.date] }), _jsx(SimpleButton, { onClick: () => setShowViewModal(false), variant: "secondary", children: "Fermer" })] })] }) })) })] }));
};
// Composant Ajout Canevas
const AjoutCanevas = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        file: null
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleFileChange = (e) => {
        var _a;
        const file = ((_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0]) || null;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { file })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Canevas submitted:', formData);
        alert('Canevas ajouté avec succès !');
        setFormData({
            title: '',
            description: '',
            category: '',
            file: null
        });
    };
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "max-w-2xl mx-auto", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6 rounded-sm", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Ajouter un canevas" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "T\u00E9l\u00E9versez un nouveau canevas pour les m\u00E9moires" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Titre du canevas *" }), _jsx("input", { type: "text", name: "title", value: formData.title, onChange: handleChange, placeholder: "Ex: Canevas de m\u00E9moire Master 2", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy rounded-sm", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cat\u00E9gorie *" }), _jsxs("select", { name: "category", value: formData.category, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionner une cat\u00E9gorie" }), _jsx("option", { value: "Mod\u00E8le", children: "Mod\u00E8le" }), _jsx("option", { value: "Guide", children: "Guide" }), _jsx("option", { value: "Template", children: "Template" }), _jsx("option", { value: "Exemple", children: "Exemple" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleChange, placeholder: "Description du canevas...", rows: 4, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fichier *" }), _jsx("div", { className: "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-sm hover:border-gray-400 transition-colors", children: _jsxs("div", { className: "space-y-1 text-center", children: [_jsx(FiUpload, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsxs("div", { className: "flex text-sm text-gray-600", children: [_jsxs("label", { htmlFor: "file-upload", className: "relative cursor-pointer bg-white rounded-sm font-medium text-navy hover:text-navy-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-navy", children: [_jsx("span", { children: "T\u00E9l\u00E9verser un fichier" }), _jsx("input", { id: "file-upload", name: "file", type: "file", className: "sr-only", accept: ".pdf,.doc,.docx", onChange: handleFileChange, required: true })] }), _jsx("p", { className: "pl-1", children: "ou glisser-d\u00E9poser" })] }), _jsx("p", { className: "text-xs text-gray-500", children: "PDF, DOC, DOCX jusqu'\u00E0 10MB" }), formData.file && (_jsxs("p", { className: "text-sm text-gray-900 mt-2", children: ["Fichier s\u00E9lectionn\u00E9: ", formData.file.name] }))] }) })] }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx(SimpleButton, { type: "button", variant: "secondary", onClick: () => setFormData({
                                        title: '',
                                        description: '',
                                        category: '',
                                        file: null
                                    }), children: "R\u00E9initialiser" }), _jsxs(SimpleButton, { type: "submit", variant: "primary", children: [_jsx(FiPlus, { className: "h-4 w-4 mr-2" }), "Ajouter le canevas"] })] })] })] }) }));
};
// Composant Ajout Cours
const AjoutCours = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        department: '',
        level: '',
        files: []
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        setFormData(prev => (Object.assign(Object.assign({}, prev), { files })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Cours submitted:', formData);
        alert('Cours ajouté avec succès !');
        setFormData({
            name: '',
            description: '',
            department: '',
            level: '',
            files: []
        });
    };
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "max-w-2xl mx-auto", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6 rounded-sm", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Ajouter un cours" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Ajoutez des ressources de cours li\u00E9es aux m\u00E9moires" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nom du cours *" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, placeholder: "Ex: M\u00E9thodologie de recherche", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "D\u00E9partement *" }), _jsxs("select", { name: "department", value: formData.department, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionner un d\u00E9partement" }), _jsx("option", { value: "Informatique", children: "Informatique" }), _jsx("option", { value: "R\u00E9seaux", children: "R\u00E9seaux" }), _jsx("option", { value: "Management", children: "Management" }), _jsx("option", { value: "G\u00E9nie Civil", children: "G\u00E9nie Civil" }), _jsx("option", { value: "\u00C9lectronique", children: "\u00C9lectronique" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Niveau *" }), _jsxs("select", { name: "level", value: formData.level, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionner un niveau" }), _jsx("option", { value: "Licence 1", children: "Licence 1" }), _jsx("option", { value: "Licence 2", children: "Licence 2" }), _jsx("option", { value: "Licence 3", children: "Licence 3" }), _jsx("option", { value: "Master 1", children: "Master 1" }), _jsx("option", { value: "Master 2", children: "Master 2" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleChange, placeholder: "Description du cours et objectifs p\u00E9dagogiques...", rows: 4, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Ressources du cours" }), _jsx("div", { className: "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-sm hover:border-gray-400 transition-colors", children: _jsxs("div", { className: "space-y-1 text-center", children: [_jsx(FiUpload, { className: "mx-auto h-12 w-12 text-gray-400" }), _jsxs("div", { className: "flex text-sm text-gray-600", children: [_jsxs("label", { htmlFor: "files-upload", className: "relative cursor-pointer bg-white rounded-sm font-medium text-navy hover:text-navy-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-navy", children: [_jsx("span", { children: "T\u00E9l\u00E9verser des fichiers" }), _jsx("input", { id: "files-upload", name: "files", type: "file", multiple: true, className: "sr-only", accept: ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png", onChange: handleFileChange })] }), _jsx("p", { className: "pl-1", children: "ou glisser-d\u00E9poser" })] }), _jsx("p", { className: "text-xs text-gray-500", children: "PDF, DOC, PPT, Images (max 10MB chacun)" }), formData.files.length > 0 && (_jsxs("div", { className: "text-sm text-gray-900 mt-2", children: [_jsxs("p", { children: [formData.files.length, " fichier(s) s\u00E9lectionn\u00E9(s):"] }), _jsx("ul", { className: "text-xs text-gray-600 mt-1", children: formData.files.map((file, index) => (_jsxs("li", { children: ["\u2022 ", file.name] }, index))) })] }))] }) })] }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx(SimpleButton, { type: "button", variant: "secondary", onClick: () => setFormData({
                                        name: '',
                                        description: '',
                                        department: '',
                                        level: '',
                                        files: []
                                    }), children: "R\u00E9initialiser" }), _jsxs(SimpleButton, { type: "submit", variant: "primary", children: [_jsx(FiPlus, { className: "h-4 w-4 mr-2" }), "Ajouter le cours"] })] })] })] }) }));
};
// Ajouter le composant ArchiveDocuments
const ArchiveDocuments = ({ documents }) => (_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Documents enregistr\u00E9s" }), documents.length === 0 ? (_jsx("div", { className: "text-gray-500", children: "Aucun document archiv\u00E9." })) : (_jsx("ul", { className: "divide-y divide-gray-200", children: documents.map(doc => (_jsxs("li", { className: "py-3 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium text-gray-900", children: doc.name }), _jsxs("span", { className: "ml-2 text-xs text-gray-500", children: ["(", doc.size, ")"] }), _jsx("span", { className: "ml-2 text-xs text-gray-400", children: doc.date })] }), _jsxs("a", { href: doc.url, target: "_blank", rel: "noopener noreferrer", className: "text-navy hover:underline flex items-center", children: [_jsx(FiDownload, { className: "mr-1" }), " T\u00E9l\u00E9charger"] })] }, doc.id))) }))] }));
// Composant principal PageMemoires
const PageMemoires = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('mediatheque');
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
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6 rounded-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-blue-100 rounded-full p-3 mr-4", children: _jsx(FiBookmark, { className: "h-7 w-7 text-navy" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Gestion des M\u00E9moires" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "G\u00E9rez les ressources, canevas et cours li\u00E9s aux m\u00E9moires" })] })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6 rounded-sm", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("div", { className: "flex space-x-8 px-6", children: [_jsx(TabButton, { isActive: activeTab === 'mediatheque', onClick: () => setActiveTab('mediatheque'), icon: _jsx(FiFolder, { className: "h-4 w-4" }), children: "M\u00E9diath\u00E8que" }), ((user === null || user === void 0 ? void 0 : user.estChef) || (user === null || user === void 0 ? void 0 : user.estSecretaire)) && (_jsx(TabButton, { isActive: activeTab === 'ajout-canevas', onClick: () => setActiveTab('ajout-canevas'), icon: _jsx(FiFileText, { className: "h-4 w-4" }), children: "Ajout Canevas" })), ((user === null || user === void 0 ? void 0 : user.estChef) || (user === null || user === void 0 ? void 0 : user.estProfesseur)) && (_jsx(TabButton, { isActive: activeTab === 'ajout-cours', onClick: () => setActiveTab('ajout-cours'), icon: _jsx(FiPlus, { className: "h-4 w-4" }), children: "Ajout Cours" })), _jsx(TabButton, { isActive: activeTab === 'archivage', onClick: () => setActiveTab('archivage'), icon: _jsx(FiFile, { className: "h-4 w-4" }), children: "Archivage" })] }) }), _jsx("div", { className: "p-6", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'mediatheque' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(Mediatheque, { mediaItems: mediaItems, setMediaItems: setMediaItems }) }, "mediatheque")), activeTab === 'ajout-canevas' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(AjoutCanevas, {}) }, "ajout-canevas")), activeTab === 'ajout-cours' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(AjoutCours, {}) }, "ajout-cours")), activeTab === 'archivage' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(ArchiveDocuments, { documents: mediaItems.filter((m) => m.type === 'document') }) }, "archivage"))] }) })] })] }) }));
};
export default PageMemoires;
