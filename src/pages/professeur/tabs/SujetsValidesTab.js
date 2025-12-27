import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Search, Link as LinkIcon, GraduationCap, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { getDossierById } from '../../../models/dossier/DossierMemoire';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
const ITEMS_PER_PAGE = 10;
const SujetsValidesTab = ({ sujets, searchQuery, onSearchChange }) => {
    const [selectedAnneeIndex, setSelectedAnneeIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDossierId, setSelectedDossierId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Convertir la Map en tableau trié par année (plus récentes en premier)
    const anneesTriees = useMemo(() => {
        return Array.from(sujets.entries()).sort((a, b) => {
            const anneeA = a[0].split('-')[0];
            const anneeB = b[0].split('-')[0];
            return parseInt(anneeB) - parseInt(anneeA);
        });
    }, [sujets]);
    // Année actuellement affichée
    const anneeActuelle = anneesTriees[selectedAnneeIndex];
    // Filtrer les sujets de l'année actuelle
    const sujetsFiltres = useMemo(() => {
        if (!anneeActuelle)
            return [];
        const [annee, sujetsAnnee] = anneeActuelle;
        if (!searchQuery.trim())
            return sujetsAnnee;
        const query = searchQuery.toLowerCase();
        return sujetsAnnee.filter(s => s.titre.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query) ||
            (s.dossierMemoireTitre && s.dossierMemoireTitre.toLowerCase().includes(query)));
    }, [anneeActuelle, searchQuery]);
    // Pagination
    const totalPages = Math.ceil(sujetsFiltres.length / ITEMS_PER_PAGE);
    const sujetsPagination = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return sujetsFiltres.slice(start, end);
    }, [sujetsFiltres, currentPage]);
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
    const handleViewDossier = (dossierId) => {
        setSelectedDossierId(dossierId);
        setIsModalOpen(true);
    };
    const selectedDossier = useMemo(() => {
        if (!selectedDossierId)
            return null;
        return getDossierById(selectedDossierId);
    }, [selectedDossierId]);
    if (anneesTriees.length === 0) {
        return (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(CheckCircle, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Aucun sujet trait\u00E9 trouv\u00E9" })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { children: _jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(GraduationCap, { className: "h-6 w-6 text-green-600" }), _jsxs("div", { children: [_jsxs(CardTitle, { className: "text-xl", children: ["Ann\u00E9e acad\u00E9mique ", anneeActuelle === null || anneeActuelle === void 0 ? void 0 : anneeActuelle[0]] }), _jsxs(CardDescription, { children: [sujetsFiltres.length, " sujet(s) trait\u00E9(s)"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: handlePreviousAnnee, disabled: selectedAnneeIndex === 0, children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsxs("span", { className: "text-sm text-gray-600 px-2", children: [selectedAnneeIndex + 1, " / ", anneesTriees.length] }), _jsx(Button, { variant: "outline", size: "sm", onClick: handleNextAnnee, disabled: selectedAnneeIndex === anneesTriees.length - 1, children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }) }) }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx(Input, { type: "text", placeholder: "Rechercher un sujet trait\u00E9...", value: searchQuery, onChange: (e) => {
                            onSearchChange(e.target.value);
                            setCurrentPage(1);
                        }, className: "pl-10" })] }), sujetsFiltres.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(CheckCircle, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Aucun sujet trouv\u00E9" })] }) })) : (_jsxs(_Fragment, { children: [_jsx(Card, { children: _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Titre" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Description" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date de validation" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Dossier associ\u00E9" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: sujetsPagination.map((sujet, index) => (_jsxs(motion.tr, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: index * 0.02 }, className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: sujet.titre }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-600 max-w-md truncate", children: sujet.description }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-600", children: format(new Date(sujet.dateValidation), 'dd/MM/yyyy', { locale: fr }) }) }), _jsx("td", { className: "px-6 py-4", children: sujet.dossierMemoireTitre ? (_jsxs("div", { className: "flex items-center gap-2 text-sm text-primary", children: [_jsx(LinkIcon, { className: "h-4 w-4" }), _jsx("span", { className: "truncate max-w-xs", children: sujet.dossierMemoireTitre })] })) : (_jsx("span", { className: "text-sm text-gray-400", children: "-" })) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs(Badge, { className: "bg-green-100 text-green-700 border-green-200", children: [_jsx(CheckCircle, { className: "h-3 w-3 mr-1" }), "Trait\u00E9"] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: sujet.dossierMemoireId && (_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleViewDossier(sujet.dossierMemoireId), children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "Voir dossier"] })) })] }, sujet.id))) })] }) }) }) }), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Page ", currentPage, " sur ", totalPages, " (", sujetsFiltres.length, " r\u00E9sultat(s))"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(p => Math.max(1, p - 1)), disabled: currentPage === 1, children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(p => Math.min(totalPages, p + 1)), disabled: currentPage === totalPages, children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] })] }))] })), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[80vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-2xl", children: "Dossier associ\u00E9" }), _jsx(DialogDescription, { children: "D\u00E9tails du dossier de m\u00E9moire associ\u00E9 au sujet" })] }), selectedDossier && (_jsxs("div", { className: "space-y-4 mt-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Titre" }), _jsx("p", { className: "text-gray-600", children: selectedDossier.titre })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Description" }), _jsx("p", { className: "text-gray-600", children: selectedDossier.description })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Statut" }), _jsx(Badge, { className: "bg-blue-100 text-blue-700", children: selectedDossier.statut })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Date de cr\u00E9ation" }), _jsx("p", { className: "text-gray-600", children: format(selectedDossier.dateCreation, 'dd/MM/yyyy', { locale: fr }) })] })] }), selectedDossier.candidats && selectedDossier.candidats.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Candidat(s)" }), _jsx("ul", { className: "list-disc list-inside text-gray-600", children: selectedDossier.candidats.map(c => (_jsxs("li", { children: [c.prenom, " ", c.nom, " (", c.email, ")"] }, c.idCandidat))) })] })), selectedDossier.documents && selectedDossier.documents.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Documents" }), _jsxs("p", { className: "text-gray-600", children: [selectedDossier.documents.length, " document(s)"] })] }))] }))] }) })] }));
};
export default SujetsValidesTab;
