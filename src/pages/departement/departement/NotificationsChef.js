import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Users, Download, X, School, Mail, BookOpen, GraduationCap, Send, MessageSquare, Bell, MessageCircle, MoreHorizontal, RefreshCw } from 'lucide-react';
// Mock du contexte d'authentification
const useAuth = () => ({
    user: {
        id: '1',
        name: 'Dr. Amadou Diop',
        email: 'chef.informatique@isimemo.edu.sn',
        department: 'Informatique',
        estChef: true,
        estSecretaire: false,
        type: 'chef',
    }
});
// Données fictives des professeurs
const PROFESSEURS_DATA = [
    {
        id: 1,
        nom: "Diop",
        prenom: "Dr. Ahmed",
        email: "ahmed.diop@isi.edu.sn",
        grade: "Professeur Titulaire",
        specialite: "Informatique",
        department: "Informatique",
        institution: "ISI",
        statut: "actif",
        dernierConnexion: "2025-01-20"
    },
    {
        id: 2,
        nom: "Fall",
        prenom: "Dr. Ousmane",
        email: "ousmane.fall@isi.edu.sn",
        grade: "Professeur",
        specialite: "Informatique",
        department: "Informatique",
        institution: "ISI",
        statut: "actif",
        dernierConnexion: "2025-01-19"
    },
    {
        id: 3,
        nom: "Ndiaye",
        prenom: "Mme Fatou",
        email: "fatou.ndiaye@isi.edu.sn",
        grade: "Secrétaire",
        specialite: "Administration",
        department: "Informatique",
        institution: "ISI",
        statut: "actif",
        estSecretaire: true,
        dernierConnexion: "2025-01-20"
    },
    {
        id: 4,
        nom: "Sarr",
        prenom: "Dr. Mamadou",
        email: "mamadou.sarr@isi.edu.sn",
        grade: "Maître de Conférences",
        specialite: "Informatique",
        department: "Informatique",
        institution: "ISI",
        statut: "actif",
        dernierConnexion: "2025-01-18"
    }
];
// Données fictives des étudiants
const ETUDIANTS_DATA = [
    {
        id: 1,
        nom: "Diallo",
        prenom: "Amadou",
        email: "amadou.diallo@student.isi.edu.sn",
        niveau: "Master 2",
        specialite: "Informatique",
        department: "Informatique",
        classe: "Informatique - M2",
        sessionChoisie: "septembre",
        statut: "actif"
    },
    {
        id: 2,
        nom: "Ba",
        prenom: "Mariama",
        email: "mariama.ba@student.isi.edu.sn",
        niveau: "Master 2",
        specialite: "Informatique",
        department: "Informatique",
        classe: "Informatique - M2",
        sessionChoisie: "septembre",
        statut: "actif"
    },
    {
        id: 3,
        nom: "Kane",
        prenom: "Moussa",
        email: "moussa.kane@student.isi.edu.sn",
        niveau: "Master 1",
        specialite: "Informatique",
        department: "Informatique",
        classe: "Informatique - M1",
        sessionChoisie: "septembre",
        statut: "actif"
    },
    {
        id: 4,
        nom: "Sow",
        prenom: "Aissatou",
        email: "aissatou.sow@student.isi.edu.sn",
        niveau: "Licence 3",
        specialite: "Informatique",
        department: "Informatique",
        classe: "Informatique - L3",
        sessionChoisie: "septembre",
        statut: "actif"
    },
    {
        id: 5,
        nom: "Ndoye",
        prenom: "Ibrahima",
        email: "ibrahima.ndoye@student.isi.edu.sn",
        niveau: "Licence 3",
        specialite: "Informatique",
        department: "Informatique",
        classe: "Informatique - L3",
        sessionChoisie: "decembre",
        statut: "actif"
    }
];
// Données fictives des notifications
const NOTIFICATIONS_DATA = [
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
        statut: "envoye"
    },
    {
        id: 2,
        expediteur: {
            id: 1,
            nom: "Diop",
            prenom: "Dr. Amadou",
            type: "chef"
        },
        destinataires: {
            type: "etudiants",
            filtres: {
                niveau: ["Master 2"],
                session: ["septembre"]
            }
        },
        objet: "Calendrier des soutenances - Session Septembre 2025",
        contenu: "Chers étudiants de Master 2,\n\nLe planning des soutenances pour la session de septembre est maintenant disponible.\n\nDates importantes :\n- Dépôt définitif des mémoires : 31 janvier 2025\n- Soutenances : Du 15 au 20 février 2025\n- Délibérations : 21 février 2025\n\nConsultez le planning détaillé sur la plateforme.\n\nBonne préparation !",
        type: "soutenance",
        dateEnvoi: "2025-01-19T16:00:00",
        statut: "envoye"
    }
];
// Données fictives des conversations
const CONVERSATIONS_DATA = [
    {
        id: 1,
        participants: [
            { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
            { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" }
        ],
        dernierMessage: {
            id: 1,
            expediteur: { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" },
            destinataire: { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
            objet: "Planning des jurys",
            contenu: "Bonjour Chef, j'ai reçu la liste des étudiants pour les jurys. Pouvons-nous discuter de la répartition ?",
            dateEnvoi: "2025-01-20T14:30:00",
            lu: false,
            conversation: 1
        },
        nombreNonLus: 1
    },
    {
        id: 2,
        participants: [
            { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
            { id: 3, nom: "Ndiaye", prenom: "Mme Fatou", type: "secretaire" }
        ],
        dernierMessage: {
            id: 2,
            expediteur: { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
            destinataire: { id: 3, nom: "Ndiaye", prenom: "Mme Fatou", type: "secretaire" },
            objet: "Préparation des convocations",
            contenu: "Madame Ndiaye, pouvez-vous préparer les convocations pour les soutenances ? Je vous envoie la liste.",
            dateEnvoi: "2025-01-20T11:15:00",
            lu: true,
            conversation: 2
        },
        nombreNonLus: 0
    }
];
// Composants UI réutilisables
const SimpleButton = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon, size = 'md' }) => {
    const styles = {
        primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
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
    return (_jsxs("button", { onClick: disabled ? undefined : onClick, disabled: disabled, type: type, className: `${sizes[size]} font-medium transition-colors duration-200 flex items-center ${styles[variant]}`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
const TabButton = ({ children, isActive, onClick, icon, badge }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        relative flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-navy text-navy'
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
        primary: "bg-navy bg-opacity-10 text-navy border border-navy border-opacity-20"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className}`, children: children }));
};
// Modal pour composer une notification
const ComposeNotificationModal = ({ isOpen, onClose, onSend, type, professeurs, etudiants }) => {
    const [formData, setFormData] = useState({
        objet: '',
        contenu: '',
        type: 'info',
        destinataires: 'tous',
        selection: [],
        filtres: {
            niveau: [],
            classe: [],
            session: []
        }
    });
    const handleSubmit = () => {
        if (!formData.objet.trim() || !formData.contenu.trim()) {
            alert('Veuillez remplir l\'objet et le contenu');
            return;
        }
        const notificationData = {
            objet: formData.objet,
            contenu: formData.contenu,
            type: formData.type,
            destinataires: Object.assign(Object.assign({ type: type }, (formData.destinataires === 'selection' && { ids: formData.selection })), (type === 'etudiants' && { filtres: formData.filtres }))
        };
        onSend(notificationData);
        setFormData({
            objet: '',
            contenu: '',
            type: 'info',
            destinataires: 'tous',
            selection: [],
            filtres: { niveau: [], classe: [], session: [] }
        });
        onClose();
    };
    if (!isOpen)
        return null;
    const niveauxDisponibles = [...new Set(etudiants.map(e => e.niveau))];
    const classesDisponibles = [...new Set(etudiants.map(e => e.classe))];
    const sessionsDisponibles = [...new Set(etudiants.map(e => e.sessionChoisie))];
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: ["Nouvelle notification - ", type === 'professeurs' ? 'Professeurs' : 'Étudiants'] }), _jsxs("p", { className: "text-sm text-gray-500", children: ["Envoyez une notification aux ", type, " du d\u00E9partement"] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Type de notification" }), _jsxs("select", { value: formData.type, onChange: (e) => setFormData(prev => (Object.assign(Object.assign({}, prev), { type: e.target.value }))), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "info", children: "Information" }), _jsx("option", { value: "urgent", children: "Urgent" }), _jsx("option", { value: "soutenance", children: "Soutenance" }), _jsx("option", { value: "convocation", children: "Convocation" }), _jsx("option", { value: "rappel", children: "Rappel" })] })] }) }), type === 'etudiants' && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 p-4", children: [_jsx("h4", { className: "font-medium text-blue-900 mb-3", children: "Filtres pour les \u00E9tudiants" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-blue-800 mb-2", children: "Niveaux" }), _jsx("div", { className: "space-y-1", children: niveauxDisponibles.map(niveau => (_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: formData.filtres.niveau.includes(niveau), onChange: (e) => {
                                                                    if (e.target.checked) {
                                                                        setFormData(prev => (Object.assign(Object.assign({}, prev), { filtres: Object.assign(Object.assign({}, prev.filtres), { niveau: [...prev.filtres.niveau, niveau] }) })));
                                                                    }
                                                                    else {
                                                                        setFormData(prev => (Object.assign(Object.assign({}, prev), { filtres: Object.assign(Object.assign({}, prev.filtres), { niveau: prev.filtres.niveau.filter(n => n !== niveau) }) })));
                                                                    }
                                                                }, className: "mr-2" }), _jsx("span", { className: "text-sm text-blue-800", children: niveau })] }, niveau))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-blue-800 mb-2", children: "Classes" }), _jsx("div", { className: "space-y-1", children: classesDisponibles.map(classe => (_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: formData.filtres.classe.includes(classe), onChange: (e) => {
                                                                    if (e.target.checked) {
                                                                        setFormData(prev => (Object.assign(Object.assign({}, prev), { filtres: Object.assign(Object.assign({}, prev.filtres), { classe: [...prev.filtres.classe, classe] }) })));
                                                                    }
                                                                    else {
                                                                        setFormData(prev => (Object.assign(Object.assign({}, prev), { filtres: Object.assign(Object.assign({}, prev.filtres), { classe: prev.filtres.classe.filter(c => c !== classe) }) })));
                                                                    }
                                                                }, className: "mr-2" }), _jsx("span", { className: "text-sm text-blue-800", children: classe })] }, classe))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-blue-800 mb-2", children: "Sessions" }), _jsx("div", { className: "space-y-1", children: sessionsDisponibles.map(session => (_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: formData.filtres.session.includes(session), onChange: (e) => {
                                                                    if (e.target.checked) {
                                                                        setFormData(prev => (Object.assign(Object.assign({}, prev), { filtres: Object.assign(Object.assign({}, prev.filtres), { session: [...prev.filtres.session, session] }) })));
                                                                    }
                                                                    else {
                                                                        setFormData(prev => (Object.assign(Object.assign({}, prev), { filtres: Object.assign(Object.assign({}, prev.filtres), { session: prev.filtres.session.filter(s => s !== session) }) })));
                                                                    }
                                                                }, className: "mr-2" }), _jsx("span", { className: "text-sm text-blue-800 capitalize", children: session })] }, session))) })] })] })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Objet *" }), _jsx("input", { type: "text", value: formData.objet, onChange: (e) => setFormData(prev => (Object.assign(Object.assign({}, prev), { objet: e.target.value }))), placeholder: "Objet de la notification...", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Contenu *" }), _jsx("textarea", { value: formData.contenu, onChange: (e) => setFormData(prev => (Object.assign(Object.assign({}, prev), { contenu: e.target.value }))), placeholder: "R\u00E9digez votre message...", rows: 8, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsxs("div", { className: "bg-gray-50 border border-gray-200 p-4", children: [_jsx("h4", { className: "font-medium text-gray-900 mb-2", children: "Aper\u00E7u des destinataires" }), _jsx("p", { className: "text-sm text-gray-600", children: type === 'professeurs'
                                        ? `${professeurs.length} professeurs du département Informatique`
                                        : `${etudiants.filter(e => {
                                            const niveauMatch = formData.filtres.niveau.length === 0 || formData.filtres.niveau.includes(e.niveau);
                                            const classeMatch = formData.filtres.classe.length === 0 || formData.filtres.classe.includes(e.classe);
                                            const sessionMatch = formData.filtres.session.length === 0 || formData.filtres.session.includes(e.sessionChoisie);
                                            return niveauMatch && classeMatch && sessionMatch;
                                        }).length} étudiants concernés` })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: [_jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Annuler" }), _jsx(SimpleButton, { variant: "primary", onClick: handleSubmit, icon: _jsx(Send, { className: "h-4 w-4" }), children: "Envoyer" })] })] }) }));
};
// Onglet Professeurs
const ProfesseursTab = ({ professeurs, notifications, onComposeNotification }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const filteredProfesseurs = professeurs.filter(prof => {
        const matchesSearch = prof.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prof.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prof.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || prof.statut === statusFilter;
        return matchesSearch && matchesStatus;
    });
    const notificationsProfesseurs = notifications.filter(n => n.destinataires.type === 'professeurs');
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-4", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Actions" }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(SimpleButton, { variant: "primary", icon: _jsx(Send, { className: "h-4 w-4" }), onClick: onComposeNotification, children: "Nouvelle notification aux professeurs" }), _jsx(SimpleButton, { variant: "secondary", icon: _jsx(Download, { className: "h-4 w-4" }), children: "Exporter la liste" }), _jsx(SimpleButton, { variant: "ghost", icon: _jsx(RefreshCw, { className: "h-4 w-4" }), children: "Actualiser" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Professeurs du d\u00E9partement" }), _jsxs("div", { className: "relative mb-4", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsx("input", { type: "text", placeholder: "Rechercher un professeur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsx("div", { className: "mb-4", children: _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Tous les statuts" }), _jsx("option", { value: "actif", children: "Actifs" }), _jsx("option", { value: "inactif", children: "Inactifs" })] }) }), _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: filteredProfesseurs.map((professeur, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "border border-gray-200 p-4 hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy text-white rounded-full w-8 h-8 flex items-center justify-center mr-3", children: _jsx(User, { className: "h-4 w-4" }) }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-gray-900", children: [professeur.prenom, " ", professeur.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: professeur.grade })] })] }), professeur.estSecretaire && (_jsx(Badge, { variant: "primary", children: "Secr\u00E9taire" }))] }), _jsxs("p", { className: "text-sm text-gray-600 flex items-center mb-1", children: [_jsx(Mail, { className: "h-3 w-3 mr-1" }), professeur.email] }), _jsxs("p", { className: "text-sm text-gray-600 flex items-center", children: [_jsx(School, { className: "h-3 w-3 mr-1" }), professeur.institution] }), professeur.dernierConnexion && (_jsxs("p", { className: "text-xs text-gray-500 mt-2", children: ["Derni\u00E8re connexion : ", new Date(professeur.dernierConnexion).toLocaleDateString('fr-FR')] }))] }, professeur.id))) }), _jsxs("div", { className: "mt-4 text-sm text-gray-500 text-center", children: [filteredProfesseurs.length, " professeur(s) affich\u00E9(s)"] })] }) }), _jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Notifications envoy\u00E9es aux professeurs" }), notificationsProfesseurs.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Bell, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-600 mb-2", children: "Aucune notification envoy\u00E9e" }), _jsx("p", { className: "text-gray-500 mb-4", children: "Commencez par envoyer votre premi\u00E8re notification aux professeurs" }), _jsx(SimpleButton, { variant: "primary", onClick: onComposeNotification, icon: _jsx(Send, { className: "h-4 w-4" }), children: "Envoyer une notification" })] })) : (_jsx("div", { className: "space-y-4", children: notificationsProfesseurs.map((notification, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "border border-gray-200 p-4 hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Badge, { variant: notification.type, children: notification.type }), _jsxs("span", { className: "ml-2 text-sm text-gray-500", children: [new Date(notification.dateEnvoi).toLocaleDateString('fr-FR'), " \u00E0 ", new Date(notification.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })] })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600", children: _jsx(MoreHorizontal, { className: "h-4 w-4" }) }) })] }), _jsx("h4", { className: "font-medium text-gray-900 mb-2", children: notification.objet }), _jsx("p", { className: "text-sm text-gray-600 mb-3 line-clamp-3", children: notification.contenu }), _jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(Users, { className: "h-4 w-4 mr-1" }), "Envoy\u00E9 \u00E0 tous les professeurs du d\u00E9partement"] })] }, notification.id))) }))] }) })] })] }));
};
// Onglet Étudiants
const EtudiantsTab = ({ etudiants, notifications, onComposeNotification }) => {
    var _a, _b, _c;
    const [searchQuery, setSearchQuery] = useState('');
    const [niveauFilter, setNiveauFilter] = useState('all');
    const [sessionFilter, setSessionFilter] = useState('all');
    const filteredEtudiants = etudiants.filter(etudiant => {
        const matchesSearch = etudiant.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            etudiant.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            etudiant.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesNiveau = niveauFilter === 'all' || etudiant.niveau === niveauFilter;
        const matchesSession = sessionFilter === 'all' || etudiant.sessionChoisie === sessionFilter;
        return matchesSearch && matchesNiveau && matchesSession;
    });
    const notificationsEtudiants = notifications.filter(n => n.destinataires.type === 'etudiants');
    const niveauxDisponibles = [...new Set(etudiants.map(e => e.niveau))];
    // Statistiques des étudiants
    const statsEtudiants = {
        total: etudiants.length,
        parNiveau: niveauxDisponibles.map(niveau => ({
            niveau,
            count: etudiants.filter(e => e.niveau === niveau).length
        })),
        parSession: [
            { session: 'septembre', count: etudiants.filter(e => e.sessionChoisie === 'septembre').length },
            { session: 'decembre', count: etudiants.filter(e => e.sessionChoisie === 'decembre').length },
            { session: 'speciale', count: etudiants.filter(e => e.sessionChoisie === 'speciale').length }
        ]
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-4", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Actions" }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(SimpleButton, { variant: "primary", icon: _jsx(Send, { className: "h-4 w-4" }), onClick: onComposeNotification, children: "Nouvelle notification aux \u00E9tudiants" }), _jsx(SimpleButton, { variant: "secondary", icon: _jsx(Download, { className: "h-4 w-4" }), children: "Exporter la liste" }), _jsx(SimpleButton, { variant: "ghost", icon: _jsx(RefreshCw, { className: "h-4 w-4" }), children: "Actualiser" })] })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [
                    { title: "Total Étudiants", value: statsEtudiants.total, icon: Users, color: "bg-blue-100 text-blue-600" },
                    { title: "Licence 3", value: ((_a = statsEtudiants.parNiveau.find(n => n.niveau === 'Licence 3')) === null || _a === void 0 ? void 0 : _a.count) || 0, icon: GraduationCap, color: "bg-green-100 text-green-600" },
                    { title: "Master 1", value: ((_b = statsEtudiants.parNiveau.find(n => n.niveau === 'Master 1')) === null || _b === void 0 ? void 0 : _b.count) || 0, icon: GraduationCap, color: "bg-orange-100 text-orange-600" },
                    { title: "Master 2", value: ((_c = statsEtudiants.parNiveau.find(n => n.niveau === 'Master 2')) === null || _c === void 0 ? void 0 : _c.count) || 0, icon: GraduationCap, color: "bg-purple-100 text-purple-600" }
                ].map((stat, index) => (_jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${stat.color} p-3 mr-4`, children: _jsx(stat.icon, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: stat.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.value })] })] }) }, stat.title))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "\u00C9tudiants du d\u00E9partement" }), _jsxs("div", { className: "space-y-4 mb-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsx("input", { type: "text", placeholder: "Rechercher un \u00E9tudiant...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsxs("select", { value: niveauFilter, onChange: (e) => setNiveauFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Tous les niveaux" }), niveauxDisponibles.map(niveau => (_jsx("option", { value: niveau, children: niveau }, niveau)))] }), _jsxs("select", { value: sessionFilter, onChange: (e) => setSessionFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Toutes les sessions" }), _jsx("option", { value: "septembre", children: "Septembre" }), _jsx("option", { value: "decembre", children: "D\u00E9cembre" }), _jsx("option", { value: "speciale", children: "Sp\u00E9ciale" })] })] }), _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: filteredEtudiants.map((etudiant, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "border border-gray-200 p-4 hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3", children: _jsx(User, { className: "h-4 w-4" }) }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-gray-900", children: [etudiant.prenom, " ", etudiant.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: etudiant.niveau })] })] }), _jsx(Badge, { variant: "primary", children: etudiant.sessionChoisie })] }), _jsxs("p", { className: "text-sm text-gray-600 flex items-center mb-1", children: [_jsx(Mail, { className: "h-3 w-3 mr-1" }), etudiant.email] }), _jsxs("p", { className: "text-sm text-gray-600 flex items-center", children: [_jsx(BookOpen, { className: "h-3 w-3 mr-1" }), etudiant.classe] })] }, etudiant.id))) }), _jsxs("div", { className: "mt-4 text-sm text-gray-500 text-center", children: [filteredEtudiants.length, " \u00E9tudiant(s) affich\u00E9(s)"] })] }) }), _jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Notifications envoy\u00E9es aux \u00E9tudiants" }), notificationsEtudiants.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(Bell, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-600 mb-2", children: "Aucune notification envoy\u00E9e" }), _jsx("p", { className: "text-gray-500 mb-4", children: "Commencez par envoyer votre premi\u00E8re notification aux \u00E9tudiants" }), _jsx(SimpleButton, { variant: "primary", onClick: onComposeNotification, icon: _jsx(Send, { className: "h-4 w-4" }), children: "Envoyer une notification" })] })) : (_jsx("div", { className: "space-y-4", children: notificationsEtudiants.map((notification, index) => {
                                        var _a;
                                        return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "border border-gray-200 p-4 hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Badge, { variant: notification.type, children: notification.type }), _jsxs("span", { className: "ml-2 text-sm text-gray-500", children: [new Date(notification.dateEnvoi).toLocaleDateString('fr-FR'), " \u00E0 ", new Date(notification.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })] })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600", children: _jsx(MoreHorizontal, { className: "h-4 w-4" }) }) })] }), _jsx("h4", { className: "font-medium text-gray-900 mb-2", children: notification.objet }), _jsx("p", { className: "text-sm text-gray-600 mb-3 line-clamp-3", children: notification.contenu }), _jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(Users, { className: "h-4 w-4 mr-1" }), notification.destinataires.filtres
                                                            ? `Envoyé aux étudiants ${((_a = notification.destinataires.filtres.niveau) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'tous niveaux'}`
                                                            : 'Envoyé à tous les étudiants du département'] })] }, notification.id));
                                    }) }))] }) })] })] }));
};
// Onglet Messagerie
const MessagerieTab = ({ conversations, professeurs, etudiants }) => {
    var _a, _b, _c;
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [showNewMessage, setShowNewMessage] = useState(false);
    const [newMessageData, setNewMessageData] = useState({
        destinataire: '',
        objet: '',
        contenu: ''
    });
    const handleSendMessage = () => {
        if (!newMessageData.destinataire || !newMessageData.objet.trim() || !newMessageData.contenu.trim()) {
            alert('Veuillez remplir tous les champs');
            return;
        }
        alert('Message envoyé avec succès !');
        setNewMessageData({ destinataire: '', objet: '', contenu: '' });
        setShowNewMessage(false);
    };
    const tousLesContacts = [
        ...professeurs.map(p => (Object.assign(Object.assign({}, p), { type: 'professeur' }))),
        ...etudiants.map(e => (Object.assign(Object.assign({}, e), { type: 'etudiant' })))
    ];
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-4", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Actions" }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(SimpleButton, { variant: "primary", icon: _jsx(MessageSquare, { className: "h-4 w-4" }), onClick: () => setShowNewMessage(true), children: "Nouveau message" }), _jsx(SimpleButton, { variant: "ghost", icon: _jsx(RefreshCw, { className: "h-4 w-4" }), children: "Actualiser" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Conversations" }), conversations.length === 0 ? (_jsxs("div", { className: "text-center py-8", children: [_jsx(MessageCircle, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-600 mb-2", children: "Aucune conversation" }), _jsx("p", { className: "text-gray-500 mb-4", children: "Commencez une nouvelle conversation" }), _jsx(SimpleButton, { variant: "primary", onClick: () => setShowNewMessage(true), icon: _jsx(MessageSquare, { className: "h-4 w-4" }), children: "Nouveau message" })] })) : (_jsx("div", { className: "space-y-3", children: conversations.map((conversation, index) => {
                                        const autreParticipant = conversation.participants.find(p => p.id !== 1); // Exclure le chef (id: 1)
                                        return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: `border border-gray-200 p-4 cursor-pointer transition-colors hover:bg-gray-50 ${(selectedConversation === null || selectedConversation === void 0 ? void 0 : selectedConversation.id) === conversation.id ? 'bg-navy bg-opacity-10 border-navy' : ''}`, onClick: () => setSelectedConversation(conversation), children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3", children: _jsx(User, { className: "h-4 w-4" }) }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-gray-900", children: [autreParticipant === null || autreParticipant === void 0 ? void 0 : autreParticipant.prenom, " ", autreParticipant === null || autreParticipant === void 0 ? void 0 : autreParticipant.nom] }), _jsx("p", { className: "text-sm text-gray-600 capitalize", children: autreParticipant === null || autreParticipant === void 0 ? void 0 : autreParticipant.type })] })] }), conversation.nombreNonLus > 0 && (_jsx("span", { className: "bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center", children: conversation.nombreNonLus }))] }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: conversation.dernierMessage.contenu }), _jsxs("p", { className: "text-xs text-gray-500 mt-2", children: [new Date(conversation.dernierMessage.dateEnvoi).toLocaleDateString('fr-FR'), " \u00E0 ", new Date(conversation.dernierMessage.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })] })] }, conversation.id));
                                    }) }))] }) }), _jsx("div", { className: "lg:col-span-2", children: selectedConversation ? (_jsxs("div", { className: "bg-white border border-gray-200 h-96 flex flex-col", children: [_jsx("div", { className: "border-b border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3", children: _jsx(User, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-gray-900", children: [(_a = selectedConversation.participants.find(p => p.id !== 1)) === null || _a === void 0 ? void 0 : _a.prenom, " ", (_b = selectedConversation.participants.find(p => p.id !== 1)) === null || _b === void 0 ? void 0 : _b.nom] }), _jsx("p", { className: "text-sm text-gray-600 capitalize", children: (_c = selectedConversation.participants.find(p => p.id !== 1)) === null || _c === void 0 ? void 0 : _c.type })] })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600", children: _jsx(MoreHorizontal, { className: "h-4 w-4" }) }) })] }) }), _jsx("div", { className: "flex-1 p-4 overflow-y-auto", children: _jsx("div", { className: "space-y-4", children: _jsx("div", { className: `flex ${selectedConversation.dernierMessage.expediteur.id === 1 ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${selectedConversation.dernierMessage.expediteur.id === 1
                                                    ? 'bg-navy text-white'
                                                    : 'bg-gray-100 text-gray-900'}`, children: [_jsx("p", { className: "text-sm", children: selectedConversation.dernierMessage.contenu }), _jsx("p", { className: `text-xs mt-1 ${selectedConversation.dernierMessage.expediteur.id === 1 ? 'text-navy-light' : 'text-gray-500'}`, children: new Date(selectedConversation.dernierMessage.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) })] }) }) }) }), _jsx("div", { className: "border-t border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "text", placeholder: "Tapez votre message...", className: "flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" }), _jsx(SimpleButton, { variant: "primary", icon: _jsx(Send, { className: "h-4 w-4" }), children: "Envoyer" })] }) })] })) : (_jsx("div", { className: "bg-white border border-gray-200 h-96 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(MessageCircle, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-600 mb-2", children: "S\u00E9lectionnez une conversation" }), _jsx("p", { className: "text-gray-500", children: "Choisissez une conversation pour voir les messages" })] }) })) })] }), _jsx(AnimatePresence, { children: showNewMessage && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Nouveau message" }), _jsx("p", { className: "text-sm text-gray-500", children: "Envoyez un message priv\u00E9" })] }), _jsx("button", { onClick: () => setShowNewMessage(false), className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Destinataire *" }), _jsxs("select", { value: newMessageData.destinataire, onChange: (e) => setNewMessageData(prev => (Object.assign(Object.assign({}, prev), { destinataire: e.target.value }))), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "", children: "S\u00E9lectionner un destinataire" }), _jsx("optgroup", { label: "Professeurs", children: professeurs.map(prof => (_jsxs("option", { value: `professeur-${prof.id}`, children: [prof.prenom, " ", prof.nom, " - ", prof.grade] }, `prof-${prof.id}`))) }), _jsx("optgroup", { label: "\u00C9tudiants", children: etudiants.map(etudiant => (_jsxs("option", { value: `etudiant-${etudiant.id}`, children: [etudiant.prenom, " ", etudiant.nom, " - ", etudiant.niveau] }, `etudiant-${etudiant.id}`))) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Objet *" }), _jsx("input", { type: "text", value: newMessageData.objet, onChange: (e) => setNewMessageData(prev => (Object.assign(Object.assign({}, prev), { objet: e.target.value }))), placeholder: "Objet du message...", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Message *" }), _jsx("textarea", { value: newMessageData.contenu, onChange: (e) => setNewMessageData(prev => (Object.assign(Object.assign({}, prev), { contenu: e.target.value }))), placeholder: "R\u00E9digez votre message...", rows: 6, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200", children: [_jsx(SimpleButton, { variant: "secondary", onClick: () => setShowNewMessage(false), children: "Annuler" }), _jsx(SimpleButton, { variant: "primary", onClick: handleSendMessage, icon: _jsx(Send, { className: "h-4 w-4" }), children: "Envoyer" })] })] }) })) })] }));
};
// Composant principal
const NotificationsChef = () => {
    const [activeTab, setActiveTab] = useState('professeurs');
    const [notificationsState, setNotificationsState] = useState(NOTIFICATIONS_DATA);
    const [conversationsState, setConversationsState] = useState(CONVERSATIONS_DATA);
    const [showComposeModal, setShowComposeModal] = useState(false);
    const [composeType, setComposeType] = useState('professeurs');
    const { user } = useAuth();
    const isSecretaire = user.estSecretaire;
    const isChef = user.estChef;
    const handleComposeNotification = (type) => {
        setComposeType(type);
        setShowComposeModal(true);
    };
    const handleSendNotification = (notificationData) => {
        const newNotification = Object.assign(Object.assign({ id: Math.max(...notificationsState.map(n => n.id), 0) + 1, expediteur: {
                id: 1,
                nom: user.name.split(' ')[2] || 'Diop',
                prenom: user.name.split(' ')[0] + ' ' + user.name.split(' ')[1],
                type: 'chef'
            } }, notificationData), { dateEnvoi: new Date().toISOString(), statut: 'envoye' });
        setNotificationsState(prev => [newNotification, ...prev]);
        alert('Notification envoyée avec succès !');
    };
    const notificationsAafficher = notificationsState.filter(n => {
        var _a;
        return (n.destinataires.type === 'professeurs' && (isChef || isSecretaire))
            || (n.destinataires.type === 'etudiants' && user.type === 'etudiant')
            || (n.destinataires.type === 'individuel' && ((_a = n.destinataires.ids) === null || _a === void 0 ? void 0 : _a.includes(Number(user.id))));
    });
    // Calcul des badges pour les onglets
    const nombreNonLusMessagerie = conversationsState.reduce((total, conv) => total + conv.nombreNonLus, 0);
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy-light rounded-full p-3 mr-4", children: _jsx(Bell, { className: "h-7 w-7 text-navy" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Notifications & Messages" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["D\u00E9partement ", user.department, " - Communiquez avec les professeurs et \u00E9tudiants"] })] })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("nav", { className: "flex space-x-8 px-6", children: [_jsx(TabButton, { isActive: activeTab === 'professeurs', onClick: () => setActiveTab('professeurs'), icon: _jsx(Users, { className: "h-4 w-4" }), children: "Professeurs" }), _jsx(TabButton, { isActive: activeTab === 'etudiants', onClick: () => setActiveTab('etudiants'), icon: _jsx(GraduationCap, { className: "h-4 w-4" }), children: "\u00C9tudiants" }), _jsx(TabButton, { isActive: activeTab === 'messagerie', onClick: () => setActiveTab('messagerie'), icon: _jsx(MessageCircle, { className: "h-4 w-4" }), badge: nombreNonLusMessagerie, children: "Messagerie" })] }) }), _jsxs("div", { className: "p-6", children: [activeTab === 'professeurs' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(ProfesseursTab, { professeurs: PROFESSEURS_DATA, notifications: notificationsState, onComposeNotification: () => handleComposeNotification('professeurs') }) })), activeTab === 'etudiants' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(EtudiantsTab, { etudiants: ETUDIANTS_DATA, notifications: notificationsState, onComposeNotification: () => handleComposeNotification('etudiants') }) })), activeTab === 'messagerie' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(MessagerieTab, { conversations: conversationsState, professeurs: PROFESSEURS_DATA.filter(p => !p.estSecretaire), etudiants: ETUDIANTS_DATA }) }))] })] }), _jsx(ComposeNotificationModal, { isOpen: showComposeModal, onClose: () => setShowComposeModal(false), onSend: handleSendNotification, type: composeType, professeurs: PROFESSEURS_DATA, etudiants: ETUDIANTS_DATA })] }) }));
};
// Définition des couleurs navy manquantes pour Tailwind
const additionalStyles = `
  .bg-navy { background-color: #1e293b; }
  .text-navy { color: #1e293b; }
  .border-navy { border-color: #1e293b; }
  .bg-navy-light { background-color: #e2e8f0; }
  .bg-navy-dark { background-color: #0f172a; }
  .text-navy-light { color: #e2e8f0; }
  .hover\\:bg-navy:hover { background-color: #1e293b; }
  .hover\\:bg-navy-dark:hover { background-color: #0f172a; }
  .hover\\:border-navy:hover { border-color: #1e293b; }
  .focus\\:border-navy:focus { border-color: #1e293b; }
  .focus\\:ring-navy:focus { --tw-ring-color: #1e293b; }
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
export default NotificationsChef;
