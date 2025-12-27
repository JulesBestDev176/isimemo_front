import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { Badge } from '../ui/badge';
export const DossierEtudiantList = ({ dossiers, encadrementId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const filteredDossiers = useMemo(() => {
        if (!searchQuery.trim())
            return dossiers;
        const query = searchQuery.toLowerCase();
        return dossiers.filter(dossier => dossier.etudiant.nom.toLowerCase().includes(query) ||
            dossier.etudiant.prenom.toLowerCase().includes(query) ||
            dossier.etudiant.email.toLowerCase().includes(query) ||
            dossier.dossierMemoire.titre.toLowerCase().includes(query) ||
            dossier.dossierMemoire.statut.toLowerCase().includes(query) ||
            dossier.dossierMemoire.etape.toLowerCase().includes(query));
    }, [dossiers, searchQuery]);
    const getStatutBadgeColor = (statut) => {
        switch (statut) {
            case 'EN_COURS':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'EN_ATTENTE_VALIDATION':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'VALIDE':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'DEPOSE':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'SOUTENU':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };
    const getEtapeBadgeColor = (etape) => {
        switch (etape) {
            case 'REDACTION':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'DEPOT_INTERMEDIAIRE':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'DEPOT_FINAL':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'SOUTENANCE':
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'TERMINE':
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Dossiers des \u00E9tudiants" }) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Rechercher par nom, email, titre du m\u00E9moire, statut ou \u00E9tape...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent" })] }), _jsx("div", { className: "bg-white border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "\u00C9tudiant" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Titre du m\u00E9moire" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "\u00C9tape" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Progression" }), _jsx("th", { className: "px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: filteredDossiers.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 6, className: "px-6 py-12 text-center text-gray-500", children: searchQuery ? 'Aucun dossier trouvé pour cette recherche.' : 'Aucun dossier disponible.' }) })) : (filteredDossiers.map((dossier) => (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsxs("div", { className: "w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm mr-3", children: [dossier.etudiant.prenom.charAt(0), dossier.etudiant.nom.charAt(0)] }), _jsxs("div", { children: [_jsxs("div", { className: "font-medium text-gray-900", children: [dossier.etudiant.prenom, " ", dossier.etudiant.nom] }), _jsx("div", { className: "text-sm text-gray-500", children: dossier.etudiant.email })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-900 max-w-md", children: dossier.dossierMemoire.titre }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { className: `${getStatutBadgeColor(dossier.dossierMemoire.statut)} text-xs`, children: dossier.dossierMemoire.statut.replace(/_/g, ' ') }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { className: `${getEtapeBadgeColor(dossier.dossierMemoire.etape)} text-xs`, children: dossier.dossierMemoire.etape.replace(/_/g, ' ') }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-24 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-primary h-2 rounded-full transition-all", style: { width: `${dossier.dossierMemoire.progression}%` } }) }), _jsxs("span", { className: "text-sm font-medium text-gray-900 w-10", children: [dossier.dossierMemoire.progression, "%"] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right", children: _jsxs("button", { onClick: () => navigate(`/professeur/encadrements/${encadrementId}/dossier/${dossier.dossierMemoire.id}`), className: "inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors border border-gray-300", children: [_jsx(Eye, { className: "h-4 w-4" }), "Voir le d\u00E9tail"] }) })] }, dossier.id)))) })] }) }) }), searchQuery && (_jsxs("div", { className: "text-sm text-gray-600", children: [filteredDossiers.length, " dossier", filteredDossiers.length !== 1 ? 's' : '', " trouv\u00E9", filteredDossiers.length !== 1 ? 's' : ''] }))] }));
};
