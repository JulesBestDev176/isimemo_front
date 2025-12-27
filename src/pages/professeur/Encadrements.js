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
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Inbox, Calendar, FileText, Clock, CheckCircle, XCircle, Search, Filter, X, AlertCircle, Settings, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { dossierService } from '../../services/dossier.service';
import { StatutDemandeEncadrement } from '../../models';
import { getAnneeAcademiqueCourante, isAnneeAcademiqueTerminee } from '../../utils/anneeAcademique';
import { getEncadrementsActifs, StatutEncadrement } from '../../models/dossier/Encadrement';
import { PanelTabs } from '../../components/panel-encadrant/PanelTabs';
import { MessageList } from '../../components/panel-encadrant/MessageList';
import { TacheCommuneList } from '../../components/panel-encadrant/TacheCommuneList';
import { SupervisionDashboard } from '../../components/panel-encadrant/SupervisionDashboard';
import { AddTacheModal } from '../../components/panel-encadrant/AddTacheModal';
import { SuiviEncadrement } from '../../components/panel-encadrant/SuiviEncadrement';
import { PrelectureList } from '../../components/panel-encadrant/PrelectureList';
import { PrelectureDetail } from '../../components/panel-encadrant/PrelectureDetail';
import { getDemandesPrelectureByPrelecteur, getDemandesPrelectureRejetees, validerPrelecture, rejeterPrelecture, StatutDemandePrelecture } from '../../models/dossier/DemandePrelecture';
import { createTicketForDossier, Priorite } from '../../models/dossier/Ticket';
import { getDossierById } from '../../models/dossier/DossierMemoire';
import { StatutDossierMemoire, EtapeDossier } from '../../models';
// Badge Component - Palette simplifiée (3 couleurs)
const Badge = ({ children, variant = 'neutral' }) => {
    const variants = {
        success: 'bg-green-50 text-green-700 border border-green-200',
        info: 'bg-blue-50 text-blue-700 border border-blue-200',
        neutral: 'bg-gray-50 text-gray-700 border border-gray-200'
    };
    return (_jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${variants[variant]}`, children: children }));
};
// Formatage des dates
const formatDate = (date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
// Obtenir l'année académique actuelle
const getCurrentAnneeAcademique = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed
    // Si on est entre janvier et août, on est dans l'année académique précédente
    // Sinon, on est dans la nouvelle année académique
    if (currentMonth >= 1 && currentMonth <= 8) {
        return `${currentYear - 1}-${currentYear}`;
    }
    else {
        return `${currentYear}-${currentYear + 1}`;
    }
};
// Tab Button Component
const TabButton = ({ children, isActive, onClick, icon, count }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-primary text-primary bg-white'
            : 'border-transparent text-slate-500 hover:text-primary-700 bg-slate-50'}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children, count !== undefined && (_jsx("span", { className: `ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-slate-200 text-slate-600'}`, children: count }))] }));
};
// Composant principal
const Encadrements = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('demandes');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatutDemande, setFilterStatutDemande] = useState('tous');
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [showRefuseModal, setShowRefuseModal] = useState(false);
    const [motifRefus, setMotifRefus] = useState('');
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [demandeDetails, setDemandeDetails] = useState(null);
    const [configEncadrement, setConfigEncadrement] = useState({
        illimite: false,
        maxCandidats: 5
    });
    // États pour le panel encadrant
    const [selectedEncadrement, setSelectedEncadrement] = useState(null);
    const [activePanelTab, setActivePanelTab] = useState('messages');
    const [showTacheModal, setShowTacheModal] = useState(false);
    const [selectedPrelecture, setSelectedPrelecture] = useState(null);
    const handleSaveConfig = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return;
        try {
            const response = yield fetch(`http://localhost:3001/api/encadrants/${user.id}/capacite`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ capaciteEncadrement: configEncadrement.maxCandidats })
            });
            if (response.ok) {
                console.log('✅ Capacité d\'encadrement mise à jour');
                setShowConfigModal(false);
            }
            else {
                console.error('❌ Erreur lors de la mise à jour de la capacité');
            }
        }
        catch (error) {
            console.error('❌ Erreur:', error);
        }
    });
    // Charger la configuration actuelle de l'encadrant
    React.useEffect(() => {
        const fetchConfig = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return;
            try {
                const response = yield fetch(`http://localhost:3001/api/encadrants/${user.id}`);
                if (response.ok) {
                    const encadrant = yield response.json();
                    setConfigEncadrement({
                        illimite: false,
                        maxCandidats: encadrant.capaciteEncadrement || 5
                    });
                }
            }
            catch (error) {
                console.error('❌ Erreur chargement config:', error);
            }
        });
        fetchConfig();
    }, [user]);
    // Messages - À récupérer depuis le backend
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    // Récupérer les messages quand un encadrement est sélectionné
    React.useEffect(() => {
        const fetchMessages = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!selectedEncadrement || !(user === null || user === void 0 ? void 0 : user.id)) {
                setMessages([]);
                return;
            }
            setLoadingMessages(true);
            try {
                const response = yield fetch(`http://localhost:3001/api/encadrements/${selectedEncadrement.anneeAcademique}/messages?encadrantId=${user.id}`);
                if (response.ok) {
                    const data = yield response.json();
                    console.log('📬 Messages récupérés:', data.length);
                    // Convertir le format backend vers le format frontend
                    // Tri par date croissante (plus anciens en haut, plus récents en bas)
                    const formattedMessages = data
                        .sort((a, b) => new Date(a.dateEnvoi).getTime() - new Date(b.dateEnvoi).getTime())
                        .map((msg) => ({
                        id: msg.id,
                        expediteur: msg.emetteurRole,
                        type: msg.typeMessage,
                        contenu: msg.contenu,
                        date: new Date(msg.dateEnvoi).toLocaleString('fr-FR'),
                        lu: msg.lu,
                        titre: msg.titre,
                        lienMeet: msg.lienMeet,
                        dateRendezVous: msg.dateRendezVous,
                        heureRendezVous: msg.heureRendezVous,
                        lieu: msg.lieu,
                        nomDocument: msg.nomDocument,
                        cheminDocument: msg.cheminDocument,
                        tailleDocument: msg.tailleDocument
                    }));
                    setMessages(formattedMessages);
                }
                else {
                    console.error('❌ Erreur récupération messages:', response.status);
                    setMessages([]);
                }
            }
            catch (error) {
                console.error('❌ Erreur:', error);
                setMessages([]);
            }
            finally {
                setLoadingMessages(false);
            }
        });
        fetchMessages();
    }, [selectedEncadrement, user]);
    // État pour les tâches
    const [taches, setTaches] = useState([]);
    const [loadingTaches, setLoadingTaches] = useState(false);
    // Récupérer les tâches depuis le backend
    React.useEffect(() => {
        const fetchTaches = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!selectedEncadrement || !(user === null || user === void 0 ? void 0 : user.id)) {
                setTaches([]);
                return;
            }
            setLoadingTaches(true);
            try {
                const response = yield fetch(`http://localhost:3001/api/encadrements/${selectedEncadrement.anneeAcademique}/taches?encadrantId=${user.id}`);
                if (response.ok) {
                    const data = yield response.json();
                    console.log('📋 Tâches récupérées:', data.length);
                    setTaches(data
                        .sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
                        .map((t) => ({
                        id: t.id,
                        titre: t.titre,
                        description: t.description,
                        dateCreation: t.dateCreation,
                        dateEcheance: t.dateEcheance,
                        priorite: t.priorite,
                        active: t.statut !== 'desactivee',
                        demandeId: t.demandeId,
                        assigneA: t.assigneA,
                        ordre: t.ordre || 0
                    })));
                }
                else {
                    console.error('❌ Erreur récupération tâches:', response.status);
                    setTaches([]);
                }
            }
            catch (error) {
                console.error('❌ Erreur:', error);
                setTaches([]);
            }
            finally {
                setLoadingTaches(false);
            }
        });
        fetchTaches();
    }, [selectedEncadrement, user]);
    // Année académique actuelle
    const anneeAcademiqueActuelle = useMemo(() => getCurrentAnneeAcademique(), []);
    // État pour les demandes d'encadrement
    const [demandes, setDemandes] = useState([]);
    const [loadingDemandes, setLoadingDemandes] = useState(true);
    // Récupérer les demandes d'encadrement depuis le backend
    React.useEffect(() => {
        const fetchDemandes = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id) || !(user === null || user === void 0 ? void 0 : user.estEncadrant)) {
                setDemandes([]);
                setLoadingDemandes(false);
                return;
            }
            try {
                console.log('🔍 Récupération demandes encadrement pour ID:', user.id);
                const response = yield fetch(`http://localhost:3001/api/demandes-encadrement/encadrant/${user.id}`);
                if (response.ok) {
                    const data = yield response.json();
                    console.log('✅ Demandes reçues:', data);
                    // Afficher toutes les demandes (pas de filtre par année académique)
                    setDemandes(data);
                }
                else {
                    console.error('❌ Erreur API demandes:', response.status);
                    setDemandes([]);
                }
            }
            catch (error) {
                console.error('❌ Erreur lors de la récupération des demandes:', error);
                setDemandes([]);
            }
            finally {
                setLoadingDemandes(false);
            }
        });
        fetchDemandes();
    }, [user, anneeAcademiqueActuelle]);
    // Récupérer tous les encadrements groupés par année académique
    // Un encadrement = toutes les demandes acceptées pour une année académique donnée
    const encadrements = useMemo(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id) || !(user === null || user === void 0 ? void 0 : user.estEncadrant))
            return [];
        const demandesAcceptees = demandes.filter(d => d.statut === StatutDemandeEncadrement.ACCEPTEE);
        // Grouper par année académique
        const groupedByYear = demandesAcceptees.reduce((acc, demande) => {
            var _a;
            const annee = ((_a = demande.dossierMemoire) === null || _a === void 0 ? void 0 : _a.anneeAcademique) || demande.anneeAcademique || anneeAcademiqueActuelle;
            if (!acc[annee]) {
                acc[annee] = [];
            }
            acc[annee].push(demande);
            return acc;
        }, {});
        // Convertir en tableau d'encadrements
        return Object.entries(groupedByYear).map(([annee, demandes]) => ({
            anneeAcademique: annee,
            demandes: demandes,
            nombreEtudiants: demandes.reduce((total, d) => {
                const candidats = d.candidats || (d.candidat ? [d.candidat] : []);
                return total + candidats.length;
            }, 0)
        }));
    }, [demandes, user, anneeAcademiqueActuelle]);
    // Récupérer l'encadrement actif (un encadrant ne peut avoir qu'un seul encadrement actif)
    const encadrementActif = useMemo(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id) || !(user === null || user === void 0 ? void 0 : user.estEncadrant))
            return undefined;
        const encadrementsActifs = getEncadrementsActifs(parseInt(user.id));
        return encadrementsActifs.length > 0 ? encadrementsActifs[0] : undefined;
    }, [user]);
    // Mock data - Dossiers étudiants
    const dossiersEtudiants = useMemo(() => {
        var _a;
        // Si l'encadrement a des candidats dans son dossier, les utiliser avec des données variées
        if (((_a = encadrementActif === null || encadrementActif === void 0 ? void 0 : encadrementActif.dossierMemoire) === null || _a === void 0 ? void 0 : _a.candidats) && encadrementActif.dossierMemoire.candidats.length > 0) {
            const titresMemoires = [
                'Système de recommandation basé sur l\'intelligence artificielle',
                'Application mobile de gestion de bibliothèque universitaire',
                'Analyse de données massives avec Apache Spark',
                'Plateforme de e-learning avec réalité virtuelle',
                'Système de détection de fraudes bancaires par machine learning'
            ];
            const statuts = [
                StatutDossierMemoire.EN_COURS,
                StatutDossierMemoire.EN_COURS,
                StatutDossierMemoire.EN_ATTENTE_VALIDATION,
                StatutDossierMemoire.EN_COURS, // Dossier 104 - Toutes les tâches terminées
                StatutDossierMemoire.EN_ATTENTE_VALIDATION // Dossier 105 - Pré-lecture effectuée
            ];
            const etapes = [
                EtapeDossier.REDACTION,
                EtapeDossier.DEPOT_INTERMEDIAIRE,
                EtapeDossier.DEPOT_FINAL,
                EtapeDossier.DEPOT_FINAL, // Dossier 104 - Prêt pour pré-lecture
                EtapeDossier.DEPOT_FINAL // Dossier 105 - Pré-lecture effectuée
            ];
            const progressions = [45, 60, 75, 100, 100]; // Dossiers 104 et 105 à 100%
            return encadrementActif.dossierMemoire.candidats.map((candidat, index) => {
                var _a;
                return ({
                    id: candidat.idCandidat,
                    etudiant: {
                        nom: candidat.nom,
                        prenom: candidat.prenom,
                        email: candidat.email || ''
                    },
                    dossierMemoire: {
                        id: (((_a = encadrementActif.dossierMemoire) === null || _a === void 0 ? void 0 : _a.idDossierMemoire) || 0) * 10 + candidat.idCandidat,
                        titre: titresMemoires[index % titresMemoires.length],
                        statut: statuts[index % statuts.length],
                        etape: etapes[index % etapes.length],
                        progression: progressions[index % progressions.length]
                    }
                });
            });
        }
        // Sinon, utiliser des données mock pour démonstration
        return [
            {
                id: 1,
                etudiant: {
                    nom: 'Diallo',
                    prenom: 'Amadou',
                    email: 'amadou.diallo@isi.edu.sn'
                },
                dossierMemoire: {
                    id: 10,
                    titre: 'Système de recommandation basé sur l\'intelligence artificielle',
                    statut: StatutDossierMemoire.EN_COURS,
                    etape: EtapeDossier.REDACTION,
                    progression: 75
                }
            },
            {
                id: 2,
                etudiant: {
                    nom: 'Ndiaye',
                    prenom: 'Fatou',
                    email: 'fatou.ndiaye@isi.edu.sn'
                },
                dossierMemoire: {
                    id: 11,
                    titre: 'Application mobile de gestion de bibliothèque universitaire',
                    statut: StatutDossierMemoire.EN_COURS,
                    etape: EtapeDossier.DEPOT_INTERMEDIAIRE,
                    progression: 60
                }
            },
            {
                id: 3,
                etudiant: {
                    nom: 'Ba',
                    prenom: 'Ibrahima',
                    email: 'ibrahima.ba@isi.edu.sn'
                },
                dossierMemoire: {
                    id: 12,
                    titre: 'Analyse de données massives avec Apache Spark',
                    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
                    etape: EtapeDossier.DEPOT_FINAL,
                    progression: 90
                }
            }
        ];
    }, [encadrementActif]);
    // Handlers
    const handleSendMessage = (messageData) => __awaiter(void 0, void 0, void 0, function* () {
        if (!messageData.contenu.trim() || !selectedEncadrement || !(user === null || user === void 0 ? void 0 : user.id))
            return;
        try {
            const response = yield fetch(`http://localhost:3001/api/encadrements/${selectedEncadrement.anneeAcademique}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    encadrantId: parseInt(user.id),
                    emetteurId: user.id,
                    emetteurNom: `${user.prenom} ${user.nom}`,
                    emetteurRole: 'encadrant',
                    contenu: messageData.contenu,
                    titre: messageData.titre,
                    type: messageData.type,
                    lienMeet: messageData.lienMeet,
                    dateRendezVous: messageData.dateRendezVous,
                    heureRendezVous: messageData.heureRendezVous,
                    lieu: messageData.lieu,
                    nomDocument: messageData.nomDocument,
                    cheminDocument: messageData.cheminDocument,
                    tailleDocument: messageData.tailleDocument
                })
            });
            if (response.ok) {
                const newMessage = yield response.json();
                console.log('✅ Message envoyé:', newMessage);
                // Ajouter le message à la liste locale
                const formattedMessage = {
                    id: newMessage.id,
                    expediteur: 'encadrant',
                    type: newMessage.typeMessage,
                    contenu: newMessage.contenu,
                    date: new Date(newMessage.dateEnvoi).toLocaleString('fr-FR'),
                    lu: newMessage.lu,
                    titre: newMessage.titre,
                    lienMeet: newMessage.lienMeet,
                    dateRendezVous: newMessage.dateRendezVous,
                    heureRendezVous: newMessage.heureRendezVous,
                    lieu: newMessage.lieu,
                    nomDocument: newMessage.nomDocument,
                    cheminDocument: newMessage.cheminDocument,
                    tailleDocument: newMessage.tailleDocument
                };
                setMessages(prev => [...prev, formattedMessage]);
            }
            else {
                console.error('❌ Erreur envoi message:', response.status);
                alert('Erreur lors de l\'envoi du message');
            }
        }
        catch (error) {
            console.error('❌ Erreur:', error);
            alert('Erreur lors de l\'envoi du message');
        }
    });
    const handleAddTache = (tache) => __awaiter(void 0, void 0, void 0, function* () {
        if (!selectedEncadrement || !(user === null || user === void 0 ? void 0 : user.id))
            return;
        try {
            const response = yield fetch(`http://localhost:3001/api/encadrements/${selectedEncadrement.anneeAcademique}/taches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.assign(Object.assign({}, tache), { encadrantId: parseInt(user.id), anneeAcademique: selectedEncadrement.anneeAcademique }))
            });
            if (response.ok) {
                const newTaches = yield response.json();
                console.log('✅ Tâche(s) créée(s):', newTaches.length);
                setTaches(prev => {
                    const updated = [...newTaches.map((t) => ({
                            id: t.id,
                            titre: t.titre,
                            description: t.description,
                            dateCreation: t.dateCreation,
                            dateEcheance: t.dateEcheance,
                            priorite: t.priorite,
                            active: t.statut !== 'desactivee',
                            demandeId: t.demandeId,
                            ordre: t.ordre || 0
                        })), ...prev];
                    return updated.sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
                });
                setShowTacheModal(false);
            }
            else {
                console.error('❌ Erreur création tâche:', response.status);
                alert('Erreur lors de la création de la tâche');
            }
        }
        catch (error) {
            console.error('❌ Erreur:', error);
            alert('Erreur lors de la création de la tâche');
        }
    });
    const handleSupprimerTache = (tacheId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?'))
            return;
        try {
            const response = yield fetch(`http://localhost:3001/api/taches/${tacheId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                console.log('✅ Tâche supprimée:', tacheId);
                setTaches(prev => prev.filter(t => t.id !== tacheId));
            }
            else {
                console.error('❌ Erreur suppression tâche:', response.status);
                alert('Erreur lors de la suppression de la tâche');
            }
        }
        catch (error) {
            console.error('❌ Erreur:', error);
            alert('Erreur lors de la suppression de la tâche');
        }
    });
    const handleDesactiverTache = (tacheId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:3001/api/taches/${tacheId}/statut`, {
                method: 'PUT'
            });
            if (response.ok) {
                const updatedTache = yield response.json();
                console.log('✅ Statut tâche changé:', tacheId);
                setTaches(prev => prev.map(t => t.id === tacheId
                    ? Object.assign(Object.assign({}, t), { active: updatedTache.statut !== 'desactivee' }) : t));
            }
            else {
                console.error('❌ Erreur changement statut:', response.status);
                alert('Erreur lors du changement de statut');
            }
        }
        catch (error) {
            console.error('❌ Erreur:', error);
            alert('Erreur lors du changement de statut');
        }
    });
    // Récupérer les demandes de pré-lecture pour l'encadrant connecté (en tant que pré-lecteur)
    const demandesPrelecture = useMemo(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return [];
        const idProfesseur = parseInt(user.id);
        return getDemandesPrelectureByPrelecteur(idProfesseur);
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // Récupérer les demandes de pré-lecture rejetées pour l'encadrant principal
    const demandesPrelectureRejetees = useMemo(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return [];
        const idProfesseur = parseInt(user.id);
        // Note: isOwner check removed as we assume active encadrement implies ownership or rights
        return getDemandesPrelectureRejetees(idProfesseur);
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // Calculer le nombre de demandes en attente
    const prelectureCount = useMemo(() => {
        return demandesPrelecture.filter(d => d.statut === StatutDemandePrelecture.EN_ATTENTE).length;
    }, [demandesPrelecture]);
    // Calculs pour les badges
    const unreadMessagesCount = 0; // TODO: Calculer depuis les messages récupérés du backend
    // Handlers pour la pré-lecture
    const handleConsultPrelecture = (demande) => {
        setSelectedPrelecture(demande.idDemandePrelecture);
    };
    const handleValiderPrelecture = (idDemande, commentaire) => {
        validerPrelecture(idDemande, commentaire);
        setSelectedPrelecture(null);
        // TODO: Appel API
    };
    const handleRejeterPrelecture = (idDemande, commentaire, corrections) => {
        var _a;
        const demande = demandesPrelecture.find(d => d.idDemandePrelecture === idDemande);
        if (!demande || !(user === null || user === void 0 ? void 0 : user.id))
            return;
        rejeterPrelecture(idDemande, commentaire, corrections);
        // Si l'encadrant connecté est l'encadrant principal, créer des tickets spécifiques pour les corrections
        if (((_a = demande.encadrantPrincipal) === null || _a === void 0 ? void 0 : _a.idProfesseur) === parseInt(user.id)) {
            const dossierId = demande.dossierMemoire.idDossierMemoire;
            if (!dossierId)
                return;
            const dossier = getDossierById(dossierId);
            if (dossier && encadrementActif) {
                corrections.forEach((correction, index) => {
                    createTicketForDossier(encadrementActif, dossier, `Correction pré-lecture ${index + 1}: ${correction.substring(0, 50)}...`, correction, Priorite.HAUTE, `Correction demandée suite au rejet de la pré-lecture. ${commentaire}`, []);
                });
            }
        }
        setSelectedPrelecture(null);
        // TODO: Appel API
    };
    const [etudiantsPourModal, setEtudiantsPourModal] = useState([]);
    // Charger les étudiants encadrés (VRAIES DONNÉES)
    useEffect(() => {
        const fetchEtudiants = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id) || !selectedEncadrement)
                return;
            try {
                const data = yield dossierService.getEtudiantsEncadres(user.id, selectedEncadrement.anneeAcademique);
                // Adapter les données si nécessaire (ici l'API retourne déjà le bon format grace au travail backend)
                // Mais attention, l'API renvoie id comme string (candidat.id), ici on attend peut-être number selon l'interface ?
                // Vérifions l'interface de SuiviEncadrement: etudiants: Array<{ id: number, ... }>
                // On va convertir l'id en number si c'est possible, ou adapter l'interface.
                // Les IDs candidats sont des strings "1", "2"... donc parseInt marche.
                setEtudiantsPourModal(data.map((e) => ({
                    id: parseInt(e.id),
                    nom: e.nom,
                    prenom: e.prenom,
                    dossierId: e.dossierId
                })));
            }
            catch (error) {
                console.error("Erreur chargement étudiants encadrés:", error);
            }
        });
        fetchEtudiants();
    }, [user, selectedEncadrement]);
    /*
    // ANCIEN CODE MOCK - COMMENTÉ OU SUPPRIMÉ
    // Extraire la liste des étudiants pour le modal de tâches
    const etudiantsPourModal = useMemo(() => {
      return dossiersEtudiants.map(d => ({
        id: d.id,
        nom: d.etudiant.nom,
        prenom: d.etudiant.prenom,
        dossierId: d.dossierMemoire.id
      }));
    }, [dossiersEtudiants]);
    */
    // Filtrer les demandes
    const demandesFiltrees = useMemo(() => {
        let filtered = demandes;
        if (filterStatutDemande !== 'tous') {
            filtered = filtered.filter(d => d.statut === filterStatutDemande);
        }
        if (searchQuery) {
            filtered = filtered.filter(d => {
                var _a, _b, _c;
                return ((_a = d.candidat) === null || _a === void 0 ? void 0 : _a.nom.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    ((_b = d.candidat) === null || _b === void 0 ? void 0 : _b.prenom.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    ((_c = d.dossierMemoire) === null || _c === void 0 ? void 0 : _c.titre.toLowerCase().includes(searchQuery.toLowerCase()));
            });
        }
        return filtered;
    }, [demandes, filterStatutDemande, searchQuery]);
    // Compter les demandes par statut
    const countsDemandes = useMemo(() => ({
        tous: demandes.length,
        enAttente: demandes.filter(d => d.statut === StatutDemandeEncadrement.EN_ATTENTE).length,
        acceptees: demandes.filter(d => d.statut === StatutDemandeEncadrement.ACCEPTEE).length,
        refusees: demandes.filter(d => d.statut === StatutDemandeEncadrement.REFUSEE).length
    }), [demandes]);
    // Accepter une demande
    const handleAccepter = (demande) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:3001/api/demandes-encadrement/${demande.idDemande}/accepter`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                console.log('✅ Demande acceptée');
                // Recharger les demandes
                if (user === null || user === void 0 ? void 0 : user.id) {
                    const demandesResponse = yield fetch(`http://localhost:3001/api/demandes-encadrement/encadrant/${user.id}`);
                    if (demandesResponse.ok) {
                        const data = yield demandesResponse.json();
                        setDemandes(data);
                    }
                }
            }
            else {
                console.error('❌ Erreur lors de l\'acceptation');
                alert('Erreur lors de l\'acceptation de la demande');
            }
        }
        catch (error) {
            console.error('❌ Erreur:', error);
            alert('Erreur lors de l\'acceptation de la demande');
        }
        setSelectedDemande(null);
    });
    // Refuser une demande
    const handleRefuser = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!selectedDemande || !motifRefus.trim())
            return;
        try {
            const response = yield fetch(`http://localhost:3001/api/demandes-encadrement/${selectedDemande.idDemande}/refuser`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ motifRefus })
            });
            if (response.ok) {
                console.log('✅ Demande refusée');
                // Recharger les demandes
                if (user === null || user === void 0 ? void 0 : user.id) {
                    const demandesResponse = yield fetch(`http://localhost:3001/api/demandes-encadrement/encadrant/${user.id}`);
                    if (demandesResponse.ok) {
                        const data = yield demandesResponse.json();
                        setDemandes(data);
                    }
                }
            }
            else {
                console.error('❌ Erreur lors du refus');
                alert('Erreur lors du refus de la demande');
            }
        }
        catch (error) {
            console.error('❌ Erreur:', error);
            alert('Erreur lors du refus de la demande');
        }
        setShowRefuseModal(false);
        setSelectedDemande(null);
        setMotifRefus('');
    });
    // Obtenir le badge de statut demande - Palette simplifiée (Bleu/Gris)
    const getStatutDemandeBadge = (statut) => {
        switch (statut) {
            case StatutDemandeEncadrement.EN_ATTENTE:
                return _jsx(Badge, { variant: "neutral", children: "En attente" });
            case StatutDemandeEncadrement.ACCEPTEE:
                return _jsx(Badge, { variant: "info", children: "Accept\u00E9e" });
            case StatutDemandeEncadrement.REFUSEE:
                return _jsx(Badge, { variant: "neutral", children: "Refus\u00E9e" });
            case StatutDemandeEncadrement.ANNULEE:
                return _jsx(Badge, { variant: "neutral", children: "Annul\u00E9e" });
            default:
                return _jsx(Badge, { variant: "neutral", children: statut });
        }
    };
    // Obtenir l'icône de statut demande - Couleurs simplifiées (Bleu/Gris)
    const getStatutDemandeIcon = (statut) => {
        switch (statut) {
            case StatutDemandeEncadrement.EN_ATTENTE:
                return _jsx(Clock, { className: "h-5 w-5 text-gray-500" });
            case StatutDemandeEncadrement.ACCEPTEE:
                return _jsx(CheckCircle, { className: "h-5 w-5 text-primary" });
            case StatutDemandeEncadrement.REFUSEE:
                return _jsx(XCircle, { className: "h-5 w-5 text-gray-500" });
            default:
                return _jsx(Clock, { className: "h-5 w-5 text-gray-500" });
        }
    };
    // Obtenir le badge de statut encadrement
    const getStatutEncadrementBadge = (statut) => {
        switch (statut) {
            case StatutEncadrement.ACTIF:
                return _jsx(Badge, { variant: "success", children: "Actif" });
            case StatutEncadrement.TERMINE:
                return _jsx(Badge, { variant: "info", children: "Termin\u00E9" });
            case StatutEncadrement.ANNULE:
                return _jsx(Badge, { variant: "neutral", children: "Annul\u00E9" });
            default:
                return _jsx(Badge, { variant: "neutral", children: statut });
        }
    };
    // Vérifier que l'utilisateur est un encadrant ET que l'année académique en cours n'est pas terminée
    // Exception : le chef de département garde toujours son rôle
    const anneeCourante = getAnneeAcademiqueCourante();
    const anneeTerminee = isAnneeAcademiqueTerminee(anneeCourante);
    const estChef = user === null || user === void 0 ? void 0 : user.estChef;
    const hasRoleEncadrantActif = (user === null || user === void 0 ? void 0 : user.estEncadrant) && (!anneeTerminee || estChef);
    if (!hasRoleEncadrantActif) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center max-w-md mx-auto px-4", children: [_jsx(AlertCircle, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Acc\u00E8s restreint" }), _jsx("p", { className: "text-gray-600 mb-4", children: anneeTerminee
                            ? 'L\'année académique est terminée. Vous n\'avez plus accès aux encadrements pour cette session.'
                            : 'Cette page est réservée aux encadrants. Vous devez être encadrant pour accéder à cette fonctionnalité.' }), _jsx("button", { onClick: () => navigate('/professeur/dashboard'), className: "px-4 py-2 bg-primary text-white hover:bg-primary-700 transition-colors", children: "Retour au tableau de bord" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Encadrements" }), _jsx("p", { className: "text-sm text-gray-600", children: (user === null || user === void 0 ? void 0 : user.estEncadrant)
                                            ? (activeTab === 'demandes'
                                                ? 'Gérez les demandes d\'encadrement des étudiants'
                                                : 'Consultez vos encadrements en cours')
                                            : 'Gérez les demandes d\'encadrement des étudiants' }), _jsx("div", { className: "mt-2", children: _jsxs(Badge, { variant: "info", children: ["Ann\u00E9e acad\u00E9mique : ", anneeAcademiqueActuelle] }) })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("button", { onClick: () => setShowConfigModal(true), className: "p-2 text-gray-500 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors", title: "Configurer la capacit\u00E9 d'encadrement", children: _jsx(Settings, { className: "h-6 w-6" }) }), (user === null || user === void 0 ? void 0 : user.estEncadrant) && activeTab === 'demandes' && (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-primary", children: countsDemandes.enAttente }), _jsx("div", { className: "text-xs text-gray-600", children: "En attente" })] })), (user === null || user === void 0 ? void 0 : user.estEncadrant) && activeTab === 'encadrements' && (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-3xl font-bold text-primary", children: encadrements.length }), _jsxs("div", { className: "text-xs text-gray-600", children: ["Encadrement", encadrements.length > 1 ? 's' : ''] })] }))] })] }) }), (user === null || user === void 0 ? void 0 : user.estEncadrant) && (_jsx("div", { className: "bg-white border border-gray-200 mb-6", children: _jsx("div", { className: "border-b border-gray-200", children: _jsxs("nav", { className: "flex", children: [_jsx(TabButton, { isActive: activeTab === 'demandes', onClick: () => setActiveTab('demandes'), icon: _jsx(Inbox, { className: "h-4 w-4" }), count: countsDemandes.tous, children: "Demandes d'encadrement" }), _jsx(TabButton, { isActive: activeTab === 'encadrements', onClick: () => setActiveTab('encadrements'), icon: _jsx(Users, { className: "h-4 w-4" }), count: encadrements.length, children: "Mes encadrements" })] }) }) })), _jsxs("div", { className: "bg-white border border-gray-200 mb-6 p-6", children: [_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { type: "text", placeholder: (user === null || user === void 0 ? void 0 : user.estEncadrant) && activeTab === 'encadrements' ? "Rechercher un encadrement..." : "Rechercher une demande...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" })] }), activeTab === 'demandes' && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { className: "h-5 w-5 text-gray-400" }), _jsxs("select", { value: filterStatutDemande, onChange: (e) => setFilterStatutDemande(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent", children: [_jsx("option", { value: "tous", children: "Tous les statuts" }), _jsx("option", { value: StatutDemandeEncadrement.EN_ATTENTE, children: "En attente" }), _jsx("option", { value: StatutDemandeEncadrement.ACCEPTEE, children: "Accept\u00E9es" }), _jsx("option", { value: StatutDemandeEncadrement.REFUSEE, children: "Refus\u00E9es" })] })] }))] }) }), (user === null || user === void 0 ? void 0 : user.estEncadrant) && activeTab === 'demandes' && demandesFiltrees.length > 0 ? (_jsx("div", { className: "space-y-3", children: demandesFiltrees.map((demande, index) => {
                                var _a, _b;
                                return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: index * 0.05 }, className: "bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all", children: _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-4 flex-1 min-w-0", children: [_jsx("div", { className: `p-3 rounded-lg ${demande.statut === StatutDemandeEncadrement.EN_ATTENTE
                                                                ? 'bg-blue-50'
                                                                : demande.statut === StatutDemandeEncadrement.ACCEPTEE
                                                                    ? 'bg-green-50'
                                                                    : 'bg-gray-50'}`, children: getStatutDemandeIcon(demande.statut) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start gap-3 mb-3", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-bold text-lg text-gray-900 mb-1 truncate", children: ((_a = demande.dossierMemoire) === null || _a === void 0 ? void 0 : _a.titre) || 'Demande d\'encadrement' }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { className: "h-4 w-4" }), formatDate(demande.dateDemande)] }), demande.candidats && demande.candidats.length > 0 && (_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Users, { className: "h-4 w-4" }), demande.candidats.length === 1 ? (_jsxs("span", { children: [demande.candidats[0].prenom, " ", demande.candidats[0].nom] })) : (_jsxs("span", { children: [demande.candidats.length, " \u00E9tudiants (bin\u00F4me)"] }))] }))] })] }), _jsx("div", { className: "flex-shrink-0", children: getStatutDemandeBadge(demande.statut) })] }), ((_b = demande.dossierMemoire) === null || _b === void 0 ? void 0 : _b.description) && (_jsx("p", { className: "text-sm text-gray-600 line-clamp-2 mb-3", children: demande.dossierMemoire.description }))] })] }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [demande.statut === StatutDemandeEncadrement.EN_ATTENTE && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => {
                                                                        setSelectedDemande(demande);
                                                                        setShowRefuseModal(true);
                                                                    }, className: "px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-medium", children: "Refuser" }), _jsx("button", { onClick: () => handleAccepter(demande), className: "px-4 py-2 bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all text-sm font-medium shadow-sm", children: "Accepter" })] })), _jsxs("button", { onClick: () => {
                                                                setDemandeDetails(demande);
                                                                setShowDetailsModal(true);
                                                            }, className: "px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary-50 transition-all text-sm font-medium flex items-center gap-1.5", children: ["D\u00E9tails", _jsx(ChevronRight, { className: "h-4 w-4" })] })] })] }) }) }, demande.idDemande));
                            }) })) : (user === null || user === void 0 ? void 0 : user.estEncadrant) && activeTab === 'demandes' ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(Inbox, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 mb-2", children: "Aucune demande d'encadrement" }), _jsx("p", { className: "text-sm text-gray-500", children: "Les demandes des \u00E9tudiants appara\u00EEtront ici" })] })) : null, (user === null || user === void 0 ? void 0 : user.estEncadrant) && activeTab === 'encadrements' && (!selectedEncadrement ? (
                        // Liste des encadrements
                        encadrements.length > 0 ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Mes encadrements" }), _jsxs(Badge, { variant: "info", children: [encadrements.length, " encadrement", encadrements.length > 1 ? 's' : ''] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: encadrements.map((encadrement, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2, delay: index * 0.05 }, onClick: () => setSelectedEncadrement(encadrement), className: "bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-primary-200 transition-all cursor-pointer", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-bold text-lg text-gray-900 mb-1", children: ["Encadrement (", encadrement.anneeAcademique, ")"] }), _jsxs("p", { className: "text-sm text-gray-600", children: [encadrement.demandes.length, " groupe", encadrement.demandes.length > 1 ? 's' : '', " encadr\u00E9", encadrement.demandes.length > 1 ? 's' : ''] })] }), _jsx(ChevronRight, { className: "h-5 w-5 text-gray-400" })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 mb-2", children: [_jsx(Users, { className: "h-4 w-4" }), _jsxs("span", { children: [encadrement.nombreEtudiants, " \u00E9tudiant", encadrement.nombreEtudiants > 1 ? 's' : ''] })] }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [_jsx(Calendar, { className: "h-3.5 w-3.5" }), _jsxs("span", { children: ["Ann\u00E9e acad\u00E9mique ", encadrement.anneeAcademique] })] })] }, encadrement.anneeAcademique))) })] })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx(Users, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600 mb-2", children: "Aucun encadrement" }), _jsx("p", { className: "text-sm text-gray-500", children: "Vous n'avez actuellement aucun encadrement. Acceptez des demandes d'encadrement pour commencer." })] }))) : (
                        // Vue détaillée de l'encadrement sélectionné avec les onglets
                        _jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => {
                                        setSelectedEncadrement(null);
                                        setActivePanelTab('messages');
                                    }, className: "mb-4 flex items-center gap-2 text-primary hover:text-primary-700 transition-colors", children: [_jsx(ChevronRight, { className: "h-4 w-4 rotate-180" }), _jsx("span", { className: "text-sm font-medium", children: "Retour \u00E0 la liste des encadrements" })] }), _jsxs("div", { className: "bg-gradient-to-r from-primary-50 to-blue-50 border border-gray-200 rounded-xl p-5 mb-6", children: [_jsxs("h3", { className: "font-bold text-xl text-gray-900 mb-2", children: ["Encadrement (", selectedEncadrement.anneeAcademique, ")"] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Users, { className: "h-4 w-4" }), selectedEncadrement.nombreEtudiants, " \u00E9tudiant", selectedEncadrement.nombreEtudiants > 1 ? 's' : ''] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(FileText, { className: "h-4 w-4" }), selectedEncadrement.demandes.length, " groupe", selectedEncadrement.demandes.length > 1 ? 's' : ''] })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6", children: [_jsx(PanelTabs, { activeTab: activePanelTab, onTabChange: setActivePanelTab, unreadMessagesCount: unreadMessagesCount, tachesCount: taches.length, dossiersCount: selectedEncadrement.demandes.length, prelectureCount: prelectureCount, suiviCount: selectedEncadrement.nombreEtudiants }), _jsxs("div", { className: "p-6", children: [activePanelTab === 'messages' && (_jsx(MessageList, { messages: messages, onSendMessage: handleSendMessage })), activePanelTab === 'suivi' && selectedEncadrement && (_jsx(SuiviEncadrement, { encadrantId: (user === null || user === void 0 ? void 0 : user.id) || 0, anneeAcademique: selectedEncadrement.anneeAcademique, etudiants: etudiantsPourModal })), activePanelTab === 'taches' && (_jsx(TacheCommuneList, { taches: taches, onAddTache: () => setShowTacheModal(true), onSupprimer: handleSupprimerTache, onDesactiver: handleDesactiverTache, canEdit: true, demandes: (selectedEncadrement === null || selectedEncadrement === void 0 ? void 0 : selectedEncadrement.demandes) || [] })), activePanelTab === 'dossiers' && (_jsx(SupervisionDashboard, { demandes: selectedEncadrement.demandes.map(d => {
                                                        var _a, _b;
                                                        return (Object.assign(Object.assign({}, d), { dossierId: ((_a = d.dossierMemoire) === null || _a === void 0 ? void 0 : _a.id) || 0, titre: ((_b = d.dossierMemoire) === null || _b === void 0 ? void 0 : _b.titre) || 'Sans titre', candidat: d.candidat ? Object.assign(Object.assign({}, d.candidat), { id: d.candidat.idCandidat }) : undefined, candidats: d.candidats ? d.candidats.map(c => (Object.assign(Object.assign({}, c), { id: c.idCandidat }))) : undefined, dossierMemoire: d.dossierMemoire ? Object.assign(Object.assign({}, d.dossierMemoire), { progression: d.dossierMemoire.progression || 0, description: d.dossierMemoire.description || '', etape: d.dossierMemoire.etape || 'CHOIX_SUJET', titre: d.dossierMemoire.titre }) : undefined }));
                                                    }), encadrantId: Number(user === null || user === void 0 ? void 0 : user.id), anneeAcademique: selectedEncadrement.anneeAcademique })), activePanelTab === 'prelecture' && (_jsx(PrelectureList, { demandes: demandesPrelecture, onConsult: handleConsultPrelecture }))] })] }), selectedPrelecture && demandesPrelecture.find(d => d.idDemandePrelecture === selectedPrelecture) && (_jsx(PrelectureDetail, { demande: demandesPrelecture.find(d => d.idDemandePrelecture === selectedPrelecture), onClose: () => setSelectedPrelecture(null), onValider: handleValiderPrelecture, onRejeter: handleRejeterPrelecture })), _jsx(AddTacheModal, { isOpen: showTacheModal, onClose: () => setShowTacheModal(false), onAdd: handleAddTache, demandes: (selectedEncadrement === null || selectedEncadrement === void 0 ? void 0 : selectedEncadrement.demandes.map(d => ({
                                        idDemande: d.idDemande,
                                        candidats: d.candidats ? d.candidats.map(c => ({
                                            id: Number(c.idCandidat),
                                            nom: String(c.nom),
                                            prenom: String(c.prenom)
                                        })) : [],
                                        candidat: d.candidat ? {
                                            id: Number(d.candidat.idCandidat),
                                            nom: String(d.candidat.nom),
                                            prenom: String(d.candidat.prenom)
                                        } : undefined
                                    }))) || [] })] })))] }), _jsx(AnimatePresence, { children: showRefuseModal && selectedDemande && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: () => setShowRefuseModal(false), children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, onClick: (e) => e.stopPropagation(), className: "bg-white rounded-lg max-w-md w-full p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: "Refuser la demande d'encadrement" }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Veuillez indiquer le motif du refus de cette demande :" }), _jsx("textarea", { value: motifRefus, onChange: (e) => setMotifRefus(e.target.value), placeholder: "Motif du refus...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none", rows: 4 }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx("button", { onClick: () => {
                                                setShowRefuseModal(false);
                                                setMotifRefus('');
                                            }, className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Annuler" }), _jsx("button", { onClick: handleRefuser, disabled: !motifRefus.trim(), className: "px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed", children: "Confirmer le refus" })] })] }) })) }), _jsx(AnimatePresence, { children: showConfigModal && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: () => setShowConfigModal(false), children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, onClick: (e) => e.stopPropagation(), className: "bg-white rounded-lg max-w-md w-full p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: "Configuration de l'encadrement" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "illimite", className: "font-medium text-gray-900", children: "Capacit\u00E9 illimit\u00E9e" }), _jsx("p", { className: "text-sm text-gray-500", children: "Accepter un nombre illimit\u00E9 de candidats" })] }), _jsxs("div", { className: "relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in", children: [_jsx("input", { type: "checkbox", name: "illimite", id: "illimite", checked: configEncadrement.illimite, onChange: (e) => setConfigEncadrement(Object.assign(Object.assign({}, configEncadrement), { illimite: e.target.checked })), className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-6 checked:border-primary", style: { right: configEncadrement.illimite ? '0' : 'auto', left: configEncadrement.illimite ? 'auto' : '0' } }), _jsx("label", { htmlFor: "illimite", className: `toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${configEncadrement.illimite ? 'bg-primary' : 'bg-gray-300'}` })] })] }), !configEncadrement.illimite && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nombre maximum de candidats" }), _jsx("input", { type: "number", min: "1", value: configEncadrement.maxCandidats, onChange: (e) => setConfigEncadrement(Object.assign(Object.assign({}, configEncadrement), { maxCandidats: parseInt(e.target.value) })), className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Une fois ce nombre atteint, vous ne recevrez plus de nouvelles demandes." })] }))] }), _jsxs("div", { className: "flex justify-end gap-3 mt-8", children: [_jsx("button", { onClick: () => setShowConfigModal(false), className: "px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50", children: "Annuler" }), _jsx("button", { onClick: handleSaveConfig, className: "px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700", children: "Enregistrer" })] })] }) })) }), _jsx(AnimatePresence, { children: showDetailsModal && demandeDetails && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: () => setShowDetailsModal(false), children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, onClick: (e) => e.stopPropagation(), className: "bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "sticky top-0 bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-5 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 rounded-lg bg-white shadow-sm", children: getStatutDemandeIcon(demandeDetails.statut) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "D\u00E9tails de la demande" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Re\u00E7ue le ", formatDate(demandeDetails.dateDemande)] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [getStatutDemandeBadge(demandeDetails.statut), _jsx("button", { onClick: () => setShowDetailsModal(false), className: "p-2 hover:bg-white/50 rounded-lg transition-colors", children: _jsx(X, { className: "h-5 w-5 text-gray-600" }) })] })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [demandeDetails.dossierMemoire && (_jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-5", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(FileText, { className: "h-6 w-6 text-primary mt-0.5 flex-shrink-0" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-bold text-lg text-gray-900 mb-2", children: demandeDetails.dossierMemoire.titre }), demandeDetails.dossierMemoire.description && (_jsx("p", { className: "text-sm text-gray-700 leading-relaxed mb-3", children: demandeDetails.dossierMemoire.description })), demandeDetails.dossierMemoire.anneeAcademique && (_jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-600", children: [_jsx(Calendar, { className: "h-3.5 w-3.5" }), _jsxs("span", { children: ["Ann\u00E9e acad\u00E9mique : ", demandeDetails.dossierMemoire.anneeAcademique] })] }))] })] }) })), demandeDetails.candidats && demandeDetails.candidats.length > 0 && (_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-xl p-5", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Users, { className: "h-6 w-6 text-gray-700" }), _jsx("h3", { className: "font-bold text-lg text-gray-900", children: demandeDetails.candidats.length === 1 ? 'Candidat' : 'Binôme' }), _jsxs("span", { className: "text-xs bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full font-medium", children: [demandeDetails.candidats.length, " ", demandeDetails.candidats.length === 1 ? 'étudiant' : 'étudiants'] })] }), _jsx("div", { className: "space-y-3", children: demandeDetails.candidats.map((candidat, idx) => (_jsxs("div", { className: "flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm", children: [_jsxs("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-bold text-lg", children: [candidat.prenom[0], candidat.nom[0]] }), _jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "font-semibold text-gray-900", children: [candidat.prenom, " ", candidat.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: candidat.email })] }), idx === 0 && demandeDetails.candidats.length > 1 && (_jsx("span", { className: "text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium", children: "Responsable" }))] }, candidat.idCandidat))) })] })), demandeDetails.motifRefus && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-xl p-5", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircle, { className: "h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-bold text-lg text-red-900 mb-2", children: "Motif de refus" }), _jsx("p", { className: "text-sm text-red-700 leading-relaxed", children: demandeDetails.motifRefus }), demandeDetails.dateReponse && (_jsxs("p", { className: "text-xs text-red-600 mt-3", children: ["Refus\u00E9 le ", formatDate(demandeDetails.dateReponse)] }))] })] }) }))] }), demandeDetails.statut === StatutDemandeEncadrement.EN_ATTENTE && (_jsxs("div", { className: "sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3", children: [_jsx("button", { onClick: () => {
                                                setShowDetailsModal(false);
                                                setSelectedDemande(demandeDetails);
                                                setShowRefuseModal(true);
                                            }, className: "px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-all font-medium", children: "Refuser" }), _jsx("button", { onClick: () => {
                                                setShowDetailsModal(false);
                                                handleAccepter(demandeDetails);
                                            }, className: "px-6 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-medium shadow-md", children: "Accepter" })] }))] }) })) })] }) }));
};
export default Encadrements;
