var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Users, Download, Upload, Filter, Edit, X, Eye, BarChart3, FileText, School, Mail, Calendar, CheckCircle, Gavel, UserCheck, Clock, Shuffle, GraduationCap } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { RoleJury } from '../../../models/soutenance/MembreJury';
import { useGenerationJurys } from '../../../hooks/useGenerationJurys';
import { EnhancedAutoGenerateJuryModal } from '../../../components/jury/EnhancedAutoGenerateJuryModal';
// Composant utilitaire SimpleButton
const SimpleButton = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon }) => {
    const styles = {
        primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        success: `bg-green-600 text-white border border-green-600 hover:bg-green-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        warning: `bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    };
    return (_jsxs("button", { onClick: disabled ? undefined : onClick, disabled: disabled, type: type, className: `px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${styles[variant]}`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
// Composant utilitaire TabButton
const TabButton = ({ children, isActive, onClick, icon }) => {
    return (_jsxs("button", { onClick: onClick, className: `flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ` +
            (isActive ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-gray-700'), children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
// Mock useAuth
const useAuth = () => ({
    user: {
        id: '1',
        name: 'Dr. Amadou Diop',
        email: 'chef.informatique@isimemo.edu.sn',
        department: 'Informatique',
        estChef: true
    }
});
// Données fictives initiales (pour l'exemple UI, à remplacer par fetch)
const JURYS_DATA_INITIAL = [
// Exemple statique si besoin
];
// Onglet Liste des jurys
const JuryListTab = ({ jurys, onViewDetails, onEditJury, onToggleStatus, onGenerateJury, onImportCSV }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sessionFilter, setSessionFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const filteredJurys = jurys.filter(jury => {
        const matchesSearch = jury.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            jury.specialite.toLowerCase().includes(searchQuery.toLowerCase()) ||
            jury.membres.some(membre => membre.professeur.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                membre.professeur.prenom.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || jury.statut === statusFilter;
        const matchesType = typeFilter === 'all' || jury.type === typeFilter;
        const matchesSession = sessionFilter === 'all' || jury.session === sessionFilter;
        return matchesSearch && matchesStatus && matchesType && matchesSession;
    });
    const getSessionLabel = (session) => {
        switch (session) {
            case 'septembre': return 'Septembre';
            case 'decembre': return 'Décembre';
            case 'speciale': return 'Spéciale';
            default: return session;
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-4", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Actions" }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(SimpleButton, { variant: "primary", icon: _jsx(Shuffle, { className: "h-4 w-4" }), onClick: onGenerateJury, children: "G\u00E9n\u00E9rer des jurys" }), _jsx(SimpleButton, { variant: "primary", icon: _jsx(Upload, { className: "h-4 w-4" }), onClick: onImportCSV, children: "Importer (CSV)" }), _jsx(SimpleButton, { variant: "secondary", icon: _jsx(Download, { className: "h-4 w-4" }), children: "Exporter" })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Filtres et recherche" }), _jsxs(SimpleButton, { variant: "ghost", onClick: () => setShowFilters(!showFilters), icon: _jsx(Filter, { className: "h-4 w-4" }), children: [showFilters ? 'Masquer' : 'Afficher', " les filtres"] })] }), _jsxs("div", { className: "relative mb-4", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Rechercher un jury...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsx(AnimatePresence, { children: showFilters && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3 }, className: "overflow-hidden", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Statut" }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Tous les statuts" }), _jsx("option", { value: "actif", children: "Actif" }), _jsx("option", { value: "inactif", children: "Inactif" }), _jsx("option", { value: "archive", children: "Archiv\u00E9" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Type" }), _jsxs("select", { value: typeFilter, onChange: (e) => setTypeFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Tous les types" }), _jsx("option", { value: "licence", children: "Licence" }), _jsx("option", { value: "master", children: "Master" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Session" }), _jsxs("select", { value: sessionFilter, onChange: (e) => setSessionFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Toutes les sessions" }), _jsx("option", { value: "septembre", children: "Septembre" }), _jsx("option", { value: "decembre", children: "D\u00E9cembre" }), _jsx("option", { value: "speciale", children: "Sp\u00E9ciale" })] })] })] }) })) })] }), filteredJurys.length === 0 ? (_jsxs("div", { className: "bg-white border border-gray-200 p-8 text-center", children: [_jsx(Users, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-600 mb-2", children: "Aucun jury trouv\u00E9" }), _jsx("p", { className: "text-gray-500", children: "Essayez de modifier vos crit\u00E8res de recherche ou filtres." })] })) : (_jsx("div", { className: "bg-white border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Jury" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Type" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Session" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Pr\u00E9sident" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tudiants" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredJurys.map((jury, index) => {
                                    const president = jury.membres.find(m => m.role === RoleJury.PRESIDENT);
                                    return (_jsxs(motion.tr, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3", children: _jsx(Users, { className: "h-5 w-5 text-gray-600" }) }), _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-gray-900 flex items-center", children: [jury.nom, jury.generationAuto && (_jsxs(Badge, { variant: "outline", className: "ml-2", children: [_jsx(Shuffle, { className: "h-3 w-3 mr-1" }), "Auto"] }))] }), _jsxs("div", { className: "text-sm text-gray-500 flex items-center", children: [_jsx(Calendar, { className: "h-3 w-3 mr-1" }), jury.anneeAcademique] })] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs(Badge, { variant: "default", children: [_jsx(GraduationCap, { className: "inline h-3 w-3 mr-1" }), jury.type] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { variant: "outline", children: getSessionLabel(jury.session) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: president && (_jsxs("div", { className: "flex items-center", children: [_jsx(Gavel, { className: "h-4 w-4 text-navy mr-2" }), _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-gray-900", children: [president.professeur.prenom, " ", president.professeur.nom] }), _jsx("div", { className: "text-xs text-gray-500", children: president.professeur.grade })] })] })) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(User, { className: "h-4 w-4 text-green-600 mr-1" }), _jsx("span", { className: "text-sm text-gray-900", children: jury.etudiants.length })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { variant: jury.statut === 'actif' ? 'secondary' :
                                                        jury.statut === 'inactif' ? 'destructive' : 'outline', children: jury.statut }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => onViewDetails(jury), className: "p-2 text-gray-600 hover:text-navy hover:bg-navy-light border border-gray-300 hover:border-navy transition-colors duration-200", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => onEditJury(jury), className: "p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-300 hover:border-green-300 transition-colors duration-200", children: _jsx(Edit, { className: "h-4 w-4" }) })] }) })] }, jury.id));
                                }) })] }) }) }))] }));
};
// Onglet Statistiques
const StatisticsTab = ({ jurys }) => {
    const juryActifs = jurys.filter(j => j.statut === 'actif');
    const jurysAutoGeneres = jurys.filter(j => j.generationAuto);
    const statsParType = ['licence', 'master'].map(type => {
        const jurysByType = jurys.filter(j => j.type === type);
        return {
            name: type.charAt(0).toUpperCase() + type.slice(1),
            count: jurysByType.length,
            actifs: jurysByType.filter(j => j.statut === 'actif').length,
            autoGeneres: jurysByType.filter(j => j.generationAuto).length
        };
    });
    const statsParSession = ['septembre', 'decembre', 'speciale'].map(session => {
        const jurysBySession = jurys.filter(j => j.session === session);
        return {
            name: session.charAt(0).toUpperCase() + session.slice(1),
            count: jurysBySession.length,
            actifs: jurysBySession.filter(j => j.statut === 'actif').length,
            autoGeneres: jurysBySession.filter(j => j.generationAuto).length
        };
    });
    const totalEtudiants = jurys.reduce((total, jury) => total + jury.etudiants.length, 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                    { title: "Total Jurys", value: jurys.length, icon: Users, color: "bg-navy-light text-navy" },
                    { title: "Jurys Actifs", value: juryActifs.length, icon: CheckCircle, color: "bg-green-100 text-green-600" },
                    { title: "Auto-générés", value: jurysAutoGeneres.length, icon: Shuffle, color: "bg-purple-100 text-purple-600" },
                    { title: "Total Étudiants", value: totalEtudiants, icon: GraduationCap, color: "bg-orange-100 text-orange-600" }
                ].map((stat, index) => (_jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${stat.color} p-3 mr-4`, children: _jsx(stat.icon, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: stat.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.value })] })] }) }, stat.title))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par type" }), _jsx("div", { className: "space-y-3", children: statsParType.map(type => {
                                    const percentage = jurys.length > 0 ? Math.round((type.count / jurys.length) * 100) : 0;
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: type.name }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3", children: _jsx("div", { className: "bg-navy h-2", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: type.count })] })] }, type.name));
                                }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par session" }), _jsx("div", { className: "space-y-3", children: statsParSession.map(session => {
                                    const percentage = jurys.length > 0 ? Math.round((session.count / jurys.length) * 100) : 0;
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: session.name }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3", children: _jsx("div", { className: "bg-green-500 h-2", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: session.count })] })] }, session.name));
                                }) })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "D\u00E9tails par jury" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Jury" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Type" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Session" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tudiants" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Membres" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: jurys.map((jury) => (_jsxs("tr", { children: [_jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: jury.nom }), _jsx("div", { className: "text-sm text-gray-500", children: jury.dateCreation })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { variant: "default", children: jury.type }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { variant: "outline", children: jury.session }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: jury.etudiants.length }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: jury.membres.length }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { variant: jury.statut === 'actif' ? 'secondary' :
                                                        jury.statut === 'inactif' ? 'destructive' : 'outline', children: jury.statut }) })] }, jury.id))) })] }) })] })] }));
};
// Composant principal
const JuryChef = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [selectedJury, setSelectedJury] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jurysState, setJurysState] = useState(JURYS_DATA_INITIAL);
    const [showAutoGenerateModal, setShowAutoGenerateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [juryToEdit, setJuryToEdit] = useState(null);
    const { user } = useAuth();
    const openJuryDetails = (jury) => {
        setSelectedJury(jury);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setSelectedJury(null);
        setIsModalOpen(false);
    };
    const handleEditJury = (jury) => {
        setJuryToEdit(jury);
        setEditModalOpen(true);
    };
    const toggleJuryStatus = (id) => {
        setJurysState(prev => prev.map(jury => jury.id === id
            ? Object.assign(Object.assign({}, jury), { statut: jury.statut === 'actif' ? 'inactif' : 'actif' }) : jury));
    };
    const handleGenerateJurys = (propositions, session, niveau, annee) => {
        // Convertir les propositions en objets JuryAffichage
        const nouveauxJurys = propositions.map((prop, index) => ({
            id: Math.max(...jurysState.map(j => j.id), 0) + index + 1,
            nom: `Jury ${user.department} ${niveau.toUpperCase()} - Session ${session} ${annee} - Lot ${index + 1}`,
            type: niveau,
            specialite: user.department,
            department: user.department,
            anneeAcademique: annee,
            membres: prop.membres,
            etudiants: prop.dossiers,
            dateCreation: new Date().toLocaleDateString('fr-FR'),
            statut: 'actif',
            session: session,
            generationAuto: true
        }));
        setJurysState(prev => [...prev, ...nouveauxJurys]);
        alert(`${nouveauxJurys.length} jury(s) généré(s) avec succès !`);
    };
    const handleImportData = (type, file) => {
        console.log(`Importing ${type} from file:`, file.name);
        // Simulation du parsing et de l'import
        alert(`Import ${type} réalisé avec succès !\nFichier: ${file.name}\nTaille: ${Math.round(file.size / 1024)} KB`);
    };
    const handleSaveJury = (jury) => {
        setJurysState(prev => prev.map(j => j.id === jury.id ? Object.assign(Object.assign({}, j), jury) : j));
        setEditModalOpen(false);
    };
    return (_jsx("div", { className: "JuryChef min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy-light rounded-full p-3 mr-4", children: _jsx(Users, { className: "h-7 w-7 text-navy" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Gestion des Jurys" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["D\u00E9partement ", user.department, " - Cr\u00E9ez, g\u00E9rez et organisez les jurys de soutenance"] })] })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("nav", { className: "flex space-x-8 px-6", children: [_jsx(TabButton, { isActive: activeTab === 'list', onClick: () => setActiveTab('list'), icon: _jsx(FileText, { className: "h-4 w-4" }), children: "Liste des jurys" }), _jsx(TabButton, { isActive: activeTab === 'stats', onClick: () => setActiveTab('stats'), icon: _jsx(BarChart3, { className: "h-4 w-4" }), children: "Statistiques" })] }) }), _jsxs("div", { className: "p-6", children: [activeTab === 'list' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(JuryListTab, { jurys: jurysState, onViewDetails: openJuryDetails, onEditJury: handleEditJury, onToggleStatus: toggleJuryStatus, onGenerateJury: () => setShowAutoGenerateModal(true), onImportCSV: () => setShowImportModal(true) }) })), activeTab === 'stats' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(StatisticsTab, { jurys: jurysState }) }))] })] }), _jsx(JuryDetailsModal, { jury: selectedJury, isOpen: isModalOpen, onClose: closeModal }), _jsx(EnhancedAutoGenerateJuryModal, { isOpen: showAutoGenerateModal, onClose: () => setShowAutoGenerateModal(false), onGenerate: handleGenerateJurys, userDepartment: user.department }), _jsx(ImportCSVModal, { isOpen: showImportModal, onClose: () => setShowImportModal(false), onImport: handleImportData }), _jsx(EditJuryModal, { isOpen: editModalOpen, onClose: () => setEditModalOpen(false), jury: juryToEdit, onSave: handleSaveJury })] }) }));
};
export default JuryChef;
// Modal pour afficher les détails d'un jury
const JuryDetailsModal = ({ jury, isOpen, onClose }) => {
    if (!isOpen || !jury)
        return null;
    const getRoleIcon = (role) => {
        switch (role) {
            case RoleJury.PRESIDENT: return _jsx(Gavel, { className: "h-4 w-4" });
            case RoleJury.RAPPORTEUR: return _jsx(FileText, { className: "h-4 w-4" });
            case RoleJury.EXAMINATEUR: return _jsx(UserCheck, { className: "h-4 w-4" });
            default: return _jsx(User, { className: "h-4 w-4" });
        }
    };
    const getRoleLabel = (role) => {
        switch (role) {
            case RoleJury.PRESIDENT: return 'Président';
            case RoleJury.RAPPORTEUR: return 'Rapporteur';
            case RoleJury.EXAMINATEUR: return 'Examinateur';
            default: return role;
        }
    };
    const getSessionLabel = (session) => {
        switch (session) {
            case 'septembre': return 'Septembre';
            case 'decembre': return 'Décembre';
            case 'speciale': return 'Spéciale';
            default: return session;
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: jury.nom }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Badge, { variant: jury.statut === 'actif' ? 'secondary' :
                                                jury.statut === 'inactif' ? 'destructive' : 'outline', children: jury.statut }), _jsx(Badge, { variant: "default", children: jury.type }), _jsx(Badge, { variant: "outline", children: jury.specialite }), _jsxs(Badge, { variant: "outline", children: ["Session ", getSessionLabel(jury.session)] }), jury.generationAuto && (_jsxs(Badge, { variant: "outline", children: [_jsx(Shuffle, { className: "h-3 w-3 mr-1" }), "Auto-g\u00E9n\u00E9r\u00E9"] }))] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Informations g\u00E9n\u00E9rales" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Ann\u00E9e acad\u00E9mique" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 text-gray-400 mr-2" }), jury.anneeAcademique] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Session" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 text-gray-400 mr-2" }), getSessionLabel(jury.session)] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Date de cr\u00E9ation" }), _jsx("p", { className: "text-gray-900", children: jury.dateCreation })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Membres du jury" }), _jsx("div", { className: "space-y-3", children: jury.membres.map((membre, index) => (_jsxs("div", { className: "border border-gray-200 p-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center", children: [getRoleIcon(membre.role), _jsx("span", { className: "ml-2 font-medium text-gray-900", children: getRoleLabel(membre.role) })] }), _jsx(Badge, { variant: "secondary", children: membre.professeur.grade })] }), _jsxs("p", { className: "text-gray-900 font-medium", children: [membre.professeur.prenom, " ", membre.professeur.nom] }), _jsxs("p", { className: "text-sm text-gray-600 flex items-center", children: [_jsx(Mail, { className: "h-3 w-3 mr-1" }), membre.professeur.email] }), _jsxs("p", { className: "text-sm text-gray-600 flex items-center", children: [_jsx(School, { className: "h-3 w-3 mr-1" }), membre.professeur.departement] })] }, index))) })] })] }), _jsxs("div", { className: "mt-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: ["\u00C9tudiants assign\u00E9s (", jury.etudiants.length, ")"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: jury.etudiants.map((dossier, index) => {
                                var _a;
                                const candidat = (_a = dossier.candidats) === null || _a === void 0 ? void 0 : _a[0]; // On prend le premier candidat pour l'affichage
                                const encadrant = dossier.encadrant;
                                return (_jsxs("div", { className: "border border-gray-200 p-3", children: [_jsx("p", { className: "font-medium text-gray-900", children: candidat ? `${candidat.prenom} ${candidat.nom}` : 'Candidat inconnu' }), _jsx("p", { className: "text-sm text-gray-600", children: candidat === null || candidat === void 0 ? void 0 : candidat.email }), _jsx("div", { className: "flex items-center gap-2 mt-2 flex-wrap" }), encadrant && (_jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Encadrant: ", encadrant.prenom, " ", encadrant.nom] })), _jsx("div", { className: "mt-2", children: _jsx("p", { className: "text-sm font-medium text-gray-700", children: dossier.titre }) })] }, index));
                            }) })] }), _jsx("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: _jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Fermer" }) })] }) }));
};
// Modal de génération automatique de jury
const AutoGenerateJuryModal = ({ isOpen, onClose, onGenerate, userDepartment }) => {
    // Imports locaux pour éviter les conflits si non importés en haut
    // Idéalement, ces imports devraient être en haut du fichier, mais pour ce replace_content localisé :
    // On suppose que les mocks sont accessibles ou on les utilise directement via les props si on refactorisait tout.
    // Pour l'instant, on va utiliser des valeurs calculées simulées basées sur les mocks existants importés en haut ou ici.
    // Note: Dans une vraie implémentation, on utiliserait des hooks pour récupérer ces infos.
    // Ici on va simuler la récupération de l'année active et session ouverte.
    const [anneeAcademique, setAnneeAcademique] = useState('2024-2025'); // Sera écrasé par l'active
    const [selectedNiveau, setSelectedNiveau] = useState('licence'); // Fixé à Licence
    const [selectedSession, setSelectedSession] = useState('');
    const [propositions, setPropositions] = useState([]);
    const [configError, setConfigError] = useState(null);
    const { genererPropositions, isGenerating, error } = useGenerationJurys();
    useEffect(() => {
        if (isOpen) {
            // 1. Récupérer l'année active
            // Simulation : on prend la dernière année du mock ou une valeur fixe pour l'exemple
            const anneeActive = '2024-2025';
            setAnneeAcademique(anneeActive);
            // 2. Récupérer la session ouverte pour cette année
            // Simulation : on cherche une session ouverte
            // Dans le mock SessionSoutenance.mock.ts, la session 3 (Septembre 2025) est ouverte
            const sessionOuverte = 'Septembre'; // On simule qu'on a trouvé "Septembre"
            if (sessionOuverte) {
                setSelectedSession(sessionOuverte);
                setConfigError(null);
            }
            else {
                setConfigError("Aucune session de soutenance n'est actuellement ouverte pour l'année en cours.");
            }
            // 3. Niveau fixé à Licence 3
            setSelectedNiveau('licence');
        }
    }, [isOpen]);
    const handlePreview = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!selectedSession)
            return;
        const result = yield genererPropositions(anneeAcademique, selectedSession, selectedNiveau, userDepartment);
        setPropositions(result);
    });
    const handleConfirm = () => {
        const valides = propositions.filter(p => p.valide);
        if (valides.length === 0) {
            alert("Aucune proposition valide à générer.");
            return;
        }
        onGenerate(valides, selectedSession, selectedNiveau, anneeAcademique);
        onClose();
    };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "G\u00E9n\u00E9ration automatique de jury" }), _jsxs("p", { className: "text-sm text-gray-500", children: ["D\u00E9partement ", userDepartment] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsx("div", { className: "space-y-6", children: configError ? (_jsxs("div", { className: "p-4 bg-red-50 text-red-600 border border-red-200 rounded flex items-center", children: [_jsx(X, { className: "h-5 w-5 mr-2" }), configError] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1", children: "Ann\u00E9e Acad\u00E9mique" }), _jsxs("p", { className: "text-lg font-semibold text-gray-900 flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 mr-2 text-navy" }), anneeAcademique] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1", children: "Session Active" }), _jsxs("p", { className: "text-lg font-semibold text-green-700 flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-2" }), selectedSession] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1", children: "Niveau Cible" }), _jsxs("p", { className: "text-lg font-semibold text-gray-900 flex items-center", children: [_jsx(GraduationCap, { className: "h-4 w-4 mr-2 text-navy" }), "Licence 3"] })] })] }), _jsx("div", { className: "mt-4 p-3 bg-blue-50 border border-blue-200 rounded", children: _jsxs("p", { className: "text-sm text-blue-800", children: [_jsx("strong", { children: "Dimensionnement automatique :" }), " Le syst\u00E8me calcule le nombre optimal de jurys en fonction de l'effectif (max 10 \u00E9tudiants/jury, sauf si reste \u2264 5)."] }) }), _jsx("div", { className: "flex justify-end", children: _jsx(SimpleButton, { onClick: handlePreview, disabled: isGenerating || !selectedSession, children: isGenerating ? 'Calcul en cours...' : 'Prévisualiser les propositions' }) }), error && (_jsx("div", { className: "p-4 bg-red-50 text-red-600 border border-red-200 rounded", children: error })), propositions.length > 0 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "font-semibold text-gray-900", children: ["Propositions (", propositions.length, ")"] }), propositions.map((prop, idx) => (_jsxs("div", { className: `p-4 border rounded ${prop.valide ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`, children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("h4", { className: "font-medium", children: ["Jury ", idx + 1, " - ", prop.dossiers.length, " \u00E9tudiants"] }), _jsx(Badge, { variant: prop.valide ? 'secondary' : 'destructive', children: prop.valide ? 'Valide' : 'Invalide' })] }), !prop.valide && _jsx("p", { className: "text-sm text-red-600 mt-1", children: prop.messageErreur }), _jsxs("div", { className: "mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-700", children: "Membres :" }), _jsx("ul", { className: "list-disc list-inside", children: prop.membres.map((m, i) => (_jsxs("li", { children: [m.role, " : ", m.professeur.prenom, " ", m.professeur.nom] }, i))) })] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-gray-700", children: "\u00C9tudiants :" }), _jsxs("p", { className: "text-gray-600", children: [prop.dossiers.length, " dossier(s)"] })] })] })] }, idx)))] }))] })) }), _jsxs("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: [_jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Annuler" }), _jsx(SimpleButton, { variant: "primary", onClick: handleConfirm, disabled: propositions.filter(p => p.valide).length === 0, icon: _jsx(Shuffle, { className: "h-4 w-4" }), children: "Valider la g\u00E9n\u00E9ration" })] })] }) }));
};
// Modal d'import CSV
const ImportCSVModal = ({ isOpen, onClose, onImport }) => {
    const [importType, setImportType] = useState('professeurs');
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        }
        else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                setSelectedFile(file);
            }
            else {
                alert('Veuillez sélectionner un fichier CSV');
            }
        }
    };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                setSelectedFile(file);
            }
            else {
                alert('Veuillez sélectionner un fichier CSV');
            }
        }
    };
    const handleImport = () => {
        if (!selectedFile) {
            alert('Veuillez sélectionner un fichier');
            return;
        }
        onImport(importType, selectedFile);
        setSelectedFile(null);
        onClose();
    };
    const resetModal = () => {
        setSelectedFile(null);
        setImportType('professeurs');
    };
    const handleClose = () => {
        resetModal();
        onClose();
    };
    if (!isOpen)
        return null;
    const getExampleData = () => {
        if (importType === 'professeurs') {
            return {
                headers: ['nom', 'prenom', 'email', 'grade', 'specialite', 'department', 'institution'],
                example: 'Diop,Dr. Ahmed,ahmed.diop@isi.edu.sn,Professeur Titulaire,Informatique,Informatique,ISI'
            };
        }
        else {
            return {
                headers: ['nom', 'prenom', 'email', 'niveau', 'specialite', 'department', 'classe', 'encadrant_email', 'session_choisie'],
                example: 'Diallo,Amadou,amadou.diallo@student.isi.edu.sn,Master 2,Informatique,Informatique,Informatique - M2,ibrahima.ndiaye@isi.edu.sn,septembre'
            };
        }
    };
    const exampleData = getExampleData();
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Importer des donn\u00E9es CSV" }), _jsx("p", { className: "text-sm text-gray-500", children: "Importez des professeurs ou des \u00E9tudiants depuis un fichier CSV" })] }), _jsx("button", { onClick: handleClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Type de donn\u00E9es \u00E0 importer" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { className: `p-4 border-2 cursor-pointer transition-colors ${importType === 'professeurs'
                                                ? 'border-navy bg-navy-light'
                                                : 'border-gray-300 hover:border-gray-400'}`, onClick: () => setImportType('professeurs'), children: _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "radio", checked: importType === 'professeurs', onChange: () => setImportType('professeurs'), className: "h-4 w-4 text-navy focus:ring-navy border-gray-300 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "Professeurs" }), _jsx("p", { className: "text-sm text-gray-600", children: "Importer la liste des professeurs" })] })] }) }), _jsx("div", { className: `p-4 border-2 cursor-pointer transition-colors ${importType === 'etudiants'
                                                ? 'border-navy bg-navy-light'
                                                : 'border-gray-300 hover:border-gray-400'}`, onClick: () => setImportType('etudiants'), children: _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "radio", checked: importType === 'etudiants', onChange: () => setImportType('etudiants'), className: "h-4 w-4 text-navy focus:ring-navy border-gray-300 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "\u00C9tudiants" }), _jsx("p", { className: "text-sm text-gray-600", children: "Importer la liste des \u00E9tudiants" })] })] }) })] })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 p-4", children: [_jsxs("h4", { className: "font-medium text-blue-900 mb-2", children: ["Format CSV requis pour ", importType, " :"] }), _jsxs("div", { className: "text-sm text-blue-800 space-y-2", children: [_jsx("p", { children: _jsx("strong", { children: "Colonnes requises :" }) }), _jsx("p", { className: "font-mono text-xs bg-white p-2 border border-blue-300", children: exampleData.headers.join(', ') }), _jsx("p", { children: _jsx("strong", { children: "Exemple :" }) }), _jsx("p", { className: "font-mono text-xs bg-white p-2 border border-blue-300 break-all", children: exampleData.example }), importType === 'etudiants' && (_jsxs("p", { className: "text-xs mt-2", children: [_jsx("strong", { children: "Note :" }), " session_choisie doit \u00EAtre \"septembre\", \"decembre\" ou \"speciale\""] }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "S\u00E9lectionner le fichier CSV" }), _jsxs("div", { className: `relative border-2 border-dashed p-8 text-center transition-colors ${dragActive
                                        ? 'border-navy bg-navy-light'
                                        : selectedFile
                                            ? 'border-green-400 bg-green-50'
                                            : 'border-gray-300 hover:border-gray-400'}`, onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop, children: [_jsx("input", { type: "file", accept: ".csv", onChange: handleFileChange, className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer" }), selectedFile ? (_jsxs("div", { className: "flex items-center justify-center", children: [_jsx(CheckCircle, { className: "h-8 w-8 text-green-600 mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-green-700 font-medium", children: selectedFile.name }), _jsxs("p", { className: "text-sm text-green-600", children: [Math.round(selectedFile.size / 1024), " KB"] })] })] })) : (_jsxs("div", { children: [_jsx(Upload, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("p", { className: "text-lg font-medium text-gray-900 mb-2", children: "Glissez votre fichier CSV ici" }), _jsx("p", { className: "text-sm text-gray-600", children: "ou cliquez pour s\u00E9lectionner un fichier" })] }))] })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: [_jsx(SimpleButton, { variant: "secondary", onClick: handleClose, children: "Annuler" }), _jsx(SimpleButton, { variant: "primary", onClick: handleImport, disabled: !selectedFile, icon: _jsx(Upload, { className: "h-4 w-4" }), children: "Importer" })] })] }) }));
};
// Modal d'édition de jury
const EditJuryModal = ({ isOpen, onClose, jury, onSave }) => {
    const [form, setForm] = useState(jury);
    useEffect(() => { setForm(jury); }, [jury]);
    if (!isOpen || !form)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "Modifier le jury" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Nom" }), _jsx("input", { type: "text", className: "w-full border px-3 py-2", value: form.nom, onChange: e => setForm(Object.assign(Object.assign({}, form), { nom: e.target.value })) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Type" }), _jsxs("select", { className: "w-full border px-3 py-2", value: form.type, onChange: e => setForm(Object.assign(Object.assign({}, form), { type: e.target.value })), children: [_jsx("option", { value: "licence", children: "Licence" }), _jsx("option", { value: "master", children: "Master" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Statut" }), _jsxs("select", { className: "w-full border px-3 py-2", value: form.statut, onChange: e => setForm(Object.assign(Object.assign({}, form), { statut: e.target.value })), children: [_jsx("option", { value: "actif", children: "Actif" }), _jsx("option", { value: "inactif", children: "Inactif" }), _jsx("option", { value: "archive", children: "Archiv\u00E9" })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-2 mt-6", children: [_jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Annuler" }), _jsx(SimpleButton, { variant: "primary", onClick: () => { if (form)
                                onSave(form); }, children: "Enregistrer" })] })] }) }));
};
