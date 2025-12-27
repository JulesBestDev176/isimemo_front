import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Users, Grid, Bell, Calendar, ArrowUpRight, ArrowDownRight, MessageSquare, CheckCircle, AlertCircle, FileText, Gavel, UserCheck, Star, GraduationCap, Edit, Send, Download, ChevronRight, BarChart3, CalendarDays, Archive, CheckSquare, MessageCircle, UserPlus, BookMarked, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getEncadrementsActifs } from '../../models/dossier/Encadrement';
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
const SimpleButton = ({ children, variant = 'ghost', onClick, size = 'sm', icon }) => {
    const styles = {
        primary: 'bg-navy text-white border border-navy hover:bg-navy-dark',
        secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
        ghost: 'bg-transparent text-gray-600 border border-transparent hover:bg-gray-50'
    };
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm'
    };
    return (_jsxs("button", { onClick: onClick, className: `font-medium transition-colors duration-200 flex items-center ${styles[variant]} ${sizeStyles[size]}`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
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
const DashboardUnifie = () => {
    const { user } = useAuth();
    if (!user) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acc\u00E8s non autoris\u00E9" }), _jsx("p", { className: "text-gray-600", children: "Veuillez vous connecter pour acc\u00E9der au tableau de bord." })] }) }));
    }
    // Génération du titre basé sur les rôles
    const getPageTitle = () => {
        const roles = [];
        if (user === null || user === void 0 ? void 0 : user.estChef)
            roles.push('Chef de département');
        if (user === null || user === void 0 ? void 0 : user.estProfesseur)
            roles.push('Professeur');
        if (user === null || user === void 0 ? void 0 : user.estEncadrant)
            roles.push('Encadrant');
        if (user === null || user === void 0 ? void 0 : user.estJurie)
            roles.push('Membre de jury');
        if (user === null || user === void 0 ? void 0 : user.estCommission)
            roles.push('Commission de validation');
        if (user === null || user === void 0 ? void 0 : user.estSecretaire)
            roles.push('Secrétaire');
        return roles.length > 0 ? `Tableau de bord` : 'Tableau de bord';
    };
    // Génération des cartes statistiques
    const renderStatsCards = () => {
        const cards = [];
        let delay = 0.1;
        // Cartes pour Chef de département
        if (user === null || user === void 0 ? void 0 : user.estChef) {
            cards.push(_jsx(DashboardCard, { title: "Classes g\u00E9r\u00E9es", value: "8", icon: _jsx(Grid, { className: "h-6 w-6" }), iconColor: "bg-blue-100 text-blue-600", trend: { value: "+2", up: true }, delay: delay }, "classes"));
            delay += 0.1;
            cards.push(_jsx(DashboardCard, { title: "Professeurs", value: "18", icon: _jsx(Users, { className: "h-6 w-6" }), iconColor: "bg-orange-100 text-orange-600", trend: { value: "+2", up: true }, delay: delay }, "professeurs"));
            delay += 0.1;
            cards.push(_jsx(DashboardCard, { title: "\u00C9tudiants d\u00E9partement", value: "156", icon: _jsx(GraduationCap, { className: "h-6 w-6" }), iconColor: "bg-purple-100 text-purple-600", trend: { value: "+12", up: true }, delay: delay }, "etudiants-dept"));
            delay += 0.1;
        }
        // Cartes pour Professeur (pas de cours, seulement publications si nécessaire)
        // Les cours ne sont plus affichés car on n'a plus de cours
        // Cartes pour Encadrant - Afficher uniquement si le professeur a des encadrements actifs
        if (user === null || user === void 0 ? void 0 : user.estEncadrant) {
            const idProfesseur = (user === null || user === void 0 ? void 0 : user.id) ? parseInt(user.id) : 0;
            const encadrementsActifs = idProfesseur > 0 ? getEncadrementsActifs(idProfesseur) : [];
            if (encadrementsActifs.length > 0) {
                cards.push(_jsx(DashboardCard, { title: "\u00C9tudiants encadr\u00E9s", value: encadrementsActifs.length.toString(), icon: _jsx(UserCheck, { className: "h-6 w-6" }), iconColor: "bg-emerald-100 text-emerald-600", trend: { value: "+3", up: true }, delay: delay }, "etudiants-encadres"));
                delay += 0.1;
                cards.push(_jsx(DashboardCard, { title: "M\u00E9moires en cours", value: encadrementsActifs.length.toString(), icon: _jsx(FileText, { className: "h-6 w-6" }), iconColor: "bg-cyan-100 text-cyan-600", delay: delay }, "memoires-cours"));
                delay += 0.1;
            }
        }
        // Cartes pour Jury
        if (user === null || user === void 0 ? void 0 : user.estJurie) {
            cards.push(_jsx(DashboardCard, { title: "Soutenances assign\u00E9es", value: "6", icon: _jsx(Gavel, { className: "h-6 w-6" }), iconColor: "bg-red-100 text-red-600", delay: delay }, "soutenances"));
            delay += 0.1;
            cards.push(_jsx(DashboardCard, { title: "\u00C9valuations en attente", value: "4", icon: _jsx(Star, { className: "h-6 w-6" }), iconColor: "bg-yellow-100 text-yellow-600", trend: { value: "+2", up: true }, delay: delay }, "evaluations"));
            delay += 0.1;
        }
        // Cartes pour Commission
        if (user === null || user === void 0 ? void 0 : user.estCommission) {
            cards.push(_jsx(DashboardCard, { title: "Sujets \u00E0 valider", value: "15", icon: _jsx(CheckSquare, { className: "h-6 w-6" }), iconColor: "bg-amber-100 text-amber-600", trend: { value: "+5", up: true }, delay: delay }, "sujets-valider"));
            delay += 0.1;
            cards.push(_jsx(DashboardCard, { title: "Validations ce mois", value: "42", icon: _jsx(CheckCircle, { className: "h-6 w-6" }), iconColor: "bg-lime-100 text-lime-600", delay: delay }, "validations-mois"));
            delay += 0.1;
        }
        // Cartes pour Secrétaire
        if (user === null || user === void 0 ? void 0 : user.estSecretaire) {
            cards.push(_jsx(DashboardCard, { title: "Documents trait\u00E9s", value: "42", icon: _jsx(FileText, { className: "h-6 w-6" }), iconColor: "bg-slate-100 text-slate-600", trend: { value: "+8", up: true }, delay: delay }, "documents"));
            delay += 0.1;
            cards.push(_jsx(DashboardCard, { title: "Convocations envoy\u00E9es", value: "28", icon: _jsx(Send, { className: "h-6 w-6" }), iconColor: "bg-pink-100 text-pink-600", delay: delay }, "convocations"));
            delay += 0.1;
            cards.push(_jsx(DashboardCard, { title: "Salles r\u00E9serv\u00E9es", value: "15", icon: _jsx(Building, { className: "h-6 w-6" }), iconColor: "bg-violet-100 text-violet-600", delay: delay }, "salles-reservees"));
            delay += 0.1;
        }
        return cards;
    };
    // Génération des actions rapides
    const renderQuickActions = () => {
        const actions = [];
        // Actions pour Chef
        if (user === null || user === void 0 ? void 0 : user.estChef) {
            actions.push(_jsx(QuickActionCard, { title: "Gestion des classes", description: "Cr\u00E9er, modifier et g\u00E9rer les classes", icon: _jsx(Grid, { className: "h-5 w-5" }), iconColor: "bg-blue-100 text-blue-600" }, "gestion-classes"), _jsx(QuickActionCard, { title: "Gestion des professeurs", description: "Ajouter et affecter les professeurs", icon: _jsx(Users, { className: "h-5 w-5" }), iconColor: "bg-orange-100 text-orange-600" }, "gestion-professeurs"), _jsx(QuickActionCard, { title: "Notifications d\u00E9partement", description: "Envoyer des notifications aux professeurs/\u00E9tudiants", icon: _jsx(Bell, { className: "h-5 w-5" }), iconColor: "bg-purple-100 text-purple-600" }, "notifications-dept"));
        }
        // Actions pour Professeur
        if (user === null || user === void 0 ? void 0 : user.estProfesseur) {
            actions.push(_jsx(QuickActionCard, { title: "M\u00E9diath\u00E8que", description: "Publier des documents et ressources", icon: _jsx(BookMarked, { className: "h-5 w-5" }), iconColor: "bg-green-100 text-green-600" }, "mediatheque"), _jsx(QuickActionCard, { title: "Messagerie \u00E9tudiants", description: "Communiquer avec les \u00E9tudiants", icon: _jsx(MessageCircle, { className: "h-5 w-5" }), iconColor: "bg-indigo-100 text-indigo-600" }, "messagerie-etudiants"));
        }
        // Actions pour Encadrant
        if (user === null || user === void 0 ? void 0 : user.estEncadrant) {
            actions.push(_jsx(QuickActionCard, { title: "Demandes d'encadrement", description: "G\u00E9rer les demandes des \u00E9tudiants", icon: _jsx(UserPlus, { className: "h-5 w-5" }), iconColor: "bg-emerald-100 text-emerald-600", badge: "3" }, "demandes-encadrement"), _jsx(QuickActionCard, { title: "Suivi des m\u00E9moires", description: "Suivre l'avancement des travaux", icon: _jsx(BarChart3, { className: "h-5 w-5" }), iconColor: "bg-cyan-100 text-cyan-600" }, "suivi-memoires"), _jsx(QuickActionCard, { title: "Organiser un \u00E9v\u00E9nement", description: "Planifier pr\u00E9-lectures et meetings", icon: _jsx(CalendarDays, { className: "h-5 w-5" }), iconColor: "bg-teal-100 text-teal-600" }, "organiser-evenement"));
        }
        // Actions pour Jury
        if (user === null || user === void 0 ? void 0 : user.estJurie) {
            actions.push(_jsx(QuickActionCard, { title: "Calendrier des soutenances", description: "Consulter vos soutenances assign\u00E9es", icon: _jsx(Calendar, { className: "h-5 w-5" }), iconColor: "bg-red-100 text-red-600" }, "calendrier-soutenances"), _jsx(QuickActionCard, { title: "\u00C9valuation des m\u00E9moires", description: "\u00C9valuer et noter les m\u00E9moires", icon: _jsx(Star, { className: "h-5 w-5" }), iconColor: "bg-yellow-100 text-yellow-600", badge: "4" }, "evaluation-memoires"));
        }
        // Actions pour Commission
        if (user === null || user === void 0 ? void 0 : user.estCommission) {
            actions.push(_jsx(QuickActionCard, { title: "Validation des sujets", description: "Valider les nouveaux sujets de m\u00E9moire", icon: _jsx(CheckCircle, { className: "h-5 w-5" }), iconColor: "bg-amber-100 text-amber-600", badge: "8" }, "validation-sujets"), _jsx(QuickActionCard, { title: "Suivi des corrections", description: "V\u00E9rifier les corrections demand\u00E9es", icon: _jsx(Edit, { className: "h-5 w-5" }), iconColor: "bg-lime-100 text-lime-600" }, "suivi-corrections"));
        }
        // Actions pour Secrétaire
        if (user === null || user === void 0 ? void 0 : user.estSecretaire) {
            actions.push(_jsx(QuickActionCard, { title: "Gestion des documents", description: "Traiter les documents administratifs", icon: _jsx(Archive, { className: "h-5 w-5" }), iconColor: "bg-slate-100 text-slate-600" }, "gestion-documents"), _jsx(QuickActionCard, { title: "Envoyer convocations", description: "Pr\u00E9parer et envoyer les convocations", icon: _jsx(Send, { className: "h-5 w-5" }), iconColor: "bg-pink-100 text-pink-600" }, "envoyer-convocations"), _jsx(QuickActionCard, { title: "Planning des salles", description: "G\u00E9rer les r\u00E9servations de salles", icon: _jsx(Building, { className: "h-5 w-5" }), iconColor: "bg-violet-100 text-violet-600" }, "planning-salles"));
        }
        return actions;
    };
    // Génération des activités récentes
    const renderRecentActivities = () => {
        const activities = [];
        if (user === null || user === void 0 ? void 0 : user.estChef) {
            activities.push(_jsx(ActivityItem, { icon: _jsx(UserPlus, { className: "h-5 w-5" }), iconColor: "bg-green-100 text-green-600", title: "Nouveau professeur ajout\u00E9", description: "Dr. Khadija Traore a \u00E9t\u00E9 ajout\u00E9e au d\u00E9partement", time: "Il y a 2 heures" }, "nouveau-professeur"), _jsx(ActivityItem, { icon: _jsx(CheckCircle, { className: "h-5 w-5" }), iconColor: "bg-blue-100 text-blue-600", title: "Planning valid\u00E9", description: "Le planning des soutenances de Master 2 a \u00E9t\u00E9 approuv\u00E9", time: "Il y a 4 heures" }, "validation-planning"));
        }
        if (user === null || user === void 0 ? void 0 : user.estProfesseur) {
            activities.push(_jsx(ActivityItem, { icon: _jsx(MessageSquare, { className: "h-5 w-5" }), iconColor: "bg-blue-100 text-blue-600", title: "Message d'\u00E9tudiant", description: "3 nouveaux messages d'\u00E9tudiants", time: "Il y a 3 heures", badge: "3" }, "message-etudiant"));
        }
        if (user === null || user === void 0 ? void 0 : user.estEncadrant) {
            activities.push(_jsx(ActivityItem, { icon: _jsx(Bell, { className: "h-5 w-5" }), iconColor: "bg-orange-100 text-orange-600", title: "Nouvelle demande d'encadrement", description: "Amadou Diallo souhaite \u00EAtre encadr\u00E9 par vous", time: "Il y a 1 heure", badge: "Nouveau" }, "demande-encadrement"), _jsx(ActivityItem, { icon: _jsx(FileText, { className: "h-5 w-5" }), iconColor: "bg-purple-100 text-purple-600", title: "M\u00E9moire soumis", description: "Mariama Ba a soumis son premier chapitre", time: "Il y a 3 heures" }, "memoire-soumis"));
        }
        if (user === null || user === void 0 ? void 0 : user.estJurie) {
            activities.push(_jsx(ActivityItem, { icon: _jsx(Gavel, { className: "h-5 w-5" }), iconColor: "bg-red-100 text-red-600", title: "Nouvelle soutenance assign\u00E9e", description: "Soutenance de Moussa Kane le 25 f\u00E9vrier 2025", time: "Il y a 30 minutes", badge: "Urgent" }, "nouvelle-soutenance"), _jsx(ActivityItem, { icon: _jsx(Download, { className: "h-5 w-5" }), iconColor: "bg-blue-100 text-blue-600", title: "Document pr\u00EAt pour \u00E9valuation", description: "Le m\u00E9moire de Fatou Sow est disponible", time: "Il y a 2 heures" }, "document-evaluation"));
        }
        if (user === null || user === void 0 ? void 0 : user.estCommission) {
            activities.push(_jsx(ActivityItem, { icon: _jsx(AlertCircle, { className: "h-5 w-5" }), iconColor: "bg-yellow-100 text-yellow-600", title: "Nouveau sujet \u00E0 valider", description: "'IA appliqu\u00E9e \u00E0 la cybers\u00E9curit\u00E9' en attente", time: "Il y a 15 minutes", badge: "Action requise" }, "sujet-a-valider"), _jsx(ActivityItem, { icon: _jsx(CheckSquare, { className: "h-5 w-5" }), iconColor: "bg-green-100 text-green-600", title: "Corrections v\u00E9rifi\u00E9es", description: "Les corrections du m\u00E9moire d'Ibrahima sont conformes", time: "Il y a 1 heure" }, "correction-verifiee"));
        }
        if (user === null || user === void 0 ? void 0 : user.estSecretaire) {
            activities.push(_jsx(ActivityItem, { icon: _jsx(Send, { className: "h-5 w-5" }), iconColor: "bg-pink-100 text-pink-600", title: "Convocations envoy\u00E9es", description: "28 convocations pour les soutenances de f\u00E9vrier", time: "Il y a 1 heure" }, "convocation-envoyee"), _jsx(ActivityItem, { icon: _jsx(Building, { className: "h-5 w-5" }), iconColor: "bg-indigo-100 text-indigo-600", title: "Salle r\u00E9serv\u00E9e", description: "Amphith\u00E9\u00E2tre A r\u00E9serv\u00E9 pour le 15 f\u00E9vrier", time: "Il y a 2 heures" }, "salle-reservee"));
        }
        return activities;
    };
    const statsCards = renderStatsCards();
    const quickActions = renderQuickActions();
    const recentActivities = renderRecentActivities();
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: getPageTitle() }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Bonjour ", user === null || user === void 0 ? void 0 : user.name, " \u2022 D\u00E9partement ", user === null || user === void 0 ? void 0 : user.department] }), _jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [(user === null || user === void 0 ? void 0 : user.estChef) && _jsx(Badge, { variant: "primary", children: "Chef de d\u00E9partement" }), (user === null || user === void 0 ? void 0 : user.estProfesseur) && _jsx(Badge, { variant: "success", children: "Professeur" }), (user === null || user === void 0 ? void 0 : user.estEncadrant) && _jsx(Badge, { variant: "info", children: "Encadrant" }), (user === null || user === void 0 ? void 0 : user.estJurie) && _jsx(Badge, { variant: "error", children: "Membre de jury" }), (user === null || user === void 0 ? void 0 : user.estCommission) && _jsx(Badge, { variant: "warning", children: "Commission de validation" }), (user === null || user === void 0 ? void 0 : user.estSecretaire) && _jsx(Badge, { variant: "info", children: "Secr\u00E9taire" })] })] }), _jsxs("div", { className: "mt-4 md:mt-0 flex items-center text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-2 rounded", children: [_jsx(Calendar, { className: "mr-2 h-4 w-4" }), _jsxs("span", { children: ["Mis \u00E0 jour le ", new Date().toLocaleDateString('fr-FR')] })] })] }) }), statsCards.length > 0 && (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6", children: statsCards })), quickActions.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.5 }, className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 mb-6", children: "Actions rapides" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: quickActions })] })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6", children: [recentActivities.length > 0 && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.6 }, className: "bg-white border border-gray-200 p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Activit\u00E9s r\u00E9centes" }), _jsx(SimpleButton, { variant: "ghost", children: "Voir tout" })] }), _jsx("div", { className: "space-y-4", children: recentActivities })] })), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.7 }, className: "bg-white border border-gray-200 p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Messages r\u00E9cents" }), _jsx(Badge, { variant: "info", children: "3 non lus" })] }), _jsx("div", { className: "space-y-4" }), _jsx("div", { className: "mt-6 pt-4 border-t border-gray-200", children: _jsx(SimpleButton, { variant: "secondary", size: "md", icon: _jsx(MessageSquare, { className: "h-4 w-4" }), children: "Voir tous les messages" }) })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.8 }, className: "bg-white border border-gray-200 p-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 mb-6", children: "Calendrier - Janvier 2025" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("div", { className: "grid grid-cols-7 gap-1 text-center mb-2", children: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day, i) => (_jsx("div", { className: "text-xs font-semibold text-gray-500 py-2", children: day }, i))) }), _jsxs("div", { className: "grid grid-cols-7 gap-1 text-center", children: [[...Array(2)].map((_, i) => (_jsx("div", { className: "p-1", children: _jsx("div", { className: "h-8 w-8" }) }, `empty-${i}`))), [...Array(31)].map((_, i) => {
                                                    const day = i + 1;
                                                    const isToday = day === 21;
                                                    const hasEvent = [15, 21, 25, 27, 30].includes(day);
                                                    return (_jsx("div", { className: "p-1", children: _jsx("div", { className: `h-8 w-8 flex items-center justify-center text-sm transition-colors duration-200 rounded ${isToday
                                                                ? 'bg-navy text-white'
                                                                : hasEvent
                                                                    ? 'border-2 border-navy text-navy hover:bg-navy hover:text-white'
                                                                    : 'text-gray-700 hover:bg-gray-100'}`, children: day }) }, day));
                                                })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-3", children: "\u00C9v\u00E9nements \u00E0 venir" }), _jsxs("div", { className: "space-y-3", children: [(user === null || user === void 0 ? void 0 : user.estChef) && (_jsxs("div", { className: "flex items-center p-3 bg-blue-50 border border-blue-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-blue-900", children: "R\u00E9union des chefs de d\u00E9partement" }), _jsx("p", { className: "text-xs text-blue-700", children: "25 janvier, 10:00 - 11:30" })] })] })), (user === null || user === void 0 ? void 0 : user.estEncadrant) && (_jsxs("div", { className: "flex items-center p-3 bg-emerald-50 border border-emerald-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-emerald-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-emerald-900", children: "Pr\u00E9-lecture - Amadou Diallo" }), _jsx("p", { className: "text-xs text-emerald-700", children: "27 janvier, 14:00 - Salle 102" })] })] })), (user === null || user === void 0 ? void 0 : user.estJurie) && (_jsxs("div", { className: "flex items-center p-3 bg-red-50 border border-red-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-red-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-red-900", children: "Soutenance - Moussa Kane" }), _jsx("p", { className: "text-xs text-red-700", children: "30 janvier, 14:00 - Amphith\u00E9\u00E2tre A" })] })] })), (user === null || user === void 0 ? void 0 : user.estCommission) && (_jsxs("div", { className: "flex items-center p-3 bg-amber-50 border border-amber-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-amber-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-amber-900", children: "R\u00E9union commission validation" }), _jsx("p", { className: "text-xs text-amber-700", children: "28 janvier, 15:00 - Salle de conf\u00E9rence" })] })] })), (user === null || user === void 0 ? void 0 : user.estSecretaire) && (_jsxs("div", { className: "flex items-center p-3 bg-violet-50 border border-violet-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-violet-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-violet-900", children: "Pr\u00E9paration convocations" }), _jsx("p", { className: "text-xs text-violet-700", children: "26 janvier, 9:00 - Bureau secr\u00E9tariat" })] })] })), _jsxs("div", { className: "flex items-center p-3 bg-gray-50 border border-gray-200 rounded", children: [_jsx("div", { className: "w-2 h-2 bg-gray-500 rounded-full mr-3" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Date limite - Soumission des m\u00E9moires" }), _jsx("p", { className: "text-xs text-gray-700", children: "31 janvier" })] })] })] })] })] })] })] }) }));
};
// Définition des couleurs navy manquantes pour Tailwind
const additionalStyles = `
  .bg-navy { background-color: #1e293b; }
  .text-navy { color: #1e293b; }
  .border-navy { border-color: #1e293b; }
  .bg-navy-dark { background-color: #0f172a; }
  .hover\\:bg-navy:hover { background-color: #1e293b; }
  .hover\\:text-white:hover { color: white; }
  .hover\\:bg-navy-dark:hover { background-color: #0f172a; }
`;
// Injection des styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = additionalStyles;
    document.head.appendChild(styleElement);
}
export default DashboardUnifie;
