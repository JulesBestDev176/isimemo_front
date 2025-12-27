import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Info, Folder, ArrowLeft, CheckCircle, Scale } from 'lucide-react';
import { StatutDossierMemoire, EtapeDossier } from '../../../models/dossier';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import DossierInformations from './DossierInformations';
import DossierDocuments from './DossierDocuments';
import ProcessusPipeline from './ProcessusPipeline';
import DossierProcessVerbal from './DossierProcessVerbal';
import { mockProcessVerbaux } from '../../../models/soutenance/ProcessVerbal';
const TabButton = ({ children, isActive, onClick, icon, count }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-primary text-primary bg-white'
            : 'border-transparent text-gray-500 hover:text-primary bg-gray-50'}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children, count !== undefined && (_jsx("span", { className: `ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-gray-200 text-gray-600'}`, children: count }))] }));
};
const getStatutLabel = (statut) => {
    const statuts = {
        [StatutDossierMemoire.EN_CREATION]: 'En création',
        [StatutDossierMemoire.EN_COURS]: 'En cours',
        [StatutDossierMemoire.EN_ATTENTE_VALIDATION]: 'En attente',
        [StatutDossierMemoire.VALIDE]: 'Validé',
        [StatutDossierMemoire.DEPOSE]: 'Déposé',
        [StatutDossierMemoire.SOUTENU]: 'Soutenu'
    };
    return statuts[statut] || statut;
};
const getStatutBadgeVariant = (statut) => {
    switch (statut) {
        case StatutDossierMemoire.EN_COURS:
            return 'default';
        case StatutDossierMemoire.VALIDE:
        case StatutDossierMemoire.SOUTENU:
            return 'default';
        case StatutDossierMemoire.EN_ATTENTE_VALIDATION:
            return 'secondary';
        case StatutDossierMemoire.DEPOSE:
            return 'outline';
        default:
            return 'outline';
    }
};
const getEtapeLabel = (etape) => {
    const etapes = {
        [EtapeDossier.CHOIX_SUJET]: 'Choix du sujet',
        [EtapeDossier.CHOIX_BINOME]: 'Choix du binôme',
        [EtapeDossier.CHOIX_ENCADRANT]: 'Choix de l\'encadrant',
        [EtapeDossier.VALIDATION_SUJET]: 'Validation du sujet',
        [EtapeDossier.VALIDATION_COMMISSION]: 'Validation commission',
        [EtapeDossier.REDACTION]: 'Rédaction en cours',
        [EtapeDossier.PRELECTURE]: 'Prélecture',
        [EtapeDossier.DEPOT_INTERMEDIAIRE]: 'Dépôt intermédiaire',
        [EtapeDossier.DEPOT_FINAL]: 'Dépôt final',
        [EtapeDossier.SOUTENANCE]: 'Soutenance',
        [EtapeDossier.CORRECTION]: 'Correction',
        [EtapeDossier.TERMINE]: 'Terminé'
    };
    return etapes[etape] || etape;
};
const DossierDetail = ({ dossier, documents, onBack, estSuiveur = false }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('informations');
    // ... (rest of the state)
    // État pour afficher la description complète
    const [showFullDescription, setShowFullDescription] = useState(false);
    // Vérifier si le dossier est en cours (pour afficher l'onglet processus)
    const isDossierEnCours = useMemo(() => {
        return dossier.statut === StatutDossierMemoire.EN_COURS ||
            dossier.statut === StatutDossierMemoire.EN_CREATION;
    }, [dossier.statut]);
    // Vérifier si le dossier est terminé (pour afficher l'onglet procès-verbal)
    const isDossierTermine = useMemo(() => {
        return dossier.statut === StatutDossierMemoire.SOUTENU ||
            dossier.statut === StatutDossierMemoire.DEPOSE ||
            dossier.etape === EtapeDossier.TERMINE;
    }, [dossier.statut, dossier.etape]);
    // Récupérer le procès-verbal du dossier
    const processVerbal = useMemo(() => {
        return mockProcessVerbaux.find(pv => { var _a, _b; return ((_b = (_a = pv.soutenance) === null || _a === void 0 ? void 0 : _a.dossierMemoire) === null || _b === void 0 ? void 0 : _b.idDossierMemoire) === dossier.id; });
    }, [dossier.id]);
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs(Button, { variant: "ghost", onClick: onBack, className: "mb-4", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Retour \u00E0 la liste"] }), _jsx(Card, { className: "mb-6", children: _jsx(CardHeader, { children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex items-start flex-1", children: [_jsx("div", { className: "bg-primary-100 rounded-lg p-3 mr-4", children: _jsx(FileText, { className: "h-6 w-6 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsx(CardTitle, { className: "text-2xl mb-2", children: dossier.titre }), _jsxs("div", { children: [_jsx(CardDescription, { className: `mb-3 ${!showFullDescription ? 'line-clamp-2' : ''}`, children: dossier.description }), dossier.description && dossier.description.length > 100 && (_jsx("button", { onClick: () => setShowFullDescription(!showFullDescription), className: "text-xs text-primary hover:underline", children: showFullDescription ? 'Voir moins' : 'Voir plus' }))] }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Badge, { variant: getStatutBadgeVariant(dossier.statut), children: getStatutLabel(dossier.statut) }), _jsx(Badge, { variant: "outline", children: getEtapeLabel(dossier.etape) }), dossier.anneeAcademique && (_jsxs("span", { className: "text-xs text-gray-500", children: ["Ann\u00E9e: ", dossier.anneeAcademique] }))] })] })] }) }) }) }), _jsxs(Card, { children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("div", { className: "flex", children: [_jsx(TabButton, { isActive: activeTab === 'informations', onClick: () => setActiveTab('informations'), icon: _jsx(Info, { className: "h-4 w-4" }), children: "Informations" }), _jsx(TabButton, { isActive: activeTab === 'documents', onClick: () => setActiveTab('documents'), icon: _jsx(Folder, { className: "h-4 w-4" }), count: 3, children: "Documents" }), isDossierEnCours && (_jsx(TabButton, { isActive: activeTab === 'processus', onClick: () => setActiveTab('processus'), icon: _jsx(CheckCircle, { className: "h-4 w-4" }), children: "Processus" })), isDossierTermine && processVerbal && (_jsx(TabButton, { isActive: activeTab === 'processverbal', onClick: () => setActiveTab('processverbal'), icon: _jsx(Scale, { className: "h-4 w-4" }), children: "Proc\u00E8s-verbal" }))] }) }), _jsx(CardContent, { className: "p-6", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'informations' && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: _jsx(DossierInformations, { dossier: dossier }) }, "informations")), activeTab === 'documents' && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: _jsx(DossierDocuments, { documents: documents, dossier: dossier, userEmail: user === null || user === void 0 ? void 0 : user.email }) }, "documents")), activeTab === 'processus' && isDossierEnCours && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: _jsx(ProcessusPipeline, { dossier: dossier, estSuiveur: estSuiveur }) }, "processus")), activeTab === 'processverbal' && isDossierTermine && processVerbal && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: _jsx(DossierProcessVerbal, { processVerbal: processVerbal }) }, "processverbal"))] }) })] })] }) }));
};
export default DossierDetail;
