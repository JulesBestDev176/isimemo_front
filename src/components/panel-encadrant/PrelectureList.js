import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Search, Eye, BookOpen } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { StatutDemandePrelecture } from '../../models/dossier/DemandePrelecture';
export const PrelectureList = ({ demandes, onConsult }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredDemandes = useMemo(() => {
        if (!searchQuery.trim())
            return demandes;
        const query = searchQuery.toLowerCase();
        return demandes.filter(demande => {
            var _a, _b, _c, _d, _e;
            return ((_a = demande.candidat) === null || _a === void 0 ? void 0 : _a.nom.toLowerCase().includes(query)) ||
                ((_b = demande.candidat) === null || _b === void 0 ? void 0 : _b.prenom.toLowerCase().includes(query)) ||
                ((_c = demande.candidat) === null || _c === void 0 ? void 0 : _c.email.toLowerCase().includes(query)) ||
                demande.dossierMemoire.titre.toLowerCase().includes(query) ||
                ((_d = demande.encadrantPrincipal) === null || _d === void 0 ? void 0 : _d.nom.toLowerCase().includes(query)) ||
                ((_e = demande.encadrantPrincipal) === null || _e === void 0 ? void 0 : _e.prenom.toLowerCase().includes(query));
        });
    }, [demandes, searchQuery]);
    const getStatutBadge = (statut) => {
        switch (statut) {
            case StatutDemandePrelecture.EN_ATTENTE:
                return _jsx(Badge, { className: "bg-yellow-50 text-yellow-700 border-yellow-200", children: "En attente" });
            case StatutDemandePrelecture.EN_COURS:
                return _jsx(Badge, { className: "bg-blue-50 text-blue-700 border-blue-200", children: "En cours" });
            case StatutDemandePrelecture.VALIDE:
                return _jsx(Badge, { className: "bg-green-50 text-green-700 border-green-200", children: "Valid\u00E9" });
            case StatutDemandePrelecture.REJETE:
                return _jsx(Badge, { className: "bg-red-50 text-red-700 border-red-200", children: "Rejet\u00E9" });
            default:
                return _jsx(Badge, { className: "bg-gray-50 text-gray-700 border-gray-200", children: statut });
        }
    };
    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    if (demandes.length === 0) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx(BookOpen, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Aucun m\u00E9moire en pr\u00E9-lecture" }), _jsx("p", { className: "text-gray-600", children: "Aucun m\u00E9moire ne vous a \u00E9t\u00E9 assign\u00E9 pour pr\u00E9-lecture pour le moment." })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "M\u00E9moires en pr\u00E9-lecture" }) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Rechercher par \u00E9tudiant, encadrant principal ou titre du m\u00E9moire...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent" })] }), _jsx("div", { className: "bg-white border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "\u00C9tudiant" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Titre du m\u00E9moire" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Encadrant principal" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Date assignation" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredDemandes.map((demande) => {
                                    var _a, _b, _c, _d, _e, _f;
                                    return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "flex items-center", children: _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-gray-900", children: [(_a = demande.candidat) === null || _a === void 0 ? void 0 : _a.prenom, " ", (_b = demande.candidat) === null || _b === void 0 ? void 0 : _b.nom] }), _jsx("div", { className: "text-sm text-gray-500", children: (_c = demande.candidat) === null || _c === void 0 ? void 0 : _c.email })] }) }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-900 max-w-xs truncate", title: demande.dossierMemoire.titre, children: demande.dossierMemoire.titre }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsxs("div", { className: "text-sm text-gray-900", children: [(_d = demande.encadrantPrincipal) === null || _d === void 0 ? void 0 : _d.prenom, " ", (_e = demande.encadrantPrincipal) === null || _e === void 0 ? void 0 : _e.nom] }), _jsx("div", { className: "text-sm text-gray-500", children: (_f = demande.encadrantPrincipal) === null || _f === void 0 ? void 0 : _f.email })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: demande.dateAssignation ? formatDate(demande.dateAssignation) : '-' }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: getStatutBadge(demande.statut) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs(Button, { onClick: () => onConsult(demande), variant: "outline", size: "sm", className: "flex items-center gap-2", children: [_jsx(Eye, { className: "h-4 w-4" }), "Consulter"] }) })] }, demande.idDemandePrelecture));
                                }) })] }) }) }), filteredDemandes.length === 0 && searchQuery && (_jsx("div", { className: "text-center py-8", children: _jsxs("p", { className: "text-gray-600", children: ["Aucun r\u00E9sultat trouv\u00E9 pour \"", searchQuery, "\""] }) }))] }));
};
