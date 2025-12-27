import { jsx as _jsx } from "react/jsx-runtime";
import { StatutLivrable } from '../../models';
import { Badge } from '../ui/badge';
// Formatage des dates
export const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
export const formatDateTime = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
// Badges pour les statuts
export const getStatutLivrableBadge = (statut) => {
    switch (statut) {
        case StatutLivrable.VALIDE:
            return _jsx(Badge, { className: "bg-blue-50 text-blue-700 border-blue-200", children: "Valid\u00E9" });
        case StatutLivrable.REJETE:
            return _jsx(Badge, { className: "bg-gray-50 text-gray-700 border-gray-200", children: "Rejet\u00E9" });
        case StatutLivrable.EN_ATTENTE_VALIDATION:
            return _jsx(Badge, { className: "bg-yellow-50 text-yellow-700 border-yellow-200", children: "En attente" });
        case StatutLivrable.DEPOSE:
            return _jsx(Badge, { className: "bg-blue-50 text-blue-700 border-blue-200", children: "D\u00E9pos\u00E9" });
        default:
            return _jsx(Badge, { variant: "outline", children: statut });
    }
};
export const getStatutTacheBadge = (statut) => {
    switch (statut) {
        case 'Terminé':
            return _jsx(Badge, { className: "bg-green-50 text-green-700 border-green-200", children: "Termin\u00E9" });
        case 'En retard':
            return _jsx(Badge, { className: "bg-red-50 text-red-700 border-red-200", children: "En retard" });
        case 'En cours':
            return _jsx(Badge, { className: "bg-blue-50 text-blue-700 border-blue-200", children: "En cours" });
        default:
            return _jsx(Badge, { variant: "outline", children: statut });
    }
};
export const getPrioriteBadge = (priorite) => {
    switch (priorite) {
        case 'Haute':
            return _jsx(Badge, { className: "bg-red-50 text-red-700 border-red-200", children: "Haute" });
        case 'Moyenne':
            return _jsx(Badge, { className: "bg-yellow-50 text-yellow-700 border-yellow-200", children: "Moyenne" });
        case 'Basse':
            return _jsx(Badge, { className: "bg-blue-50 text-blue-700 border-blue-200", children: "Basse" });
        default:
            return _jsx(Badge, { variant: "outline", children: priorite });
    }
};
