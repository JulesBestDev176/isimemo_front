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
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Download, Eye } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Panel from './Panel';
import EspaceTravail from './EspaceTravail';
import { mockRessourcesMediatheque } from '../../models/ressource/RessourceMediatheque';
import { dossierService } from '../../services/dossier.service';
const Encadrement = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('panel');
    const [encadrant, setEncadrant] = useState(null);
    const [loading, setLoading] = useState(true);
    // Gérer l'onglet actif via le state de navigation
    useEffect(() => {
        const state = location.state;
        if ((state === null || state === void 0 ? void 0 : state.activeTab) === 'espace-travail' || (state === null || state === void 0 ? void 0 : state.activeTab) === 'panel' || (state === null || state === void 0 ? void 0 : state.activeTab) === 'canevas') {
            setActiveTab(state.activeTab);
        }
    }, [location]);
    // Récupérer les vraies données de l'encadrant depuis le dossier du candidat
    useEffect(() => {
        const fetchEncadrant = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return;
            try {
                setLoading(true);
                // Récupérer le dossier du candidat
                const dossiers = yield dossierService.getAllDossiers();
                const monDossier = dossiers.find(d => { var _a; return (_a = d.candidatIds) === null || _a === void 0 ? void 0 : _a.includes(user.id); });
                if (monDossier && monDossier.encadrantId) {
                    // Récupérer les infos de l'encadrant
                    const response = yield fetch(`http://localhost:3001/api/encadrants/${monDossier.encadrantId}`);
                    if (response.ok) {
                        const encadrantData = yield response.json();
                        setEncadrant({
                            id: encadrantData.id,
                            nom: encadrantData.nom,
                            prenom: encadrantData.prenom,
                            email: encadrantData.email,
                            specialite: encadrantData.specialite || 'Non spécifié',
                            bureau: encadrantData.bureau || 'Non spécifié',
                            telephone: encadrantData.telephone || 'Non spécifié'
                        });
                    }
                }
            }
            catch (error) {
                console.error('Erreur chargement encadrant:', error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchEncadrant();
    }, [user]);
    const notifications = [
        {
            id: 1,
            titre: 'Réunion de suivi programmée',
            message: 'RDV fixé pour le 8 juillet à 14h en visio. Préparez vos questions sur le chapitre 2.',
            type: 'Meet',
            date: '2024-07-04 10:30',
            lu: false,
            urgent: false,
            lienMeet: 'https://meet.google.com/abc-defg-hij',
            dateRendezVous: '2024-07-08',
            heureRendezVous: '14:00'
        },
        {
            id: 2,
            titre: 'Feedback sur votre chapitre 1',
            message: 'J\'ai relu votre introduction. Quelques corrections à apporter. Voir le document annoté.',
            type: 'Feedback',
            date: '2024-07-03 16:45',
            lu: false,
            urgent: false
        },
        {
            id: 3,
            titre: 'Pré-soutenance approche',
            message: 'N\'oubliez pas de préparer votre présentation pour la pré-soutenance du 20 juillet.',
            type: 'Pré-soutenance',
            date: '2024-07-02 09:15',
            lu: true,
            urgent: true,
            lieu: 'Salle de conférence A, Bâtiment principal',
            dateRendezVous: '2024-07-20',
            heureRendezVous: '10:00'
        }
    ];
    const getInitials = (nom, prenom) => {
        if (prenom) {
            return `${prenom[0]}${nom[0]}`.toUpperCase();
        }
        return nom.split(' ').map(n => n[0]).join('').toUpperCase();
    };
    // Filtrer les canevas depuis les mocks
    const canevasResources = mockRessourcesMediatheque.filter(r => r.categorie === 'canevas');
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Encadrement" }), _jsx("p", { className: "text-gray-600", children: "Interface de collaboration avec votre encadrant" }), _jsx("div", { className: "mt-4 flex items-center space-x-4", children: loading ? (_jsxs("div", { className: "animate-pulse flex items-center space-x-4", children: [_jsx("div", { className: "w-12 h-12 bg-gray-300 rounded-full" }), _jsxs("div", { children: [_jsx("div", { className: "h-4 bg-gray-300 rounded w-48 mb-2" }), _jsx("div", { className: "h-3 bg-gray-200 rounded w-32" })] })] })) : encadrant ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold", children: getInitials(encadrant.nom, encadrant.prenom) }), _jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-gray-900", children: ["Encadrant: Prof. ", encadrant.prenom, " ", encadrant.nom] }), _jsx("p", { className: "text-gray-600 text-sm", children: encadrant.specialite })] })] })) : (_jsx("p", { className: "text-gray-500", children: "Aucun encadrant assign\u00E9" })) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-sm border mb-6", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("nav", { className: "flex space-x-8 px-6", children: [_jsxs("button", { onClick: () => setActiveTab('panel'), className: `py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${activeTab === 'panel'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: ["Panel", notifications.filter(n => !n.lu).length > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center", children: notifications.filter(n => !n.lu).length }))] }), _jsx("button", { onClick: () => setActiveTab('espace-travail'), className: `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'espace-travail'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: "Espace de travail" }), _jsx("button", { onClick: () => setActiveTab('canevas'), className: `py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'canevas'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: "Canevas" })] }) }), _jsx("div", { className: "p-6", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'panel' && _jsx(Panel, {}), activeTab === 'espace-travail' && _jsx(EspaceTravail, {}), activeTab === 'canevas' && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Canevas et Mod\u00E8les" }), _jsx("p", { className: "text-gray-600", children: "T\u00E9l\u00E9chargez les mod\u00E8les officiels pour la r\u00E9daction de votre m\u00E9moire." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: canevasResources.length > 0 ? (canevasResources.map((canevas) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: "p-3 bg-blue-50 text-blue-600 rounded-lg", children: _jsx(FileText, { className: "h-6 w-6" }) }), canevas.estImportant && (_jsx("span", { className: "px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium rounded-full", children: "Important" }))] }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: canevas.titre }), _jsx("p", { className: "text-sm text-gray-600 mb-4 line-clamp-2", children: canevas.description }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-gray-100", children: [_jsxs("span", { className: "text-xs text-gray-500", children: ["Mis \u00E0 jour le ", new Date(canevas.dateModification).toLocaleDateString()] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => window.open(canevas.cheminFichier, '_blank'), className: "p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors", title: "Voir", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("a", { href: canevas.cheminFichier, download: true, className: "p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors", title: "T\u00E9l\u00E9charger", children: _jsx(Download, { className: "h-4 w-4" }) })] })] })] }, canevas.idRessource)))) : (_jsxs("div", { className: "col-span-full text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300", children: [_jsx(FileText, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "Aucun canevas disponible pour le moment." })] })) })] }))] }) })] })] }) }));
};
export default Encadrement;
