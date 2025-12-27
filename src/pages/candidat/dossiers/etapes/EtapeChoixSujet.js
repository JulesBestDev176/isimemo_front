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
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, CheckCircle, ArrowRight, Plus, Eye, Target, Bell, Users, Clock, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import { useAuth } from '../../../../contexts/AuthContext';
import sujetService from '../../../../services/sujet.service';
import dossierService from '../../../../services/dossier.service';
import demandeBinomeService from '../../../../services/demandeBinome.service';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from '../../../../components/ui/dialog';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';
// Fonction pour convertir un Sujet API en SujetMemoire frontend
const mapApiSujetToSujetMemoire = (apiSujet) => ({
    id: apiSujet.id,
    titre: apiSujet.titre,
    description: apiSujet.description || '',
    domaine: apiSujet.departement || 'Informatique',
    attentes: apiSujet.prerequis ? `Prérequis:\n${apiSujet.prerequis}\n\nObjectifs:\n${apiSujet.objectifs || ''}` : undefined,
    encadrantPropose: apiSujet.nomCreateur ? {
        id: 0,
        nom: apiSujet.nomCreateur.split(' ').slice(-1)[0] || '',
        prenom: apiSujet.nomCreateur.split(' ').slice(0, -1).join(' ') || '',
        email: apiSujet.emailCreateur
    } : undefined,
    estDisponible: apiSujet.statut === 'VALIDE' && !apiSujet.dossierMemoireId // Disponible si VALIDE et pas encore attribué
});
const EtapeChoixSujet = ({ dossier, onComplete, estSuiveur = false }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sujetSelectionne, setSujetSelectionne] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [titrePropose, setTitrePropose] = useState('');
    const [descriptionProposee, setDescriptionProposee] = useState('');
    const [sujetConsulte, setSujetConsulte] = useState(null);
    const [isConsultDialogOpen, setIsConsultDialogOpen] = useState(false);
    const [propositionAConfirmer, setPropositionAConfirmer] = useState(null);
    const [showConfirmAccept, setShowConfirmAccept] = useState(false);
    const [activeTab, setActiveTab] = useState('sujets');
    // États pour l'API des sujets
    const [sujetsDisponibles, setSujetsDisponibles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProposing, setIsProposing] = useState(false);
    // Charger les sujets depuis l'API
    useEffect(() => {
        const fetchSujets = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                setIsLoading(true);
                setError(null);
                // Récupérer les sujets disponibles (filtrés par filière si disponible)
                const sujets = yield sujetService.getSujetsDisponibles();
                const sujetsMapped = sujets.map(mapApiSujetToSujetMemoire);
                setSujetsDisponibles(sujetsMapped);
                // Si le candidat a une proposition personnelle, la récupérer aussi
                if (user === null || user === void 0 ? void 0 : user.id) {
                    try {
                        const propositions = yield sujetService.getPropositionsByCandidat(user.id);
                        if (propositions.length > 0) {
                            const propositionsMapped = propositions.map(mapApiSujetToSujetMemoire);
                            setSujetsDisponibles(prev => [...prev, ...propositionsMapped]);
                        }
                    }
                    catch (e) {
                        console.log('Pas de propositions personnelles');
                    }
                }
            }
            catch (err) {
                console.error('Erreur lors du chargement des sujets:', err);
                setError('Impossible de charger les sujets. Vérifiez votre connexion.');
            }
            finally {
                setIsLoading(false);
            }
        });
        fetchSujets();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // États pour les demandes de binôme depuis l'API
    const [demandesRecues, setDemandesRecues] = useState([]);
    const [isLoadingDemandes, setIsLoadingDemandes] = useState(true);
    // Charger les demandes de binôme depuis l'API
    useEffect(() => {
        const fetchDemandes = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return;
            try {
                setIsLoadingDemandes(true);
                const demandes = yield demandeBinomeService.getDemandesRecues(user.id);
                setDemandesRecues(demandes);
            }
            catch (err) {
                console.error('Erreur lors du chargement des demandes:', err);
            }
            finally {
                setIsLoadingDemandes(false);
            }
        });
        fetchDemandes();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // Filtrer les demandes en attente
    const demandesEnAttente = useMemo(() => {
        return demandesRecues.filter(d => d.statut === 'EN_ATTENTE');
    }, [demandesRecues]);
    // Vérifier si une demande a été acceptée
    const demandeAcceptee = useMemo(() => {
        return demandesRecues.find(d => d.statut === 'ACCEPTEE');
    }, [demandesRecues]);
    // Créer une liste combinée des sujets disponibles et du sujet proposé (s'il existe)
    const tousLesSujets = sujetSelectionne && !sujetSelectionne.estDisponible && !sujetsDisponibles.some(s => s.id === sujetSelectionne.id)
        ? [...sujetsDisponibles, sujetSelectionne]
        : sujetsDisponibles;
    const sujetsFiltres = tousLesSujets.filter(sujet => {
        const matchesSearch = sujet.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sujet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sujet.domaine.toLowerCase().includes(searchQuery.toLowerCase());
        // Inclure les sujets disponibles OU le sujet sélectionné (même s'il n'est pas disponible)
        return matchesSearch && (sujet.estDisponible || sujet.id === (sujetSelectionne === null || sujetSelectionne === void 0 ? void 0 : sujetSelectionne.id));
    });
    const handleValider = () => __awaiter(void 0, void 0, void 0, function* () {
        if (sujetSelectionne) {
            try {
                setIsLoading(true);
                // 1. Lier le sujet au dossier dans le service Sujet
                yield sujetService.attribuerSujet(Number(sujetSelectionne.id), dossier.id);
                // 2. Mettre à jour le dossier (titre, description et étape suivante)
                yield dossierService.selectionnerSujet(dossier.id, {
                    titre: sujetSelectionne.titre,
                    description: sujetSelectionne.description
                });
                console.log('Sujet persisté pour le dossier:', dossier.id);
                onComplete();
            }
            catch (err) {
                console.error('Erreur lors de la validation du sujet:', err);
                setError('Impossible d\'enregistrer votre choix. Veuillez réessayer.');
            }
            finally {
                setIsLoading(false);
            }
        }
    });
    const handleProposerSujet = () => __awaiter(void 0, void 0, void 0, function* () {
        if (titrePropose.trim() && descriptionProposee.trim() && user) {
            try {
                setIsProposing(true);
                // Appel API pour soumettre le sujet proposé
                const sujetCree = yield sujetService.proposerSujet({
                    titre: titrePropose.trim(),
                    description: descriptionProposee.trim(),
                    emailCreateur: user.email || '',
                    nomCreateur: user.name || '',
                    candidatId: user.id,
                    dossierMemoireId: dossier.id,
                    anneeAcademique: '2025-2026'
                });
                console.log('Sujet proposé:', sujetCree);
                // Nouveau sujet créé avec succès
                const nouveauSujet = mapApiSujetToSujetMemoire(sujetCree);
                setSujetsDisponibles(prev => [...prev, nouveauSujet]);
                setSujetSelectionne(nouveauSujet);
                // Fermer le dialog et réinitialiser les champs immédiatement
                setIsDialogOpen(false);
                setTitrePropose('');
                setDescriptionProposee('');
                // Mettre à jour le dossier pour refléter cette proposition comme sujet actuel
                yield dossierService.selectionnerSujet(dossier.id, {
                    titre: nouveauSujet.titre,
                    description: nouveauSujet.description
                });
                onComplete();
            }
            catch (err) {
                console.error('Erreur lors de la proposition du sujet:', err);
                setError('Impossible de proposer le sujet. Veuillez réessayer.');
            }
            finally {
                setIsProposing(false);
            }
        }
    });
    const handleConsulterSujet = (sujet, e) => {
        e.stopPropagation(); // Empêcher la sélection du sujet
        setSujetConsulte(sujet);
        setIsConsultDialogOpen(true);
    };
    // État pour la demande à confirmer
    const [demandeAConfirmer, setDemandeAConfirmer] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const [isRefusing, setIsRefusing] = useState(null);
    const handleAccepterDemande = (demande) => {
        // Afficher le modal de confirmation
        setDemandeAConfirmer(demande);
        setShowConfirmAccept(true);
    };
    const handleConfirmAccept = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!demandeAConfirmer)
            return;
        try {
            setIsAccepting(true);
            // Appel API pour accepter la demande
            const response = yield demandeBinomeService.accepterDemande(demandeAConfirmer.idDemande);
            // Sauvegarder l'ID du dossier du groupe avant de réinitialiser les états
            const dossierGroupeId = ((_a = response.dossierGroupe) === null || _a === void 0 ? void 0 : _a.id) || demandeAConfirmer.dossierDemandeurId;
            // Fermer le modal
            setShowConfirmAccept(false);
            setDemandeAConfirmer(null);
            // Rediriger vers le dossier du groupe (celui du demandeur)
            if (dossierGroupeId) {
                // Rafraîchir la page en naviguant vers le dossier du groupe
                navigate(`/etudiant/dossiers/${dossierGroupeId}`, { replace: true });
                window.location.reload(); // Force le rechargement pour voir le nouveau dossier
            }
        }
        catch (err) {
            console.error('Erreur lors de l\'acceptation de la demande:', err);
            setError('Impossible d\'accepter la demande. Veuillez réessayer.');
        }
        finally {
            setIsAccepting(false);
        }
    });
    const handleRefuserDemande = (demande) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            setIsRefusing(demande.idDemande);
            // Appel API pour refuser la demande
            yield demandeBinomeService.refuserDemande(demande.idDemande);
            // Mettre à jour l'état local
            setDemandesRecues(prev => prev.map(d => d.idDemande === demande.idDemande
                ? Object.assign(Object.assign({}, d), { statut: 'REFUSEE' }) : d));
        }
        catch (err) {
            console.error('Erreur lors du refus de la demande:', err);
            setError('Impossible de refuser la demande. Veuillez réessayer.');
        }
        finally {
            setIsRefusing(null);
        }
    });
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(BookOpen, { className: "h-5 w-5 text-primary" }), "\u00C9tape 1 : Choix du sujet"] }), _jsx(CardDescription, { children: "Consultez la banque de sujets disponibles, s\u00E9lectionnez celui qui vous int\u00E9resse ou consultez les demandes de bin\u00F4me re\u00E7ues" })] }), _jsx(CardContent, { className: "space-y-6", children: _jsxs(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsxs(TabsTrigger, { value: "sujets", className: "gap-2", children: [_jsx(BookOpen, { className: "h-4 w-4" }), "Sujets"] }), _jsxs(TabsTrigger, { value: "demandes", className: "gap-2", children: [_jsx(Bell, { className: "h-4 w-4" }), "Demandes re\u00E7ues", demandesEnAttente.length > 0 && (_jsx(Badge, { variant: "secondary", className: "ml-2 bg-primary text-white", children: demandesEnAttente.length }))] })] }), dossier.motifRefusCommission && (_jsxs("div", { className: "mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500", children: [_jsx("div", { className: "bg-red-100 rounded-full p-2", children: _jsx(XCircle, { className: "h-6 w-6 text-red-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-bold text-red-900 uppercase tracking-tight", children: "Sujet refus\u00E9 par la commission" }), _jsx("p", { className: "text-sm text-red-700 mt-1 leading-relaxed", children: dossier.motifRefusCommission }), _jsx("p", { className: "text-xs text-red-500 mt-2 italic", children: "Veuillez soumettre une nouvelle proposition de sujet ci-dessous. Votre bin\u00F4me et votre encadrant sont conserv\u00E9s." })] })] })), _jsxs(TabsContent, { value: "sujets", className: "space-y-6 mt-6", children: [(demandeAcceptee || estSuiveur) && (_jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "bg-blue-100 rounded-full p-2", children: _jsx(Bell, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-blue-900 mb-1", children: estSuiveur ? 'Mode observation (Binôme)' : 'Demande de binôme acceptée' }), _jsx("p", { className: "text-xs text-blue-700", children: estSuiveur
                                                                    ? "En tant que binôme, vous pouvez suivre le choix du sujet. Votre partenaire est responsable de la sélection finale."
                                                                    : `Vous avez accepté une demande de binôme de ${demandeAcceptee === null || demandeAcceptee === void 0 ? void 0 : demandeAcceptee.demandeurNom}. C'est votre binôme qui a choisi le sujet et qui doit continuer le pipeline.` })] })] }) })), !demandeAcceptee && !estSuiveur && (_jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx(Input, { type: "text", placeholder: "Rechercher un sujet par titre, description ou domaine...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] }), _jsxs(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: "gap-2 whitespace-nowrap", children: [_jsx(Plus, { className: "h-4 w-4" }), "Proposer un sujet"] }) }), _jsxs(DialogContent, { className: "sm:max-w-[600px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Proposer un nouveau sujet" }), _jsx(DialogDescription, { children: "Remplissez les informations ci-dessous pour proposer votre propre sujet de m\u00E9moire. Votre proposition sera soumise pour validation." })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "titre", children: "Titre du sujet *" }), _jsx(Input, { id: "titre", placeholder: "Ex: Syst\u00E8me de gestion de biblioth\u00E8que num\u00E9rique", value: titrePropose, onChange: (e) => setTitrePropose(e.target.value), className: "w-full" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Description *" }), _jsx(Textarea, { id: "description", placeholder: "D\u00E9crivez votre sujet de m\u00E9moire en d\u00E9tail. Incluez les objectifs, la m\u00E9thodologie pr\u00E9vue, et les technologies envisag\u00E9es...", value: descriptionProposee, onChange: (e) => setDescriptionProposee(e.target.value), className: "min-h-[120px]", rows: 5 }), _jsx("p", { className: "text-xs text-gray-500", children: "Minimum 50 caract\u00E8res. D\u00E9crivez clairement votre sujet et son int\u00E9r\u00EAt." })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => {
                                                                                setIsDialogOpen(false);
                                                                                setTitrePropose('');
                                                                                setDescriptionProposee('');
                                                                            }, children: "Annuler" }), _jsx(Button, { onClick: handleProposerSujet, disabled: !titrePropose.trim() || !descriptionProposee.trim() || descriptionProposee.trim().length < 50 || isProposing, children: isProposing ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }), "Envoi en cours..."] })) : ('Proposer le sujet') })] })] })] })] })), estSuiveur && sujetSelectionne && (_jsxs("div", { className: "p-4 bg-white border border-gray-200 rounded-lg shadow-sm", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Sujet s\u00E9lectionn\u00E9 par votre bin\u00F4me :" }), _jsx("p", { className: "text-sm font-medium text-primary", children: sujetSelectionne.titre }), _jsx("p", { className: "text-xs text-gray-600 mt-1 line-clamp-3", children: sujetSelectionne.description })] })), !demandeAcceptee && (_jsx("div", { className: "space-y-4", children: isLoading ? (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(Loader2, { className: "h-8 w-8 mx-auto mb-4 animate-spin text-primary" }), _jsx("p", { className: "text-gray-600", children: "Chargement des sujets..." })] }) })) : error ? (_jsx(Card, { className: "border-red-200 bg-red-50", children: _jsxs(CardContent, { className: "py-8 text-center", children: [_jsx("p", { className: "text-red-600", children: error }), _jsx(Button, { variant: "outline", className: "mt-4", onClick: () => window.location.reload(), children: "R\u00E9essayer" })] }) })) : sujetsFiltres.length > 0 ? (sujetsFiltres.map((sujet, index) => (_jsx(Card, { className: `cursor-pointer transition-all ${(sujetSelectionne === null || sujetSelectionne === void 0 ? void 0 : sujetSelectionne.id) === sujet.id
                                                    ? 'border-primary border-2 bg-primary-50'
                                                    : 'hover:border-primary hover:shadow-md'}`, onClick: () => setSujetSelectionne(sujet), children: _jsx(CardContent, { className: "p-4", children: _jsx("div", { className: "flex items-start justify-between", children: _jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-start gap-3 mb-2", children: [_jsx("div", { className: `mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${(sujetSelectionne === null || sujetSelectionne === void 0 ? void 0 : sujetSelectionne.id) === sujet.id
                                                                            ? 'border-primary bg-primary'
                                                                            : 'border-gray-300'}`, children: (sujetSelectionne === null || sujetSelectionne === void 0 ? void 0 : sujetSelectionne.id) === sujet.id && (_jsx(CheckCircle, { className: "h-4 w-4 text-white" })) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-start justify-between mb-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 flex-1", children: sujet.titre }), _jsx(Button, { variant: "ghost", size: "sm", className: "ml-2 h-8 w-8 p-0", onClick: (e) => handleConsulterSujet(sujet, e), title: "Consulter les d\u00E9tails", children: _jsx(Eye, { className: "h-4 w-4 text-primary" }) })] }), _jsx("p", { className: "text-sm text-gray-600 mb-3 line-clamp-2", children: sujet.description }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Badge, { variant: "outline", children: sujet.domaine }), !sujet.estDisponible && (_jsx(Badge, { variant: "secondary", className: "bg-primary-100 text-primary-800 border-primary-300", children: "En attente de validation" })), sujet.encadrantPropose && (_jsxs(Badge, { variant: "outline", children: ["Professeur: ", sujet.encadrantPropose.prenom, " ", sujet.encadrantPropose.nom] }))] })] })] }) }) }) }) }, `${sujet.id}-${index}`)))) : (_jsx(Card, { children: _jsx(CardContent, { className: "py-12 text-center", children: _jsx("p", { className: "text-gray-600", children: searchQuery ? 'Aucun sujet trouvé pour votre recherche' : 'Aucun sujet disponible' }) }) })) })), sujetSelectionne && !demandeAcceptee && !estSuiveur && (_jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: handleValider, className: "gap-2", children: ["Valider et continuer", _jsx(ArrowRight, { className: "h-4 w-4" })] }) })), (demandeAcceptee || estSuiveur) && (_jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "bg-blue-100 rounded-full p-2", children: _jsx(Bell, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-blue-900 mb-1", children: estSuiveur ? 'Mode observation' : 'Demande de binôme acceptée' }), _jsx("p", { className: "text-xs text-blue-700", children: estSuiveur
                                                                    ? "Votre binôme est responsable de la progression du dossier."
                                                                    : `Vous avez accepté une demande de binôme de ${demandeAcceptee === null || demandeAcceptee === void 0 ? void 0 : demandeAcceptee.demandeurNom}. C'est votre binôme qui a choisi le sujet et qui doit continuer le pipeline.` })] })] }) }))] }), _jsx(TabsContent, { value: "demandes", className: "space-y-4 mt-6", children: demandesEnAttente.length > 0 ? (_jsx("div", { className: "space-y-3", children: demandesEnAttente.map((proposition, index) => (_jsx(Card, { className: "border-primary-200 bg-primary-50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "flex items-center gap-2 mb-2", children: _jsx(Badge, { variant: "secondary", className: "bg-primary-100 text-primary-800 border-primary-300", children: "Demande re\u00E7ue" }) }), _jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-2", children: _jsx(Users, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: proposition.demandeurNom }), _jsx("p", { className: "text-sm text-gray-600", children: proposition.demandeurEmail }), _jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [_jsx(Badge, { variant: "outline", children: proposition.demandeurMatricule }), _jsx(Badge, { variant: "outline", children: proposition.demandeurFiliere })] })] })] }), _jsx("div", { className: "mt-3 p-3 bg-white rounded-lg border border-primary-200", children: _jsx("div", { className: "flex items-start gap-2", children: _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-xs font-medium text-gray-500 mb-1", children: "Sujet propos\u00E9 :" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: proposition.sujetTitre }), proposition.sujetDescription && (_jsx("p", { className: "text-xs text-gray-600 mt-1", children: proposition.sujetDescription }))] }) }) }), proposition.message && (_jsx("div", { className: "mt-3 p-3 bg-white rounded-lg border border-primary-200", children: _jsx("p", { className: "text-sm text-gray-700", children: proposition.message }) })), _jsxs("div", { className: "flex items-center gap-2 mt-3 text-xs text-gray-500", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsxs("span", { children: ["Propos\u00E9 le ", formatDate(proposition.dateDemande)] })] })] }), _jsxs("div", { className: "flex flex-col gap-2 ml-4", children: [_jsxs(Button, { size: "sm", onClick: () => handleAccepterDemande(proposition), className: "gap-2", disabled: !!demandeAcceptee, children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Accepter"] }), _jsxs(Button, { size: "sm", variant: "outline", onClick: () => handleRefuserDemande(proposition), className: "gap-2", children: [_jsx(XCircle, { className: "h-4 w-4" }), "Refuser"] })] })] }) }) }, `${proposition.idDemande}-${index}`))) })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(Bell, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-600", children: "Aucune demande re\u00E7ue" })] }) })) })] }) })] }), _jsx(Dialog, { open: isConsultDialogOpen, onOpenChange: setIsConsultDialogOpen, children: _jsx(DialogContent, { className: "sm:max-w-[700px] max-h-[90vh] overflow-y-auto", children: sujetConsulte && (_jsxs(_Fragment, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { className: "text-2xl", children: sujetConsulte.titre }), _jsx(DialogDescription, { children: "D\u00E9tails complets du sujet de m\u00E9moire" })] }), _jsxs("div", { className: "space-y-6 py-4", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Badge, { variant: "outline", className: "text-base px-3 py-1", children: sujetConsulte.domaine }), !sujetConsulte.estDisponible && (_jsx(Badge, { variant: "secondary", className: "bg-primary-100 text-primary-800 border-primary-300", children: "En attente de validation" })), sujetConsulte.estDisponible && (_jsx(Badge, { variant: "default", className: "bg-primary text-white", children: "Disponible" }))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BookOpen, { className: "h-5 w-5 text-primary" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Description" })] }), _jsx("div", { className: "bg-gray-50 rounded-lg p-4", children: _jsx("p", { className: "text-gray-700 whitespace-pre-line leading-relaxed", children: sujetConsulte.description }) })] }), sujetConsulte.attentes && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Target, { className: "h-5 w-5 text-primary" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Attentes et pr\u00E9requis" })] }), _jsx("div", { className: "bg-primary-50 border border-primary-200 rounded-lg p-4", children: _jsx("p", { className: "text-gray-700 whitespace-pre-line leading-relaxed", children: sujetConsulte.attentes }) })] })), sujetConsulte.encadrantPropose && (_jsxs("div", { className: "space-y-2", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Professeur" }), _jsx("div", { className: "bg-gray-50 rounded-lg p-4", children: _jsxs("p", { className: "text-gray-700", children: [_jsxs("span", { className: "font-medium", children: [sujetConsulte.encadrantPropose.prenom, " ", sujetConsulte.encadrantPropose.nom] }), _jsx("br", {}), _jsx("span", { className: "text-sm text-gray-600", children: sujetConsulte.encadrantPropose.email })] }) })] }))] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsConsultDialogOpen(false), children: "Fermer" }), _jsxs(Button, { onClick: () => {
                                            setSujetSelectionne(sujetConsulte);
                                            setIsConsultDialogOpen(false);
                                        }, className: "gap-2", children: ["S\u00E9lectionner ce sujet", _jsx(CheckCircle, { className: "h-4 w-4" })] })] })] })) }) }), _jsx(Dialog, { open: showConfirmAccept, onOpenChange: setShowConfirmAccept, children: _jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Confirmer l'acceptation de la demande" }), _jsx(DialogDescription, { children: "\u00CAtes-vous s\u00FBr de vouloir accepter cette demande de bin\u00F4me ?" })] }), demandeAConfirmer && (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "p-4 bg-primary-50 border border-primary-200 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: demandeAConfirmer.demandeurNom }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: demandeAConfirmer.demandeurEmail }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-gray-500 mb-1", children: "Sujet propos\u00E9 :" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: demandeAConfirmer.sujetTitre })] }), demandeAConfirmer.message && (_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-gray-500 mb-1", children: "Message :" }), _jsx("p", { className: "text-sm text-gray-700", children: demandeAConfirmer.message })] }))] })] }), _jsx("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-blue-900", children: [_jsx("strong", { children: "Important :" }), " En acceptant cette demande, vous ne pourrez plus choisir un sujet vous-m\u00EAme. C'est votre bin\u00F4me qui a choisi le sujet et qui continuera le pipeline (choix de l'encadrant, etc.)."] }) })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowConfirmAccept(false);
                                        setPropositionAConfirmer(null);
                                    }, children: "Annuler" }), _jsxs(Button, { onClick: handleConfirmAccept, className: "gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Confirmer l'acceptation"] })] })] }) })] }));
};
export default EtapeChoixSujet;
