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
import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, Calendar, CheckCircle, Clock, Download, Eye, Info, Folder, Ticket as TicketIcon, AlertCircle, RefreshCw, X, Plus, Trash2, Check, XCircle, FileText as FileTextIcon, Circle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { StatutDossierMemoire, EtapeDossier, PhaseTicket, StatutTicket, Priorite, StatutLivrable, getDocumentsByDossier, StatutDocument, TypeDocument, mockTickets, getNotesSuiviByDossier, addNoteSuivi } from '../../models';
import dossierService from '../../services/dossier.service';
import { getAnneeAcademiqueCourante, isAnneeAcademiqueTerminee } from '../../utils/anneeAcademique';
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
        [StatutDossierMemoire.EN_ATTENTE_VALIDATION]: 'En attente de validation',
        [StatutDossierMemoire.VALIDE]: 'Validé',
        [StatutDossierMemoire.DEPOSE]: 'Déposé',
        [StatutDossierMemoire.SOUTENU]: 'Soutenu'
    };
    return statuts[statut] || statut;
};
const getStatutBadgeColor = (statut) => {
    switch (statut) {
        case StatutDossierMemoire.EN_COURS:
            return 'bg-blue-50 text-blue-700 border-blue-200';
        case StatutDossierMemoire.EN_ATTENTE_VALIDATION:
            return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case StatutDossierMemoire.VALIDE:
            return 'bg-green-50 text-green-700 border-green-200';
        case StatutDossierMemoire.DEPOSE:
            return 'bg-purple-50 text-purple-700 border-purple-200';
        case StatutDossierMemoire.SOUTENU:
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200';
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
const getDocumentStatutLabel = (statut) => {
    const statuts = {
        [StatutDocument.BROUILLON]: 'Brouillon',
        [StatutDocument.DEPOSE]: 'Déposé',
        [StatutDocument.EN_ATTENTE_VALIDATION]: 'En attente de validation',
        [StatutDocument.VALIDE]: 'Validé',
        [StatutDocument.REJETE]: 'Rejeté',
        [StatutDocument.ARCHIVE]: 'Archivé'
    };
    return statuts[statut] || statut;
};
const DossierEtudiantDetail = () => {
    const { id, dossierId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('informations');
    const [ticketFilterTab, setTicketFilterTab] = useState('a-faire');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [showRejetModal, setShowRejetModal] = useState(false);
    const [rejetCommentaire, setRejetCommentaire] = useState('');
    const [rejetCorrections, setRejetCorrections] = useState(['']);
    const [nouvelleNote, setNouvelleNote] = useState('');
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [showConfirmPrelectureModal, setShowConfirmPrelectureModal] = useState(false);
    const [showConfirmSoutenanceModal, setShowConfirmSoutenanceModal] = useState(false);
    // State pour les données réelles
    const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Simulation de l'encadrement pour la compatibilité (à remplacer par un vrai appel API si nécessaire)
    const encadrement = useMemo(() => {
        if (!id)
            return null;
        return {
            idEncadrement: parseInt(id),
            anneeAcademique: getAnneeAcademiqueCourante()
        };
    }, [id]);
    // Chargement du dossier réel
    useEffect(() => {
        const fetchDossier = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!dossierId)
                return;
            setLoading(true);
            try {
                const realDossier = yield dossierService.getDossierById(parseInt(dossierId));
                console.log("Dossier chargé:", realDossier);
                setDossier(realDossier);
            }
            catch (err) {
                console.error("Erreur chargement dossier:", err);
                setError("Impossible de charger le dossier");
            }
            finally {
                setLoading(false);
            }
        });
        fetchDossier();
    }, [dossierId]);
    // Vérifier que l'utilisateur est un encadrant ET que l'année académique en cours n'est pas terminée
    // Exception : le chef de département garde toujours son rôle
    const anneeCourante = getAnneeAcademiqueCourante();
    const anneeTerminee = isAnneeAcademiqueTerminee(anneeCourante);
    const estChef = user === null || user === void 0 ? void 0 : user.estChef;
    const hasRoleEncadrantActif = (user === null || user === void 0 ? void 0 : user.estEncadrant) && (!anneeTerminee || estChef);
    if (!hasRoleEncadrantActif) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acc\u00E8s non autoris\u00E9" }), _jsx("p", { className: "text-gray-600", children: anneeTerminee
                            ? 'L\'année académique est terminée. Vous n\'avez plus accès aux dossiers étudiants pour cette session.'
                            : 'Vous devez être un encadrant pour accéder à cette page.' })] }) }));
    }
    if (loading) {
        return _jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Chargement..." });
    }
    if (error || !dossier) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Dossier introuvable" }), _jsx("p", { className: "text-gray-600 mb-4", children: error || "Le dossier demandé n'existe pas." }), _jsx(Button, { onClick: () => navigate('/professeur/encadrements'), children: "Retour aux encadrements" })] }) }));
    }
    // Récupérer le candidat (premier candidat du dossier)
    // Dans le vrai dossier, 'candidats' est un tableau d'objets ou d'IDs, adapter si nécessaire
    // L'API server.js renvoie 'candidats' comme un tableau d'objets complets
    const candidat = dossier.candidats && dossier.candidats.length > 0
        ? dossier.candidats[0]
        : null;
    // Récupérer les documents du dossier
    // Adapter si 'getDocumentsByDossier' attend un ID spécifique
    // TODO: Utiliser un vrai service pour les documents aussi ?
    const documents = getDocumentsByDossier(dossier.idDossierMemoire || dossier.id);
    // Récupérer les notes de suivi pour ce dossier
    const notesSuivi = getNotesSuiviByDossier(dossier.idDossierMemoire || dossier.id);
    // Récupérer les tickets réels via le service
    const [allTickets, setAllTickets] = useState([]);
    const [loadingTickets, setLoadingTickets] = useState(false);
    useEffect(() => {
        const fetchTickets = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!dossier)
                return;
            setLoadingTickets(true);
            try {
                const userId = user === null || user === void 0 ? void 0 : user.id; // encadrantId
                const fetchedTasks = yield dossierService.getTachesEncadrement(userId || '', dossier.anneeAcademique);
                // Filtrer par dossier
                const dossierTasks = fetchedTasks.filter((t) => t.dossierId === (dossier.idDossierMemoire || dossier.id));
                console.log('Tâches récupérées (raw):', dossierTasks);
                // Mapper les tâches backend (Tache) vers le format frontend (Ticket)
                const mappedTickets = dossierTasks.map((t) => ({
                    idTicket: t.id,
                    titre: t.titre,
                    description: t.description,
                    priorite: t.priorite === 'Haute' ? Priorite.HAUTE : t.priorite === 'Basse' ? Priorite.BASSE : Priorite.MOYENNE,
                    dateCreation: t.dateCreation ? new Date(t.dateCreation) : new Date(),
                    dateEcheance: t.dateEcheance ? new Date(t.dateEcheance) : undefined,
                    statut: t.statut === 'done' ? StatutTicket.TERMINE : t.statut === 'in_progress' ? StatutTicket.EN_COURS : StatutTicket.A_FAIRE,
                    phase: t.statut === 'done' ? PhaseTicket.TERMINE : t.statut === 'in_progress' ? PhaseTicket.EN_COURS : PhaseTicket.A_FAIRE,
                    sousTaches: [],
                    progression: t.progression || (t.statut === 'done' ? 100 : 0),
                    // TODO: Gérer les livrables si disponibles dans l'API tâche
                    livrables: []
                }));
                console.log('Tickets mappés:', mappedTickets);
                setAllTickets(mappedTickets);
            }
            catch (error) {
                console.error("Erreur chargement tickets:", error);
            }
            finally {
                setLoadingTickets(false);
            }
        });
        fetchTickets();
    }, [dossier, user === null || user === void 0 ? void 0 : user.id]);
    // Filtrer les tickets par statut selon l'onglet actif
    const tickets = useMemo(() => {
        switch (ticketFilterTab) {
            case 'a-faire':
                return allTickets.filter(t => t.phase === PhaseTicket.A_FAIRE);
            case 'en-cours':
                return allTickets.filter(t => t.phase === PhaseTicket.EN_COURS);
            case 'en-revision':
                return allTickets.filter(t => t.phase === PhaseTicket.EN_REVISION);
            case 'termines':
                return allTickets.filter(t => t.phase === PhaseTicket.TERMINE);
            default:
                return allTickets.filter(t => t.phase === PhaseTicket.A_FAIRE);
        }
    }, [allTickets, ticketFilterTab]);
    // Compter les tickets par phase
    const ticketCounts = useMemo(() => {
        return {
            'a-faire': allTickets.filter(t => t.phase === PhaseTicket.A_FAIRE).length,
            'en-cours': allTickets.filter(t => t.phase === PhaseTicket.EN_COURS).length,
            'en-revision': allTickets.filter(t => t.phase === PhaseTicket.EN_REVISION).length,
            'termines': allTickets.filter(t => t.phase === PhaseTicket.TERMINE).length
        };
    }, [allTickets]);
    // Vérifier si toutes les tâches sont terminées
    const toutesTachesTerminees = useMemo(() => {
        if (allTickets.length === 0)
            return false;
        return allTickets.every(t => t.phase === PhaseTicket.TERMINE);
    }, [allTickets]);
    // Vérifier si la pré-lecture a été effectuée
    const prelectureEffectuee = dossier.prelectureEffectuee === true;
    // Vérifier s'il y a un ticket EN_COURS
    const ticketEnCours = useMemo(() => {
        return allTickets.find(t => t.phase === PhaseTicket.EN_COURS);
    }, [allTickets]);
    // Fonction pour ajouter une note de suivi
    const handleAjouterNote = () => {
        if (!nouvelleNote.trim()) {
            alert('Veuillez saisir une note de suivi.');
            return;
        }
        if (!(user === null || user === void 0 ? void 0 : user.id)) {
            alert('Erreur : Utilisateur non identifié.');
            return;
        }
        if (!encadrement) {
            alert('Erreur : Encadrement non trouvé.');
            return;
        }
        addNoteSuivi({
            contenu: nouvelleNote,
            dossierMemoire: dossier,
            encadrement: encadrement,
            idEncadrant: parseInt(user.id)
        });
        setNouvelleNote('');
        setShowAddNoteModal(false);
        // TODO: Appel API pour sauvegarder la note
    };
    // Fonction pour ouvrir la modal de confirmation de pré-lecture
    const handleOuvrirModalPrelecture = () => {
        if (!toutesTachesTerminees) {
            alert('Toutes les tâches doivent être terminées avant d\'autoriser la pré-lecture.');
            return;
        }
        setShowConfirmPrelectureModal(true);
    };
    // Fonction pour confirmer l'autorisation de pré-lecture
    const handleConfirmAutoriserPrelecture = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Envoi de la mise à jour à l'API
            yield dossierService.updateDossier(dossier.id, {
                // @ts-ignore - 'autorisePrelecture' might not be in the strict type yet but supported by backend schema if dynamic
                autorisePrelecture: true,
                etape: 'PRELECTURE'
            });
            // Mise à jour locale
            setDossier((prev) => (Object.assign(Object.assign({}, prev), { autorisePrelecture: true, etape: 'PRELECTURE', dateModification: new Date().toISOString() })));
            setShowConfirmPrelectureModal(false);
        }
        catch (err) {
            console.error("Erreur update dossier:", err);
            alert("Erreur lors de l'autorisation de pré-lecture");
        }
    });
    // Fonction pour ouvrir la modal de confirmation de soutenance
    const handleOuvrirModalSoutenance = () => {
        if (!prelectureEffectuee) {
            alert('La pré-lecture doit être effectuée avant d\'autoriser la soutenance.');
            return;
        }
        setShowConfirmSoutenanceModal(true);
    };
    // Fonction pour confirmer l'autorisation de soutenance
    const handleConfirmAutoriserSoutenance = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield dossierService.updateDossier(dossier.id, {
                // @ts-ignore
                autoriseSoutenance: true,
                etape: 'SOUTENANCE'
            });
            setDossier((prev) => (Object.assign(Object.assign({}, prev), { autoriseSoutenance: true, etape: 'SOUTENANCE', dateModification: new Date().toISOString() })));
            setShowConfirmSoutenanceModal(false);
        }
        catch (err) {
            console.error("Erreur update dossier:", err);
            alert("Erreur lors de l'autorisation de soutenance");
        }
    });
    // Fonction pour valider un ticket en révision
    const handleValiderTicket = (ticket) => {
        // Vérifier que toutes les sous-tâches sont terminées
        if (ticket.sousTaches && ticket.sousTaches.length > 0) {
            const toutesTerminees = ticket.sousTaches.every(st => st.terminee);
            if (!toutesTerminees) {
                alert('Toutes les sous-tâches doivent être terminées avant de valider le ticket.');
                return;
            }
        }
        // Mettre à jour le ticket : passe à TERMINE
        const ticketIndex = mockTickets.findIndex(t => t.idTicket === ticket.idTicket);
        if (ticketIndex !== -1) {
            mockTickets[ticketIndex] = Object.assign(Object.assign({}, mockTickets[ticketIndex]), { statut: StatutTicket.TERMINE, phase: PhaseTicket.TERMINE, progression: 100 });
            // Mettre à jour le livrable si présent
            if (mockTickets[ticketIndex].livrables && mockTickets[ticketIndex].livrables.length > 0) {
                mockTickets[ticketIndex].livrables[0].statut = StatutLivrable.VALIDE;
            }
            // Mettre à jour le ticket sélectionné
            setSelectedTicket(mockTickets[ticketIndex]);
        }
    };
    // Fonction pour rejeter un ticket en révision
    const handleRejeterTicket = () => {
        if (!selectedTicket)
            return;
        // Vérifier que le commentaire est rempli
        if (!rejetCommentaire.trim()) {
            alert('Veuillez saisir un commentaire de rejet.');
            return;
        }
        // Filtrer les corrections vides
        const correctionsValides = rejetCorrections.filter(c => c.trim() !== '');
        // Mettre à jour le ticket : retourne à EN_COURS avec feedback
        const ticketIndex = mockTickets.findIndex(t => t.idTicket === selectedTicket.idTicket);
        if (ticketIndex !== -1) {
            // Ajouter les corrections comme nouvelles sous-tâches
            const nouvellesSousTaches = [...(selectedTicket.sousTaches || [])];
            const maxId = nouvellesSousTaches.length > 0
                ? Math.max(...nouvellesSousTaches.map(st => st.id))
                : 0;
            correctionsValides.forEach((correction, index) => {
                nouvellesSousTaches.push({
                    id: maxId + index + 1,
                    titre: correction,
                    terminee: false
                });
            });
            // Recalculer la progression
            const etapesTerminees = nouvellesSousTaches.filter(st => st.terminee).length;
            const nouvelleProgression = nouvellesSousTaches.length > 0
                ? Math.round((etapesTerminees / nouvellesSousTaches.length) * 100)
                : 0;
            mockTickets[ticketIndex] = Object.assign(Object.assign({}, mockTickets[ticketIndex]), { statut: StatutTicket.EN_COURS, phase: PhaseTicket.EN_COURS, estRetourne: true, feedbackRejet: {
                    dateRetour: new Date(),
                    commentaire: rejetCommentaire,
                    corrections: correctionsValides
                }, sousTaches: nouvellesSousTaches, progression: nouvelleProgression });
            // Mettre à jour le livrable si présent
            if (mockTickets[ticketIndex].livrables && mockTickets[ticketIndex].livrables.length > 0) {
                mockTickets[ticketIndex].livrables[0].statut = StatutLivrable.REJETE;
            }
            // Fermer les modals et réinitialiser
            setShowRejetModal(false);
            setSelectedTicket(mockTickets[ticketIndex]);
            setRejetCommentaire('');
            setRejetCorrections(['']);
        }
    };
    // Fonction pour ajouter une correction
    const handleAjouterCorrection = () => {
        setRejetCorrections([...rejetCorrections, '']);
    };
    // Fonction pour supprimer une correction
    const handleSupprimerCorrection = (index) => {
        setRejetCorrections(rejetCorrections.filter((_, i) => i !== index));
    };
    // Fonction pour mettre à jour une correction
    const handleUpdateCorrection = (index, value) => {
        const nouvellesCorrections = [...rejetCorrections];
        nouvellesCorrections[index] = value;
        setRejetCorrections(nouvellesCorrections);
    };
    // Helper pour obtenir la couleur du badge selon la phase
    const getPhaseBadgeColor = (phase) => {
        switch (phase) {
            case PhaseTicket.A_FAIRE:
                return 'bg-gray-50 text-gray-700 border-gray-200';
            case PhaseTicket.EN_COURS:
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case PhaseTicket.EN_REVISION:
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case PhaseTicket.TERMINE:
                return 'bg-green-50 text-green-700 border-green-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };
    // Helper pour obtenir le label de la phase
    const getPhaseLabel = (phase) => {
        switch (phase) {
            case PhaseTicket.A_FAIRE:
                return 'À faire';
            case PhaseTicket.EN_COURS:
                return 'En cours';
            case PhaseTicket.EN_REVISION:
                return 'En révision';
            case PhaseTicket.TERMINE:
                return 'Terminé';
            default:
                return phase;
        }
    };
    // Calculer la progression du dossier basée sur les tickets
    const progression = useMemo(() => {
        if (allTickets.length === 0)
            return 0;
        // Calculer la progression moyenne des tickets
        // Les tickets terminés comptent pour 100%, les autres utilisent leur progression
        const progressionTotale = allTickets.reduce((sum, ticket) => {
            if (ticket.phase === PhaseTicket.TERMINE) {
                return sum + 100;
            }
            else {
                return sum + ticket.progression;
            }
        }, 0);
        return Math.round(progressionTotale / allTickets.length);
    }, [allTickets]);
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs(Button, { variant: "ghost", onClick: () => navigate(`/professeur/encadrements`), className: "mb-4", children: [_jsx(ArrowLeft, { className: "h-4 w-4 mr-2" }), "Retour au panel"] }), _jsxs(Card, { children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("div", { className: "flex", children: [_jsx(TabButton, { isActive: activeTab === 'informations', onClick: () => setActiveTab('informations'), icon: _jsx(Info, { className: "h-4 w-4" }), children: "Informations" }), _jsx(TabButton, { isActive: activeTab === 'documents', onClick: () => setActiveTab('documents'), icon: _jsx(Folder, { className: "h-4 w-4" }), count: documents.length, children: "Documents" }), _jsx(TabButton, { isActive: activeTab === 'tickets', onClick: () => setActiveTab('tickets'), icon: _jsx(TicketIcon, { className: "h-4 w-4" }), count: tickets.length, children: "Tickets" }), _jsx(TabButton, { isActive: activeTab === 'fiche-suivi', onClick: () => setActiveTab('fiche-suivi'), icon: _jsx(FileTextIcon, { className: "h-4 w-4" }), count: notesSuivi.length, children: "Fiche de suivi" })] }) }), _jsx(CardContent, { className: "p-6", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'informations' && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: _jsxs("div", { className: "space-y-6", children: [candidat && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Informations de l'\u00E9tudiant" }), _jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Nom complet" }), _jsxs("p", { className: "text-sm font-medium text-gray-900", children: [candidat.prenom, " ", candidat.nom] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Email" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: candidat.email })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Num\u00E9ro matricule" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: candidat.numeroMatricule })] }), candidat.niveau && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Niveau" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: candidat.niveau })] })), candidat.filiere && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Fili\u00E8re" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: candidat.filiere })] }))] }) })] })), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Informations du dossier" }), _jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Titre" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: dossier.titre })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Description" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: dossier.description })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Statut" }), _jsx(Badge, { className: getStatutBadgeColor(dossier.statut), children: getStatutLabel(dossier.statut) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "\u00C9tape" }), _jsx(Badge, { variant: "outline", children: getEtapeLabel(dossier.etape) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Date de cr\u00E9ation" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: new Date(dossier.dateCreation).toLocaleDateString('fr-FR', {
                                                                                    day: 'numeric',
                                                                                    month: 'long',
                                                                                    year: 'numeric'
                                                                                }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Derni\u00E8re modification" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: new Date(dossier.dateModification).toLocaleDateString('fr-FR', {
                                                                                    day: 'numeric',
                                                                                    month: 'long',
                                                                                    year: 'numeric'
                                                                                }) })] }), dossier.anneeAcademique && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Ann\u00E9e acad\u00E9mique" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: dossier.anneeAcademique })] })), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Autorisation de soutenance" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: dossier.autoriseSoutenance ? (_jsx("span", { className: "text-green-600", children: "Autoris\u00E9e" })) : (_jsx("span", { className: "text-red-600", children: "Non autoris\u00E9e" })) })] }), dossier.autorisePrelecture !== undefined && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Autorisation de pr\u00E9-lecture" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: dossier.autorisePrelecture ? (_jsx("span", { className: "text-green-600", children: "Autoris\u00E9e" })) : (_jsx("span", { className: "text-red-600", children: "Non autoris\u00E9e" })) })] })), dossier.prelectureEffectuee !== undefined && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "Pr\u00E9-lecture effectu\u00E9e" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: dossier.prelectureEffectuee ? (_jsx("span", { className: "text-green-600", children: "Oui" })) : (_jsx("span", { className: "text-gray-600", children: "Non" })) })] }))] }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Actions d'autorisation" }), _jsxs("div", { className: "bg-white border border-gray-200 p-6 space-y-4", children: [toutesTachesTerminees && !dossier.autorisePrelecture && (_jsxs("div", { className: "flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 mb-1", children: "Autoriser la pr\u00E9-lecture" }), _jsx("p", { className: "text-sm text-gray-600", children: "Toutes les t\u00E2ches sont termin\u00E9es. Vous pouvez autoriser la pr\u00E9-lecture." })] }), _jsx(Button, { onClick: handleOuvrirModalPrelecture, className: "bg-primary hover:bg-primary-dark text-white", children: "Autoriser pr\u00E9-lecture" })] })), prelectureEffectuee && !dossier.autoriseSoutenance && (_jsxs("div", { className: "flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900 mb-1", children: "Autoriser la soutenance" }), _jsx("p", { className: "text-sm text-gray-600", children: "La pr\u00E9-lecture a \u00E9t\u00E9 effectu\u00E9e. Vous pouvez autoriser la soutenance." })] }), _jsx(Button, { onClick: handleOuvrirModalSoutenance, className: "bg-green-600 hover:bg-green-700 text-white", children: "Autoriser soutenance" })] })), !toutesTachesTerminees && !prelectureEffectuee && (_jsx("div", { className: "p-4 bg-gray-50 border border-gray-200 rounded", children: _jsx("p", { className: "text-sm text-gray-600", children: "Les actions d'autorisation seront disponibles lorsque toutes les conditions seront remplies." }) }))] })] })] }) }, "informations")), activeTab === 'documents' && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: _jsx("div", { className: "space-y-4", children: documents.length === 0 ? (_jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx(Folder, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { children: "Aucun document disponible pour ce dossier." })] })) : (documents.map((document) => (_jsx("div", { className: "bg-white border border-gray-200 p-4 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(FileText, { className: "h-5 w-5 text-gray-400" }), _jsx("h4", { className: "font-medium text-gray-900", children: document.titre }), _jsx(Badge, { variant: "outline", className: "text-xs", children: getDocumentTypeLabel(document.typeDocument) }), _jsx(Badge, { className: `text-xs ${document.statut === StatutDocument.VALIDE
                                                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                                                : document.statut === StatutDocument.EN_ATTENTE_VALIDATION
                                                                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                                                    : document.statut === StatutDocument.REJETE
                                                                                        ? 'bg-red-50 text-red-700 border-red-200'
                                                                                        : 'bg-gray-50 text-gray-700 border-gray-200'}`, children: getDocumentStatutLabel(document.statut) })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 mr-1" }), document.dateCreation.toLocaleDateString('fr-FR')] }), document.commentaire && (_jsx("span", { className: "text-gray-500 italic", children: document.commentaire }))] })] }), _jsxs("div", { className: "flex items-center gap-2 ml-4", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
                                                                        // TODO: Implémenter la visualisation du document
                                                                        console.log('Voir document:', document.cheminFichier);
                                                                    }, children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "Voir"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
                                                                        // TODO: Implémenter le téléchargement
                                                                        console.log('Télécharger document:', document.cheminFichier);
                                                                    }, children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "T\u00E9l\u00E9charger"] })] })] }) }, document.idDocument)))) }) }, "documents")), activeTab === 'tickets' && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: [_jsx("div", { className: "mb-6 border-b border-gray-200", children: _jsxs("div", { className: "flex space-x-1 -mb-px", children: [_jsx(TabButton, { isActive: ticketFilterTab === 'a-faire', onClick: () => setTicketFilterTab('a-faire'), count: ticketCounts['a-faire'], icon: _jsx(AlertCircle, { className: "h-4 w-4" }), children: "\u00C0 faire" }), _jsx(TabButton, { isActive: ticketFilterTab === 'en-cours', onClick: () => setTicketFilterTab('en-cours'), count: ticketCounts['en-cours'], icon: _jsx(RefreshCw, { className: "h-4 w-4" }), children: "En cours" }), _jsx(TabButton, { isActive: ticketFilterTab === 'en-revision', onClick: () => setTicketFilterTab('en-revision'), count: ticketCounts['en-revision'], icon: _jsx(FileText, { className: "h-4 w-4" }), children: "En r\u00E9vision" }), _jsx(TabButton, { isActive: ticketFilterTab === 'termines', onClick: () => setTicketFilterTab('termines'), count: ticketCounts['termines'], icon: _jsx(CheckCircle, { className: "h-4 w-4" }), children: "Termin\u00E9s" })] }) }), _jsx("div", { className: "space-y-4", children: tickets.length === 0 ? (_jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx(TicketIcon, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { children: "Aucun ticket disponible pour ce dossier." })] })) : (tickets.map((ticket) => (_jsx("div", { className: `bg-white border p-4 hover:shadow-md transition-shadow cursor-pointer ${ticket.phase === PhaseTicket.EN_COURS
                                                        ? 'border-blue-300 shadow-md'
                                                        : ticket.phase === PhaseTicket.EN_REVISION
                                                            ? 'border-orange-300'
                                                            : 'border-gray-200'}`, onClick: () => setSelectedTicket(ticket), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2 flex-wrap", children: [_jsx(TicketIcon, { className: "h-5 w-5 text-gray-400" }), _jsx("h4", { className: "font-medium text-gray-900", children: ticket.titre }), _jsx(Badge, { className: `text-xs ${getPhaseBadgeColor(ticket.phase)}`, children: getPhaseLabel(ticket.phase) }), _jsx(Badge, { className: `text-xs ${ticket.priorite === 'URGENTE'
                                                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                                                    : ticket.priorite === 'HAUTE'
                                                                                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                                                                                        : ticket.priorite === 'MOYENNE'
                                                                                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                                                            : 'bg-blue-50 text-blue-700 border-blue-200'}`, children: ticket.priorite }), ticket.phase === PhaseTicket.EN_COURS && (_jsx(Badge, { className: "bg-blue-100 text-blue-800 border-blue-300 text-xs", children: "Ticket actif" }))] }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: ticket.description }), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-gray-600 mb-1", children: [_jsx("span", { children: "Progression" }), _jsxs("span", { children: [ticket.progression, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full transition-all ${ticket.phase === PhaseTicket.EN_REVISION
                                                                                        ? 'bg-orange-500'
                                                                                        : ticket.phase === PhaseTicket.TERMINE
                                                                                            ? 'bg-green-500'
                                                                                            : 'bg-primary'}`, style: { width: `${ticket.progression}%` } }) })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 mr-1" }), ticket.dateCreation.toLocaleDateString('fr-FR')] }), ticket.dateEcheance && (_jsxs("span", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), "\u00C9ch\u00E9ance: ", ticket.dateEcheance.toLocaleDateString('fr-FR')] }))] })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedTicket(ticket);
                                                                }, children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "Consulter"] })] }) }, ticket.idTicket)))) })] }, "tickets")), activeTab === 'fiche-suivi' && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Fiche de suivi" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Historique des notes de suivi pour ce dossier" })] }), _jsxs(Button, { onClick: () => setShowAddNoteModal(true), className: "bg-primary hover:bg-primary-dark text-white", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Ajouter une note"] })] }), notesSuivi.length === 0 ? (_jsxs("div", { className: "text-center py-12 bg-gray-50 border border-gray-200 rounded", children: [_jsx(FileTextIcon, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 mb-2", children: "Aucune note de suivi pour le moment" }), _jsx("p", { className: "text-sm text-gray-500", children: "Cliquez sur \"Ajouter une note\" pour commencer le suivi" })] })) : (_jsx("div", { className: "space-y-4", children: notesSuivi.map((note) => (_jsxs("div", { className: "bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow", children: [_jsx("div", { className: "flex items-start justify-between mb-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-primary-50 rounded-lg", children: _jsx(FileTextIcon, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-medium text-gray-900", children: ["Note de suivi #", note.id] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [note.dateCreation.toLocaleDateString('fr-FR', {
                                                                                            day: 'numeric',
                                                                                            month: 'long',
                                                                                            year: 'numeric',
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit'
                                                                                        }), note.dateModification && (_jsxs("span", { className: "ml-2", children: ["(modifi\u00E9e le ", note.dateModification.toLocaleDateString('fr-FR', {
                                                                                                    day: 'numeric',
                                                                                                    month: 'long',
                                                                                                    year: 'numeric',
                                                                                                    hour: '2-digit',
                                                                                                    minute: '2-digit'
                                                                                                }), ")"] }))] })] })] }) }), _jsx("div", { className: "mt-4", children: _jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap", children: note.contenu }) })] }, note.id))) }))] }) }, "fiche-suivi"))] }) })] }), selectedTicket && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: () => setSelectedTicket(null), children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "D\u00E9tails du ticket" }), _jsx("button", { onClick: () => setSelectedTicket(null), className: "p-2 hover:bg-gray-100 transition-colors", children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { children: _jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("div", { className: "flex-1", children: _jsx("h3", { className: "text-xl font-semibold text-gray-900", children: selectedTicket.titre }) }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Badge, { className: getPhaseBadgeColor(selectedTicket.phase), children: getPhaseLabel(selectedTicket.phase) }), _jsx(Badge, { className: `${selectedTicket.priorite === Priorite.URGENTE
                                                                ? 'bg-red-50 text-red-700 border-red-200'
                                                                : selectedTicket.priorite === Priorite.HAUTE
                                                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                                                    : selectedTicket.priorite === Priorite.MOYENNE
                                                                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                                        : 'bg-blue-50 text-blue-700 border-blue-200'}`, children: selectedTicket.priorite })] })] }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Description" }), _jsx("p", { className: "text-gray-700", children: selectedTicket.description })] }), selectedTicket.consigne && (_jsx("div", { className: "bg-blue-50 border border-blue-200 p-4", children: _jsxs("div", { className: "flex items-start space-x-2", children: [_jsx(Info, { className: "h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-blue-900 mb-1", children: "Consigne" }), _jsx("p", { className: "text-blue-800 text-sm", children: selectedTicket.consigne })] })] }) })), selectedTicket.sousTaches && selectedTicket.sousTaches.length > 0 && (_jsxs("div", { children: [_jsxs("h4", { className: "font-semibold text-gray-900 mb-3", children: ["Sous-t\u00E2ches (", selectedTicket.sousTaches.filter(st => st.terminee).length, " / ", selectedTicket.sousTaches.length, " termin\u00E9es)"] }), _jsx("div", { className: "max-h-64 overflow-y-auto space-y-2 pr-2", children: selectedTicket.sousTaches.map((sousTache) => (_jsxs("div", { className: `flex items-center space-x-3 p-3 bg-gray-50 transition-colors ${sousTache.terminee ? 'opacity-75' : ''}`, children: [sousTache.terminee ? (_jsx(CheckCircle, { className: "h-5 w-5 text-green-600 flex-shrink-0" })) : (_jsx(Circle, { className: "h-5 w-5 text-gray-400 flex-shrink-0" })), _jsx("span", { className: `flex-1 ${sousTache.terminee ? 'text-gray-500 line-through' : 'text-gray-900'}`, children: sousTache.titre })] }, sousTache.id))) })] })), _jsxs("div", { className: "bg-gray-50 border border-gray-200 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Progression" }), _jsxs("span", { className: "text-sm font-bold text-gray-900", children: [selectedTicket.progression, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 h-3", children: _jsx("div", { className: `h-3 transition-all duration-300 ${selectedTicket.phase === PhaseTicket.EN_REVISION
                                                        ? 'bg-orange-500'
                                                        : selectedTicket.phase === PhaseTicket.TERMINE
                                                            ? 'bg-green-500'
                                                            : 'bg-primary'}`, style: { width: `${selectedTicket.progression}%` } }) })] }), _jsxs("div", { className: "border-t border-gray-200 pt-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-3", children: "Informations" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Calendar, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Date de cr\u00E9ation" }), _jsx("p", { className: "font-medium text-gray-900", children: selectedTicket.dateCreation.toLocaleDateString('fr-FR', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric'
                                                                        }) })] })] }), selectedTicket.dateEcheance && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Clock, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Date d'\u00E9ch\u00E9ance" }), _jsx("p", { className: "font-medium text-gray-900", children: selectedTicket.dateEcheance.toLocaleDateString('fr-FR', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric'
                                                                        }) })] })] }))] })] }), selectedTicket.livrables && selectedTicket.livrables.length > 0 && (_jsxs("div", { className: "border-t border-gray-200 pt-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-3", children: selectedTicket.phase === PhaseTicket.EN_REVISION
                                                    ? 'Document envoyé en révision'
                                                    : 'Livrable' }), (() => {
                                                const livrable = selectedTicket.livrables[selectedTicket.livrables.length - 1];
                                                return (_jsx("div", { className: `p-4 bg-gray-50 border ${selectedTicket.phase === PhaseTicket.EN_REVISION
                                                        ? 'border-orange-200 bg-orange-50'
                                                        : 'border-gray-200'}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3 flex-1", children: [_jsx("div", { className: "w-12 h-12 bg-primary flex items-center justify-center", children: _jsx(FileTextIcon, { className: "h-6 w-6 text-white" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: livrable.nomFichier }), _jsx("div", { className: "flex items-center space-x-4 mt-1 text-xs text-gray-600", children: _jsxs("span", { children: ["D\u00E9pos\u00E9 le ", livrable.dateSubmission.toLocaleDateString('fr-FR', {
                                                                                            day: 'numeric',
                                                                                            month: 'long',
                                                                                            year: 'numeric',
                                                                                            hour: '2-digit',
                                                                                            minute: '2-digit'
                                                                                        })] }) })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { className: livrable.statut === StatutLivrable.VALIDE
                                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                            : livrable.statut === StatutLivrable.REJETE
                                                                                ? 'bg-gray-50 text-gray-700 border-gray-200'
                                                                                : 'bg-yellow-50 text-yellow-700 border-yellow-200', children: livrable.statut === StatutLivrable.VALIDE ? 'Validé' :
                                                                            livrable.statut === StatutLivrable.REJETE ? 'Rejeté' :
                                                                                livrable.statut === StatutLivrable.EN_ATTENTE_VALIDATION ? 'En attente' :
                                                                                    'Déposé' }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
                                                                            // Ouvrir le livrable dans un nouvel onglet pour visualisation
                                                                            window.open(livrable.cheminFichier, '_blank');
                                                                        }, children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "Visualiser"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
                                                                            // Simuler le téléchargement
                                                                            const link = document.createElement('a');
                                                                            link.href = livrable.cheminFichier;
                                                                            link.download = livrable.nomFichier;
                                                                            link.click();
                                                                        }, children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "T\u00E9l\u00E9charger"] })] })] }) }));
                                            })(), selectedTicket.phase === PhaseTicket.EN_REVISION && (_jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Ce document est en cours de r\u00E9vision. Vous pouvez le consulter, le valider ou le rejeter." }))] })), selectedTicket.estRetourne && selectedTicket.feedbackRejet && (_jsx("div", { className: "bg-blue-50 border-2 border-blue-300 p-4", children: _jsxs("div", { className: "flex items-start space-x-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-semibold text-blue-900", children: "Ticket retourn\u00E9 pour r\u00E9vision" }), _jsx("span", { className: "text-xs text-blue-700", children: selectedTicket.feedbackRejet.dateRetour.toLocaleDateString('fr-FR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    }) })] }), _jsx("p", { className: "text-blue-800 text-sm mb-2", children: selectedTicket.feedbackRejet.commentaire }), selectedTicket.feedbackRejet.corrections.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-blue-700 font-semibold mb-1", children: "Corrections \u00E0 apporter :" }), _jsx("ul", { className: "list-disc list-inside text-xs text-blue-700 space-y-1", children: selectedTicket.feedbackRejet.corrections.map((correction, index) => (_jsx("li", { children: correction }, index))) })] }))] })] }) }))] }), _jsxs("div", { className: "sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center", children: [_jsx("div", { children: selectedTicket.phase === PhaseTicket.EN_REVISION && (_jsx("p", { className: "text-xs text-gray-500", children: "V\u00E9rifiez que toutes les sous-t\u00E2ches sont termin\u00E9es avant de valider." })) }), _jsxs("div", { className: "flex space-x-2", children: [selectedTicket.phase === PhaseTicket.EN_REVISION && (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: "outline", onClick: () => {
                                                            // Vérifier que toutes les sous-tâches sont terminées
                                                            if (selectedTicket.sousTaches && selectedTicket.sousTaches.length > 0) {
                                                                const toutesTerminees = selectedTicket.sousTaches.every(st => st.terminee);
                                                                if (!toutesTerminees) {
                                                                    alert('Toutes les sous-tâches doivent être terminées avant de valider le ticket.');
                                                                    return;
                                                                }
                                                            }
                                                            handleValiderTicket(selectedTicket);
                                                        }, className: "bg-primary hover:bg-primary-dark text-white", children: [_jsx(Check, { className: "h-4 w-4 mr-2" }), "Valider"] }), _jsxs(Button, { variant: "outline", onClick: () => setShowRejetModal(true), className: "bg-gray-600 hover:bg-gray-700 text-white", children: [_jsx(XCircle, { className: "h-4 w-4 mr-2" }), "Rejeter"] })] })), _jsx(Button, { onClick: () => setSelectedTicket(null), children: "Fermer" })] })] })] }) })), showRejetModal && selectedTicket && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: () => {
                        setShowRejetModal(false);
                        setRejetCommentaire('');
                        setRejetCorrections(['']);
                    }, children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Rejeter le ticket" }), _jsx("button", { onClick: () => {
                                            setShowRejetModal(false);
                                            setRejetCommentaire('');
                                            setRejetCorrections(['']);
                                        }, className: "p-2 hover:bg-gray-100 transition-colors", children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: selectedTicket.titre }), _jsx("p", { className: "text-sm text-gray-600", children: selectedTicket.description })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-semibold text-gray-900 mb-2", children: ["Commentaire de rejet ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx(Textarea, { value: rejetCommentaire, onChange: (e) => setRejetCommentaire(e.target.value), placeholder: "Expliquez pourquoi le ticket est rejet\u00E9 et ce qui doit \u00EAtre corrig\u00E9...", className: "min-h-[100px]" })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-900", children: "Corrections \u00E0 apporter (seront ajout\u00E9es comme nouvelles sous-t\u00E2ches)" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: handleAjouterCorrection, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Ajouter"] })] }), _jsx("div", { className: "space-y-2", children: rejetCorrections.map((correction, index) => (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Input, { value: correction, onChange: (e) => handleUpdateCorrection(index, e.target.value), placeholder: `Correction ${index + 1}...`, className: "flex-1" }), rejetCorrections.length > 1 && (_jsx(Button, { type: "button", variant: "outline", size: "sm", onClick: () => handleSupprimerCorrection(index), className: "text-red-600 hover:text-red-700", children: _jsx(Trash2, { className: "h-4 w-4" }) }))] }, index))) })] })] }), _jsxs("div", { className: "sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-2", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                            setShowRejetModal(false);
                                            setRejetCommentaire('');
                                            setRejetCorrections(['']);
                                        }, children: "Annuler" }), _jsxs(Button, { onClick: handleRejeterTicket, className: "bg-gray-600 hover:bg-gray-700 text-white", disabled: !rejetCommentaire.trim(), children: [_jsx(XCircle, { className: "h-4 w-4 mr-2" }), "Rejeter le ticket"] })] })] }) })), showAddNoteModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Ajouter une note de suivi" }), _jsx("button", { onClick: () => {
                                            setShowAddNoteModal(false);
                                            setNouvelleNote('');
                                        }, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Note de suivi" }), _jsx(Textarea, { value: nouvelleNote, onChange: (e) => setNouvelleNote(e.target.value), placeholder: "Saisissez votre note de suivi concernant l'avancement du dossier...", className: "min-h-[150px]" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Cette note sera ajout\u00E9e \u00E0 la fiche de suivi du dossier et sera visible dans l'historique." })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                            setShowAddNoteModal(false);
                                            setNouvelleNote('');
                                        }, children: "Annuler" }), _jsxs(Button, { onClick: handleAjouterNote, className: "bg-primary hover:bg-primary-dark text-white", disabled: !nouvelleNote.trim(), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Ajouter la note"] })] })] }) })), showAddNoteModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Ajouter une note de suivi" }), _jsx("button", { onClick: () => {
                                            setShowAddNoteModal(false);
                                            setNouvelleNote('');
                                        }, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Note de suivi" }), _jsx(Textarea, { value: nouvelleNote, onChange: (e) => setNouvelleNote(e.target.value), placeholder: "Saisissez votre note de suivi concernant l'avancement du dossier...", className: "min-h-[150px]" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Cette note sera ajout\u00E9e \u00E0 la fiche de suivi du dossier et sera visible dans l'historique." })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "outline", onClick: () => {
                                            setShowAddNoteModal(false);
                                            setNouvelleNote('');
                                        }, children: "Annuler" }), _jsxs(Button, { onClick: handleAjouterNote, className: "bg-primary hover:bg-primary-dark text-white", disabled: !nouvelleNote.trim(), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Ajouter la note"] })] })] }) })), showConfirmPrelectureModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-md w-full mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Confirmer l'autorisation" }), _jsx("button", { onClick: () => setShowConfirmPrelectureModal(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-sm text-gray-700 mb-4", children: "\u00CAtes-vous s\u00FBr de vouloir autoriser la pr\u00E9-lecture pour ce dossier ?" }), candidat && (_jsxs("div", { className: "bg-gray-50 border border-gray-200 p-3 rounded", children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "\u00C9tudiant" }), _jsxs("p", { className: "text-sm font-medium text-gray-900", children: [candidat.prenom, " ", candidat.nom] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Dossier : ", dossier.titre] })] }))] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "outline", onClick: () => setShowConfirmPrelectureModal(false), children: "Annuler" }), _jsxs(Button, { onClick: handleConfirmAutoriserPrelecture, className: "bg-primary hover:bg-primary-dark text-white", children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-2" }), "Confirmer"] })] })] }) })), showConfirmSoutenanceModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-md w-full mx-4", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Confirmer l'autorisation" }), _jsx("button", { onClick: () => setShowConfirmSoutenanceModal(false), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-sm text-gray-700 mb-4", children: "\u00CAtes-vous s\u00FBr de vouloir autoriser la soutenance pour ce dossier ?" }), candidat && (_jsxs("div", { className: "bg-gray-50 border border-gray-200 p-3 rounded", children: [_jsx("p", { className: "text-xs text-gray-500 mb-1", children: "\u00C9tudiant" }), _jsxs("p", { className: "text-sm font-medium text-gray-900", children: [candidat.prenom, " ", candidat.nom] }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Dossier : ", dossier.titre] })] }))] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "outline", onClick: () => setShowConfirmSoutenanceModal(false), children: "Annuler" }), _jsxs(Button, { onClick: handleConfirmAutoriserSoutenance, className: "bg-green-600 hover:bg-green-700 text-white", children: [_jsx(CheckCircle, { className: "h-4 w-4 mr-2" }), "Confirmer"] })] })] }) }))] }) }));
};
export default DossierEtudiantDetail;
