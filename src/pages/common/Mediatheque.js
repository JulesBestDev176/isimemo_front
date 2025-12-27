import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import { Star, FileText, Eye, Calendar, User, X, ExternalLink, Link as LinkIcon, BookOpen, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { mockRessourcesMediatheque } from '../../models';
import { addRessourceSauvegardee, removeRessourceSauvegardee, isRessourceSauvegardee, getRessourcesSauvegardees, getRessourcesSauvegardeesProfesseur } from '../../models/ressource/RessourceSauvegardee';
import { trackInteraction } from '../../models/tracking/UserInteraction';
import { RecommendationEngine } from '../../models/recommendation/RecommendationEngine';
import { SemanticSearchEngine } from '../../models/search/SemanticSearch';
import SemanticSearchBar from '../../components/library/SemanticSearchBar';
import { useSearchHistory, usePageTimer } from '../../hooks/usePageTimer';
// Badge Component
const Badge = ({ children, variant = 'info' }) => {
    const variants = {
        success: 'bg-primary-100 text-primary-800',
        warning: 'bg-primary-100 text-primary-800',
        info: 'bg-primary-100 text-primary-800',
        error: 'bg-primary-100 text-primary-800',
        primary: 'bg-primary-100 text-primary-800',
        recommendation: 'bg-blue-50 text-blue-700 border border-blue-100'
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
            return 'bg-primary-100 text-primary-700';
        case 'lien':
            return 'bg-primary-100 text-primary-700';
        default:
            return 'bg-primary-100 text-primary-700';
    }
};
// Tab Button Component
const TabButton = ({ children, isActive, onClick, icon, count }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-navy text-navy bg-white'
            : 'border-transparent text-slate-500 hover:text-navy-700 bg-slate-50'}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children, count !== undefined && (_jsx("span", { className: `ml-2 px-2 py-0.5 text-xs font-medium border ${isActive
                    ? 'bg-navy-50 text-navy-700 border-navy-200'
                    : 'bg-navy-200 text-navy-600 border-navy-300'}`, children: count }))] }));
};
// Composant principal
const Mediatheque = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [niveauFilter, setNiveauFilter] = useState('tous');
    const [filiereFilter, setFiliereFilter] = useState('tous');
    const [typeFilter, setTypeFilter] = useState('tous');
    const [selectedRessource, setSelectedRessource] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    // Hooks personnalisés
    const { getHistory, addToHistory } = useSearchHistory();
    const [recentSearches, setRecentSearches] = useState([]);
    // Charger l'historique de recherche
    useEffect(() => {
        setRecentSearches(getHistory());
    }, []);
    // Tracking du temps passé sur la ressource sélectionnée
    usePageTimer((user === null || user === void 0 ? void 0 : user.id) ? parseInt(user.id) : undefined, selectedRessource === null || selectedRessource === void 0 ? void 0 : selectedRessource.idRessource, !!selectedRessource);
    // Initialiser les ressources sauvegardées de l'utilisateur
    const savedResourcesIds = useMemo(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return [];
        const id = parseInt(user.id);
        let savedResources;
        if (user.type === 'professeur') {
            savedResources = getRessourcesSauvegardeesProfesseur(id);
        }
        else {
            savedResources = getRessourcesSauvegardees(id);
        }
        return savedResources.map(rs => rs.idRessource);
    }, [user, refreshKey]);
    // Récupérer toutes les ressources de la médiathèque (uniquement les actives)
    const ressourcesMediatheque = useMemo(() => {
        return mockRessourcesMediatheque.filter(r => r.estActif !== false && r.categorie !== 'canevas');
    }, []);
    // Compter les ressources par catégorie
    const countsByCategory = useMemo(() => {
        const counts = {
            tous: ressourcesMediatheque.length,
            memoires: 0,
            canevas: 0
        };
        ressourcesMediatheque.forEach(ressource => {
            if (ressource.categorie in counts) {
                counts[ressource.categorie]++;
            }
        });
        return counts;
    }, [ressourcesMediatheque]);
    // Générer des recommandations (pour le tri)
    const recommendations = useMemo(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return [];
        try {
            const userId = parseInt(user.id);
            return RecommendationEngine.getHybridRecommendations(userId, ressourcesMediatheque, ressourcesMediatheque.length // Récupérer des scores pour tout
            );
        }
        catch (error) {
            console.error('Error generating recommendations:', error);
            return [];
        }
    }, [user, ressourcesMediatheque, refreshKey]);
    // Créer une map des scores de recommandation pour un accès rapide
    const recommendationMap = useMemo(() => {
        const map = new Map();
        recommendations.forEach(rec => {
            map.set(rec.ressource.idRessource, {
                score: rec.score,
                reason: rec.reasons[0],
                source: rec.source
            });
        });
        return map;
    }, [recommendations]);
    // Filtrage et Tri des ressources
    const filteredRessources = useMemo(() => {
        let filtered = [...ressourcesMediatheque];
        // Filtrer par niveau
        if (niveauFilter !== 'tous') {
            filtered = filtered.filter(ressource => {
                const tags = ressource.tags.map(t => t.toLowerCase());
                if (niveauFilter === 'licence') {
                    return tags.some(t => t.includes('licence') || t.includes('l3') || t.includes('l2') || t.includes('l1'));
                }
                else if (niveauFilter === 'master') {
                    return tags.some(t => t.includes('master') || t.includes('m1') || t.includes('m2'));
                }
                return true;
            });
        }
        // Filtrer par filière
        if (filiereFilter !== 'tous') {
            filtered = filtered.filter(ressource => {
                const tags = ressource.tags.map(t => t.toLowerCase());
                const titre = ressource.titre.toLowerCase();
                const description = ressource.description.toLowerCase();
                const searchIn = [...tags, titre, description].join(' ');
                switch (filiereFilter) {
                    case 'genie-logiciel':
                        return searchIn.includes('génie logiciel') || searchIn.includes('genie logiciel') || searchIn.includes('gl');
                    case 'iage':
                        return searchIn.includes('iage') || searchIn.includes('informatique appliquée');
                    case 'multimedia':
                        return searchIn.includes('multimédia') || searchIn.includes('multimedia');
                    case 'gda':
                        return searchIn.includes('gda') || searchIn.includes('gestion des affaires');
                    case 'mcd':
                        return searchIn.includes('mcd') || searchIn.includes('management') || searchIn.includes('commerce digital');
                    default:
                        return true;
                }
            });
        }
        // Filtrer par type (PDF uniquement maintenant)
        if (typeFilter === 'pdf') {
            filtered = filtered.filter(ressource => {
                var _a, _b;
                return ressource.typeRessource === 'document' &&
                    (((_a = ressource.cheminFichier) === null || _a === void 0 ? void 0 : _a.endsWith('.pdf')) || ((_b = ressource.cheminFichier) === null || _b === void 0 ? void 0 : _b.endsWith('.PDF')));
            });
        }
        // Filtrer par recherche (classique si pas de recherche sémantique)
        if (searchQuery) {
            filtered = filtered.filter(ressource => {
                return ressource.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ressource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ressource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            });
        }
        // TRI PAR DEFAUT : PERTINENCE (Score de recommandation)
        filtered.sort((a, b) => {
            var _a, _b;
            const scoreA = ((_a = recommendationMap.get(a.idRessource)) === null || _a === void 0 ? void 0 : _a.score) || 0;
            const scoreB = ((_b = recommendationMap.get(b.idRessource)) === null || _b === void 0 ? void 0 : _b.score) || 0;
            return scoreB - scoreA;
        });
        return filtered;
    }, [ressourcesMediatheque, niveauFilter, filiereFilter, typeFilter, searchQuery, recommendationMap]);
    // Recherche sémantique
    const semanticSearchResults = useMemo(() => {
        if (!searchQuery.trim())
            return null;
        try {
            return SemanticSearchEngine.search({ query: searchQuery, limit: 50 }, ressourcesMediatheque);
        }
        catch (error) {
            console.error('Error in semantic search:', error);
            return null;
        }
    }, [searchQuery, ressourcesMediatheque]);
    // Si recherche sémantique active, utiliser les résultats sémantiques
    const displayedResources = useMemo(() => {
        if (semanticSearchResults) {
            return semanticSearchResults.map(result => result.ressource);
        }
        return filteredRessources;
    }, [semanticSearchResults, filteredRessources]);
    // Pagination Logic
    const paginatedResources = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return displayedResources.slice(startIndex, startIndex + itemsPerPage);
    }, [displayedResources, currentPage]);
    const totalPages = Math.ceil(displayedResources.length / itemsPerPage);
    // Fonction pour sauvegarder/retirer une ressource
    const handleToggleSave = (idRessource) => {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return;
        const id = parseInt(user.id);
        const isCurrentlySaved = isRessourceSauvegardee(idRessource, user.type === 'professeur' ? undefined : id, user.type === 'professeur' ? id : undefined);
        if (isCurrentlySaved) {
            removeRessourceSauvegardee(idRessource, user.type === 'professeur' ? undefined : id, user.type === 'professeur' ? id : undefined);
            trackInteraction(id, idRessource, 'unsave');
        }
        else {
            addRessourceSauvegardee(idRessource, user.type === 'professeur' ? undefined : id, user.type === 'professeur' ? id : undefined);
            trackInteraction(id, idRessource, 'save');
        }
        setRefreshKey(prev => prev + 1);
    };
    // Vérifier si une ressource est sauvegardée
    const isSaved = (idRessource) => {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return false;
        const id = parseInt(user.id);
        return isRessourceSauvegardee(idRessource, user.type === 'professeur' ? undefined : id, user.type === 'professeur' ? id : undefined);
    };
    // Handler pour la recherche sémantique
    const handleSemanticSearch = (query) => {
        setSearchQuery(query);
        addToHistory(query);
        setRecentSearches(getHistory());
        setCurrentPage(1);
        if (user === null || user === void 0 ? void 0 : user.id) {
            trackInteraction(parseInt(user.id), 0, 'search', { searchQuery: query });
        }
    };
    // Handler pour ouvrir une ressource
    const handleOpenResource = (resource) => {
        setSelectedRessource(resource);
        if (user === null || user === void 0 ? void 0 : user.id) {
            trackInteraction(parseInt(user.id), resource.idRessource, 'view', {
                clickSource: searchQuery ? 'search' : 'direct'
            });
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Biblioth\u00E8que num\u00E9rique" }), _jsx("p", { className: "text-sm text-gray-600", children: "Explorez toutes les ressources disponibles : m\u00E9moires et documents acad\u00E9miques" })] }) }), _jsx("div", { className: "bg-white border border-gray-200 p-4 mb-6", children: _jsx("div", { className: "flex flex-col md:flex-row gap-4", children: _jsx("div", { className: "flex-1", children: _jsx(SemanticSearchBar, { onSearch: handleSemanticSearch, placeholder: "Recherche s\u00E9mantique intelligente...", recentSearches: recentSearches, onRecentSearchClick: handleSemanticSearch }) }) }) }), _jsx("div", { className: "bg-white border border-gray-200 p-4 mb-6", children: _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: "flex-1 min-w-[200px]", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Niveau" }), _jsxs("select", { value: niveauFilter, onChange: (e) => { setNiveauFilter(e.target.value); setCurrentPage(1); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "tous", children: "Tous les niveaux" }), _jsx("option", { value: "licence", children: "Licence" }), _jsx("option", { value: "master", children: "Master" })] })] }), _jsxs("div", { className: "flex-1 min-w-[200px]", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Fili\u00E8re" }), _jsxs("select", { value: filiereFilter, onChange: (e) => { setFiliereFilter(e.target.value); setCurrentPage(1); }, className: "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500", children: [_jsx("option", { value: "tous", children: "Toutes les fili\u00E8res" }), _jsx("option", { value: "genie-logiciel", children: "G\u00E9nie Logiciel" }), _jsx("option", { value: "iage", children: "IAGE" }), _jsx("option", { value: "multimedia", children: "Multim\u00E9dia" }), _jsx("option", { value: "gda", children: "GDA" }), _jsx("option", { value: "mcd", children: "MCD" })] })] })] }) }), _jsx("div", { className: "bg-white border border-gray-200 mb-6", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: paginatedResources.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "divide-y divide-gray-200", children: paginatedResources.map((ressource, index) => {
                                            const saved = isSaved(ressource.idRessource);
                                            return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: index * 0.05 }, className: `p-4 hover:bg-gray-50 transition-colors`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start flex-1", children: [_jsx("div", { className: `p-3 rounded-lg mr-4 ${getRessourceColor(ressource.typeRessource)}`, children: getRessourceIcon(ressource.typeRessource) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h3", { className: "font-semibold text-gray-900", children: ressource.titre }), ressource.estImportant && (_jsx(Badge, { variant: "warning", children: "Important" }))] }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: ressource.description }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-500 mb-2", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(User, { className: "h-3 w-3 mr-1" }), _jsx("span", { children: ressource.auteur })] }), ressource.filiere && (_jsxs("div", { className: "flex items-center", children: [_jsx(GraduationCap, { className: "h-3 w-3 mr-1" }), _jsx("span", { children: ressource.filiere === 'genie-logiciel' ? 'Génie Logiciel' : ressource.filiere === 'iage' ? 'IAGE' : ressource.filiere === 'multimedia' ? 'Multimédia' : ressource.filiere === 'gda' ? 'GDA' : ressource.filiere === 'mcd' ? 'MCD' : ressource.filiere })] })), ressource.niveau && ressource.niveau !== 'all' && (_jsxs("div", { className: "flex items-center", children: [_jsx(BookOpen, { className: "h-3 w-3 mr-1" }), _jsx("span", { children: ressource.niveau === 'licence' ? 'Licence' : ressource.niveau === 'master' ? 'Master' : ressource.niveau })] })), ressource.anneeAcademique && (_jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-3 w-3 mr-1" }), _jsx("span", { children: ressource.anneeAcademique })] }))] })] })] }), _jsxs("div", { className: "flex items-center gap-2 ml-4", children: [_jsx("button", { onClick: () => handleOpenResource(ressource), className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", title: "Voir", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => handleToggleSave(ressource.idRessource), className: `p-2 rounded-lg transition-colors ${saved
                                                                        ? 'text-primary-500 hover:text-primary-600 hover:bg-primary-50'
                                                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`, title: saved ? 'Retirer des sauvegardes' : 'Sauvegarder', children: _jsx(Star, { className: `h-4 w-4 ${saved ? 'fill-current' : ''}` }) })] })] }) }, ressource.idRessource));
                                        }) }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6", children: [_jsxs("div", { className: "flex flex-1 justify-between sm:hidden", children: [_jsx("button", { onClick: () => setCurrentPage(prev => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: "relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: "Pr\u00E9c\u00E9dent" }), _jsx("button", { onClick: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: "relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50", children: "Suivant" })] }), _jsxs("div", { className: "hidden sm:flex sm:flex-1 sm:items-center sm:justify-between", children: [_jsx("div", { children: _jsxs("p", { className: "text-sm text-gray-700", children: ["Affichage de ", _jsx("span", { className: "font-medium", children: (currentPage - 1) * itemsPerPage + 1 }), " \u00E0 ", _jsx("span", { className: "font-medium", children: Math.min(currentPage * itemsPerPage, displayedResources.length) }), " sur ", _jsx("span", { className: "font-medium", children: displayedResources.length }), " r\u00E9sultats"] }) }), _jsx("div", { children: _jsxs("nav", { className: "isolate inline-flex -space-x-px rounded-md shadow-sm", "aria-label": "Pagination", children: [_jsxs("button", { onClick: () => setCurrentPage(prev => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: "relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50", children: [_jsx("span", { className: "sr-only", children: "Pr\u00E9c\u00E9dent" }), _jsx(ChevronLeft, { className: "h-5 w-5", "aria-hidden": "true" })] }), Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (_jsx("button", { onClick: () => setCurrentPage(page), className: `relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                                                                        ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'}`, children: page }, page))), _jsxs("button", { onClick: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: "relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50", children: [_jsx("span", { className: "sr-only", children: "Suivant" }), _jsx(ChevronRight, { className: "h-5 w-5", "aria-hidden": "true" })] })] }) })] })] }))] })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx(FileText, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 mb-2", children: "Aucune ressource trouv\u00E9e" }), _jsx("p", { className: "text-sm text-gray-500", children: searchQuery
                                            ? 'Essayez de modifier vos critères de recherche'
                                            : 'Aucune ressource disponible dans la médiathèque.' })] })) }, "resources") }) }), _jsx(AnimatePresence, { children: selectedRessource && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: () => setSelectedRessource(null), children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, onClick: (e) => e.stopPropagation(), className: "bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `p-3 rounded-lg mr-4 ${getRessourceColor(selectedRessource.typeRessource)}`, children: getRessourceIcon(selectedRessource.typeRessource) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: selectedRessource.titre }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Badge, { variant: "info", children: selectedRessource.categorie }), selectedRessource.estImportant && (_jsx(Badge, { variant: "warning", children: "Important" }))] })] })] }), _jsx("button", { onClick: () => setSelectedRessource(null), className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Description" }), _jsx("p", { className: "text-gray-600", children: selectedRessource.description })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(User, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "\u00C9tudiant" })] }), _jsx("p", { className: "text-gray-900", children: selectedRessource.auteur })] }), selectedRessource.auteurEmail && (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(FileText, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Email" })] }), _jsx("p", { className: "text-gray-900", children: selectedRessource.auteurEmail })] })), selectedRessource.filiere && (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(GraduationCap, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Fili\u00E8re" })] }), _jsx("p", { className: "text-gray-900", children: selectedRessource.filiere === 'genie-logiciel' ? 'Génie Logiciel' :
                                                                    selectedRessource.filiere === 'iage' ? 'IAGE' :
                                                                        selectedRessource.filiere === 'multimedia' ? 'Multimédia' :
                                                                            selectedRessource.filiere === 'gda' ? 'GDA' :
                                                                                selectedRessource.filiere === 'mcd' ? 'MCD' : selectedRessource.filiere })] })), selectedRessource.niveau && selectedRessource.niveau !== 'all' && (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(BookOpen, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Niveau d'\u00E9tudes" })] }), _jsx("p", { className: "text-gray-900", children: selectedRessource.niveau === 'licence' ? 'Licence' : selectedRessource.niveau === 'master' ? 'Master' : selectedRessource.niveau })] })), selectedRessource.anneeAcademique && (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Calendar, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Ann\u00E9e acad\u00E9mique" })] }), _jsx("p", { className: "text-gray-900", children: selectedRessource.anneeAcademique })] }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Acc\u00E8s \u00E0 la ressource" }), selectedRessource.cheminFichier && (selectedRessource.cheminFichier.endsWith('.pdf') || selectedRessource.cheminFichier.endsWith('.PDF')) ? (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4 bg-gray-50", children: [_jsx("div", { className: "w-full h-[600px] bg-white rounded-lg shadow-inner flex items-center justify-center", children: _jsx("object", { data: selectedRessource.cheminFichier, type: "application/pdf", className: "w-full h-full rounded-lg", children: _jsxs("div", { className: "text-center p-6", children: [_jsx("p", { className: "text-gray-600 mb-4", children: "Impossible d'afficher le PDF directement." }), _jsxs("a", { href: selectedRessource.cheminFichier, target: "_blank", rel: "noopener noreferrer", className: "btn-primary inline-flex items-center", children: [_jsx(ExternalLink, { className: "h-4 w-4 mr-2" }), "T\u00E9l\u00E9charger le PDF"] })] }) }) }), _jsx("div", { className: "flex justify-center gap-3 mt-4", children: _jsxs("button", { className: "btn-outline flex items-center", onClick: () => {
                                                                        window.open(selectedRessource.cheminFichier, '_blank');
                                                                    }, children: [_jsx(ExternalLink, { className: "h-4 w-4 mr-2" }), "Ouvrir dans un nouvel onglet"] }) })] })) : (_jsxs("div", { className: "border border-gray-200 rounded-lg p-8 bg-gray-50 text-center", children: [getRessourceIcon(selectedRessource.typeRessource), _jsx("p", { className: "text-gray-600 mb-4 mt-4", children: selectedRessource.cheminFichier
                                                                    ? 'La ressource est disponible dans la médiathèque.'
                                                                    : selectedRessource.url
                                                                        ? 'La ressource est accessible via un lien externe.'
                                                                        : 'La ressource est disponible dans la médiathèque.' }), _jsx("div", { className: "flex justify-center gap-3", children: selectedRessource.url && (_jsxs("button", { className: "btn-outline flex items-center", onClick: () => {
                                                                        window.open(selectedRessource.url, '_blank');
                                                                    }, children: [_jsx(ExternalLink, { className: "h-4 w-4 mr-2" }), "Ouvrir le lien"] })) })] }))] })] }) }), _jsxs("div", { className: "p-6 border-t border-gray-200 flex justify-between items-center", children: [_jsxs("button", { onClick: () => handleToggleSave(selectedRessource.idRessource), className: `px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${isSaved(selectedRessource.idRessource)
                                                ? 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100'
                                                : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'}`, children: [_jsx(Star, { className: `h-4 w-4 ${isSaved(selectedRessource.idRessource) ? 'fill-current' : ''}` }), isSaved(selectedRessource.idRessource) ? 'Retirer des sauvegardes' : 'Sauvegarder'] }), _jsx("button", { onClick: () => setSelectedRessource(null), className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Fermer" })] })] }) })) })] }) }));
};
export default Mediatheque;
