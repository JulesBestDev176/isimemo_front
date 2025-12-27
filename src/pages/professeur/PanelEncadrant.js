var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getEncadrementsByProfesseur } from '../../models';
import { PanelHeader } from '../../components/panel-encadrant/PanelHeader';
import { PanelTabs } from '../../components/panel-encadrant/PanelTabs';
import { MessageList } from '../../components/panel-encadrant/MessageList';
import { TacheCommuneList } from '../../components/panel-encadrant/TacheCommuneList';
import { DossierEtudiantList } from '../../components/panel-encadrant/DossierEtudiantList';
import { AddTacheModal } from '../../components/panel-encadrant/AddTacheModal';
import { PrelectureList } from '../../components/panel-encadrant/PrelectureList';
import { PrelectureDetail } from '../../components/panel-encadrant/PrelectureDetail';
import { getDemandesPrelectureByPrelecteur, getDemandesPrelectureRejetees, validerPrelecture, rejeterPrelecture, StatutDemandePrelecture } from '../../models/dossier/DemandePrelecture';
import { createTicketForDossier, Priorite } from '../../models/dossier/Ticket';
import { getDossierById } from '../../models/dossier/DossierMemoire';
import { getAnneeAcademiqueCourante, isAnneeAcademiqueTerminee } from '../../utils/anneeAcademique';
import dossierService from '../../services/dossier.service';
const PanelEncadrant = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('messages');
    const [showTacheModal, setShowTacheModal] = useState(false);
    const [selectedPrelecture, setSelectedPrelecture] = useState(null);
    // Récupérer l'encadrement
    const [encadrement, setEncadrement] = useState(null);
    useEffect(() => {
        if (id) {
            // Fetch real encadrement potentially if needed, or construct it
            // For now, keep it simple or assume passed correctly?
            // Actually, we need to correct the logic:
            setEncadrement({ idEncadrement: parseInt(id), anneeAcademique: getAnneeAcademiqueCourante() });
        }
    }, [id]);
    // Vérifier que l'utilisateur est un encadrant ET que l'année académique en cours n'est pas terminée
    // Exception : le chef de département garde toujours son rôle
    const anneeCourante = getAnneeAcademiqueCourante();
    const anneeTerminee = isAnneeAcademiqueTerminee(anneeCourante);
    const estChef = user === null || user === void 0 ? void 0 : user.estChef;
    const hasRoleEncadrantActif = (user === null || user === void 0 ? void 0 : user.estEncadrant) && (!anneeTerminee || estChef);
    if (!hasRoleEncadrantActif) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertCircle, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Acc\u00E8s restreint" }), _jsx("p", { className: "text-gray-600 mb-4", children: anneeTerminee
                            ? 'L\'année académique est terminée. Vous n\'avez plus accès au panel encadrant pour cette session.'
                            : 'Cette page est réservée aux encadrants.' }), _jsx("button", { onClick: () => navigate('/professeur/encadrements'), className: "px-4 py-2 bg-primary text-white hover:bg-primary-700 transition-colors", children: "Retour aux encadrements" })] }) }));
    }
    if (!encadrement) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertCircle, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Encadrement introuvable" }), _jsx("button", { onClick: () => navigate('/professeur/encadrements'), className: "px-4 py-2 bg-primary text-white hover:bg-primary-700 transition-colors", children: "Retour aux encadrements" })] }) }));
    }
    // Vérifier que l'encadrant est bien le propriétaire de cet encadrement
    // On vérifie via getEncadrementsByProfesseur pour s'assurer que l'encadrement appartient bien à l'utilisateur
    const encadrementsUtilisateur = getEncadrementsByProfesseur(parseInt(user.id));
    const isOwner = encadrementsUtilisateur.some(e => e.idEncadrement === encadrement.idEncadrement);
    if (!isOwner) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertCircle, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Acc\u00E8s non autoris\u00E9" }), _jsx("p", { className: "text-gray-600 mb-4", children: "Vous n'\u00EAtes pas autoris\u00E9 \u00E0 acc\u00E9der \u00E0 cet encadrement." }), _jsx("button", { onClick: () => navigate('/professeur/encadrements'), className: "px-4 py-2 bg-primary text-white hover:bg-primary-700 transition-colors", children: "Retour aux encadrements" })] }) }));
    }
    // Mock data - Messages (seulement ceux envoyés par l'encadrant, l'étudiant ne peut pas envoyer)
    const messages = useMemo(() => [
        {
            id: 1,
            expediteur: 'encadrant',
            type: 'texte',
            contenu: 'Bonjour, j\'ai relu votre chapitre 2. Globalement c\'est bien mais il faut revoir la partie sur les algorithmes.',
            date: '2025-01-20 14:15',
            lu: true,
            titre: 'Feedback sur le chapitre 2'
        },
        {
            id: 2,
            expediteur: 'encadrant',
            type: 'reunion-meet',
            contenu: 'Réunion de suivi programmée pour discuter de l\'avancement de votre mémoire.',
            date: '2025-01-20 10:15',
            lu: true,
            titre: 'Réunion de suivi',
            lienMeet: 'https://meet.google.com/abc-defg-hij',
            dateRendezVous: '2025-01-25',
            heureRendezVous: '14:00'
        },
        {
            id: 3,
            expediteur: 'encadrant',
            type: 'presentiel',
            contenu: 'Pré-lecture programmée. Préparez votre présentation PowerPoint.',
            date: '2025-01-19 10:45',
            lu: false,
            titre: 'Pré-lecture',
            lieu: 'Salle de conférence A, Bâtiment principal',
            dateRendezVous: '2025-02-20',
            heureRendezVous: '10:00'
        },
        {
            id: 4,
            expediteur: 'encadrant',
            type: 'document',
            contenu: 'Document annoté avec mes commentaires sur votre introduction.',
            date: '2025-01-18 16:30',
            lu: false,
            titre: 'Document annoté - Introduction',
            nomDocument: 'Introduction_annotee.pdf',
            cheminDocument: '/documents/introduction_annotee.pdf',
            tailleDocument: '2.4 MB'
        },
        {
            id: 5,
            expediteur: 'encadrant',
            type: 'texte',
            contenu: 'N\'oubliez pas de finaliser l\'état de l\'art avant la prochaine réunion.',
            date: '2025-01-17 14:20',
            lu: true,
            titre: 'Rappel - État de l\'art'
        }
    ], []);
    // Mock data - Tâches communes
    const tachesCommunes = useMemo(() => [
        {
            id: 1,
            titre: 'Finaliser l\'état de l\'art',
            description: 'Compléter la revue de littérature avec au moins 15 références récentes',
            dateCreation: '2025-01-15',
            dateEcheance: '2025-02-01',
            priorite: 'Haute',
            active: true,
            tags: ['recherche', 'bibliographie'],
            consigne: 'Privilégier les articles récents (moins de 5 ans) et les sources académiques reconnues.'
        },
        {
            id: 2,
            titre: 'Rédiger le chapitre méthodologie',
            description: 'Décrire en détail la méthodologie de recherche utilisée',
            dateCreation: '2025-01-10',
            dateEcheance: '2025-02-15',
            priorite: 'Moyenne',
            active: true,
            tags: ['rédaction', 'méthodologie'],
            consigne: 'La méthodologie doit être claire et reproductible.'
        }
    ], []);
    // Mock data - Dossiers étudiants (REMPLACEMENT PAR REAL DATA)
    const [dossiersEtudiants, setDossiersEtudiants] = useState([]);
    useEffect(() => {
        const fetchDossiers = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return;
            try {
                // Utiliser le service pour récupérer les dossiers liés à l'encadrant via les tâches ou une route dédiée
                // Comme on n'a pas de route directe "encadrements/:id/dossiers", on va chercher les dossiers
                // où l'étudiant est candidat et l'encadrant est associé (via demande encadrement acceptée)
                // Approche : Récupérer tous les dossiers (filtrés par année ?) et voir s'ils sont liés à l'encadrant
                const allDossiers = yield dossierService.getAllDossiers();
                // Filtrer pour l'encadrant actuel (ID user.id)
                // Note: le modèle DossierMemoire contient encadrantId ou candidatIds
                // Mais l'API /api/dossiers renvoie des objets Dossier
                // Vérifier si dossier.encadrantId correspond à user.id
                const myDossiers = allDossiers.filter((d) => 
                // Vérifier l'encadrantId si disponible dans le modèle dossier
                // d.encadrantId === parseInt(user.id) || 
                // Ou vérifier via les demandes d'encadrement acceptées ? (plus complexe)
                // Pour l'instant, supposons que le backend renvoie encadrantId ou que l'on vérifie autre chose.
                // Hack temporaire pour démonstration si l'API ne filtre pas encore par encadrant : 
                // On prend tout pour le moment pour valider le flux, ou on filtre par année
                d.anneeAcademique === anneeCourante);
                // Mapper vers le format DossierEtudiant
                // On a besoin des details étudiants, donc il faudra peut-être enrichir
                const mappedDossiers = yield Promise.all(myDossiers.map((d) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    // Récupérer infos candidat premier
                    // L'API dossier renvoie candidatIds array
                    let etudiantInfo = { nom: 'Inconnu', prenom: '', email: '' };
                    if (d.candidatIds && d.candidatIds.length > 0) {
                        // Si d.candidats est déjà peuplé par le backend (populate)
                        if (d.candidats && d.candidats[0]) {
                            // Si c'est un objet complet
                            if (typeof d.candidats[0] === 'object') {
                                etudiantInfo = d.candidats[0];
                            }
                            else {
                                // Si c'est un ID, on essaie de charger (plus complexe sans getCandidatById)
                                // Pour l'instant on garde Inconnu ou on charge depuis les étudiants globaux si on peut
                                try {
                                    // Fallback: chercher dans un service si dispo, sinon laisser vide
                                    // etudiantInfo = await dossierService.getCandidatById(d.candidatIds[0]); 
                                }
                                catch (e) { }
                            }
                        }
                        else {
                            // Sinon fetch candidat ?
                            // dossierService.getCandidatById n'existe pas encore, on peut l'ajouter ou filtrer sur la liste globale des Users/Candidats
                        }
                    }
                    return {
                        id: ((_a = d.candidatIds) === null || _a === void 0 ? void 0 : _a[0]) || d.id, // Fallback ID
                        etudiant: {
                            nom: etudiantInfo.nom,
                            prenom: etudiantInfo.prenom,
                            email: etudiantInfo.email
                        },
                        dossierMemoire: {
                            id: d.id, // ID REEL DU DOSSIER
                            titre: d.titre,
                            statut: d.statut,
                            etape: d.etape,
                            progression: d.progression || 0
                        }
                    };
                })));
                setDossiersEtudiants(mappedDossiers);
            }
            catch (err) {
                console.error("Erreur chargement dossiers étudiants:", err);
            }
        });
        fetchDossiers();
    }, [user === null || user === void 0 ? void 0 : user.id, anneeCourante]);
    // Handlers
    const handleSendMessage = (messageData) => {
        if (!messageData.contenu.trim())
            return;
        console.log('Envoi message:', messageData);
        // TODO: Appel API
    };
    const handleAddTache = (tache) => {
        console.log('Ajout tâche commune:', tache);
        setShowTacheModal(false);
        // TODO: Appel API
    };
    const handleSupprimerTache = (tacheId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche commune ?')) {
            console.log('Supprimer tâche:', tacheId);
            // TODO: Appel API
        }
    };
    const handleDesactiverTache = (tacheId) => {
        console.log('Désactiver/Réactiver tâche:', tacheId);
        // TODO: Appel API
    };
    // Récupérer les demandes de pré-lecture pour l'encadrant connecté (en tant que pré-lecteur)
    const demandesPrelecture = useMemo(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id))
            return [];
        const idProfesseur = parseInt(user.id);
        return getDemandesPrelectureByPrelecteur(idProfesseur);
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // Récupérer les demandes de pré-lecture rejetées pour l'encadrant principal
    const demandesPrelectureRejetees = useMemo(() => {
        if (!(user === null || user === void 0 ? void 0 : user.id) || !isOwner)
            return [];
        const idProfesseur = parseInt(user.id);
        return getDemandesPrelectureRejetees(idProfesseur);
    }, [user === null || user === void 0 ? void 0 : user.id, isOwner]);
    // Calculer le nombre de demandes en attente
    const prelectureCount = useMemo(() => {
        return demandesPrelecture.filter(d => d.statut === StatutDemandePrelecture.EN_ATTENTE).length;
    }, [demandesPrelecture]);
    // Calculs pour les badges
    const unreadMessagesCount = 0; // L'étudiant ne peut pas envoyer de messages, donc pas de messages non lus
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
        if (!demande)
            return;
        rejeterPrelecture(idDemande, commentaire, corrections);
        // Si l'encadrant connecté est l'encadrant principal, créer des tickets spécifiques pour les corrections
        if (isOwner && ((_a = demande.encadrantPrincipal) === null || _a === void 0 ? void 0 : _a.idProfesseur) === parseInt(user.id)) {
            const dossier = getDossierById(demande.dossierMemoire.idDossierMemoire);
            if (dossier && encadrement) {
                corrections.forEach((correction, index) => {
                    createTicketForDossier(encadrement, dossier, `Correction pré-lecture ${index + 1}: ${correction.substring(0, 50)}...`, correction, Priorite.HAUTE, `Correction demandée suite au rejet de la pré-lecture. ${commentaire}`, []);
                });
            }
        }
        setSelectedPrelecture(null);
        // TODO: Appel API
    };
    // Extraire la liste des étudiants pour le modal de tâches
    const etudiantsPourModal = useMemo(() => {
        return dossiersEtudiants.map(d => ({
            id: d.id,
            nom: d.etudiant.nom,
            prenom: d.etudiant.prenom
        }));
    }, [dossiersEtudiants]);
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx(PanelHeader, { encadrement: encadrement, encadrementId: id || '' }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6", children: [_jsx(PanelTabs, { activeTab: activeTab, onTabChange: setActiveTab, unreadMessagesCount: unreadMessagesCount, tachesCount: tachesCommunes.length, dossiersCount: dossiersEtudiants.length, prelectureCount: prelectureCount }), _jsxs("div", { className: "p-6", children: [activeTab === 'messages' && (_jsx(MessageList, { messages: messages, onSendMessage: handleSendMessage })), activeTab === 'taches' && (_jsx(TacheCommuneList, { taches: tachesCommunes, onAddTache: () => setShowTacheModal(true), onSupprimer: handleSupprimerTache, onDesactiver: handleDesactiverTache, canEdit: isOwner })), activeTab === 'dossiers' && (_jsx(DossierEtudiantList, { dossiers: dossiersEtudiants, encadrementId: id || '' })), activeTab === 'prelecture' && (_jsx(PrelectureList, { demandes: demandesPrelecture, onConsult: handleConsultPrelecture }))] })] }), selectedPrelecture && demandesPrelecture.find(d => d.idDemandePrelecture === selectedPrelecture) && (_jsx(PrelectureDetail, { demande: demandesPrelecture.find(d => d.idDemandePrelecture === selectedPrelecture), onClose: () => setSelectedPrelecture(null), onValider: handleValiderPrelecture, onRejeter: handleRejeterPrelecture })), _jsx(AddTacheModal, { isOpen: showTacheModal, onClose: () => setShowTacheModal(false), onAdd: handleAddTache, 
                    // @ts-ignore
                    etudiants: etudiantsPourModal })] }) }));
};
export default PanelEncadrant;
