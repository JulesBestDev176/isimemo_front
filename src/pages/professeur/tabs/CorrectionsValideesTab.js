import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Search, CheckCircle, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
const ITEMS_PER_PAGE = 10;
const CorrectionsValideesTab = ({ corrections, searchQuery, onSearchChange }) => {
    const [selectedAnneeIndex, setSelectedAnneeIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    // Convertir la Map en tableau trié par année (plus récentes en premier)
    const anneesTriees = useMemo(() => {
        return Array.from(corrections.entries()).sort((a, b) => {
            const anneeA = a[0].split('-')[0];
            const anneeB = b[0].split('-')[0];
            return parseInt(anneeB) - parseInt(anneeA);
        });
    }, [corrections]);
    // Année actuellement affichée
    const anneeActuelle = anneesTriees[selectedAnneeIndex];
    // Filtrer les corrections de l'année actuelle
    const correctionsFiltrees = useMemo(() => {
        if (!anneeActuelle)
            return [];
        const [annee, correctionsAnnee] = anneeActuelle;
        if (!searchQuery.trim())
            return correctionsAnnee;
        const query = searchQuery.toLowerCase();
        return correctionsAnnee.filter(c => c.titre.toLowerCase().includes(query) ||
            c.dossierMemoireTitre.toLowerCase().includes(query) ||
            c.candidats.some(cand => `${cand.prenom} ${cand.nom}`.toLowerCase().includes(query)));
    }, [anneeActuelle, searchQuery]);
    // Pagination
    const totalPages = Math.ceil(correctionsFiltrees.length / ITEMS_PER_PAGE);
    const correctionsPagination = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return correctionsFiltrees.slice(start, end);
    }, [correctionsFiltrees, currentPage]);
    const handlePreviousAnnee = () => {
        if (selectedAnneeIndex > 0) {
            setSelectedAnneeIndex(selectedAnneeIndex - 1);
            setCurrentPage(1);
            onSearchChange('');
        }
    };
    const handleNextAnnee = () => {
        if (selectedAnneeIndex < anneesTriees.length - 1) {
            setSelectedAnneeIndex(selectedAnneeIndex + 1);
            setCurrentPage(1);
            onSearchChange('');
        }
    };
    if (anneesTriees.length === 0) {
        return (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(FileCheck, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Aucune correction trait\u00E9e trouv\u00E9e" })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { children: _jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(GraduationCap, { className: "h-6 w-6 text-green-600" }), _jsxs("div", { children: [_jsxs(CardTitle, { className: "text-xl", children: ["Ann\u00E9e acad\u00E9mique ", anneeActuelle === null || anneeActuelle === void 0 ? void 0 : anneeActuelle[0]] }), _jsxs(CardDescription, { children: [correctionsFiltrees.length, " correction(s) trait\u00E9e(s)"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: handlePreviousAnnee, disabled: selectedAnneeIndex === 0, children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsxs("span", { className: "text-sm text-gray-600 px-2", children: [selectedAnneeIndex + 1, " / ", anneesTriees.length] }), _jsx(Button, { variant: "outline", size: "sm", onClick: handleNextAnnee, disabled: selectedAnneeIndex === anneesTriees.length - 1, children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }) }) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx(Input, { type: "text", placeholder: "Rechercher une correction trait\u00E9e...", value: searchQuery, onChange: (e) => {
                            onSearchChange(e.target.value);
                            setCurrentPage(1);
                        }, className: "pl-10" })] }), correctionsFiltrees.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(FileCheck, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Aucune correction trait\u00E9e trouv\u00E9e" })] }) })) : (_jsxs(_Fragment, { children: [_jsx(Card, { children: _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Document" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Dossier de m\u00E9moire" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Candidat(s)" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date de validation" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: correctionsPagination.map((correction, index) => (_jsxs(motion.tr, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: index * 0.02 }, className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: correction.titre }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-600 max-w-md truncate", children: correction.dossierMemoireTitre }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-600", children: correction.candidats.map(c => `${c.prenom} ${c.nom}`).join(', ') }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-600", children: format(correction.dateValidation, 'dd/MM/yyyy', { locale: fr }) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs(Badge, { className: "bg-green-100 text-green-700 border-green-200", children: [_jsx(CheckCircle, { className: "h-3 w-3 mr-1" }), "Valid\u00E9"] }) })] }, correction.idDocument))) })] }) }) }) }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Page ", currentPage, " sur ", totalPages, " (", correctionsFiltrees.length, " r\u00E9sultat(s))"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(p => Math.max(1, p - 1)), disabled: currentPage === 1, children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(p => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }))] }))] }));
};
export default CorrectionsValideesTab;
