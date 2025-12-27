import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileCheck } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { mockSujets } from '../../models/pipeline/SujetMemoire';
import { mockDocuments, StatutDocument, TypeDocument } from '../../models/dossier/Document';
export const getDashboardCommissionCards = (delay = 0, navigate) => {
    let currentDelay = delay;
    // Compter les sujets en attente
    const sujetsEnAttente = mockSujets.filter(s => s.statut === 'soumis' && !s.dateApprobation).length;
    // Compter les documents en attente de validation
    const documentsEnAttente = mockDocuments.filter(d => d.statut === StatutDocument.EN_ATTENTE_VALIDATION &&
        d.typeDocument === TypeDocument.CHAPITRE).length;
    const cards = [];
    // Sujets en attente de validation
    if (sujetsEnAttente > 0) {
        cards.push(_jsx(DashboardCard, { title: "Sujets \u00E0 valider", value: sujetsEnAttente.toString(), icon: _jsx(BookOpen, { className: "h-6 w-6" }), iconColor: "bg-amber-100 text-amber-600", trend: { value: "En attente", up: false }, delay: currentDelay, onClick: () => navigate('/commission/sujets') }, "sujets-en-attente"));
        currentDelay += 0.1;
    }
    // Documents corrigés en attente
    if (documentsEnAttente > 0) {
        cards.push(_jsx(DashboardCard, { title: "Documents \u00E0 valider", value: documentsEnAttente.toString(), icon: _jsx(FileCheck, { className: "h-6 w-6" }), iconColor: "bg-indigo-100 text-indigo-600", trend: { value: "Corrections", up: false }, delay: currentDelay, onClick: () => navigate('/commission/documents') }, "documents-en-attente"));
        currentDelay += 0.1;
    }
    return cards;
};
export const DashboardCommission = ({ delay = 0 }) => {
    const navigate = useNavigate();
    const cards = getDashboardCommissionCards(delay, navigate);
    return _jsx(_Fragment, { children: cards });
};
