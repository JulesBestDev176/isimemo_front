import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { History, Calendar, Users, FileText, Search, Award } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { StatutDossierMemoire } from '../../../models/dossier/DossierMemoire';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
const HistoriqueTab = ({ dossiers, searchQuery, onSearchChange }) => {
    const dossiersFiltres = useMemo(() => {
        if (!searchQuery.trim())
            return dossiers;
        const query = searchQuery.toLowerCase();
        return dossiers.filter(d => {
            var _a;
            return d.titre.toLowerCase().includes(query) ||
                d.description.toLowerCase().includes(query) ||
                ((_a = d.candidats) === null || _a === void 0 ? void 0 : _a.some(c => `${c.prenom} ${c.nom}`.toLowerCase().includes(query)));
        });
    }, [dossiers, searchQuery]);
    // Trier par date de modification (plus récent en premier)
    const dossiersTries = useMemo(() => {
        return [...dossiersFiltres].sort((a, b) => new Date(b.dateModification).getTime() - new Date(a.dateModification).getTime());
    }, [dossiersFiltres]);
    const getStatutBadge = (statut) => {
        switch (statut) {
            case StatutDossierMemoire.SOUTENU:
                return _jsx(Badge, { className: "bg-purple-100 text-purple-700 border-purple-200", children: "Soutenu" });
            case StatutDossierMemoire.VALIDE:
                return _jsx(Badge, { className: "bg-green-100 text-green-700 border-green-200", children: "Valid\u00E9" });
            case StatutDossierMemoire.DEPOSE:
                return _jsx(Badge, { className: "bg-blue-100 text-blue-700 border-blue-200", children: "D\u00E9pos\u00E9" });
            default:
                return _jsx(Badge, { children: statut });
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx(Input, { type: "text", placeholder: "Rechercher dans l'historique...", value: searchQuery, onChange: (e) => onSearchChange(e.target.value), className: "pl-10" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Total dossiers" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-primary", children: dossiers.length }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Dossiers soutenus" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-purple-600", children: dossiers.filter(d => d.statut === StatutDossierMemoire.SOUTENU).length }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Dossiers valid\u00E9s" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-green-600", children: dossiers.filter(d => d.statut === StatutDossierMemoire.VALIDE).length }) })] })] }), dossiersTries.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(History, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Aucun dossier dans l'historique" })] }) })) : (_jsx("div", { className: "grid grid-cols-1 gap-4", children: dossiersTries.map((dossier, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, children: _jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx(CardTitle, { className: "text-lg mb-2", children: dossier.titre }), _jsx(CardDescription, { className: "line-clamp-2", children: dossier.description })] }), getStatutBadge(dossier.statut)] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [dossier.candidats && dossier.candidats.length > 0 && (_jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Users, { className: "h-4 w-4" }), _jsx("span", { children: dossier.candidats.map(c => `${c.prenom} ${c.nom}`).join(', ') })] })), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsxs("span", { children: ["Cr\u00E9\u00E9 le ", format(dossier.dateCreation, 'dd/MM/yyyy', { locale: fr })] })] }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsxs("span", { children: ["Modifi\u00E9 le ", format(dossier.dateModification, 'dd/MM/yyyy', { locale: fr })] })] }), dossier.anneeAcademique && (_jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Award, { className: "h-4 w-4" }), _jsx("span", { children: dossier.anneeAcademique })] }))] }), dossier.documents && dossier.documents.length > 0 && (_jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(FileText, { className: "h-4 w-4" }), _jsxs("span", { children: [dossier.documents.length, " document(s)"] })] }))] }) })] }) }, dossier.idDossierMemoire))) }))] }));
};
export default HistoriqueTab;
