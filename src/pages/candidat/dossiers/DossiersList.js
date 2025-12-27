import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Plus, Clock, Folder, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { StatutDossierMemoire, EtapeDossier } from '../../../models';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import CreateDossierModal from '../../../components/dossier/CreateDossierModal';
const getStatutLabel = (statut) => {
    const statuts = {
        [StatutDossierMemoire.EN_CREATION]: 'En création',
        [StatutDossierMemoire.EN_COURS]: 'En cours',
        [StatutDossierMemoire.EN_ATTENTE_VALIDATION]: 'En attente',
        [StatutDossierMemoire.VALIDE]: 'Validé',
        [StatutDossierMemoire.DEPOSE]: 'Déposé',
        [StatutDossierMemoire.SOUTENU]: 'Soutenu'
    };
    return statuts[statut] || statut;
};
const getStatutBadgeVariant = (statut) => {
    switch (statut) {
        case StatutDossierMemoire.EN_COURS:
            return 'default';
        case StatutDossierMemoire.VALIDE:
        case StatutDossierMemoire.SOUTENU:
            return 'default';
        case StatutDossierMemoire.EN_ATTENTE_VALIDATION:
            return 'secondary';
        case StatutDossierMemoire.DEPOSE:
            return 'outline';
        default:
            return 'outline';
    }
};
const getEtapeLabel = (etape) => {
    const etapes = {
        [EtapeDossier.CHOIX_SUJET]: 'Choix du sujet',
        [EtapeDossier.CHOIX_BINOME]: 'Choix du binôme',
        [EtapeDossier.CHOIX_ENCADRANT]: 'Choix de l\'encadrant',
        [EtapeDossier.VALIDATION_COMMISSION]: 'Validation commission',
        [EtapeDossier.VALIDATION_SUJET]: 'Validation du sujet',
        [EtapeDossier.REDACTION]: 'Rédaction en cours',
        [EtapeDossier.PRELECTURE]: 'Pré-lecture',
        [EtapeDossier.DEPOT_INTERMEDIAIRE]: 'Dépôt intermédiaire',
        [EtapeDossier.DEPOT_FINAL]: 'Dépôt final',
        [EtapeDossier.CORRECTION]: 'Corrections',
        [EtapeDossier.SOUTENANCE]: 'Soutenance',
        [EtapeDossier.TERMINE]: 'Terminé'
    };
    return etapes[etape] || etape;
};
const formatDate = (date) => {
    if (!date)
        return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
const DossiersList = ({ dossiers, onDossierClick, onDossierCreated }) => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const filteredDossiers = useMemo(() => {
        if (!searchQuery.trim())
            return dossiers;
        const query = searchQuery.toLowerCase();
        return dossiers.filter(dossier => {
            var _a, _b, _c;
            return (((_a = dossier.titre) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '').includes(query) ||
                (((_b = dossier.description) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '').includes(query) ||
                (((_c = dossier.anneeAcademique) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '').includes(query);
        });
    }, [dossiers, searchQuery]);
    // Séparer les dossiers en cours et terminés
    const dossiersEnCours = filteredDossiers.filter(d => d.statut === StatutDossierMemoire.EN_COURS ||
        d.statut === StatutDossierMemoire.EN_CREATION);
    const dossiersTermines = filteredDossiers.filter(d => d.statut !== StatutDossierMemoire.EN_COURS &&
        d.statut !== StatutDossierMemoire.EN_CREATION);
    // Vérifier si l'utilisateur a déjà un dossier pour l'année académique en cours
    const currentAcademicYear = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        // L'année académique commence en septembre
        if (month >= 8) { // Septembre = 8
            return `${year}-${year + 1}`;
        }
        else {
            return `${year - 1}-${year}`;
        }
    }, []);
    const hasCurrentYearDossier = useMemo(() => {
        return dossiers.some(d => d.anneeAcademique === currentAcademicYear);
    }, [dossiers, currentAcademicYear]);
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Mes Dossiers" }), _jsx("p", { className: "text-gray-600 mt-1", children: (user === null || user === void 0 ? void 0 : user.estCandidat) ? 'Gérez vos dossiers de mémoire en tant que candidat' : 'Consultez vos dossiers de mémoire' })] }), (user === null || user === void 0 ? void 0 : user.type) === 'etudiant' && !hasCurrentYearDossier && (_jsxs(Button, { onClick: () => setShowCreateModal(true), className: "flex items-center gap-2", children: [_jsx(Plus, { className: "h-5 w-5" }), "Cr\u00E9er un dossier"] }))] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx(Input, { type: "text", placeholder: "Rechercher un dossier...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] })] }), dossiersEnCours.length > 0 && (_jsxs("div", { className: "mb-8", children: [_jsxs("h2", { className: "text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Clock, { className: "h-5 w-5 text-primary" }), "Dossiers en cours"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: dossiersEnCours.map((dossier, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.1 }, children: _jsxs(Card, { className: "cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary", onClick: () => onDossierClick(dossier.id), children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("div", { className: "bg-primary-100 rounded-lg p-2", children: _jsx(Folder, { className: "h-5 w-5 text-primary" }) }), _jsx(Badge, { variant: getStatutBadgeVariant(dossier.statut), children: getStatutLabel(dossier.statut) })] }), _jsx(CardTitle, { className: "text-lg", children: dossier.titre }), _jsx(CardDescription, { className: "line-clamp-2", children: dossier.description })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "\u00C9tape" }), _jsx(Badge, { variant: "outline", children: getEtapeLabel(dossier.etape) })] }), dossier.anneeAcademique && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Ann\u00E9e" }), _jsx("span", { className: "text-gray-900", children: dossier.anneeAcademique })] })), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Cr\u00E9\u00E9 le" }), _jsx("span", { className: "text-gray-900", children: formatDate(dossier.dateCreation) })] })] }) })] }) }, dossier.id))) })] })), dossiersTermines.length > 0 && (_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(FileText, { className: "h-5 w-5 text-gray-600" }), "Dossiers termin\u00E9s"] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: dossiersTermines.map((dossier, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: index * 0.1 }, children: _jsxs(Card, { className: "cursor-pointer hover:shadow-lg transition-all duration-200", onClick: () => onDossierClick(dossier.id), children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("div", { className: "bg-gray-100 rounded-lg p-2", children: _jsx(FileText, { className: "h-5 w-5 text-gray-600" }) }), _jsx(Badge, { variant: getStatutBadgeVariant(dossier.statut), children: getStatutLabel(dossier.statut) })] }), _jsx(CardTitle, { className: "text-lg", children: dossier.titre }), _jsx(CardDescription, { className: "line-clamp-2", children: dossier.description })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "\u00C9tape" }), _jsx(Badge, { variant: "outline", children: getEtapeLabel(dossier.etape) })] }), dossier.anneeAcademique && (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Ann\u00E9e" }), _jsx("span", { className: "text-gray-900", children: dossier.anneeAcademique })] })), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-gray-500", children: "Cr\u00E9\u00E9 le" }), _jsx("span", { className: "text-gray-900", children: formatDate(dossier.dateCreation) })] })] }) })] }) }, dossier.id))) })] })), filteredDossiers.length === 0 && (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(AlertCircle, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: searchQuery ? 'Aucun dossier trouvé' : 'Aucun dossier' }), _jsx("p", { className: "text-gray-600 mb-6 max-w-md mx-auto", children: searchQuery
                                        ? 'Essayez avec d\'autres mots-clés'
                                        : 'Vous n\'avez pas encore de dossier de mémoire actif. Vous pouvez en créer un dès maintenant pour entamer le processus.' }), !searchQuery && (user === null || user === void 0 ? void 0 : user.type) === 'etudiant' && (_jsxs(Button, { onClick: () => setShowCreateModal(true), className: "flex items-center gap-2 mx-auto", size: "lg", children: [_jsx(Plus, { className: "h-5 w-5" }), "Cr\u00E9er mon dossier maintenant"] }))] }) }))] }), _jsx(CreateDossierModal, { isOpen: showCreateModal, onClose: () => setShowCreateModal(false), userId: (user === null || user === void 0 ? void 0 : user.id) || '', onSuccess: (dossier) => {
                    if (onDossierCreated)
                        onDossierCreated(dossier);
                    onDossierClick(dossier.id);
                } })] }));
};
export default DossiersList;
