import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, ArrowUpRight, ArrowDownRight, AlertCircle, FileText, GraduationCap, Send, ChevronRight, Building, Clock, Folder, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { TypeEvenement, getDashboardStats, mockEvenements } from '../../models';
import { preloadDashboardData } from '../../models/services/dashboard.service';
import { getDashboardProfesseurBaseCards } from '../../components/dashboard/DashboardProfesseurBase';
import { DashboardEncadrant } from '../../components/dashboard/DashboardEncadrant';
import { MonEncadrement } from '../../components/dashboard/MonEncadrement';
import { getDashboardJuryCards } from '../../components/dashboard/DashboardJury';
import { getDashboardCommissionCards } from '../../components/dashboard/DashboardCommission';
import { DashboardPersonnel } from '../../components/dashboard/DashboardPersonnel';
import { getAnneeAcademiqueCourante, isAnneeAcademiqueTerminee } from '../../utils/anneeAcademique';
// Badge Component
const Badge = ({ children, variant = 'info' }) => {
    const styles = {
        success: "bg-green-50 text-green-700 border border-green-200",
        warning: "bg-orange-50 text-orange-700 border border-orange-200",
        info: "bg-blue-50 text-blue-700 border border-blue-200",
        error: "bg-red-50 text-red-600 border border-red-200",
        primary: "bg-navy bg-opacity-10 text-navy border border-navy border-opacity-20"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded ${styles[variant]}`, children: children }));
};
// Simple Button Component
const SimpleButton = ({ children, variant = 'ghost', onClick, size = 'sm', icon, className = '' }) => {
    const styles = {
        primary: 'bg-navy text-white border border-navy hover:bg-navy-dark',
        secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
        ghost: 'bg-transparent text-gray-600 border border-transparent hover:bg-gray-50'
    };
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm'
    };
    return (_jsxs("button", { onClick: onClick, className: `font-medium transition-colors duration-200 flex items-center ${styles[variant]} ${sizeStyles[size]} ${className}`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
const DashboardCard = ({ title, value, icon, iconColor, trend, delay = 0, onClick }) => {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay }, className: `bg-white border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`, onClick: onClick, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: `${iconColor} p-3 rounded-lg`, children: icon }), trend && (_jsxs("div", { className: `flex items-center text-sm ${trend.up ? 'text-green-600' : 'text-red-600'}`, children: [trend.up ? (_jsx(ArrowUpRight, { className: "h-4 w-4 mr-1" })) : (_jsx(ArrowDownRight, { className: "h-4 w-4 mr-1" })), _jsx("span", { children: trend.value })] }))] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 mb-1", children: title }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: value })] })] }));
};
const QuickActionCard = ({ title, description, icon, iconColor, onClick, badge }) => {
    return (_jsx("div", { className: "bg-white border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group", onClick: onClick, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: `${iconColor} p-2 rounded-lg mr-3`, children: icon }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium text-gray-900 group-hover:text-navy transition-colors", children: title }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: description })] })] }), _jsxs("div", { className: "flex items-center", children: [badge && _jsx(Badge, { variant: "primary", children: badge }), _jsx(ChevronRight, { className: "h-4 w-4 text-gray-400 ml-2 group-hover:text-navy transition-colors" })] })] }) }));
};
const ActivityItem = ({ icon, iconColor, title, description, time, badge }) => {
    return (_jsxs("div", { className: "flex items-start pb-4 border-b border-gray-100 last:border-0", children: [_jsx("div", { className: `${iconColor} p-2 rounded-lg mr-3`, children: icon }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "font-medium text-gray-900", children: title }), badge && _jsx(Badge, { variant: "warning", children: badge })] }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: description }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: time })] })] }));
};
const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    // Précharger les données du dashboard depuis le backend
    useEffect(() => {
        if (user === null || user === void 0 ? void 0 : user.id) {
            preloadDashboardData(user.id).then(() => {
                setIsDataLoaded(true);
            });
        }
    }, [user === null || user === void 0 ? void 0 : user.id]);
    if (!user) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acc\u00E8s non autoris\u00E9" }), _jsx("p", { className: "text-gray-600", children: "Veuillez vous connecter pour acc\u00E9der au tableau de bord." })] }) }));
    }
    // Génération du titre basé sur les rôles
    const getPageTitle = () => {
        return 'Tableau de bord';
    };
    // Génération des cartes statistiques
    const renderStatsCards = () => {
        const cards = [];
        let delay = 0.1;
        // Cartes pour Étudiant - Basées sur le diagramme de classes
        if ((user === null || user === void 0 ? void 0 : user.type) === 'etudiant') {
            const stats = getDashboardStats(user.id);
            // Cartes spécifiques pour Candidat
            if (user === null || user === void 0 ? void 0 : user.estCandidat) {
                // 1. Tickets en cours
                cards.push(_jsx(DashboardCard, { title: "Tickets actifs", value: stats.ticketsCount.toString(), icon: _jsx(AlertCircle, { className: "h-6 w-6" }), iconColor: "bg-primary-100 text-primary-700", delay: delay, onClick: () => navigate('/etudiant/dossiers') }, "tickets"));
                delay += 0.1;
                // 2. Dossiers en cours
                cards.push(_jsx(DashboardCard, { title: "Dossiers en cours", value: stats.dossiersCount.toString(), icon: _jsx(Folder, { className: "h-6 w-6" }), iconColor: "bg-primary-100 text-primary-700", delay: delay, onClick: () => navigate('/etudiant/dossiers') }, "dossiers-candidat"));
                delay += 0.1;
                // 3. Documents administratifs
                cards.push(_jsx(DashboardCard, { title: "Documents administratifs", value: stats.documentsCount.toString(), icon: _jsx(FileCheck, { className: "h-6 w-6" }), iconColor: "bg-primary-100 text-primary-700", delay: delay }, "documents-admin"));
                delay += 0.1;
            }
            else {
                // Cartes pour étudiant normal
                // 1. Dossiers/Mémoires actifs
                cards.push(_jsx(DashboardCard, { title: "Mes Dossiers", value: stats.dossiersCount.toString(), icon: _jsx(FileText, { className: "h-6 w-6" }), iconColor: "bg-primary-100 text-primary-700", delay: delay, onClick: () => navigate('/etudiant/dossiers') }, "dossiers"));
                delay += 0.1;
                // 2. Documents déposés
                const nouveauxDocuments = 2; // À remplacer par calcul réel depuis l'historique
                cards.push(_jsx(DashboardCard, { title: "Documents d\u00E9pos\u00E9s", value: stats.documentsCount.toString(), icon: _jsx(FileCheck, { className: "h-6 w-6" }), iconColor: "bg-primary-100 text-primary-700", trend: { value: `+${nouveauxDocuments}`, up: true }, delay: delay }, "documents"));
                delay += 0.1;
                // 3. Échéances à venir
                cards.push(_jsx(DashboardCard, { title: "\u00C9ch\u00E9ances", value: stats.echeancesCount.toString(), icon: _jsx(Clock, { className: "h-6 w-6" }), iconColor: "bg-primary-100 text-primary-700", delay: delay }, "echeances"));
                delay += 0.1;
            }
        }
        // Cartes pour Chef de département (professeur avec rôle chef)
        if ((user === null || user === void 0 ? void 0 : user.type) === 'professeur' && (user === null || user === void 0 ? void 0 : user.estChef)) {
            cards.push(_jsx(DashboardCard, { title: "Professeurs", value: "18", icon: _jsx(Users, { className: "h-6 w-6" }), iconColor: "bg-orange-100 text-orange-600", trend: { value: "+2", up: true }, delay: delay }, "professeurs"));
            delay += 0.1;
            cards.push(_jsx(DashboardCard, { title: "\u00C9tudiants d\u00E9partement", value: "156", icon: _jsx(GraduationCap, { className: "h-6 w-6" }), iconColor: "bg-purple-100 text-purple-600", trend: { value: "+12", up: true }, delay: delay }, "etudiants-dept"));
            delay += 0.1;
        }
        // Cartes pour Professeur - Composants modulaires selon les rôles
        if ((user === null || user === void 0 ? void 0 : user.type) === 'professeur') {
            const idProfesseur = (user === null || user === void 0 ? void 0 : user.id) ? parseInt(user.id) : 0;
            const anneeCourante = getAnneeAcademiqueCourante();
            const anneeTerminee = isAnneeAcademiqueTerminee(anneeCourante);
            const estChef = user === null || user === void 0 ? void 0 : user.estChef;
            // 1. Composants de base pour tous les professeurs
            const baseCards = getDashboardProfesseurBaseCards(delay, navigate);
            cards.push(...baseCards);
            delay += baseCards.length * 0.1;
            // 2. Les cartes encadrant seront affichées via le composant DashboardEncadrant dans le rendu
            // (car il fait un appel API asynchrone)
            // 3. Composants spécifiques pour membre du jury (si année académique en cours ou chef)
            if ((user === null || user === void 0 ? void 0 : user.estJurie) && (!anneeTerminee || estChef)) {
                const juryCards = getDashboardJuryCards(user.email, delay, navigate);
                cards.push(...juryCards);
                delay += juryCards.length * 0.1;
            }
            // 4. Composants spécifiques pour commission (si année académique en cours ou chef)
            if ((user === null || user === void 0 ? void 0 : user.estCommission) && (!anneeTerminee || estChef)) {
                const commissionCards = getDashboardCommissionCards(delay, navigate);
                cards.push(...commissionCards);
                delay += commissionCards.length * 0.1;
            }
        }
        // Cartes pour Assistant
        if ((user === null || user === void 0 ? void 0 : user.type) === 'assistant') {
            cards.push(_jsx(DashboardCard, { title: "Documents trait\u00E9s", value: "42", icon: _jsx(FileText, { className: "h-6 w-6" }), iconColor: "bg-slate-100 text-slate-600", trend: { value: "+8", up: true }, delay: delay }, "documents"));
            delay += 0.1;
            cards.push(_jsx(DashboardCard, { title: "Convocations envoy\u00E9es", value: "28", icon: _jsx(Send, { className: "h-6 w-6" }), iconColor: "bg-pink-100 text-pink-600", delay: delay }, "convocations"));
            delay += 0.1;
            cards.push(_jsx(DashboardCard, { title: "Salles r\u00E9serv\u00E9es", value: "15", icon: _jsx(Building, { className: "h-6 w-6" }), iconColor: "bg-violet-100 text-violet-600", delay: delay }, "salles-reservees"));
            delay += 0.1;
        }
        return cards;
    };
    const statsCards = renderStatsCards();
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: getPageTitle() }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Bonjour ", user === null || user === void 0 ? void 0 : user.name, (user === null || user === void 0 ? void 0 : user.department) && ` • Département ${user.department}`] }), _jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [(user === null || user === void 0 ? void 0 : user.type) === 'etudiant' && (_jsxs(_Fragment, { children: [_jsx(Badge, { variant: "success", children: "\u00C9tudiant" }), (user === null || user === void 0 ? void 0 : user.estCandidat) && _jsx(Badge, { variant: "info", children: "Candidat" })] })), (user === null || user === void 0 ? void 0 : user.type) === 'professeur' && (_jsxs(_Fragment, { children: [_jsx(Badge, { variant: "success", children: "Professeur" }), (user === null || user === void 0 ? void 0 : user.estChef) && _jsx(Badge, { variant: "primary", children: "Chef de d\u00E9partement" }), (user === null || user === void 0 ? void 0 : user.estEncadrant) && _jsx(Badge, { variant: "info", children: "Encadrant" }), (user === null || user === void 0 ? void 0 : user.estJurie) && _jsx(Badge, { variant: "error", children: "Membre de jury" }), (user === null || user === void 0 ? void 0 : user.estCommission) && _jsx(Badge, { variant: "warning", children: "Commission de validation" })] })), (user === null || user === void 0 ? void 0 : user.type) === 'assistant' && _jsx(Badge, { variant: "info", children: "Assistant" })] })] }), _jsxs("div", { className: "mt-4 md:mt-0 flex items-center text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-2 rounded", children: [_jsx(Calendar, { className: "mr-2 h-4 w-4" }), _jsxs("span", { children: ["Mis \u00E0 jour le ", new Date().toLocaleDateString('fr-FR')] })] })] }) }), ((user === null || user === void 0 ? void 0 : user.role) === 'CHEF' || (user === null || user === void 0 ? void 0 : user.role) === 'ASSISTANT') && (_jsx(DashboardPersonnel, {})), (statsCards.length > 0 || ((user === null || user === void 0 ? void 0 : user.type) === 'professeur' && (user === null || user === void 0 ? void 0 : user.estEncadrant))) && !((user === null || user === void 0 ? void 0 : user.role) === 'CHEF' || (user === null || user === void 0 ? void 0 : user.role) === 'ASSISTANT') && (_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full", children: [statsCards, (user === null || user === void 0 ? void 0 : user.type) === 'professeur' && (user === null || user === void 0 ? void 0 : user.estEncadrant) && (() => {
                                const anneeCourante = getAnneeAcademiqueCourante();
                                const anneeTerminee = isAnneeAcademiqueTerminee(anneeCourante);
                                const estChef = user === null || user === void 0 ? void 0 : user.estChef;
                                const idProfesseur = (user === null || user === void 0 ? void 0 : user.id) ? parseInt(user.id) : 0;
                                if (!anneeTerminee || estChef) {
                                    return _jsx(DashboardEncadrant, { idProfesseur: idProfesseur, delay: statsCards.length * 0.1 });
                                }
                                return null;
                            })()] }) })), (user === null || user === void 0 ? void 0 : user.type) === 'professeur' && (user === null || user === void 0 ? void 0 : user.estEncadrant) && (() => {
                    const idProfesseur = (user === null || user === void 0 ? void 0 : user.id) ? parseInt(user.id) : 0;
                    return _jsx(MonEncadrement, { idProfesseur: idProfesseur });
                })(), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.8 }, className: "bg-white border border-gray-200 p-6", children: [_jsxs("h2", { className: "text-xl font-bold text-gray-900 mb-6", children: ["Calendrier - ", new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("div", { className: "grid grid-cols-7 gap-1 text-center mb-2", children: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day, i) => (_jsx("div", { className: "text-xs font-semibold text-gray-500 py-2", children: day }, i))) }), _jsxs("div", { className: "grid grid-cols-7 gap-1 text-center", children: [[...Array(2)].map((_, i) => (_jsx("div", { className: "p-1", children: _jsx("div", { className: "h-8 w-8" }) }, `empty-${i}`))), [...Array(31)].map((_, i) => {
                                                    const day = i + 1;
                                                    const isToday = day === new Date().getDate();
                                                    const hasEvent = [15, 21, 25, 27, 30].includes(day);
                                                    return (_jsx("div", { className: "p-1", children: _jsx("div", { className: `h-8 w-8 flex items-center justify-center text-sm transition-colors duration-200 rounded ${isToday
                                                                ? 'bg-navy text-white'
                                                                : hasEvent
                                                                    ? 'border-2 border-navy text-navy hover:bg-navy hover:text-white'
                                                                    : 'text-gray-700 hover:bg-gray-100'}`, children: day }) }, day));
                                                })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "\u00C9v\u00E9nements \u00E0 venir" }), _jsxs("div", { className: "space-y-3", children: [(user === null || user === void 0 ? void 0 : user.type) === 'etudiant' && (_jsx(_Fragment, { children: mockEvenements
                                                        .filter(event => {
                                                        const now = new Date();
                                                        const eventDate = event.dateDebut;
                                                        // Afficher les événements des 30 prochains jours
                                                        return eventDate >= now && eventDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                                                    })
                                                        .sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime())
                                                        .slice(0, 3)
                                                        .map((event) => {
                                                        const getEventColor = (type) => {
                                                            switch (type) {
                                                                case TypeEvenement.SOUTENANCE:
                                                                    return 'bg-purple-50 border-purple-200 text-purple-900';
                                                                case TypeEvenement.ECHANCE:
                                                                    return 'bg-orange-50 border-orange-200 text-orange-900';
                                                                case TypeEvenement.RENDEZ_VOUS:
                                                                    return 'bg-blue-50 border-blue-200 text-blue-900';
                                                                default:
                                                                    return 'bg-gray-50 border-gray-200 text-gray-900';
                                                            }
                                                        };
                                                        const getEventDotColor = (type) => {
                                                            switch (type) {
                                                                case TypeEvenement.SOUTENANCE:
                                                                    return 'bg-purple-500';
                                                                case TypeEvenement.ECHANCE:
                                                                    return 'bg-orange-500';
                                                                case TypeEvenement.RENDEZ_VOUS:
                                                                    return 'bg-blue-500';
                                                                default:
                                                                    return 'bg-gray-500';
                                                            }
                                                        };
                                                        const formatEventDate = (date) => {
                                                            return date.toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: date.getMonth() === new Date().getMonth() ? 'short' : 'long',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            });
                                                        };
                                                        return (_jsxs("div", { className: `flex items-center p-3 ${getEventColor(event.type)} border rounded`, children: [_jsx("div", { className: `w-2 h-2 ${getEventDotColor(event.type)} rounded-full mr-3` }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: event.titre }), _jsxs("p", { className: "text-xs", children: [formatEventDate(event.dateDebut), event.lieu && ` - ${event.lieu}`] })] })] }, event.idEvenement));
                                                    }) })), (user === null || user === void 0 ? void 0 : user.type) === 'professeur' && (user === null || user === void 0 ? void 0 : user.estChef) && (_jsxs("div", { className: "flex items-center p-3 bg-blue-50 border border-blue-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-blue-900", children: "R\u00E9union des chefs de d\u00E9partement" }), _jsx("p", { className: "text-xs text-blue-700", children: "25 janvier, 10:00 - 11:30" })] })] })), (user === null || user === void 0 ? void 0 : user.type) === 'professeur' && (user === null || user === void 0 ? void 0 : user.estEncadrant) && (_jsxs("div", { className: "flex items-center p-3 bg-emerald-50 border border-emerald-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-emerald-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-emerald-900", children: "Pr\u00E9-lecture - Amadou Diallo" }), _jsx("p", { className: "text-xs text-emerald-700", children: "27 janvier, 14:00 - Salle 102" })] })] })), (user === null || user === void 0 ? void 0 : user.type) === 'professeur' && (user === null || user === void 0 ? void 0 : user.estJurie) && (_jsxs("div", { className: "flex items-center p-3 bg-red-50 border border-red-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-900", children: "Soutenance - Moussa Kane" }), _jsx("p", { className: "text-xs text-red-700", children: "30 janvier, 14:00 - Amphith\u00E9\u00E2tre A" })] })] })), (user === null || user === void 0 ? void 0 : user.type) === 'professeur' && (user === null || user === void 0 ? void 0 : user.estCommission) && (_jsxs("div", { className: "flex items-center p-3 bg-amber-50 border border-amber-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-amber-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-amber-900", children: "R\u00E9union commission validation" }), _jsx("p", { className: "text-xs text-amber-700", children: "28 janvier, 15:00 - Salle de conf\u00E9rence" })] })] })), (user === null || user === void 0 ? void 0 : user.type) === 'assistant' && (_jsxs("div", { className: "flex items-center p-3 bg-violet-50 border border-violet-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-violet-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-violet-900", children: "Pr\u00E9paration convocations" }), _jsx("p", { className: "text-xs text-violet-700", children: "26 janvier, 9:00 - Bureau secr\u00E9tariat" })] })] })), _jsxs("div", { className: "flex items-center p-3 bg-gray-50 border border-gray-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-gray-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Date limite - Soumission des m\u00E9moires" }), _jsx("p", { className: "text-xs text-gray-700", children: "31 janvier" })] })] })] })] })] })] })] }) }));
};
export default Dashboard;
