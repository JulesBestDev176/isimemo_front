import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Star, Search, FileText, Eye, Calendar, User, X, ExternalLink, Link as LinkIcon, Trash2, BookOpen, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getRessourcesSauvegardees, getRessourcesSauvegardeesProfesseur } from '../../models';
// Badge Component
const Badge = ({ children, variant = 'info' }) => {
    const variants = {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-orange-100 text-orange-800',
        info: 'bg-blue-100 text-blue-800',
        error: 'bg-red-100 text-red-800',
        primary: 'bg-primary-100 text-primary-800'
    };
    return (_jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`, children: children }));
};
// Formatage des dates
const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
// Obtenir l'icône selon le type de ressource
const getRessourceIcon = (type) => {
    switch (type) {
        case 'document':
            return _jsx(FileText, { className: "h-5 w-5" });
        case 'lien':
            return _jsx(LinkIcon, { className: "h-5 w-5" });
        default:
            return _jsx(FileText, { className: "h-5 w-5" });
    }
};
// Obtenir la couleur selon le type de ressource
const getRessourceColor = (type) => {
    switch (type) {
        case 'document':
            return 'bg-blue-100 text-blue-700';
        case 'lien':
            return 'bg-green-100 text-green-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};
// Composant principal
const RessourcesSauvegardees = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [niveauFilter, setNiveauFilter] = useState('all');
    const [filiereFilter, setFiliereFilter] = useState('all');
    const [selectedRessource, setSelectedRessource] = useState(null);
    const [savedResources, setSavedResources] = useState([]);
    // Récupérer les ressources sauvegardées de l'utilisateur (étudiant ou professeur)
    const ressourcesSauvegardees = useMemo(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return [];
        let resources = [];
        if (user.type === 'professeur') {
            resources = getRessourcesSauvegardeesProfesseur(parseInt(user.id));
        }
        else {
            resources = getRessourcesSauvegardees(parseInt(user.id));
        }
        setSavedResources(resources);
        // Filtrer les ressources undefined et retourner uniquement les ressources valides
        return resources
            .map(rs => rs.ressource)
            .filter((ressource) => ressource !== undefined);
    }, [user]);
    // Filtrage des ressources par filtres et recherche
    const filteredRessources = useMemo(() => {
        let filtered = ressourcesSauvegardees;
        // Filtrer par niveau
        if (niveauFilter !== 'all') {
            filtered = filtered.filter(ressource => ressource.niveau === niveauFilter);
        }
        // Filtrer par filière
        if (filiereFilter !== 'all') {
            filtered = filtered.filter(ressource => ressource.filiere === filiereFilter);
        }
        // Filtrer par recherche
        if (searchQuery) {
            filtered = filtered.filter(ressource => {
                return ressource.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ressource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ressource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (ressource.filiere && ressource.filiere.toLowerCase().includes(searchQuery.toLowerCase()));
            });
        }
        return filtered;
    }, [ressourcesSauvegardees, niveauFilter, filiereFilter, searchQuery]);
    // Fonction pour retirer une ressource des sauvegardes
    const handleUnsave = (idRessource) => {
        // TODO: Remplacer par un appel API
        setSavedResources(prev => prev.filter(rs => rs.idRessource !== idRessource));
    };
    // Obtenir la date de sauvegarde d'une ressource
    const getSavedDate = (idRessource) => {
        const saved = savedResources.find(rs => rs.idRessource === idRessource);
        return saved ? saved.dateSauvegarde : null;
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Ressources Sauvegard\u00E9es" }), _jsx("p", { className: "text-sm text-gray-600", children: "Consultez les ressources de la m\u00E9diath\u00E8que que vous avez sauvegard\u00E9es" })] }) }), _jsx("div", { className: "bg-white border border-gray-200 p-4 mb-6 rounded-lg shadow-sm", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Rechercher par titre, description, tags...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx("div", { className: "w-full sm:w-48", children: _jsxs("select", { value: niveauFilter, onChange: (e) => setNiveauFilter(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-700", children: [_jsx("option", { value: "all", children: "Tous les niveaux" }), _jsx("option", { value: "licence", children: "Licence" }), _jsx("option", { value: "master", children: "Master" })] }) }), _jsx("div", { className: "w-full sm:w-48", children: _jsxs("select", { value: filiereFilter, onChange: (e) => setFiliereFilter(e.target.value), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-700", children: [_jsx("option", { value: "all", children: "Toutes les fili\u00E8res" }), _jsx("option", { value: "genie-logiciel", children: "G\u00E9nie Logiciel" }), _jsx("option", { value: "iage", children: "IAGE" }), _jsx("option", { value: "multimedia", children: "Multim\u00E9dia" }), _jsx("option", { value: "gda", children: "GDA" }), _jsx("option", { value: "mcd", children: "MCD" })] }) })] })] }) }), _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { layout: true, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: filteredRessources.length > 0 ? (_jsx("div", { className: "space-y-4", children: filteredRessources.map((ressource, index) => {
                                const savedDate = getSavedDate(ressource.idRessource);
                                return (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.05 }, className: "bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start flex-1 gap-4", children: [_jsx("div", { className: `p-3 rounded-lg ${getRessourceColor(ressource.typeRessource)}`, children: getRessourceIcon(ressource.typeRessource) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: ressource.titre }) }), _jsx("p", { className: "text-sm text-gray-600 mb-4 line-clamp-2", children: ressource.description }), _jsxs("div", { className: "flex flex-wrap items-center gap-4 text-xs text-gray-500", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(User, { className: "h-3 w-3 mr-1" }), _jsx("span", { children: ressource.auteur })] }), ressource.filiere && (_jsxs("div", { className: "flex items-center", children: [_jsx(GraduationCap, { className: "h-3 w-3 mr-1" }), _jsx("span", { children: ressource.filiere === 'genie-logiciel' ? 'Génie Logiciel' :
                                                                                    ressource.filiere === 'iage' ? 'IAGE' :
                                                                                        ressource.filiere === 'multimedia' ? 'Multimédia' :
                                                                                            ressource.filiere === 'gda' ? 'GDA' :
                                                                                                ressource.filiere === 'mcd' ? 'MCD' : ressource.filiere })] })), ressource.niveau && ressource.niveau !== 'all' && (_jsxs("div", { className: "flex items-center", children: [_jsx(BookOpen, { className: "h-3 w-3 mr-1" }), _jsx("span", { children: ressource.niveau === 'licence' ? 'Licence' : ressource.niveau === 'master' ? 'Master' : ressource.niveau })] })), ressource.anneeAcademique && (_jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-3 w-3 mr-1" }), _jsx("span", { children: ressource.anneeAcademique })] }))] })] })] }), _jsxs("div", { className: "flex items-center gap-2 ml-4", children: [_jsx("button", { onClick: () => setSelectedRessource(ressource), className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", title: "Voir", children: _jsx(Eye, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleUnsave(ressource.idRessource), className: "p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50", title: "Retirer des sauvegardes", children: _jsx(Trash2, { className: "h-5 w-5" }) })] })] }) }, ressource.idRessource));
                            }) })) : (_jsxs("div", { className: "text-center py-12 bg-white rounded-lg border border-gray-200", children: [_jsx(Star, { className: "h-16 w-16 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 mb-2 font-medium", children: "Aucune ressource trouv\u00E9e" }), _jsx("p", { className: "text-sm text-gray-500", children: searchQuery
                                        ? 'Essayez de modifier vos critères de recherche ou filtres.'
                                        : 'Vous n\'avez pas encore sauvegardé de ressources correspondant à ces critères.' })] })) }) }), _jsx(AnimatePresence, { children: selectedRessource && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: () => setSelectedRessource(null), children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, onClick: (e) => e.stopPropagation(), className: "bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `p-3 rounded-lg mr-4 ${getRessourceColor(selectedRessource.typeRessource)}`, children: getRessourceIcon(selectedRessource.typeRessource) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: selectedRessource.titre }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Badge, { variant: "info", children: selectedRessource.categorie }), selectedRessource.estImportant && (_jsx(Badge, { variant: "warning", children: "Important" }))] })] })] }), _jsx("button", { onClick: () => setSelectedRessource(null), className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Description" }), _jsx("p", { className: "text-gray-600", children: selectedRessource.description })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(User, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "\u00C9tudiant" })] }), _jsx("p", { className: "text-gray-900", children: selectedRessource.auteur }), selectedRessource.auteurEmail && (_jsx("p", { className: "text-xs text-gray-500 mt-1", children: selectedRessource.auteurEmail }))] }), selectedRessource.filiere && (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(GraduationCap, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Fili\u00E8re" })] }), _jsx("p", { className: "text-gray-900", children: selectedRessource.filiere === 'genie-logiciel' ? 'Génie Logiciel' :
                                                                    selectedRessource.filiere === 'iage' ? 'IAGE' :
                                                                        selectedRessource.filiere === 'multimedia' ? 'Multimédia' :
                                                                            selectedRessource.filiere === 'gda' ? 'GDA' :
                                                                                selectedRessource.filiere === 'mcd' ? 'MCD' : selectedRessource.filiere })] })), selectedRessource.niveau && selectedRessource.niveau !== 'all' && (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(BookOpen, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Niveau d'\u00E9tudes" })] }), _jsx("p", { className: "text-gray-900", children: selectedRessource.niveau === 'licence' ? 'Licence' : selectedRessource.niveau === 'master' ? 'Master' : selectedRessource.niveau })] })), selectedRessource.anneeAcademique && (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Calendar, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Ann\u00E9e acad\u00E9mique" })] }), _jsx("p", { className: "text-gray-900", children: selectedRessource.anneeAcademique })] }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Acc\u00E8s \u00E0 la ressource" }), selectedRessource.cheminFichier && (selectedRessource.cheminFichier.endsWith('.pdf') || selectedRessource.cheminFichier.endsWith('.PDF')) ? (
                                                    // Visualiseur PDF intégré
                                                    _jsxs("div", { className: "border border-gray-200 rounded-lg p-4 bg-gray-50", children: [_jsx("div", { className: "w-full", style: { height: '600px' }, children: _jsx("object", { data: selectedRessource.cheminFichier, type: "application/pdf", width: "100%", height: "100%", className: "rounded-lg", children: _jsxs("p", { children: ["Votre navigateur ne supporte pas l'affichage de PDF. ", _jsx("a", { href: selectedRessource.cheminFichier, target: "_blank", rel: "noreferrer", children: "T\u00E9l\u00E9charger le PDF" }), "."] }) }) }), _jsx("div", { className: "flex justify-center gap-3 mt-4", children: _jsxs("button", { className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center", onClick: () => {
                                                                        window.open(selectedRessource.cheminFichier, '_blank');
                                                                    }, children: [_jsx(ExternalLink, { className: "h-4 w-4 mr-2" }), "Ouvrir dans un nouvel onglet"] }) })] })) : (_jsxs("div", { className: "border border-gray-200 rounded-lg p-8 bg-gray-50 text-center", children: [getRessourceIcon(selectedRessource.typeRessource), _jsx("p", { className: "text-gray-600 mb-4 mt-4", children: selectedRessource.cheminFichier
                                                                    ? 'La ressource est disponible.'
                                                                    : selectedRessource.url
                                                                        ? 'La ressource est accessible via un lien externe.'
                                                                        : 'La ressource est indisponible.' }), _jsx("div", { className: "flex justify-center gap-3", children: selectedRessource.url && (_jsxs("button", { className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center", onClick: () => {
                                                                        window.open(selectedRessource.url, '_blank');
                                                                    }, children: [_jsx(ExternalLink, { className: "h-4 w-4 mr-2" }), "Ouvrir le lien"] })) })] }))] })] }) }), _jsx("div", { className: "p-6 border-t border-gray-200 flex justify-end", children: _jsx("button", { onClick: () => setSelectedRessource(null), className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Fermer" }) })] }) })) })] }) }));
};
export default RessourcesSauvegardees;
