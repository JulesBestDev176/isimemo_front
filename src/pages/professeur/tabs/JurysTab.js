import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Calendar, Users, Clock, Search, Eye, Award } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
const JurysTab = ({ jurys, searchQuery, onSearchChange }) => {
    const [selectedJury, setSelectedJury] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const jurysFiltres = useMemo(() => {
        if (!searchQuery.trim())
            return jurys;
        const query = searchQuery.toLowerCase();
        return jurys.filter(j => j.dossiers.some(d => d.titre.toLowerCase().includes(query)) ||
            j.dossiers.some(d => d.candidats.some(c => `${c.prenom} ${c.nom}`.toLowerCase().includes(query))));
    }, [jurys, searchQuery]);
    const getRoleBadge = (role) => {
        switch (role) {
            case 'PRESIDENT':
                return _jsx(Badge, { className: "bg-purple-100 text-purple-700 border-purple-200", children: "Pr\u00E9sident" });
            case 'RAPPORTEUR':
                return _jsx(Badge, { className: "bg-blue-100 text-blue-700 border-blue-200", children: "Rapporteur" });
            case 'EXAMINATEUR':
                return _jsx(Badge, { className: "bg-green-100 text-green-700 border-green-200", children: "Examinateur" });
            case 'ENCADRANT':
                return _jsx(Badge, { className: "bg-orange-100 text-orange-700 border-orange-200", children: "Encadrant" });
            default:
                return _jsx(Badge, { children: role });
        }
    };
    const getStatutBadge = (statut) => {
        switch (statut) {
            case 'TERMINEE':
                return _jsx(Badge, { className: "bg-green-100 text-green-700 border-green-200", children: "Termin\u00E9e" });
            case 'EN_COURS':
                return _jsx(Badge, { className: "bg-blue-100 text-blue-700 border-blue-200", children: "En cours" });
            case 'PLANIFIEE':
                return _jsx(Badge, { className: "bg-yellow-100 text-yellow-700 border-yellow-200", children: "Planifi\u00E9e" });
            default:
                return _jsx(Badge, { children: statut });
        }
    };
    const handleViewJury = (jury) => {
        setSelectedJury(jury);
        setIsModalOpen(true);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx(Input, { type: "text", placeholder: "Rechercher un jury...", value: searchQuery, onChange: (e) => onSearchChange(e.target.value), className: "pl-10" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Total jurys" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-primary", children: jurys.length }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Soutenances termin\u00E9es" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-green-600", children: jurys.filter(j => j.statut === 'TERMINEE').length }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Soutenances planifi\u00E9es" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-yellow-600", children: jurys.filter(j => j.statut === 'PLANIFIEE').length }) })] })] }), jurysFiltres.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(Gavel, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Aucun jury trouv\u00E9" })] }) })) : (_jsx("div", { className: "grid grid-cols-1 gap-4", children: jurysFiltres.map((jury, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, children: _jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs(CardTitle, { className: "text-lg mb-2 flex items-center gap-2", children: [_jsx(Gavel, { className: "h-5 w-5 text-primary" }), "Soutenance #", jury.idSoutenance] }), _jsxs(CardDescription, { children: [jury.dossiers.length, " dossier(s) - ", jury.anneeAcademique] })] }), _jsxs("div", { className: "flex flex-col gap-2 items-end", children: [getRoleBadge(jury.role), getStatutBadge(jury.statut)] })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsx("span", { children: format(jury.dateSoutenance, 'dd/MM/yyyy', { locale: fr }) })] }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsxs("span", { children: [jury.heureDebut, " - ", jury.heureFin] })] }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Users, { className: "h-4 w-4" }), _jsxs("span", { children: [jury.dossiers.reduce((acc, d) => acc + d.candidats.length, 0), " candidat(s)"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Award, { className: "h-4 w-4" }), _jsx("span", { className: "capitalize", children: jury.role.toLowerCase() })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-2", children: "Dossiers" }), _jsx("div", { className: "space-y-2", children: jury.dossiers.map((dossier, idx) => (_jsxs("div", { className: "text-sm text-gray-600 bg-gray-50 p-2 rounded", children: [_jsx("p", { className: "font-medium", children: dossier.titre }), _jsx("p", { className: "text-xs text-gray-500", children: dossier.candidats.map(c => `${c.prenom} ${c.nom}`).join(', ') })] }, idx))) })] }), _jsx("div", { className: "flex justify-end", children: _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleViewJury(jury), children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "Voir les d\u00E9tails"] }) })] }) })] }) }, jury.idSoutenance))) })), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "max-w-3xl max-h-[80vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "D\u00E9tails de la soutenance" }), _jsx(DialogDescription, { children: "Informations compl\u00E8tes sur la soutenance et le jury" })] }), selectedJury && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Date" }), _jsx("p", { className: "text-gray-600", children: format(selectedJury.dateSoutenance, 'dd/MM/yyyy', { locale: fr }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Heure" }), _jsxs("p", { className: "text-gray-600", children: [selectedJury.heureDebut, " - ", selectedJury.heureFin] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Votre r\u00F4le" }), getRoleBadge(selectedJury.role)] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Statut" }), getStatutBadge(selectedJury.statut)] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Dossiers de m\u00E9moire" }), _jsx("div", { className: "space-y-3", children: selectedJury.dossiers.map((dossier, idx) => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-base", children: dossier.titre }) }), _jsx(CardContent, { children: _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-1", children: "Candidat(s)" }), _jsx("ul", { className: "list-disc list-inside text-sm text-gray-600", children: dossier.candidats.map((candidat, cIdx) => (_jsxs("li", { children: [candidat.prenom, " ", candidat.nom, " (", candidat.email, ")"] }, cIdx))) })] }) })] }, idx))) })] })] }))] }) })] }));
};
export default JurysTab;
