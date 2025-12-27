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
import { Users, Search, UserPlus, ArrowRight, CheckCircle, XCircle, Bell, Clock, Send, UserCheck, UserX, AlertCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import { useAuth } from '../../../../contexts/AuthContext';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';
import demandeBinomeService from '../../../../services/demandeBinome.service';
import dossierService from '../../../../services/dossier.service';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '../../../../components/ui/dialog';
const EtapeChoixBinome = ({ dossier, onComplete, estSuiveur = false }) => {
    var _a;
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [binomeSelectionne, setBinomeSelectionne] = useState(null);
    const [optionChoisie, setOptionChoisie] = useState('sans');
    const [activeTab, setActiveTab] = useState('demandes');
    const [activeSousTab, setActiveSousTab] = useState('envoyer');
    const [propositionAConfirmer, setPropositionAConfirmer] = useState(null);
    const [showConfirmAccept, setShowConfirmAccept] = useState(false);
    // États pour les données chargées depuis l'API
    const [candidatsDisponibles, setCandidatsDisponibles] = useState([]);
    const [demandesEnvoyees, setDemandesEnvoyees] = useState([]);
    const [propositionsRecues, setPropositionsRecues] = useState([]);
    const [isLoadingCandidats, setIsLoadingCandidats] = useState(true);
    const [isLoadingDemandes, setIsLoadingDemandes] = useState(true);
    const [error, setError] = useState(null);
    // Récupérer le sujet choisi directement depuis les données du dossier
    const sujetChoisi = useMemo(() => {
        // Le sujet est stocké dans le dossier lui-même (pas de localStorage)
        if (dossier.titre && dossier.titre !== 'Nouveau dossier de mémoire') {
            return {
                titre: dossier.titre,
                description: dossier.description
            };
        }
        return null;
    }, [dossier.titre, dossier.description]);
    const [etudiantSelectionnePourDemande, setEtudiantSelectionnePourDemande] = useState(null);
    const [messageDemande, setMessageDemande] = useState('');
    const [showDialogDemande, setShowDialogDemande] = useState(false);
    // Charger les candidats disponibles depuis l'API
    useEffect(() => {
        const fetchCandidatsDisponibles = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return;
            try {
                setIsLoadingCandidats(true);
                // Passer l'ID du candidat courant pour l'exclure des résultats
                const candidats = yield dossierService.getCandidatsDisponibles(user.id);
                // Mapper vers le format BinomeOption (l'API retourne des DossierResponse)
                const binomeOptions = candidats
                    .map((c) => ({
                    id: c.id,
                    nom: c.nom || '',
                    prenom: c.prenom || '',
                    email: c.email || '',
                    numeroMatricule: c.matricule || c.etudiantId || '',
                    niveau: 'LICENCE_3',
                    filiere: 'GENIE_LOGICIEL',
                    departement: 'Informatique'
                }));
                setCandidatsDisponibles(binomeOptions);
            }
            catch (err) {
                console.error('Erreur lors du chargement des candidats disponibles:', err);
                setError('Erreur lors du chargement des candidats disponibles');
            }
            finally {
                setIsLoadingCandidats(false);
            }
        });
        fetchCandidatsDisponibles();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // Charger les demandes de binôme depuis l'API
    useEffect(() => {
        const fetchDemandes = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return;
            try {
                setIsLoadingDemandes(true);
                // Charger les demandes envoyées par cet utilisateur
                const envoyees = yield demandeBinomeService.getDemandesEnvoyees(user.id);
                // Charger les demandes reçues par cet utilisateur
                const recues = yield demandeBinomeService.getDemandesRecues(user.id);
                // Mapper les demandes envoyées vers le format DemandeBinome
                const demandesMappees = envoyees.map((d) => ({
                    id: d.idDemande,
                    etudiantDestinataire: {
                        id: d.destinataireId,
                        nom: d.destinataireNom || 'Inconnu',
                        prenom: d.destinatairePrenom || '',
                        email: d.destinataireEmail || '',
                        numeroMatricule: '',
                        niveau: 'Licence 3',
                        filiere: 'Génie Logiciel',
                        departement: 'Département Informatique'
                    },
                    dateDemande: new Date(d.dateDemande),
                    message: d.message,
                    dossierMemoire: {
                        id: d.dossierDestinataireId,
                        titre: d.sujetTitre || 'Sujet non spécifié'
                    },
                    statut: d.statut === 'EN_ATTENTE' ? 'en_attente' : d.statut === 'ACCEPTEE' ? 'acceptee' : 'refusee'
                }));
                setDemandesEnvoyees(demandesMappees);
                // Mapper les demandes reçues vers le format PropositionBinome
                const propositionsMappees = recues.map((d) => ({
                    id: d.idDemande,
                    etudiant: {
                        id: d.demandeurId,
                        nom: d.demandeurNom || 'Inconnu',
                        prenom: d.demandeurPrenom || '',
                        email: d.demandeurEmail || '',
                        numeroMatricule: d.demandeurMatricule || '',
                        niveau: 'Licence 3',
                        filiere: 'Génie Logiciel',
                        departement: 'Département Informatique'
                    },
                    dateProposition: new Date(d.dateDemande),
                    message: d.message,
                    sujetChoisi: {
                        id: d.dossierDemandeurId,
                        titre: d.sujetTitre || 'Sujet proposé',
                        description: d.sujetDescription || ''
                    },
                    statut: d.statut === 'EN_ATTENTE' ? 'en_attente' : d.statut === 'ACCEPTEE' ? 'acceptee' : 'refusee'
                }));
                setPropositionsRecues(propositionsMappees);
            }
            catch (err) {
                console.error('Erreur lors du chargement des demandes de binôme:', err);
            }
            finally {
                setIsLoadingDemandes(false);
            }
        });
        fetchDemandes();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // Filtrer les étudiants selon la recherche
    const etudiantsFiltres = useMemo(() => {
        return candidatsDisponibles.filter(etudiant => {
            const matchesSearch = `${etudiant.prenom} ${etudiant.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                etudiant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                etudiant.numeroMatricule.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [candidatsDisponibles, searchQuery]);
    // Trouver la demande en cours (la plus récente en attente ou acceptée)
    const demandeEnCours = useMemo(() => {
        const demandesActives = demandesEnvoyees.filter(d => d.statut === 'en_attente' || d.statut === 'acceptee');
        if (demandesActives.length === 0)
            return null;
        // Retourner la plus récente
        return demandesActives.sort((a, b) => b.dateDemande.getTime() - a.dateDemande.getTime())[0];
    }, [demandesEnvoyees]);
    // Si une demande existe et est en attente ou acceptée, afficher le sous-onglet état
    useEffect(() => {
        if (activeTab === 'demandes') {
            if (demandeEnCours && (demandeEnCours.statut === 'en_attente' || demandeEnCours.statut === 'acceptee')) {
                setActiveSousTab('etat');
            }
            else if (demandeEnCours && demandeEnCours.statut === 'refusee') {
                // Si refusé, retourner à l'onglet envoyer
                setActiveSousTab('envoyer');
            }
        }
    }, [demandeEnCours, activeTab]);
    // Vérifier si l'étudiant a déjà un binôme accepté
    const binomeAccepte = useMemo(() => {
        const propositionAcceptee = propositionsRecues.find(p => p.statut === 'acceptee');
        const demandeAcceptee = demandesEnvoyees.find(d => d.statut === 'acceptee');
        return (propositionAcceptee === null || propositionAcceptee === void 0 ? void 0 : propositionAcceptee.etudiant) || (demandeAcceptee === null || demandeAcceptee === void 0 ? void 0 : demandeAcceptee.etudiantDestinataire) || binomeSelectionne;
    }, [propositionsRecues, demandesEnvoyees, binomeSelectionne]);
    // Vérifier si l'étudiant est le "leader" du binôme (celui qui a choisi le sujet et continue le pipeline)
    // Si on accepte une demande reçue, on n'est pas le leader, c'est celui qui a envoyé la demande
    const estLeaderBinome = useMemo(() => {
        const propositionAcceptee = propositionsRecues.find(p => p.statut === 'acceptee');
        const demandeAcceptee = demandesEnvoyees.find(d => d.statut === 'acceptee');
        // Si on a accepté une proposition reçue, on n'est pas le leader
        if (propositionAcceptee) {
            return false;
        }
        // Si notre demande envoyée a été acceptée, on est le leader
        if (demandeAcceptee) {
            return true;
        }
        // Si on a sélectionné un binôme manuellement, on est le leader
        if (binomeSelectionne) {
            return true;
        }
        return false;
    }, [propositionsRecues, demandesEnvoyees, binomeSelectionne]);
    const handleValider = () => {
        if (optionChoisie === 'sans') {
            // Si l'étudiant choisit de travailler seul, il peut continuer
            // TODO: Appel API pour enregistrer le choix
            console.log('Choix binôme: sans binôme');
            onComplete();
        }
        else if (optionChoisie === 'avec' && binomeAccepte) {
            // Si l'étudiant choisit de travailler en binôme, il doit avoir un binôme accepté
            // Mais seulement s'il est le leader (celui qui a choisi le sujet)
            // Si on a accepté une demande reçue, on ne continue pas, c'est l'autre qui continue
            if (estLeaderBinome) {
                // TODO: Appel API pour enregistrer le choix
                console.log('Choix binôme:', binomeAccepte);
                onComplete();
            }
            else {
                // Si on n'est pas le leader, on ne peut pas continuer le pipeline
                // L'autre personne (qui a envoyé la demande) doit continuer
                console.log('Binôme accepté, mais vous n\'êtes pas le leader. C\'est votre binôme qui doit continuer le pipeline.');
                // TODO: Afficher un message à l'utilisateur
            }
        }
        // Sinon, on ne fait rien (le bouton est désactivé)
    };
    const handleAccepterProposition = (proposition) => {
        // Afficher le modal de confirmation
        setPropositionAConfirmer(proposition);
        setShowConfirmAccept(true);
    };
    const handleConfirmAccept = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!propositionAConfirmer)
            return;
        try {
            yield demandeBinomeService.accepterDemande(propositionAConfirmer.id);
            setPropositionsRecues(prev => prev.map(p => p.id === propositionAConfirmer.id
                ? Object.assign(Object.assign({}, p), { statut: 'acceptee' }) : p.statut === 'acceptee'
                ? Object.assign(Object.assign({}, p), { statut: 'refusee' }) : p));
            // Refuser toutes les autres demandes envoyées en attente
            setDemandesEnvoyees(prev => prev.map(d => d.statut === 'en_attente'
                ? Object.assign(Object.assign({}, d), { statut: 'refusee' }) : d));
            setBinomeSelectionne(propositionAConfirmer.etudiant);
            setOptionChoisie('avec');
            setShowConfirmAccept(false);
            setPropositionAConfirmer(null);
        }
        catch (err) {
            console.error('Erreur lors de l\'acceptation de la proposition:', err);
            alert('Une erreur est survenue lors de l\'acceptation.');
        }
    });
    const handleRefuserProposition = (proposition) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield demandeBinomeService.refuserDemande(proposition.id);
            setPropositionsRecues(prev => prev.map(p => p.id === proposition.id
                ? Object.assign(Object.assign({}, p), { statut: 'refusee' }) : p));
        }
        catch (err) {
            console.error('Erreur lors du refus de la proposition:', err);
        }
    });
    const handleEnvoyerDemande = () => __awaiter(void 0, void 0, void 0, function* () {
        if (etudiantSelectionnePourDemande && user) {
            if (!sujetChoisi) {
                alert('Vous devez d\'abord choisir un sujet avant d\'envoyer une demande de binôme.');
                return;
            }
            try {
                const nouvelleDemandeMock = yield demandeBinomeService.creerDemande({
                    demandeurId: user.id,
                    demandeurEmail: user.email,
                    demandeurNom: user.name,
                    destinataireId: etudiantSelectionnePourDemande.id,
                    destinataireEmail: etudiantSelectionnePourDemande.email,
                    destinataireNom: `${etudiantSelectionnePourDemande.prenom} ${etudiantSelectionnePourDemande.nom}`,
                    dossierDemandeurId: dossier.id,
                    dossierDestinataireId: 0, // Inconnu à ce stade
                    sujetTitre: sujetChoisi.titre,
                    sujetDescription: sujetChoisi.description,
                    message: messageDemande.trim()
                });
                const m = {
                    id: nouvelleDemandeMock.idDemande,
                    etudiantDestinataire: etudiantSelectionnePourDemande,
                    dateDemande: new Date(nouvelleDemandeMock.dateDemande),
                    message: nouvelleDemandeMock.message,
                    dossierMemoire: {
                        id: dossier.id,
                        titre: sujetChoisi.titre
                    },
                    statut: 'en_attente'
                };
                setDemandesEnvoyees(prev => {
                    const demandesAnnulees = prev.map(d => d.statut === 'en_attente' ? Object.assign(Object.assign({}, d), { statut: 'refusee' }) : d);
                    return [...demandesAnnulees, m];
                });
                setShowDialogDemande(false);
                setEtudiantSelectionnePourDemande(null);
                setMessageDemande('');
                setActiveSousTab('etat');
            }
            catch (err) {
                console.error('Erreur lors de l\'envoi de la demande:', err);
            }
        }
    });
    const handleAnnulerDemandeEnCours = () => __awaiter(void 0, void 0, void 0, function* () {
        if (demandeEnCours && demandeEnCours.statut === 'en_attente') {
            try {
                yield demandeBinomeService.annulerDemande(demandeEnCours.id);
                setDemandesEnvoyees(prev => prev.filter(d => d.id !== demandeEnCours.id));
                // Retourner au sous-onglet envoyer
                setActiveSousTab('envoyer');
            }
            catch (err) {
                console.error('Erreur lors de l\'annulation de la demande:', err);
            }
        }
    });
    const handleAnnulerDemande = (demande) => __awaiter(void 0, void 0, void 0, function* () {
        if (demande.statut === 'en_attente') {
            try {
                yield demandeBinomeService.annulerDemande(demande.id);
                setDemandesEnvoyees(prev => prev.filter(d => d.id !== demande.id));
            }
            catch (err) {
                console.error('Erreur lors de l\'annulation:', err);
            }
        }
    });
    const propositionsEnAttente = useMemo(() => {
        return propositionsRecues.filter(p => p.statut === 'en_attente');
    }, [propositionsRecues]);
    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };
    // Filtrer les étudiants qui ont déjà reçu une demande
    const etudiantsDisponiblesPourDemande = useMemo(() => {
        // Exclure seulement ceux à qui on a déjà envoyé une demande
        const idsAvecDemande = demandesEnvoyees.map(d => d.etudiantDestinataire.id);
        return etudiantsFiltres.filter(e => !idsAvecDemande.includes(e.id));
    }, [etudiantsFiltres, demandesEnvoyees]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-5 w-5 text-primary" }), "\u00C9tape 2 : Choix du bin\u00F4me"] }), _jsx(CardDescription, { children: "Choisissez si vous souhaitez travailler seul ou en bin\u00F4me" })] }), _jsxs(CardContent, { children: [_jsxs(Tabs, { defaultValue: optionChoisie, onValueChange: (value) => {
                                    // Empêcher de passer à "Travailler seul" si un binôme est accepté
                                    if (value === 'sans' && binomeAccepte) {
                                        return;
                                    }
                                    setOptionChoisie(value);
                                }, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsxs(TabsTrigger, { value: "sans", className: "gap-2", disabled: !!binomeAccepte, children: [_jsx(UserX, { className: "h-4 w-4" }), "Travailler seul"] }), _jsxs(TabsTrigger, { value: "avec", className: "gap-2", children: [_jsx(UserPlus, { className: "h-4 w-4" }), "Travailler en bin\u00F4me"] })] }), _jsxs(TabsContent, { value: "avec", className: "space-y-6 mt-6", children: [binomeAccepte && (_jsx(Card, { className: "border-green-200 bg-green-50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-green-100 rounded-full p-2", children: _jsx(UserCheck, { className: "h-5 w-5 text-green-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-900", children: ["Bin\u00F4me accept\u00E9 : ", binomeAccepte.prenom, " ", binomeAccepte.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: binomeAccepte.email })] }), _jsx(Badge, { variant: "default", className: "bg-green-600 text-white", children: "Accept\u00E9" })] }) }) })), _jsxs(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), children: [_jsx(TabsList, { className: "w-auto", children: _jsxs(TabsTrigger, { value: "demandes", className: "gap-2", children: [_jsx(Send, { className: "h-4 w-4" }), "Mes demandes", demandeEnCours && demandeEnCours.statut === 'en_attente' && (_jsx(Badge, { variant: "secondary", className: "ml-2 bg-yellow-100 text-yellow-800", children: "1" }))] }) }), _jsx(TabsContent, { value: "demandes", className: "space-y-6 mt-6", children: _jsxs(Tabs, { value: activeSousTab, onValueChange: (value) => setActiveSousTab(value), children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsxs(TabsTrigger, { value: "envoyer", className: "gap-2", disabled: !!demandeEnCours && (demandeEnCours.statut === 'en_attente' || demandeEnCours.statut === 'acceptee'), children: [_jsx(Send, { className: "h-4 w-4" }), "Envoyer une demande"] }), _jsxs(TabsTrigger, { value: "etat", className: "gap-2", disabled: !demandeEnCours, children: [_jsx(Clock, { className: "h-4 w-4" }), "\u00C9tat de la demande", demandeEnCours && demandeEnCours.statut === 'en_attente' && (_jsx(Badge, { variant: "secondary", className: "ml-2 bg-yellow-100 text-yellow-800", children: "1" }))] })] }), _jsx(TabsContent, { value: "envoyer", className: "space-y-4 mt-4", children: !binomeAccepte ? (_jsxs(_Fragment, { children: [sujetChoisi ? (_jsx(Card, { className: "border-primary-200 bg-primary-50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-2", children: _jsx(BookOpen, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-1", children: "Sujet choisi" }), _jsx("p", { className: "text-sm text-gray-700", children: sujetChoisi.titre }), sujetChoisi.description && (_jsx("p", { className: "text-xs text-gray-600 mt-1", children: sujetChoisi.description })), _jsx("p", { className: "text-xs text-primary-600 mt-2", children: "Ce sujet sera inclus dans votre demande de bin\u00F4me" })] })] }) }) })) : (_jsx(Card, { className: "border-yellow-200 bg-yellow-50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-yellow-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-yellow-900 mb-1", children: "Aucun sujet choisi" }), _jsx("p", { className: "text-sm text-yellow-700", children: "Vous devez d'abord choisir un sujet dans l'\u00E9tape pr\u00E9c\u00E9dente avant d'envoyer une demande de bin\u00F4me." })] })] }) }) })), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx(Input, { type: "text", placeholder: "Rechercher un \u00E9tudiant par nom, email ou matricule...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] }), _jsx("div", { className: "space-y-3", children: etudiantsDisponiblesPourDemande.length > 0 ? (etudiantsDisponiblesPourDemande.map((etudiant) => (_jsx(Card, { className: "cursor-pointer transition-all hover:border-primary hover:shadow-md", onClick: () => {
                                                                                        setEtudiantSelectionnePourDemande(etudiant);
                                                                                        setShowDialogDemande(true);
                                                                                    }, children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-3", children: _jsx(Users, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-gray-900", children: [etudiant.prenom, " ", etudiant.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: etudiant.email }), _jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [_jsx(Badge, { variant: "outline", children: etudiant.niveau }), _jsx(Badge, { variant: "outline", children: etudiant.filiere }), _jsx(Badge, { variant: "outline", children: etudiant.departement })] })] })] }), _jsxs(Button, { size: "sm", variant: "outline", className: "gap-2", children: [_jsx(Send, { className: "h-4 w-4" }), "Envoyer demande"] })] }) }) }, etudiant.id)))) : (_jsx(Card, { children: _jsx(CardContent, { className: "py-8 text-center", children: _jsx("p", { className: "text-gray-600", children: searchQuery ? 'Aucun étudiant trouvé' : 'Aucun étudiant disponible' }) }) })) })] })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "py-8 text-center", children: [_jsx(UserCheck, { className: "h-12 w-12 mx-auto mb-4 text-green-600" }), _jsx("p", { className: "text-gray-600", children: "Vous avez d\u00E9j\u00E0 un bin\u00F4me accept\u00E9. Vous ne pouvez pas envoyer d'autres demandes." })] }) })) }), _jsx(TabsContent, { value: "etat", className: "space-y-6 mt-6", children: demandeEnCours ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 bg-primary-50 border border-primary-200 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-2", children: _jsx(Send, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-1", children: ["Demande envoy\u00E9e \u00E0 ", demandeEnCours.etudiantDestinataire.prenom, " ", demandeEnCours.etudiantDestinataire.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: demandeEnCours.etudiantDestinataire.email }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Envoy\u00E9e le ", formatDate(demandeEnCours.dateDemande)] })] }), demandeEnCours.statut === 'en_attente' && (_jsxs(Badge, { variant: "secondary", className: "bg-yellow-100 text-yellow-800 border-yellow-300", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), "En attente"] })), demandeEnCours.statut === 'acceptee' && (_jsxs(Badge, { variant: "default", className: "bg-green-600 text-white", children: [_jsx(CheckCircle, { className: "h-3 w-3 mr-1" }), "Accept\u00E9e"] })), demandeEnCours.statut === 'refusee' && (_jsxs(Badge, { variant: "secondary", className: "bg-red-100 text-red-800 border-red-300", children: [_jsx(XCircle, { className: "h-3 w-3 mr-1" }), "Refus\u00E9e"] }))] }) }), _jsxs("div", { className: "p-4 bg-gray-50 border border-gray-200 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Sujet choisi" }), _jsx("p", { className: "text-sm text-gray-700", children: (_a = demandeEnCours.dossierMemoire) === null || _a === void 0 ? void 0 : _a.titre })] }), demandeEnCours.statut === 'en_attente' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Clock, { className: "h-5 w-5 text-blue-600 mt-0.5" }), _jsx("div", { className: "flex-1", children: _jsx("p", { className: "text-sm text-blue-900", children: "Votre demande est en cours d'examen par l'\u00E9tudiant. Vous recevrez une notification d\u00E8s qu'une r\u00E9ponse sera disponible." }) })] }) }), _jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: handleAnnulerDemandeEnCours, variant: "outline", className: "gap-2", children: [_jsx(XCircle, { className: "h-4 w-4" }), "Annuler la demande"] }) })] })), demandeEnCours.statut === 'acceptee' && (_jsx("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CheckCircle, { className: "h-5 w-5 text-green-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-green-900 mb-1", children: "Demande accept\u00E9e !" }), _jsx("p", { className: "text-sm text-green-700", children: "Votre demande de bin\u00F4me a \u00E9t\u00E9 accept\u00E9e. Vous pouvez maintenant passer \u00E0 l'\u00E9tape suivante." })] })] }) })), demandeEnCours.statut === 'refusee' && (_jsx("div", { className: "p-4 bg-orange-50 border border-orange-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-orange-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-orange-900 mb-1", children: "Demande refus\u00E9e" }), _jsx("p", { className: "text-sm text-orange-700", children: "Vous pouvez envoyer une nouvelle demande \u00E0 un autre \u00E9tudiant en retournant \u00E0 l'onglet \"Envoyer une demande\"." })] })] }) }))] })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(Send, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-600", children: "Aucune demande en cours" }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Veuillez d'abord envoyer une demande dans l'onglet \"Envoyer une demande\"" })] }) })) })] }) })] })] }), _jsx(TabsContent, { value: "sans", className: "mt-6", children: _jsx(Card, { className: "border-primary-200 bg-primary-50", children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(UserX, { className: "h-16 w-16 mx-auto mb-4 text-primary" }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Travailler seul" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Vous avez choisi de travailler seul sur votre m\u00E9moire. Vous pouvez continuer sans bin\u00F4me." })] }) }) })] }), _jsxs("div", { className: "space-y-3 pt-6 border-t mt-6", children: [binomeAccepte && !estLeaderBinome && (_jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "bg-blue-100 rounded-full p-2", children: _jsx(Bell, { className: "h-5 w-5 text-blue-600" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-blue-900 mb-1", children: "Bin\u00F4me accept\u00E9" }), _jsxs("p", { className: "text-xs text-blue-700", children: ["Vous avez accept\u00E9 une demande de bin\u00F4me. C'est votre bin\u00F4me (", binomeAccepte.prenom, " ", binomeAccepte.nom, ") qui a choisi le sujet et qui doit continuer le pipeline. Vous serez inform\u00E9(e) des prochaines \u00E9tapes."] })] })] }) })), _jsx("div", { className: "flex justify-end", children: _jsxs(Button, { onClick: handleValider, disabled: (optionChoisie === 'avec' && (!binomeAccepte || !estLeaderBinome)) || estSuiveur, className: "gap-2", children: [estSuiveur ? 'Attente de progression' : 'Valider et continuer', _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] })] })] }), _jsx(Dialog, { open: showDialogDemande, onOpenChange: setShowDialogDemande, children: _jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Envoyer une demande de bin\u00F4me" }), _jsxs(DialogDescription, { children: ["Envoyez une demande \u00E0 ", etudiantSelectionnePourDemande === null || etudiantSelectionnePourDemande === void 0 ? void 0 : etudiantSelectionnePourDemande.prenom, " ", etudiantSelectionnePourDemande === null || etudiantSelectionnePourDemande === void 0 ? void 0 : etudiantSelectionnePourDemande.nom] })] }), _jsxs("div", { className: "space-y-4 py-4", children: [sujetChoisi ? (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Votre sujet propos\u00E9" }), _jsxs("div", { className: "p-3 bg-primary-50 border border-primary-200 rounded-lg", children: [_jsx("p", { className: "font-medium text-gray-900", children: sujetChoisi.titre }), sujetChoisi.description && (_jsx("p", { className: "text-sm text-gray-600 mt-1", children: sujetChoisi.description }))] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["En envoyant cette demande, vous proposez \u00E0 ", etudiantSelectionnePourDemande === null || etudiantSelectionnePourDemande === void 0 ? void 0 : etudiantSelectionnePourDemande.prenom, " de travailler avec vous sur ce sujet."] })] })) : (_jsx("div", { className: "space-y-2", children: _jsxs("div", { className: "p-3 bg-yellow-50 border border-yellow-200 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-yellow-900", children: "\u26A0\uFE0F Aucun sujet choisi" }), _jsx("p", { className: "text-xs text-yellow-700 mt-1", children: "Vous devez d'abord choisir un sujet dans l'\u00E9tape pr\u00E9c\u00E9dente avant d'envoyer une demande de bin\u00F4me." })] }) })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "message", children: "Message (optionnel)" }), _jsx(Textarea, { id: "message", placeholder: "Ajoutez un message pour accompagner votre demande...", value: messageDemande, onChange: (e) => setMessageDemande(e.target.value), rows: 4 })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowDialogDemande(false);
                                        setMessageDemande('');
                                        setEtudiantSelectionnePourDemande(null);
                                    }, children: "Annuler" }), _jsxs(Button, { onClick: handleEnvoyerDemande, className: "gap-2", disabled: !sujetChoisi, children: [_jsx(Send, { className: "h-4 w-4" }), "Envoyer la demande"] })] })] }) }), _jsx(Dialog, { open: showConfirmAccept, onOpenChange: setShowConfirmAccept, children: _jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Confirmer l'acceptation de la demande" }), _jsx(DialogDescription, { children: "\u00CAtes-vous s\u00FBr de vouloir accepter cette demande de bin\u00F4me ?" })] }), propositionAConfirmer && (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "p-4 bg-primary-50 border border-primary-200 rounded-lg", children: [_jsxs("h4", { className: "font-semibold text-gray-900 mb-2", children: [propositionAConfirmer.etudiant.prenom, " ", propositionAConfirmer.etudiant.nom] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: propositionAConfirmer.etudiant.email }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-gray-500 mb-1", children: "Sujet propos\u00E9 :" }), _jsx("p", { className: "text-sm font-semibold text-gray-900", children: propositionAConfirmer.sujetChoisi.titre })] }), propositionAConfirmer.message && (_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-gray-500 mb-1", children: "Message :" }), _jsx("p", { className: "text-sm text-gray-700", children: propositionAConfirmer.message })] }))] })] }), _jsx("div", { className: "p-3 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-blue-900", children: [_jsx("strong", { children: "Important :" }), " En acceptant cette demande, vous ne pourrez plus choisir \"Travailler seul\" et c'est votre bin\u00F4me qui continuera le pipeline (choix de l'encadrant, etc.)."] }) })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowConfirmAccept(false);
                                        setPropositionAConfirmer(null);
                                    }, children: "Annuler" }), _jsxs(Button, { onClick: handleConfirmAccept, className: "gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Confirmer l'acceptation"] })] })] }) })] }));
};
export default EtapeChoixBinome;
