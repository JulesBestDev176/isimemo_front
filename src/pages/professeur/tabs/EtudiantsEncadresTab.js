import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Eye, Search, GraduationCap, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { StatutDossierMemoire } from '../../../models/dossier/DossierMemoire';
import { StatutEncadrement } from '../../../models/dossier/Encadrement';
import { getDocumentsByDossier } from '../../../models/dossier/Document';
import { getTicketsByDossier } from '../../../models/dossier/Ticket';
import { getProcessVerbalByDossier } from '../../../models/soutenance/ProcessVerbal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
const EtudiantsEncadresTab = ({ etudiants, searchQuery, onSearchChange }) => {
    const [selectedDossier, setSelectedDossier] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAnneeIndex, setSelectedAnneeIndex] = useState(0);
    // Trier les encadrements par année (plus récent en premier)
    const encadrementsTries = useMemo(() => {
        return [...etudiants].sort((a, b) => {
            const anneeA = a.anneeAcademique.split('-')[0];
            const anneeB = b.anneeAcademique.split('-')[0];
            return parseInt(anneeB) - parseInt(anneeA);
        });
    }, [etudiants]);
    // Encadrement actuellement affiché
    const encadrementActuel = encadrementsTries[selectedAnneeIndex];
    // Filtrer les étudiants de l'encadrement actuel
    const etudiantsFiltres = useMemo(() => {
        if (!encadrementActuel)
            return [];
        if (!searchQuery.trim())
            return encadrementActuel.etudiants;
        const query = searchQuery.toLowerCase();
        return encadrementActuel.etudiants.filter(et => `${et.candidat.prenom} ${et.candidat.nom}`.toLowerCase().includes(query) ||
            et.candidat.email.toLowerCase().includes(query) ||
            et.dossier.titre.toLowerCase().includes(query));
    }, [encadrementActuel, searchQuery]);
    const getStatutBadge = (statut) => {
        switch (statut) {
            case StatutDossierMemoire.EN_COURS:
                return _jsx(Badge, { className: "bg-blue-100 text-blue-700 border-blue-200", children: "En cours" });
            case StatutDossierMemoire.VALIDE:
                return _jsx(Badge, { className: "bg-green-100 text-green-700 border-green-200", children: "Valid\u00E9" });
            case StatutDossierMemoire.SOUTENU:
                return _jsx(Badge, { className: "bg-purple-100 text-purple-700 border-purple-200", children: "Soutenu" });
            case StatutDossierMemoire.EN_ATTENTE_VALIDATION:
                return _jsx(Badge, { className: "bg-yellow-100 text-yellow-700 border-yellow-200", children: "En attente" });
            default:
                return _jsx(Badge, { children: statut });
        }
    };
    const handleViewDossier = (dossier) => {
        setSelectedDossier(dossier);
        setIsModalOpen(true);
    };
    const handlePreviousAnnee = () => {
        if (selectedAnneeIndex > 0) {
            setSelectedAnneeIndex(selectedAnneeIndex - 1);
            onSearchChange(''); // Réinitialiser la recherche
        }
    };
    const handleNextAnnee = () => {
        if (selectedAnneeIndex < encadrementsTries.length - 1) {
            setSelectedAnneeIndex(selectedAnneeIndex + 1);
            onSearchChange(''); // Réinitialiser la recherche
        }
    };
    if (encadrementsTries.length === 0) {
        return (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(Users, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Aucun encadrement trouv\u00E9" })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(GraduationCap, { className: "h-6 w-6 text-primary" }), _jsxs("div", { children: [_jsxs(CardTitle, { className: "text-xl", children: ["Encadrement ", encadrementActuel === null || encadrementActuel === void 0 ? void 0 : encadrementActuel.anneeAcademique] }), _jsxs(CardDescription, { children: [(encadrementActuel === null || encadrementActuel === void 0 ? void 0 : encadrementActuel.etudiants.length) || 0, " \u00E9tudiant(s)"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: handlePreviousAnnee, disabled: selectedAnneeIndex === 0, children: [_jsx(ChevronLeft, { className: "h-4 w-4" }), "Ann\u00E9e pr\u00E9c\u00E9dente"] }), _jsxs("span", { className: "text-sm text-gray-600 px-2", children: [selectedAnneeIndex + 1, " / ", encadrementsTries.length] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: handleNextAnnee, disabled: selectedAnneeIndex === encadrementsTries.length - 1, children: ["Ann\u00E9e suivante", _jsx(ChevronRight, { className: "h-4 w-4" })] })] })] }) }), encadrementActuel && (_jsx(CardContent, { children: _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsxs("span", { children: [format(encadrementActuel.encadrement.dateDebut, 'dd/MM/yyyy', { locale: fr }), encadrementActuel.encadrement.dateFin &&
                                                    ` - ${format(encadrementActuel.encadrement.dateFin, 'dd/MM/yyyy', { locale: fr })}`] })] }), encadrementActuel.encadrement.statut === StatutEncadrement.ACTIF ? (_jsx(Badge, { className: "bg-green-100 text-green-700 border-green-200", children: "Actif" })) : (_jsx(Badge, { className: "bg-gray-100 text-gray-700 border-gray-200", children: "Termin\u00E9" }))] }) }))] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx(Input, { type: "text", placeholder: "Rechercher un \u00E9tudiant ou un dossier...", value: searchQuery, onChange: (e) => onSearchChange(e.target.value), className: "pl-10" })] }), etudiantsFiltres.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(Users, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Aucun \u00E9tudiant trouv\u00E9" })] }) })) : (_jsx(Card, { children: _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200 bg-gray-50", children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tudiant" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Email" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Dossier de m\u00E9moire" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Documents" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: etudiantsFiltres.map((item, index) => {
                                        var _a;
                                        return (_jsxs(motion.tr, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: index * 0.02 }, className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center", children: _jsx(Users, { className: "h-5 w-5 text-primary" }) }), _jsx("div", { className: "ml-4", children: _jsxs("div", { className: "text-sm font-medium text-gray-900", children: [item.candidat.prenom, " ", item.candidat.nom] }) })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-600", children: item.candidat.email }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-900 max-w-md truncate", children: item.dossier.titre }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: getStatutBadge(item.dossier.statut) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "text-sm text-gray-600", children: [((_a = item.dossier.documents) === null || _a === void 0 ? void 0 : _a.length) || 0, " document(s)"] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleViewDossier(item.dossier), children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "Consulter"] }) })] }, `${item.candidat.idCandidat}-${item.dossier.idDossierMemoire}`));
                                    }) })] }) }) }) })), _jsx(Dialog, { open: isModalOpen, onOpenChange: setIsModalOpen, children: _jsxs(DialogContent, { className: "max-w-5xl max-h-[90vh] overflow-y-auto", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-2xl", children: "D\u00E9tails du dossier" }), _jsx(DialogDescription, { children: "Consultation compl\u00E8te du dossier de m\u00E9moire" })] }), selectedDossier && (_jsx(DossierDetailModal, { dossier: selectedDossier }))] }) })] }));
};
// Composant pour la consultation complète du dossier
const DossierDetailModal = ({ dossier }) => {
    const [activeTab, setActiveTab] = useState('informations');
    const documents = useMemo(() => getDocumentsByDossier(dossier.idDossierMemoire), [dossier.idDossierMemoire]);
    const tickets = useMemo(() => getTicketsByDossier(dossier.idDossierMemoire), [dossier.idDossierMemoire]);
    const processVerbal = useMemo(() => getProcessVerbalByDossier(dossier.idDossierMemoire), [dossier.idDossierMemoire]);
    // Vérifier si le dossier a été soutenu
    const estSoutenu = dossier.statut === StatutDossierMemoire.SOUTENU;
    return (_jsx("div", { className: "mt-4", children: _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsx(TabsTrigger, { value: "informations", children: "Informations" }), _jsx(TabsTrigger, { value: "documents", children: "Documents" }), _jsx(TabsTrigger, { value: "suivi", children: "Suivi" }), estSoutenu && _jsx(TabsTrigger, { value: "process-verbal", children: "Proc\u00E8s-verbal" })] }), _jsx(TabsContent, { value: "informations", className: "mt-4", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Titre" }), _jsx("p", { className: "text-gray-600", children: dossier.titre })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Description" }), _jsx("p", { className: "text-gray-600", children: dossier.description })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Statut" }), _jsx(Badge, { className: "bg-blue-100 text-blue-700", children: dossier.statut })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Date de cr\u00E9ation" }), _jsx("p", { className: "text-gray-600", children: format(dossier.dateCreation, 'dd/MM/yyyy', { locale: fr }) })] })] }), dossier.candidats && dossier.candidats.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Candidat(s)" }), _jsx("ul", { className: "list-disc list-inside text-gray-600", children: dossier.candidats.map(c => (_jsxs("li", { children: [c.prenom, " ", c.nom, " (", c.email, ")"] }, c.idCandidat))) })] }))] }) }), _jsx(TabsContent, { value: "documents", className: "mt-4", children: _jsx("div", { className: "space-y-3", children: documents.length === 0 ? (_jsx("p", { className: "text-gray-600 text-center py-8", children: "Aucun document" })) : (documents.map(doc => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { className: "text-base", children: doc.titre }), _jsx(Badge, { children: doc.typeDocument })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-600", children: [_jsxs("p", { children: ["Cr\u00E9\u00E9 le ", format(doc.dateCreation, 'dd/MM/yyyy', { locale: fr })] }), _jsxs("p", { children: ["Statut: ", doc.statut] })] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "T\u00E9l\u00E9charger"] })] }) })] }, doc.idDocument)))) }) }), _jsx(TabsContent, { value: "suivi", className: "mt-4", children: _jsx("div", { className: "space-y-3", children: tickets.length === 0 ? (_jsx("p", { className: "text-gray-600 text-center py-8", children: "Aucun ticket de suivi" })) : (tickets.map(ticket => (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { className: "text-base", children: ticket.titre }), _jsx(Badge, { children: ticket.phase })] }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: ticket.description }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-gray-500", children: [_jsxs("span", { children: ["Priorit\u00E9: ", ticket.priorite] }), _jsxs("span", { children: ["Progression: ", ticket.progression, "%"] })] })] })] }, ticket.idTicket)))) }) }), estSoutenu && (_jsx(TabsContent, { value: "process-verbal", className: "mt-4", children: processVerbal ? (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Proc\u00E8s-verbal de soutenance" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Note finale" }), _jsxs("p", { className: "text-2xl font-bold text-primary", children: [processVerbal.noteFinale, "/20"] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Mention" }), _jsx(Badge, { children: processVerbal.mention })] }), processVerbal.observations && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Observations" }), _jsx("p", { className: "text-gray-600", children: processVerbal.observations })] })), processVerbal.appreciations && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Appr\u00E9ciations" }), _jsx("p", { className: "text-gray-600", children: processVerbal.appreciations })] })), processVerbal.demandesModifications && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: "Demandes de modifications" }), _jsx("p", { className: "text-gray-600 whitespace-pre-line", children: processVerbal.demandesModifications })] }))] })] })) : (_jsx("p", { className: "text-gray-600 text-center py-8", children: "Aucun proc\u00E8s-verbal disponible" })) }))] }) }));
};
export default EtudiantsEncadresTab;
