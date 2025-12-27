import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, CheckCircle, Gavel, FileCheck, History, BarChart3 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { getSujetsProposesByProfesseur, getSujetsValidesByProfesseur, getEtudiantsEncadresByProfesseur, getJurysByProfesseur, getCorrectionsValideesByProfesseur, getStatistiquesEncadrement, getHistoriqueDossiersByProfesseur } from '../../models/services/ProfesseurEspace.service';
import SujetsProposesTab from './tabs/SujetsProposesTab';
import EtudiantsEncadresTab from './tabs/EtudiantsEncadresTab';
import SujetsValidesTab from './tabs/SujetsValidesTab';
import JurysTab from './tabs/JurysTab';
import CorrectionsValideesTab from './tabs/CorrectionsValideesTab';
import HistoriqueTab from './tabs/HistoriqueTab';
import StatistiquesTab from './tabs/StatistiquesTab';
const EspaceProfesseur = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('sujets-proposes');
    const [searchQuery, setSearchQuery] = useState('');
    // Vérifier que l'utilisateur est un professeur
    if (!user || user.type !== 'professeur') {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Acc\u00E8s restreint" }), _jsx("p", { className: "text-gray-600", children: "Cette page est r\u00E9serv\u00E9e aux professeurs." })] }) }));
    }
    const professeurId = user.id || 1; // Utiliser l'ID du professeur connecté
    const estCommission = user.estCommission || false;
    // Récupérer les données
    const sujetsProposes = useMemo(() => getSujetsProposesByProfesseur(professeurId), [professeurId]);
    const sujetsValides = useMemo(() => getSujetsValidesByProfesseur(professeurId), [professeurId]);
    const etudiantsEncadres = useMemo(() => getEtudiantsEncadresByProfesseur(professeurId), [professeurId]);
    const jurys = useMemo(() => getJurysByProfesseur(professeurId), [professeurId]);
    const correctionsValidees = useMemo(() => getCorrectionsValideesByProfesseur(professeurId, estCommission), [professeurId, estCommission]);
    const statistiques = useMemo(() => getStatistiquesEncadrement(professeurId), [professeurId]);
    const historiqueDossiers = useMemo(() => getHistoriqueDossiersByProfesseur(professeurId), [professeurId]);
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-2", children: "Espace Professeur" }), _jsx("p", { className: "text-gray-600", children: "Consultez vos sujets propos\u00E9s, \u00E9tudiants encadr\u00E9s, jurys et statistiques" })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-7 mb-6", children: [_jsxs(TabsTrigger, { value: "sujets-proposes", className: "flex items-center gap-2", children: [_jsx(BookOpen, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Sujets propos\u00E9s" })] }), _jsxs(TabsTrigger, { value: "etudiants-encadres", className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "\u00C9tudiants encadr\u00E9s" })] }), _jsxs(TabsTrigger, { value: "sujets-valides", className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Sujets valid\u00E9s" })] }), _jsxs(TabsTrigger, { value: "jurys", className: "flex items-center gap-2", children: [_jsx(Gavel, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Jurys" })] }), estCommission && (_jsxs(TabsTrigger, { value: "corrections-validees", className: "flex items-center gap-2", children: [_jsx(FileCheck, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Corrections valid\u00E9es" })] })), _jsxs(TabsTrigger, { value: "historique", className: "flex items-center gap-2", children: [_jsx(History, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Historique" })] }), _jsxs(TabsTrigger, { value: "statistiques", className: "flex items-center gap-2", children: [_jsx(BarChart3, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Statistiques" })] })] }), _jsx(TabsContent, { value: "sujets-proposes", className: "mt-6", children: _jsx(SujetsProposesTab, { sujets: sujetsProposes, searchQuery: searchQuery, onSearchChange: setSearchQuery }) }), _jsx(TabsContent, { value: "etudiants-encadres", className: "mt-6", children: _jsx(EtudiantsEncadresTab, { etudiants: etudiantsEncadres, searchQuery: searchQuery, onSearchChange: setSearchQuery }) }), _jsx(TabsContent, { value: "sujets-valides", className: "mt-6", children: _jsx(SujetsValidesTab, { sujets: sujetsValides, searchQuery: searchQuery, onSearchChange: setSearchQuery }) }), _jsx(TabsContent, { value: "jurys", className: "mt-6", children: _jsx(JurysTab, { jurys: jurys, searchQuery: searchQuery, onSearchChange: setSearchQuery }) }), estCommission && (_jsx(TabsContent, { value: "corrections-validees", className: "mt-6", children: _jsx(CorrectionsValideesTab, { corrections: correctionsValidees, searchQuery: searchQuery, onSearchChange: setSearchQuery }) })), _jsx(TabsContent, { value: "historique", className: "mt-6", children: _jsx(HistoriqueTab, { dossiers: historiqueDossiers, searchQuery: searchQuery, onSearchChange: setSearchQuery }) }), _jsx(TabsContent, { value: "statistiques", className: "mt-6", children: _jsx(StatistiquesTab, { statistiques: statistiques }) })] })] }) }));
};
export default EspaceProfesseur;
