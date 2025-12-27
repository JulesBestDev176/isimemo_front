import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Download, Filter, Eye, FileText, Calendar, CheckCircle, AlertCircle, MessageSquare, Bell, MessageCircle, Archive, MoreHorizontal, RefreshCw, Send, X, Star } from 'lucide-react';
// Données fictives - notifications reçues par le professeur
const NOTIFICATIONS_RECUES = [
    {
        id: 1,
        expediteur: {
            id: 1,
            nom: "Diop",
            prenom: "Dr. Amadou",
            type: "chef"
        },
        destinataires: {
            type: "professeurs"
        },
        objet: "Réunion du département - Planning des soutenances",
        contenu: "Chers collègues,\n\nJe vous convie à une réunion du département qui se tiendra le vendredi 25 janvier 2025 à 14h en salle de conférence.\n\nOrdre du jour :\n- Planning des soutenances de fin d'année\n- Attribution des jurys\n- Questions diverses\n\nMerci de confirmer votre présence.\n\nCordialement,\nDr. Amadou Diop",
        type: "convocation",
        dateEnvoi: "2025-01-20T10:30:00",
        statut: "envoye",
        important: true
    },
    {
        id: 2,
        expediteur: {
            id: 3,
            nom: "Ndiaye",
            prenom: "Mme Fatou",
            type: "secretaire"
        },
        destinataires: {
            type: "professeurs"
        },
        objet: "Rappel : Remise des notes de cours",
        contenu: "Bonjour chers professeurs,\n\nJe vous rappelle que la date limite pour la remise des notes de cours est fixée au 30 janvier 2025.\n\nMerci de bien vouloir déposer vos documents sur la plateforme ou les remettre directement au secrétariat.\n\nCordialement,\nMme Fatou Ndiaye\nSecrétaire du département",
        type: "rappel",
        dateEnvoi: "2025-01-19T14:15:00",
        statut: "lu"
    },
    {
        id: 3,
        expediteur: {
            id: 1,
            nom: "Diop",
            prenom: "Dr. Amadou",
            type: "chef"
        },
        destinataires: {
            type: "professeurs"
        },
        objet: "Information : Nouvelle procédure d'évaluation",
        contenu: "Chers collègues,\n\nSuite aux dernières directives ministérielles, nous devons mettre en place une nouvelle procédure d'évaluation des étudiants.\n\nUne formation sera organisée le 28 janvier 2025 de 9h à 12h.\n\nDétails en pièce jointe.\n\nCordialement,\nDr. Amadou Diop",
        type: "info",
        dateEnvoi: "2025-01-18T16:45:00",
        statut: "envoye",
        pieceJointe: {
            nom: "nouvelle_procedure_evaluation.pdf",
            url: "#",
            taille: "245 KB"
        }
    },
    {
        id: 4,
        expediteur: {
            id: 1,
            nom: "Diop",
            prenom: "Dr. Amadou",
            type: "chef"
        },
        destinataires: {
            type: "professeurs"
        },
        objet: "URGENT : Modification planning des examens",
        contenu: "Chers collègues,\n\nEn raison d'un imprévu, nous devons modifier le planning des examens de la semaine prochaine.\n\nLes examens prévus mardi 23 janvier sont reportés au jeudi 25 janvier.\n\nMerci d'informer vos étudiants rapidement.\n\nDésolé pour ce changement de dernière minute.\n\nCordialement,\nDr. Amadou Diop",
        type: "urgent",
        dateEnvoi: "2025-01-20T08:30:00",
        statut: "envoye",
        important: true,
        favori: true
    }
];
// Données fictives des conversations
const CONVERSATIONS_PROFESSEUR = [
    {
        id: 1,
        participants: [
            { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" }, // Moi
            { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" }
        ],
        dernierMessage: {
            id: 1,
            expediteur: { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
            destinataire: { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" },
            objet: "Planning des jurys",
            contenu: "Bonjour Ousmane, j'ai préparé la répartition des jurys pour les soutenances. Pouvez-vous me confirmer votre disponibilité pour le 15 février ?",
            dateEnvoi: "2025-01-20T14:30:00",
            lu: false,
            conversation: 1
        },
        nombreNonLus: 1
    },
    {
        id: 2,
        participants: [
            { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" }, // Moi
            { id: 3, nom: "Ndiaye", prenom: "Mme Fatou", type: "secretaire" }
        ],
        dernierMessage: {
            id: 2,
            expediteur: { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" },
            destinataire: { id: 3, nom: "Ndiaye", prenom: "Mme Fatou", type: "secretaire" },
            objet: "Demande de salle",
            contenu: "Bonjour Madame Ndiaye, pourrais-je réserver la salle informatique 3 pour mes TPs du jeudi matin ?",
            dateEnvoi: "2025-01-19T11:45:00",
            lu: true,
            conversation: 2
        },
        nombreNonLus: 0
    },
    {
        id: 3,
        participants: [
            { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" }, // Moi
            { id: 1, nom: "Diallo", prenom: "Amadou", type: "etudiant" }
        ],
        dernierMessage: {
            id: 3,
            expediteur: { id: 1, nom: "Diallo", prenom: "Amadou", type: "etudiant" },
            destinataire: { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" },
            objet: "Question sur le projet",
            contenu: "Bonjour Professeur, j'ai une question concernant la partie algorithmes de notre projet de fin d'études. Pourriez-vous me recevoir cette semaine ?",
            dateEnvoi: "2025-01-18T16:20:00",
            lu: false,
            conversation: 3
        },
        nombreNonLus: 1
    }
];
// Utilisateur actuel (professeur)
const CURRENT_USER = {
    id: 2,
    nom: "Fall",
    prenom: "Dr. Ousmane",
    type: "professeur"
};
// Composants UI réutilisables
const SimpleButton = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon, size = 'md' }) => {
    const styles = {
        primary: `bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        success: `bg-green-600 text-white border border-green-600 hover:bg-green-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        warning: `bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        danger: `bg-red-600 text-white border border-red-600 hover:bg-red-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };
    return (_jsxs("button", { onClick: disabled ? undefined : onClick, disabled: disabled, type: type, className: `${sizes[size]} font-medium transition-colors duration-200 flex items-center rounded-sm ${styles[variant]}`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
const TabButton = ({ children, isActive, onClick, icon, badge }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        relative flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children, badge && badge > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: badge > 99 ? '99+' : badge }))] }));
};
const Badge = ({ children, variant = 'info', className = '' }) => {
    const styles = {
        info: "bg-blue-50 text-blue-700 border border-blue-200",
        urgent: "bg-red-50 text-red-700 border border-red-200",
        soutenance: "bg-purple-50 text-purple-700 border border-purple-200",
        convocation: "bg-orange-50 text-orange-700 border border-orange-200",
        rappel: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        success: "bg-green-50 text-green-700 border border-green-200",
        warning: "bg-orange-50 text-orange-700 border border-orange-200",
        primary: "bg-blue-50 text-blue-700 border border-blue-200"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded-sm ${styles[variant]} ${className}`, children: children }));
};
// Modal pour voir les détails d'une notification
const NotificationDetailsModal = ({ notification, isOpen, onClose, onMarkAsRead, onToggleFavorite, onArchive }) => {
    if (!isOpen || !notification)
        return null;
    const handleMarkAsRead = () => {
        if (notification.statut !== 'lu') {
            onMarkAsRead(notification.id);
        }
    };
    const handleToggleFavorite = () => {
        onToggleFavorite(notification.id);
    };
    const handleArchive = () => {
        onArchive(notification.id);
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto", onAnimationComplete: handleMarkAsRead, children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Badge, { variant: notification.type, children: notification.type }), notification.important && (_jsx(Badge, { variant: "urgent", children: "Important" })), notification.favori && (_jsx(Star, { className: "h-4 w-4 text-yellow-500 fill-current" })), notification.statut === 'lu' && (_jsx(CheckCircle, { className: "h-4 w-4 text-green-500" }))] }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: notification.objet }), _jsxs("div", { className: "text-sm text-gray-500", children: [_jsxs("p", { children: ["De : ", notification.expediteur.prenom, " ", notification.expediteur.nom] }), _jsxs("p", { children: ["Date : ", new Date(notification.dateEnvoi).toLocaleDateString('fr-FR'), " \u00E0 ", new Date(notification.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })] })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { onClick: handleToggleFavorite, className: `p-2 transition-colors ${notification.favori ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`, title: notification.favori ? 'Retirer des favoris' : 'Ajouter aux favoris', children: _jsx(Star, { className: `h-5 w-5 ${notification.favori ? 'fill-current' : ''}` }) }), _jsx("button", { onClick: handleArchive, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", title: "Archiver", children: _jsx(Archive, { className: "h-5 w-5" }) }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-gray-50 border border-gray-200 p-4 rounded-sm", children: _jsx("div", { className: "whitespace-pre-wrap text-gray-900 leading-relaxed", children: notification.contenu }) }), notification.pieceJointe && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 p-4 rounded-sm", children: [_jsx("h4", { className: "font-medium text-blue-900 mb-2", children: "Pi\u00E8ce jointe" }), _jsxs("div", { className: "flex items-center", children: [_jsx(FileText, { className: "h-5 w-5 text-blue-600 mr-2" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-blue-900", children: notification.pieceJointe.nom }), _jsx("p", { className: "text-xs text-blue-700", children: notification.pieceJointe.taille })] }), _jsx(SimpleButton, { variant: "primary", size: "sm", icon: _jsx(Download, { className: "h-4 w-4" }), onClick: () => { var _a; return window.open((_a = notification.pieceJointe) === null || _a === void 0 ? void 0 : _a.url, '_blank'); }, children: "T\u00E9l\u00E9charger" })] })] }))] }), _jsx("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: _jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Fermer" }) })] }) }));
};
// Onglet Notifications
const NotificationsTab = ({ notifications, onViewNotification, onMarkAsRead, onToggleFavorite, onArchive }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const filteredNotifications = notifications.filter(notification => {
        const matchesSearch = notification.objet.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notification.contenu.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `${notification.expediteur.prenom} ${notification.expediteur.nom}`.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'non_lu' && notification.statut === 'envoye') ||
            (statusFilter === 'lu' && notification.statut === 'lu') ||
            (statusFilter === 'archive' && notification.statut === 'archive') ||
            (statusFilter === 'favoris' && notification.favori);
        const matchesType = typeFilter === 'all' || notification.type === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });
    const notificationsNonLues = notifications.filter(n => n.statut === 'envoye').length;
    const notificationsUrgentes = notifications.filter(n => n.type === 'urgent' && n.statut === 'envoye').length;
    const notificationsFavorites = notifications.filter(n => n.favori).length;
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                    { title: "Non lues", value: notificationsNonLues, icon: Bell, color: "bg-blue-100 text-blue-600" },
                    { title: "Urgentes", value: notificationsUrgentes, icon: AlertCircle, color: "bg-red-100 text-red-600" },
                    { title: "Favorites", value: notificationsFavorites, icon: Star, color: "bg-yellow-100 text-yellow-600" },
                    { title: "Total", value: notifications.length, icon: FileText, color: "bg-gray-100 text-gray-600" }
                ].map((stat, index) => (_jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${stat.color} p-3 mr-4 rounded-sm`, children: _jsx(stat.icon, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: stat.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.value })] })] }) }, stat.title))) }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4", children: [_jsxs("div", { className: "relative w-full md:w-1/2", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Rechercher une notification...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(SimpleButton, { variant: "ghost", onClick: () => setShowFilters(!showFilters), icon: _jsx(Filter, { className: "h-5 w-5" }), children: showFilters ? 'Masquer' : 'Filtres' }), _jsx(SimpleButton, { variant: "ghost", icon: _jsx(RefreshCw, { className: "h-4 w-4" }), children: "Actualiser" })] })] }), _jsx(AnimatePresence, { children: showFilters && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Statut" }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600", children: [_jsx("option", { value: "all", children: "Toutes" }), _jsx("option", { value: "non_lu", children: "Non lues" }), _jsx("option", { value: "lu", children: "Lues" }), _jsx("option", { value: "favoris", children: "Favorites" }), _jsx("option", { value: "archive", children: "Archiv\u00E9es" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Type" }), _jsxs("select", { value: typeFilter, onChange: (e) => setTypeFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600", children: [_jsx("option", { value: "all", children: "Tous les types" }), _jsx("option", { value: "info", children: "Information" }), _jsx("option", { value: "urgent", children: "Urgent" }), _jsx("option", { value: "soutenance", children: "Soutenance" }), _jsx("option", { value: "convocation", children: "Convocation" }), _jsx("option", { value: "rappel", children: "Rappel" })] })] })] })) })] }), _jsx("div", { className: "mb-4", children: _jsxs("p", { className: "text-sm text-gray-600", children: [filteredNotifications.length, " notification", filteredNotifications.length !== 1 ? 's' : '', " trouv\u00E9e", filteredNotifications.length !== 1 ? 's' : ''] }) }), filteredNotifications.length === 0 ? (_jsxs("div", { className: "bg-white border border-gray-200 p-12 text-center", children: [_jsx(Bell, { className: "h-16 w-16 mx-auto text-gray-300 mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-700 mb-2", children: "Aucune notification trouv\u00E9e" }), _jsx("p", { className: "text-gray-500", children: "Modifiez vos crit\u00E8res de recherche" })] })) : (_jsx("div", { className: "space-y-4", children: filteredNotifications.map((notification, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: `bg-white border-l-4 border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200 ${notification.statut === 'envoye' ? 'border-l-blue-500 bg-blue-50 bg-opacity-30' :
                        notification.important ? 'border-l-red-500' :
                            notification.favori ? 'border-l-yellow-500' : 'border-l-gray-300'}`, onClick: () => onViewNotification(notification), children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Badge, { variant: notification.type, children: notification.type }), notification.important && (_jsx(Badge, { variant: "urgent", children: "Important" })), notification.favori && (_jsx(Star, { className: "h-4 w-4 text-yellow-500 fill-current" })), notification.statut === 'envoye' && (_jsx("span", { className: "inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full", children: "Nouveau" }))] }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: notification.objet }), _jsx("p", { className: "text-sm text-gray-600 mb-3 line-clamp-2", children: notification.contenu }), _jsxs("div", { className: "flex items-center text-sm text-gray-500 space-x-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(User, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: [notification.expediteur.prenom, " ", notification.expediteur.nom] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: [new Date(notification.dateEnvoi).toLocaleDateString('fr-FR'), " \u00E0 ", new Date(notification.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })] })] }), notification.pieceJointe && (_jsxs("div", { className: "flex items-center", children: [_jsx(FileText, { className: "h-4 w-4 mr-1" }), _jsx("span", { children: "Pi\u00E8ce jointe" })] }))] })] }), _jsxs("div", { className: "flex items-center space-x-2 ml-4", children: [_jsx("button", { onClick: (e) => {
                                            e.stopPropagation();
                                            onToggleFavorite(notification.id);
                                        }, className: `p-2 transition-colors ${notification.favori ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`, title: notification.favori ? 'Retirer des favoris' : 'Ajouter aux favoris', children: _jsx(Star, { className: `h-4 w-4 ${notification.favori ? 'fill-current' : ''}` }) }), _jsx("button", { onClick: (e) => {
                                            e.stopPropagation();
                                            onArchive(notification.id);
                                        }, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", title: "Archiver", children: _jsx(Archive, { className: "h-4 w-4" }) }), _jsx("div", { className: "text-gray-400", children: _jsx(Eye, { className: "h-4 w-4" }) })] })] }) }, notification.id))) }))] }));
};
// Onglet Messagerie
const MessagerieTab = ({ conversations }) => {
    var _a, _b, _c, _d, _e, _f;
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [newMessageData, setNewMessageData] = useState({
        destinataire: '',
        objet: '',
        contenu: ''
    });
    const [messageText, setMessageText] = useState('');
    const handleSendMessage = () => {
        if (!newMessageData.destinataire || !newMessageData.objet.trim() || !newMessageData.contenu.trim()) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        alert('Message envoyé avec succès !');
        setNewMessageData({ destinataire: '', objet: '', contenu: '' });
        setShowNewMessage(false);
    };
    const handleSendReply = () => {
        if (!messageText.trim()) {
            alert('Veuillez saisir un message');
            return;
        }
        alert('Réponse envoyée avec succès !');
        setMessageText('');
    };
    // Contacts disponibles (chef, secrétaire, autres professeurs)
    const contactsDisponibles = [
        { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
        { id: 3, nom: "Ndiaye", prenom: "Mme Fatou", type: "secretaire" },
        { id: 4, nom: "Sarr", prenom: "Dr. Mamadou", type: "professeur" }
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-4", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Actions" }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(SimpleButton, { variant: "primary", icon: _jsx(MessageSquare, { className: "h-4 w-4" }), onClick: () => setShowNewMessage(true), children: "Nouveau message" }), _jsx(SimpleButton, { variant: "ghost", icon: _jsx(RefreshCw, { className: "h-4 w-4" }), children: "Actualiser" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Conversations" }), conversations.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(MessageCircle, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-600 mb-2", children: "Aucune conversation" }), _jsx("p", { className: "text-gray-500 mb-4", children: "Commencez une nouvelle conversation" }), _jsx(SimpleButton, { variant: "primary", onClick: () => setShowNewMessage(true), icon: _jsx(MessageSquare, { className: "h-4 w-4" }), children: "Nouveau message" })] })) : (_jsx("div", { className: "space-y-3", children: conversations.map((conversation, index) => {
                                        const autreParticipant = conversation.participants.find(p => p.id !== CURRENT_USER.id);
                                        return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: `border border-gray-200 p-4 cursor-pointer transition-colors hover:bg-gray-50 rounded-sm ${(selectedConversation === null || selectedConversation === void 0 ? void 0 : selectedConversation.id) === conversation.id ? 'bg-blue-50 border-blue-300' : ''}`, onClick: () => setSelectedConversation(conversation), children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${(autreParticipant === null || autreParticipant === void 0 ? void 0 : autreParticipant.type) === 'chef' ? 'bg-purple-600' :
                                                                        (autreParticipant === null || autreParticipant === void 0 ? void 0 : autreParticipant.type) === 'secretaire' ? 'bg-green-600' :
                                                                            (autreParticipant === null || autreParticipant === void 0 ? void 0 : autreParticipant.type) === 'etudiant' ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded-full w-8 h-8 flex items-center justify-center mr-3`, children: _jsx(User, { className: "h-4 w-4" }) }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-gray-900", children: [autreParticipant === null || autreParticipant === void 0 ? void 0 : autreParticipant.prenom, " ", autreParticipant === null || autreParticipant === void 0 ? void 0 : autreParticipant.nom] }), _jsx("p", { className: "text-sm text-gray-600 capitalize", children: autreParticipant === null || autreParticipant === void 0 ? void 0 : autreParticipant.type })] })] }), conversation.nombreNonLus > 0 && (_jsx("span", { className: "bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: conversation.nombreNonLus }))] }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: conversation.dernierMessage.contenu }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [new Date(conversation.dernierMessage.dateEnvoi).toLocaleDateString('fr-FR'), " \u00E0 ", new Date(conversation.dernierMessage.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })] })] }, conversation.id));
                                    }) }))] }) }), _jsx("div", { className: "lg:col-span-2", children: selectedConversation ? (_jsxs("div", { className: "bg-white border border-gray-200 h-96 flex flex-col", children: [_jsx("div", { className: "border-b border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${((_a = selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)) === null || _a === void 0 ? void 0 : _a.type) === 'chef' ? 'bg-purple-600' :
                                                            ((_b = selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)) === null || _b === void 0 ? void 0 : _b.type) === 'secretaire' ? 'bg-green-600' :
                                                                ((_c = selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)) === null || _c === void 0 ? void 0 : _c.type) === 'etudiant' ? 'bg-blue-600' : 'bg-gray-600'} text-white rounded-full w-10 h-10 flex items-center justify-center mr-3`, children: _jsx(User, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-gray-900", children: [(_d = selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)) === null || _d === void 0 ? void 0 : _d.prenom, " ", (_e = selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)) === null || _e === void 0 ? void 0 : _e.nom] }), _jsx("p", { className: "text-sm text-gray-600 capitalize", children: (_f = selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)) === null || _f === void 0 ? void 0 : _f.type })] })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600", children: _jsx(MoreHorizontal, { className: "h-4 w-4" }) }) })] }) }), _jsx("div", { className: "flex-1 p-4 overflow-y-auto", children: _jsx("div", { className: "space-y-4", children: _jsx("div", { className: `flex ${selectedConversation.dernierMessage.expediteur.id === CURRENT_USER.id ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${selectedConversation.dernierMessage.expediteur.id === CURRENT_USER.id
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-900'}`, children: [_jsx("p", { className: "text-sm font-medium mb-1", children: selectedConversation.dernierMessage.objet }), _jsx("p", { className: "text-sm", children: selectedConversation.dernierMessage.contenu }), _jsx("p", { className: `text-xs mt-1 ${selectedConversation.dernierMessage.expediteur.id === CURRENT_USER.id ? 'text-blue-200' : 'text-gray-500'}`, children: new Date(selectedConversation.dernierMessage.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) })] }) }) }) }), _jsx("div", { className: "border-t border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "text", placeholder: "Tapez votre r\u00E9ponse...", value: messageText, onChange: (e) => setMessageText(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSendReply(), className: "flex-1 px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" }), _jsx(SimpleButton, { variant: "primary", icon: _jsx(Send, { className: "h-4 w-4" }), onClick: handleSendReply, children: "Envoyer" })] }) })] })) : (_jsx("div", { className: "bg-white border border-gray-200 h-96 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(MessageCircle, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-600 mb-2", children: "S\u00E9lectionnez une conversation" }), _jsx("p", { className: "text-gray-500", children: "Choisissez une conversation pour voir les messages" })] }) })) })] }), _jsx(AnimatePresence, { children: showNewMessage && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Nouveau message" }), _jsx("p", { className: "text-sm text-gray-500", children: "Envoyez un message priv\u00E9" })] }), _jsx("button", { onClick: () => setShowNewMessage(false), className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Destinataire *" }), _jsxs("select", { value: newMessageData.destinataire, onChange: (e) => setNewMessageData(prev => (Object.assign(Object.assign({}, prev), { destinataire: e.target.value }))), className: "w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600", children: [_jsx("option", { value: "", children: "S\u00E9lectionner un destinataire" }), contactsDisponibles.map(contact => (_jsxs("option", { value: `${contact.type}-${contact.id}`, children: [contact.prenom, " ", contact.nom, " - ", contact.type === 'chef' ? 'Chef de département' : contact.type === 'secretaire' ? 'Secrétaire' : 'Professeur'] }, contact.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Objet *" }), _jsx("input", { type: "text", value: newMessageData.objet, onChange: (e) => setNewMessageData(prev => (Object.assign(Object.assign({}, prev), { objet: e.target.value }))), placeholder: "Objet du message...", className: "w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Message *" }), _jsx("textarea", { value: newMessageData.contenu, onChange: (e) => setNewMessageData(prev => (Object.assign(Object.assign({}, prev), { contenu: e.target.value }))), placeholder: "R\u00E9digez votre message...", rows: 6, className: "w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200", children: [_jsx(SimpleButton, { variant: "secondary", onClick: () => setShowNewMessage(false), children: "Annuler" }), _jsx(SimpleButton, { variant: "primary", onClick: handleSendMessage, icon: _jsx(Send, { className: "h-4 w-4" }), children: "Envoyer" })] })] }) })) })] }));
};
// Composant principal
const NotificationsProfesseur = () => {
    const [activeTab, setActiveTab] = useState('notifications');
    const [notificationsState, setNotificationsState] = useState(NOTIFICATIONS_RECUES);
    const [conversationsState, setConversationsState] = useState(CONVERSATIONS_PROFESSEUR);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleViewNotification = (notification) => {
        setSelectedNotification(notification);
        setIsModalOpen(true);
    };
    const handleMarkAsRead = (id) => {
        setNotificationsState(prev => prev.map(notification => notification.id === id
            ? Object.assign(Object.assign({}, notification), { statut: 'lu' }) : notification));
    };
    const handleToggleFavorite = (id) => {
        setNotificationsState(prev => prev.map(notification => notification.id === id
            ? Object.assign(Object.assign({}, notification), { favori: !notification.favori }) : notification));
    };
    const handleArchive = (id) => {
        setNotificationsState(prev => prev.map(notification => notification.id === id
            ? Object.assign(Object.assign({}, notification), { statut: 'archive' }) : notification));
    };
    const closeModal = () => {
        setSelectedNotification(null);
        setIsModalOpen(false);
    };
    // Calcul des badges pour les onglets
    const notificationsNonLues = notificationsState.filter(n => n.statut === 'envoye').length;
    const nombreNonLusMessagerie = conversationsState.reduce((total, conv) => total + conv.nombreNonLus, 0);
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-blue-100 rounded-full p-3 mr-4", children: _jsx(Bell, { className: "h-7 w-7 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Notifications & Messages" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Consultez vos notifications et \u00E9changez des messages" })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-sm font-medium text-gray-900", children: [CURRENT_USER.prenom, " ", CURRENT_USER.nom] }), _jsx("p", { className: "text-xs text-gray-500", children: "Professeur - D\u00E9partement Informatique" })] })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("nav", { className: "flex space-x-8 px-6", children: [_jsx(TabButton, { isActive: activeTab === 'notifications', onClick: () => setActiveTab('notifications'), icon: _jsx(Bell, { className: "h-4 w-4" }), badge: notificationsNonLues, children: "Notifications" }), _jsx(TabButton, { isActive: activeTab === 'messagerie', onClick: () => setActiveTab('messagerie'), icon: _jsx(MessageCircle, { className: "h-4 w-4" }), badge: nombreNonLusMessagerie, children: "Messagerie" })] }) }), _jsx("div", { className: "p-6", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'notifications' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(NotificationsTab, { notifications: notificationsState, onViewNotification: handleViewNotification, onMarkAsRead: handleMarkAsRead, onToggleFavorite: handleToggleFavorite, onArchive: handleArchive }) }, "notifications")), activeTab === 'messagerie' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(MessagerieTab, { conversations: conversationsState }) }, "messagerie"))] }) })] }), _jsx(NotificationDetailsModal, { notification: selectedNotification, isOpen: isModalOpen, onClose: closeModal, onMarkAsRead: handleMarkAsRead, onToggleFavorite: handleToggleFavorite, onArchive: handleArchive })] }) }));
};
// Styles CSS additionnels
const additionalStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;
// Injection des styles
if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = additionalStyles;
    document.head.appendChild(styleElement);
}
export default NotificationsProfesseur;
