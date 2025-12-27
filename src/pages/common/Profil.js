import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserIcon, FileText, Upload, Download, Eye, Edit, FileCheck, FileX, FileClock, AlertCircle, Mail, Phone, Calendar, MapPin, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { mockDocumentsAdministratifs, StatutDocument } from '../../models';
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
const formatDateTime = (date) => {
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
const getDocumentStatutBadge = (statut) => {
    switch (statut) {
        case StatutDocument.VALIDE:
            return 'success';
        case StatutDocument.EN_ATTENTE_VALIDATION:
            return 'warning';
        case StatutDocument.REJETE:
            return 'error';
        case StatutDocument.DEPOSE:
            return 'info';
        default:
            return 'info';
    }
};
const getDocumentStatutLabel = (statut) => {
    const statuts = {
        [StatutDocument.BROUILLON]: 'Brouillon',
        [StatutDocument.DEPOSE]: 'Déposé',
        [StatutDocument.EN_ATTENTE_VALIDATION]: 'En attente',
        [StatutDocument.VALIDE]: 'Validé',
        [StatutDocument.REJETE]: 'Rejeté',
        [StatutDocument.ARCHIVE]: 'Archivé'
    };
    return statuts[statut] || statut;
};
// Composant principal
const Profil = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('informations');
    // Données du profil (à remplacer par des appels API)
    const [profileData, setProfileData] = useState({
        nom: (user === null || user === void 0 ? void 0 : user.name.split(' ')[1]) || 'Dupont',
        prenom: (user === null || user === void 0 ? void 0 : user.name.split(' ')[0]) || 'Jean',
        email: (user === null || user === void 0 ? void 0 : user.email) || 'jean.dupont@example.com',
        telephone: '+221 77 123 45 67',
        adresse: 'Dakar, Sénégal',
        dateNaissance: '1998-05-15',
        numeroMatricule: 'ETU2024001',
        niveau: 'Master 2',
        filiere: 'Informatique'
    });
    // Documents administratifs
    const documentsAdministratifs = useMemo(() => {
        return mockDocumentsAdministratifs;
    }, []);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSave = () => {
        // TODO: Appel API pour sauvegarder
        setIsEditing(false);
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
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-4 mr-4", children: _jsx(UserIcon, { className: "h-8 w-8 text-primary-700" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: [profileData.prenom, " ", profileData.nom] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: profileData.email }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "info", children: profileData.niveau }), _jsx(Badge, { variant: "primary", children: profileData.filiere }), _jsxs("span", { className: "text-xs text-gray-500", children: ["Matricule: ", profileData.numeroMatricule] })] })] })] }), !isEditing && (_jsxs("button", { onClick: () => setIsEditing(true), className: "btn-primary flex items-center", children: [_jsx(Edit, { className: "h-4 w-4 mr-2" }), "Modifier le profil"] }))] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("div", { className: "flex", children: [_jsx(TabButton, { isActive: activeTab === 'informations', onClick: () => setActiveTab('informations'), icon: _jsx(UserIcon, { className: "h-4 w-4" }), children: "Informations personnelles" }), _jsx(TabButton, { isActive: activeTab === 'documents', onClick: () => setActiveTab('documents'), icon: _jsx(FileText, { className: "h-4 w-4" }), count: documentsAdministratifs.length, children: "Documents administratifs" })] }) }), _jsx("div", { className: "p-6", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'informations' && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: _jsx("div", { className: "space-y-6", children: _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Informations personnelles" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Pr\u00E9nom" }), isEditing ? (_jsx("input", { type: "text", name: "prenom", value: profileData.prenom, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" })) : (_jsx("p", { className: "text-gray-900 bg-gray-50 px-3 py-2 rounded-lg", children: profileData.prenom }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nom" }), isEditing ? (_jsx("input", { type: "text", name: "nom", value: profileData.nom, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" })) : (_jsx("p", { className: "text-gray-900 bg-gray-50 px-3 py-2 rounded-lg", children: profileData.nom }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Mail, { className: "h-4 w-4 inline mr-1" }), "Email"] }), isEditing ? (_jsx("input", { type: "email", name: "email", value: profileData.email, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" })) : (_jsx("p", { className: "text-gray-900 bg-gray-50 px-3 py-2 rounded-lg", children: profileData.email }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Phone, { className: "h-4 w-4 inline mr-1" }), "T\u00E9l\u00E9phone"] }), isEditing ? (_jsx("input", { type: "tel", name: "telephone", value: profileData.telephone, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" })) : (_jsx("p", { className: "text-gray-900 bg-gray-50 px-3 py-2 rounded-lg", children: profileData.telephone }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(Calendar, { className: "h-4 w-4 inline mr-1" }), "Date de naissance"] }), isEditing ? (_jsx("input", { type: "date", name: "dateNaissance", value: profileData.dateNaissance, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" })) : (_jsx("p", { className: "text-gray-900 bg-gray-50 px-3 py-2 rounded-lg", children: new Date(profileData.dateNaissance).toLocaleDateString('fr-FR') }))] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: [_jsx(MapPin, { className: "h-4 w-4 inline mr-1" }), "Adresse"] }), isEditing ? (_jsx("input", { type: "text", name: "adresse", value: profileData.adresse, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" })) : (_jsx("p", { className: "text-gray-900 bg-gray-50 px-3 py-2 rounded-lg", children: profileData.adresse }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Niveau" }), isEditing ? (_jsxs("select", { name: "niveau", value: profileData.niveau, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent", children: [_jsx("option", { value: "Licence 1", children: "Licence 1" }), _jsx("option", { value: "Licence 2", children: "Licence 2" }), _jsx("option", { value: "Licence 3", children: "Licence 3" }), _jsx("option", { value: "Master 1", children: "Master 1" }), _jsx("option", { value: "Master 2", children: "Master 2" })] })) : (_jsx("p", { className: "text-gray-900 bg-gray-50 px-3 py-2 rounded-lg", children: profileData.niveau }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Fili\u00E8re" }), isEditing ? (_jsxs("select", { name: "filiere", value: profileData.filiere, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent", children: [_jsx("option", { value: "Informatique", children: "Informatique" }), _jsx("option", { value: "Math\u00E9matiques", children: "Math\u00E9matiques" }), _jsx("option", { value: "Physique", children: "Physique" }), _jsx("option", { value: "Chimie", children: "Chimie" })] })) : (_jsx("p", { className: "text-gray-900 bg-gray-50 px-3 py-2 rounded-lg", children: profileData.filiere }))] })] }), isEditing && (_jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { onClick: () => setIsEditing(false), className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Annuler" }), _jsxs("button", { onClick: handleSave, className: "btn-primary flex items-center", children: [_jsx(Save, { className: "h-4 w-4 mr-2" }), "Enregistrer"] })] }))] }) }) }, "informations")), activeTab === 'documents' && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: _jsx("div", { className: "space-y-6", children: _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Documents administratifs" }), _jsxs("button", { className: "btn-primary flex items-center text-sm", children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "D\u00E9poser un document"] })] }), _jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4", children: _jsxs("div", { className: "flex items-start", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-sm text-blue-800", children: "Les documents administratifs sont g\u00E9n\u00E9raux \u00E0 tous vos dossiers et peuvent \u00EAtre d\u00E9pos\u00E9s ou modifi\u00E9s \u00E0 tout moment." })] }) }), _jsx("div", { className: "space-y-3", children: documentsAdministratifs.length > 0 ? (documentsAdministratifs.map((doc) => (_jsx("div", { className: "bg-gray-50 border border-gray-200 p-4 rounded-lg hover:border-primary transition-colors", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start flex-1", children: [_jsx("div", { className: "bg-primary-100 p-2 rounded-lg mr-4", children: doc.statut === StatutDocument.VALIDE ? (_jsx(FileCheck, { className: "h-5 w-5 text-green-600" })) : doc.statut === StatutDocument.REJETE ? (_jsx(FileX, { className: "h-5 w-5 text-red-600" })) : (_jsx(FileClock, { className: "h-5 w-5 text-orange-600" })) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("p", { className: "font-medium text-gray-900", children: doc.titre }), _jsx(Badge, { variant: getDocumentStatutBadge(doc.statut), children: getDocumentStatutLabel(doc.statut) })] }), _jsxs("p", { className: "text-sm text-gray-500 mb-2", children: ["D\u00E9pos\u00E9 le ", formatDateTime(doc.dateCreation)] }), doc.commentaire && (_jsxs("p", { className: "text-sm text-gray-600 italic", children: ["\"", doc.commentaire, "\""] }))] })] }), _jsxs("div", { className: "flex items-center gap-2 ml-4", children: [_jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("button", { className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: _jsx(Download, { className: "h-4 w-4" }) }), _jsx("button", { className: "p-2 text-primary hover:text-primary-700 rounded-lg hover:bg-primary-50", children: _jsx(Edit, { className: "h-4 w-4" }) })] })] }) }, doc.idDocument)))) : (_jsxs("div", { className: "bg-gray-50 border border-gray-200 p-6 rounded-lg text-center", children: [_jsx(FileText, { className: "h-12 w-12 text-gray-400 mx-auto mb-3" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Aucun document administratif d\u00E9pos\u00E9" }), _jsxs("button", { className: "btn-primary inline-flex items-center", children: [_jsx(Upload, { className: "h-4 w-4 mr-2" }), "D\u00E9poser votre premier document"] })] })) })] }) }) }, "documents"))] }) })] })] }) }));
};
export default Profil;
