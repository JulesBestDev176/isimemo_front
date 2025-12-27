import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Users, CheckCircle, Clock, Search } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
const SujetsProposesTab = ({ sujets, searchQuery, onSearchChange }) => {
    const sujetsFiltres = useMemo(() => {
        if (!searchQuery.trim())
            return sujets;
        const query = searchQuery.toLowerCase();
        return sujets.filter(s => s.titre.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query) ||
            s.anneeAcademique.toLowerCase().includes(query));
    }, [sujets, searchQuery]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx(Input, { type: "text", placeholder: "Rechercher un sujet...", value: searchQuery, onChange: (e) => onSearchChange(e.target.value), className: "pl-10" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: "Total sujets propos\u00E9s" }) }), _jsx(CardContent, { children: _jsx("div", { className: "text-2xl font-bold text-primary", children: sujets.length }) })] }), sujetsFiltres.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(BookOpen, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Aucun sujet propos\u00E9 trouv\u00E9" })] }) })) : (_jsx("div", { className: "grid grid-cols-1 gap-4", children: sujetsFiltres.map((sujet, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, children: _jsxs(Card, { className: "hover:shadow-md transition-shadow", children: [_jsx(CardHeader, { children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsx(CardTitle, { className: "text-lg mb-2", children: sujet.titre }), _jsx(CardDescription, { className: "line-clamp-2", children: sujet.description })] }) }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Users, { className: "h-4 w-4" }), _jsxs("span", { children: [sujet.nombreEtudiantsActuels, "/", sujet.nombreMaxEtudiants, " \u00E9tudiants"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsx("span", { children: sujet.anneeAcademique })] }), sujet.dateSoumission && (_jsxs("div", { className: "flex items-center gap-2 text-gray-600", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsxs("span", { children: ["Soumis le ", format(new Date(sujet.dateSoumission), 'dd/MM/yyyy', { locale: fr })] })] })), sujet.dateApprobation && (_jsxs("div", { className: "flex items-center gap-2 text-green-600", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), _jsxs("span", { children: ["Valid\u00E9 le ", format(new Date(sujet.dateApprobation), 'dd/MM/yyyy', { locale: fr })] })] }))] }) })] }) }, sujet.id))) }))] }));
};
export default SujetsProposesTab;
