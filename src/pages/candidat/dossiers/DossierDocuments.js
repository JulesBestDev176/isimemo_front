var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { FileText, Download, Eye, FileCheck, FileX, FileClock, X, Clock, Scale, Folder } from 'lucide-react';
import { generateFicheDepotPDF, generateNotesSuiviPDF } from '../../../services/pdf.service';
import { dossierService } from '../../../services/dossier.service';
import { StatutDocument, TypeDocument } from '../../../models/dossier';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
const formatDateTime = (date) => {
    if (!date)
        return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    // Vérifier si la date est valide
    if (isNaN(dateObj.getTime()))
        return 'Date invalide';
    return dateObj.toLocaleDateString('fr-FR', {
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
            return 'default';
        case StatutDocument.EN_ATTENTE_VALIDATION:
            return 'secondary';
        case StatutDocument.REJETE:
            return 'destructive';
        case StatutDocument.DEPOSE:
            return 'outline';
        default:
            return 'outline';
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
const getDocumentTypeLabel = (type) => {
    const types = {
        [TypeDocument.CHAPITRE]: 'Chapitre',
        [TypeDocument.ANNEXE]: 'Annexe',
        [TypeDocument.FICHE_SUIVI]: 'Fiche de suivi',
        [TypeDocument.DOCUMENT_ADMINISTRATIF]: 'Document administratif',
        [TypeDocument.PRESENTATION]: 'Présentation',
        [TypeDocument.LIVRABLE]: 'Livrable',
        [TypeDocument.AUTRE]: 'Autre'
    };
    return types[type] || type;
};
const getDocumentIcon = (statut) => {
    switch (statut) {
        case StatutDocument.VALIDE:
            return _jsx(FileCheck, { className: "h-5 w-5 text-primary" });
        case StatutDocument.REJETE:
            return _jsx(FileX, { className: "h-5 w-5 text-red-600" });
        case StatutDocument.EN_ATTENTE_VALIDATION:
            return _jsx(FileClock, { className: "h-5 w-5 text-orange-600" });
        default:
            return _jsx(FileText, { className: "h-5 w-5 text-primary" });
    }
};
const DossierDocuments = ({ documents, dossier, userEmail }) => {
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [notes, setNotes] = useState([]);
    // 1. Charger les notes de suivi pour la génération PDF
    React.useEffect(() => {
        const fetchNotes = () => __awaiter(void 0, void 0, void 0, function* () {
            if (dossier === null || dossier === void 0 ? void 0 : dossier.id) {
                try {
                    const fetchedNotes = yield dossierService.getNotesSuiviByDossier(dossier.id);
                    setNotes(fetchedNotes);
                }
                catch (err) {
                    console.error('Erreur chargement notes pour PDF:', err);
                }
            }
        });
        fetchNotes();
    }, [dossier === null || dossier === void 0 ? void 0 : dossier.id]);
    const handleViewDocument = (doc) => {
        setSelectedDocument(doc);
    };
    const handleCloseView = () => {
        setSelectedDocument(null);
    };
    // 2. Filtrer pour ne garder que le DERNIER document de type LIVRABLE (ou type par défaut si pas de livrable)
    // On renomme ce document "Mémoire"
    const memoireDocument = React.useMemo(() => {
        // Filtrage strict : uniquement les Livrables ou Chapitres (considérés comme parties du mémoire)
        const livrables = documents.filter(d => d.typeDocument === TypeDocument.LIVRABLE || d.typeDocument === TypeDocument.CHAPITRE);
        if (livrables.length === 0)
            return null;
        // Trier par date décroissante
        const sorted = livrables.sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime());
        // Renvoyer le plus récent avec titre forcé
        return Object.assign(Object.assign({}, sorted[0]), { titre: 'Mémoire' // Surcharger le titre
         });
    }, [documents]);
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Scale, { className: "h-5 w-5 text-primary" }), " Documents Administratifs"] }), _jsx(Card, { className: "bg-primary/5 border-primary/20", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "bg-primary p-2 rounded-lg text-white", children: _jsx(FileCheck, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-gray-900", children: "Fiche de d\u00E9p\u00F4t du sujet de m\u00E9moire" }), _jsx("p", { className: "text-xs text-gray-600", children: "Document officiel g\u00E9n\u00E9r\u00E9 par l'administration ISI" })] })] }), _jsxs(Button, { onClick: () => {
                                                    if (dossier) {
                                                        generateFicheDepotPDF(dossier, userEmail);
                                                    }
                                                }, className: "gap-2", children: [_jsx(Download, { className: "h-4 w-4" }), "T\u00E9l\u00E9charger"] })] }) }) })] }), _jsx("hr", { className: "border-gray-100" }), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-bold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Folder, { className: "h-5 w-5 text-primary" }), " Documents de Travail"] }), _jsxs("div", { className: "space-y-4", children: [memoireDocument ? (_jsx(Card, { className: "hover:shadow-md transition-shadow border-l-4 border-l-primary", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start flex-1", children: [_jsx("div", { className: "bg-primary-100 p-2 rounded-lg mr-4", children: _jsx(FileText, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1 flex-wrap", children: [_jsx("p", { className: "font-bold text-gray-900 text-lg", children: memoireDocument.titre }), _jsx(Badge, { variant: getDocumentStatutBadge(memoireDocument.statut), children: getDocumentStatutLabel(memoireDocument.statut) })] }), _jsxs("p", { className: "text-sm text-gray-500 mb-2", children: ["Derni\u00E8re version d\u00E9pos\u00E9e le ", formatDateTime(memoireDocument.dateCreation)] }), memoireDocument.commentaire && (_jsxs("p", { className: "text-sm text-gray-600 italic", children: ["\"", memoireDocument.commentaire, "\""] }))] })] }), _jsxs("div", { className: "flex items-center gap-2 ml-4", children: [_jsx(Button, { variant: "ghost", size: "icon", title: "Voir", onClick: () => handleViewDocument(memoireDocument), children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", title: "T\u00E9l\u00E9charger", children: _jsx(Download, { className: "h-4 w-4" }) })] })] }) }) }, memoireDocument.idDocument || memoireDocument.id)) : (_jsx(Card, { className: "border-dashed", children: _jsx(CardContent, { className: "py-8 text-center text-gray-400", children: _jsx("p", { children: "Aucun document \"M\u00E9moire\" disponible pour le moment." }) }) })), _jsx(Card, { className: "hover:shadow-md transition-shadow bg-gray-50/50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "bg-orange-100 p-2 rounded-lg text-orange-600", children: _jsx(FileClock, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "font-bold text-gray-900", children: "Fiche de Suivi" }), _jsxs(Badge, { variant: "outline", className: "text-xs", children: [notes.length, " note(s)"] })] }), _jsx("p", { className: "text-xs text-gray-600", children: "Historique complet des \u00E9changes avec l'encadrant" })] })] }), _jsxs(Button, { variant: "outline", onClick: () => {
                                                            if (dossier && notes.length > 0) {
                                                                generateNotesSuiviPDF(dossier, notes);
                                                            }
                                                            else {
                                                                alert("Aucune note de suivi à exporter.");
                                                            }
                                                        }, className: "gap-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800", disabled: notes.length === 0, children: [_jsx(Download, { className: "h-4 w-4" }), "Exporter en PDF"] })] }) }) })] })] })] }), _jsx(AnimatePresence, { children: selectedDocument && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: handleCloseView, children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, onClick: (e) => e.stopPropagation(), className: "bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-gray-200", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-primary-100 p-3 rounded-lg mr-4", children: getDocumentIcon(selectedDocument.statut) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: selectedDocument.titre }), _jsxs("div", { className: "flex items-center gap-2 mt-1", children: [_jsx(Badge, { variant: getDocumentStatutBadge(selectedDocument.statut), children: getDocumentStatutLabel(selectedDocument.statut) }), _jsx(Badge, { variant: "outline", children: getDocumentTypeLabel(selectedDocument.typeDocument) })] })] })] }), _jsx("button", { onClick: handleCloseView, className: "p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-6", children: _jsxs("div", { className: "space-y-6", children: [selectedDocument.commentaire && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Commentaire" }), _jsx("p", { className: "text-gray-600 bg-gray-50 p-4 rounded-lg", children: selectedDocument.commentaire })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Clock, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Date de d\u00E9p\u00F4t" })] }), _jsx("p", { className: "text-gray-900", children: formatDateTime(selectedDocument.dateCreation) })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(FileText, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Type de document" })] }), _jsx("p", { className: "text-gray-900", children: getDocumentTypeLabel(selectedDocument.typeDocument) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Aper\u00E7u du document" }), _jsxs("div", { className: "border border-gray-200 rounded-lg p-8 bg-gray-50 text-center", children: [_jsx(FileText, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Le document est disponible en t\u00E9l\u00E9chargement." }), _jsx("div", { className: "flex justify-center gap-3", children: _jsxs(Button, { onClick: () => {
                                                                    // TODO: Implémenter le téléchargement
                                                                    window.open(selectedDocument.cheminFichier, '_blank');
                                                                }, className: "gap-2", children: [_jsx(Download, { className: "h-4 w-4" }), "T\u00E9l\u00E9charger le document"] }) })] })] })] }) }), _jsx("div", { className: "p-6 border-t border-gray-200 flex justify-end", children: _jsx(Button, { variant: "outline", onClick: handleCloseView, children: "Fermer" }) })] }) })) })] }));
};
export default DossierDocuments;
