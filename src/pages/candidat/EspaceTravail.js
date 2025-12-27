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
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, Filter, Plus, Calendar, X, CheckCircle, Circle, AlertCircle, Clock, ArrowRight, Upload, FileText, Trash2, Download, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { dossierService } from '../../services/dossier.service';
const EspaceTravail = () => {
    var _a, _b;
    const { user } = useAuth();
    const [showTacheModal, setShowTacheModal] = useState(false);
    const [tacheSelectionnee, setTacheSelectionnee] = useState(null);
    const [modeVue, setModeVue] = useState('kanban');
    const [filtres, setFiltres] = useState({
        priorite: '',
        assignee: '',
        tags: '',
    });
    const [draggedTask, setDraggedTask] = useState(null);
    const [colonnes, setColonnes] = useState([]);
    const [fichierLivrable, setFichierLivrable] = useState(null);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);
    // Charger les données du dossier
    useEffect(() => {
        const fetchDossierData = () => __awaiter(void 0, void 0, void 0, function* () {
            if (user === null || user === void 0 ? void 0 : user.id) {
                try {
                    const userDossier = yield dossierService.getDossierCandidat(user.id);
                    setDossier(userDossier);
                }
                catch (error) {
                    console.error("Erreur chargement dossier:", error);
                }
                finally {
                    setLoading(false);
                }
            }
        });
        fetchDossierData();
    }, [user]);
    // Initialiser les colonnes pour l'espace de travail
    useEffect(() => {
        const fetchTaches = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(dossier === null || dossier === void 0 ? void 0 : dossier.id))
                return;
            try {
                const response = yield fetch(`http://localhost:3001/api/dossiers/${dossier.id}/taches`);
                if (response.ok) {
                    const data = yield response.json();
                    // Mapper les tâches backend vers la structure Kanban
                    const tachesMappees = data.map((t) => ({
                        id: t.id,
                        titre: t.titre,
                        description: t.description || '',
                        // Mapping de base : active -> todo, terminee -> done
                        statutColonne: t.statut || 'todo',
                        priorite: t.priorite || 'Moyenne',
                        assignee: (user === null || user === void 0 ? void 0 : user.nom) || '',
                        dateCreation: t.dateCreation,
                        dateEcheance: t.dateEcheance,
                        ordre: t.ordre || 0,
                        tags: t.demandeId ? ['Spécifique'] : ['Commune'],
                        commentaires: [],
                        progression: t.statut === 'done' ? 100 : (t.statut === 'review' ? 90 : (t.statut === 'inprogress' ? 50 : 0)),
                        livrable: t.livrable ? {
                            nom: t.livrable.nom,
                            taille: 'PDF', // On n'a pas la taille exacte en DB
                            dateUpload: t.livrable.dateUpload
                        } : undefined,
                        fichiers: [],
                        sousEtapes: t.sousEtapes || [],
                        estRetournee: t.estRetournee,
                        feedbackRetour: t.feedbackRetour
                    }));
                    const colonnesInitiales = [
                        {
                            id: 'todo',
                            titre: 'À faire',
                            couleur: 'bg-blue-50 border-blue-200',
                            taches: tachesMappees.filter(t => t.statutColonne === 'todo').sort((a, b) => (a.ordre || 0) - (b.ordre || 0))
                        },
                        {
                            id: 'inprogress',
                            titre: 'En cours',
                            couleur: 'bg-blue-50 border-blue-200',
                            taches: tachesMappees.filter(t => t.statutColonne === 'inprogress')
                        },
                        {
                            id: 'review',
                            titre: 'En révision',
                            couleur: 'bg-blue-50 border-blue-200',
                            taches: tachesMappees.filter(t => t.statutColonne === 'review')
                        },
                        {
                            id: 'done',
                            titre: 'Terminé',
                            couleur: 'bg-blue-50 border-blue-200',
                            taches: tachesMappees.filter(t => t.statutColonne === 'done')
                        }
                    ];
                    setColonnes(colonnesInitiales);
                }
            }
            catch (error) {
                console.error("Erreur chargement tâches:", error);
            }
        });
        fetchTaches();
    }, [user, dossier === null || dossier === void 0 ? void 0 : dossier.id]);
    const getPrioriteColor = (priorite) => {
        switch (priorite) {
            case 'Critique': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Haute': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Moyenne': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Basse': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };
    const deplacerTache = (tacheId, nouvelleColonne, metadata) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Vérifications préalables locales pour réactivité
        const colonneInprogress = colonnes.find(col => col.id === 'inprogress');
        const hasOtherInProgress = colonneInprogress === null || colonneInprogress === void 0 ? void 0 : colonneInprogress.taches.some(t => t.id !== tacheId);
        if (nouvelleColonne === 'inprogress' && hasOtherInProgress) {
            setAlertMessage('Une seule tâche peut être "En cours" à la fois pour votre groupe.');
            setShowAlertModal(true);
            return;
        }
        // NOUVEAU : Vérifier le livrable si passage en révision
        if (nouvelleColonne === 'review') {
            const tache = colonnes.flatMap(col => col.taches).find(t => t.id === tacheId);
            if (!(metadata === null || metadata === void 0 ? void 0 : metadata.livrable) && !(tache === null || tache === void 0 ? void 0 : tache.livrable)) {
                setAlertMessage('Un livrable (document PDF) est obligatoire pour envoyer une tâche en révision.');
                setShowAlertModal(true);
                return;
            }
        }
        try {
            // 2. Appel API pour persister
            let response;
            if (metadata === null || metadata === void 0 ? void 0 : metadata.file) {
                // Mode multipart pour l'upload de fichier
                const formData = new FormData();
                formData.append('statut', nouvelleColonne);
                formData.append('fichier', metadata.file);
                if (metadata.livrable) {
                    formData.append('livrable', JSON.stringify(metadata.livrable));
                }
                response = yield fetch(`http://localhost:3001/api/taches/${tacheId}/statut`, {
                    method: 'PUT',
                    body: formData // Pas de Content-Type header, le navigateur le mettra avec le boundary
                });
            }
            else {
                // Mode JSON classique
                response = yield fetch(`http://localhost:3001/api/taches/${tacheId}/statut`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        statut: nouvelleColonne,
                        livrable: metadata === null || metadata === void 0 ? void 0 : metadata.livrable
                    })
                });
            }
            if (!response.ok) {
                const errorData = yield response.json();
                setAlertMessage(errorData.error || 'Erreur lors du déplacement de la tâche.');
                setShowAlertModal(true);
                return;
            }
            // 3. Mise à jour de l'état local après succès
            setColonnes(prev => {
                const nouvellesColonnes = prev.map(col => (Object.assign(Object.assign({}, col), { taches: col.taches.filter(t => t.id !== tacheId) })));
                const tache = prev.flatMap(col => col.taches).find(t => t.id === tacheId);
                if (tache) {
                    const colonneCible = nouvellesColonnes.find(col => col.id === nouvelleColonne);
                    if (colonneCible) {
                        colonneCible.taches.push(Object.assign(Object.assign({}, tache), { statutColonne: nouvelleColonne, progression: nouvelleColonne === 'done' ? 100 : (nouvelleColonne === 'review' ? 90 : (nouvelleColonne === 'inprogress' ? 50 : 0)), livrable: (metadata === null || metadata === void 0 ? void 0 : metadata.livrable) || tache.livrable }));
                    }
                }
                return nouvellesColonnes;
            });
        }
        catch (error) {
            console.error("Erreur déplacement tâche:", error);
            setAlertMessage('Erreur de connexion au serveur.');
            setShowAlertModal(true);
        }
    });
    const filtrerTaches = (taches) => {
        return taches.filter(tache => {
            var _a;
            if (filtres.priorite && tache.priorite !== filtres.priorite)
                return false;
            if (filtres.assignee && !((_a = tache.assignee) === null || _a === void 0 ? void 0 : _a.includes(filtres.assignee)))
                return false;
            if (filtres.tags && !tache.tags.some(tag => tag.includes(filtres.tags)))
                return false;
            return true;
        });
    };
    const handleDragStart = (e, tacheId) => {
        // Empêcher le drag des tâches terminées ou en révision
        const tache = colonnes.flatMap(col => col.taches).find(t => t.id === tacheId);
        if (tache && (tache.statutColonne === 'done' || tache.statutColonne === 'review')) {
            e.preventDefault();
            setAlertMessage(`Cette tâche est en statut "${tache.statutColonne === 'done' ? 'Terminé' : 'En révision'}" et ne peut plus être déplacée.`);
            setShowAlertModal(true);
            return;
        }
        setDraggedTask(tacheId);
        e.dataTransfer.effectAllowed = 'move';
    };
    const handleDragEnd = () => {
        setDraggedTask(null);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    const handleDrop = (e, colonneId) => {
        e.preventDefault();
        if (draggedTask) {
            const tache = colonnes.flatMap(col => col.taches).find(t => t.id === draggedTask);
            if (tache) {
                // Interdiction de déplacer une tâche terminée ou en révision
                if (tache.statutColonne === 'done' || tache.statutColonne === 'review') {
                    setAlertMessage(`Impossible de déplacer une tâche déjà "${tache.statutColonne === 'done' ? 'Terminée' : 'En révision'}".`);
                    setShowAlertModal(true);
                    setDraggedTask(null);
                    return;
                }
                // Empêcher le déplacement des tâches vers "Terminé" (seul l'encadrant peut finir)
                if (colonneId === 'done' && (tache.statutColonne === 'todo' || tache.statutColonne === 'inprogress' || tache.statutColonne === 'review')) {
                    setAlertMessage('Seul votre encadrant peut valider définitivement une tâche. Déplacez-la plutôt vers "En révision".');
                    setShowAlertModal(true);
                    setDraggedTask(null);
                    return;
                }
            }
            deplacerTache(draggedTask, colonneId);
        }
        setDraggedTask(null);
    };
    const migrerVersEnCours = (tacheId) => {
        // Les vérifications sont déjà faites dans deplacerTache
        deplacerTache(tacheId, 'inprogress');
        setTacheSelectionnee(null);
    };
    const envoyerEnRevision = (tacheId) => {
        if (!fichierLivrable && !(tacheSelectionnee === null || tacheSelectionnee === void 0 ? void 0 : tacheSelectionnee.livrable)) {
            setAlertMessage('Veuillez d\'abord uploader un document PDF avant d\'envoyer en révision.');
            setShowAlertModal(true);
            return;
        }
        // Vérifier que toutes les sous-étapes sont validées
        if ((tacheSelectionnee === null || tacheSelectionnee === void 0 ? void 0 : tacheSelectionnee.sousEtapes) && tacheSelectionnee.sousEtapes.length > 0) {
            const toutesEtapesValidees = tacheSelectionnee.sousEtapes.every(etape => etape.terminee);
            if (!toutesEtapesValidees) {
                const etapesNonValidees = tacheSelectionnee.sousEtapes.filter(etape => !etape.terminee).length;
                setAlertMessage(`Vous devez valider toutes les sous-étapes avant d'envoyer en révision. ${etapesNonValidees} sous-étape(s) restante(s).`);
                setShowAlertModal(true);
                return;
            }
        }
        const livrableMetadata = fichierLivrable ? {
            nom: fichierLivrable.name,
            taille: `${(fichierLivrable.size / 1024 / 1024).toFixed(2)} MB`,
            dateUpload: new Date().toISOString()
        } : tacheSelectionnee === null || tacheSelectionnee === void 0 ? void 0 : tacheSelectionnee.livrable;
        deplacerTache(tacheId, 'review', {
            livrable: livrableMetadata,
            file: fichierLivrable
        });
        setFichierLivrable(null);
        setTacheSelectionnee(null);
    };
    const handleFileChange = (e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setAlertMessage('Veuillez sélectionner un fichier PDF.');
                setShowAlertModal(true);
                e.target.value = '';
                return;
            }
            setFichierLivrable(file);
        }
    };
    const supprimerLivrable = () => {
        setFichierLivrable(null);
        if (tacheSelectionnee) {
            setColonnes(prev => {
                return prev.map(colonne => (Object.assign(Object.assign({}, colonne), { taches: colonne.taches.map(tache => {
                        if (tache.id === tacheSelectionnee.id) {
                            return Object.assign(Object.assign({}, tache), { livrable: undefined });
                        }
                        return tache;
                    }) })));
            });
            setTacheSelectionnee(Object.assign(Object.assign({}, tacheSelectionnee), { livrable: undefined }));
        }
    };
    const toggleSousEtape = (tacheId, sousEtapeId) => __awaiter(void 0, void 0, void 0, function* () {
        let nouvellesSousEtapes = [];
        let tacheMiseAJour = null;
        setColonnes(prev => {
            const nouvellesColonnes = prev.map(colonne => (Object.assign(Object.assign({}, colonne), { taches: colonne.taches.map(tache => {
                    if (tache.id === tacheId && tache.sousEtapes) {
                        nouvellesSousEtapes = tache.sousEtapes.map(etape => etape.id === sousEtapeId ? Object.assign(Object.assign({}, etape), { terminee: !etape.terminee }) : etape);
                        const etapesTerminees = nouvellesSousEtapes.filter(e => e.terminee).length;
                        const nouvelleProgression = Math.round((etapesTerminees / nouvellesSousEtapes.length) * 100);
                        tacheMiseAJour = Object.assign(Object.assign({}, tache), { sousEtapes: nouvellesSousEtapes, progression: nouvelleProgression });
                        return tacheMiseAJour;
                    }
                    return tache;
                }) })));
            return nouvellesColonnes;
        });
        // Mettre à jour la tâche sélectionnée immédiatement pour la UI
        if (tacheSelectionnee && tacheSelectionnee.id === tacheId) {
            const updatedSE = (tacheSelectionnee.sousEtapes || []).map(etape => etape.id === sousEtapeId ? Object.assign(Object.assign({}, etape), { terminee: !etape.terminee }) : etape);
            setTacheSelectionnee(Object.assign(Object.assign({}, tacheSelectionnee), { sousEtapes: updatedSE }));
        }
        try {
            // Persister en base
            yield fetch(`http://localhost:3001/api/taches/${tacheId}/sous-etapes`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sousEtapes: nouvellesSousEtapes })
            });
        }
        catch (error) {
            console.error("Erreur mise à jour sous-étapes:", error);
        }
    });
    return (_jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, className: "space-y-6", children: loading ? (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px]", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }), _jsx("p", { className: "mt-4 text-gray-600", children: "Chargement de votre espace de travail..." })] })) : !dossier ? (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center", children: [_jsx("div", { className: "bg-gray-50 rounded-full p-6 mb-6", children: _jsx(FileText, { className: "h-12 w-12 text-gray-400" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Aucun dossier actif trouv\u00E9" }), _jsx("p", { className: "text-gray-600 max-w-md mx-auto mb-8", children: "Vous n'avez pas encore de dossier de m\u00E9moire actif. Veuillez cr\u00E9er votre dossier pour commencer \u00E0 travailler." }), _jsxs("button", { onClick: () => {
                        // Rediriger vers le dashboard ou ouvrir un modal local
                        // Pour faire simple et cohérent, on va demander d'aller sur le Dashboard
                        // ou on peut ajouter un bouton qui crée un dossier par défaut s'il le faut.
                        // Mais le plus simple est de dire d'aller sur le dashboard car le modal y est déjà.
                        window.location.hash = '#dashboard'; // Si c'est du hash routing, à vérifier.
                        // Sinon, on peut juste dire de changer d'onglet via l'UI parente (DossierCandidat.tsx)
                        alert("Veuillez créer votre dossier depuis l'onglet 'Tableau de bord'.");
                    }, className: "inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors", children: [_jsx(Plus, { className: "h-5 w-5" }), _jsx("span", { children: "Aller au tableau de bord" })] })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex flex-wrap items-center justify-between gap-4", children: _jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "flex bg-gray-100 rounded-lg p-1", children: [_jsxs("button", { onClick: () => setModeVue('kanban'), className: `px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${modeVue === 'kanban'
                                            ? 'bg-white shadow-sm text-gray-900'
                                            : 'text-gray-600 hover:text-gray-900'}`, children: [_jsx(List, { className: "h-4 w-4" }), _jsx("span", { children: "Kanban" })] }), _jsxs("button", { onClick: () => setModeVue('liste'), className: `px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${modeVue === 'liste'
                                            ? 'bg-white shadow-sm text-gray-900'
                                            : 'text-gray-600 hover:text-gray-900'}`, children: [_jsx(List, { className: "h-4 w-4" }), _jsx("span", { children: "Liste" })] })] }), _jsx("div", { className: "flex items-center space-x-3", children: _jsxs("div", { className: "relative", children: [_jsx(Filter, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsxs("select", { value: filtres.priorite, onChange: (e) => setFiltres(prev => (Object.assign(Object.assign({}, prev), { priorite: e.target.value }))), className: "pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "", children: "Toutes priorit\u00E9s" }), _jsx("option", { value: "Critique", children: "Critique" }), _jsx("option", { value: "Haute", children: "Haute" }), _jsx("option", { value: "Moyenne", children: "Moyenne" }), _jsx("option", { value: "Basse", children: "Basse" })] })] }) })] }) }), modeVue === 'kanban' && (_jsx("div", { className: "flex gap-4 overflow-x-auto pb-8", children: colonnes.map(colonne => (_jsxs("div", { className: `flex-1 min-w-[280px] max-w-xs bg-white border border-gray-200 shadow-sm flex flex-col h-[70vh] ${colonne.couleur}`, onDragOver: handleDragOver, onDrop: (e) => handleDrop(e, colonne.id), children: [_jsx("div", { className: `p-4 rounded-t-xl border-b ${colonne.couleur}`, children: _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-gray-900", children: colonne.titre }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [filtrerTaches(colonne.taches).length, " t\u00E2che", filtrerTaches(colonne.taches).length !== 1 ? 's' : ''] })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto p-2 space-y-4", children: _jsx(AnimatePresence, { children: filtrerTaches(colonne.taches).map(tache => (_jsxs(motion.div, { layout: true, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, draggable: true, onDragStart: (e) => handleDragStart(e, tache.id), onDragEnd: handleDragEnd, onClick: () => {
                                            setTacheSelectionnee(tache);
                                            setFichierLivrable(null);
                                        }, className: `p-4 bg-white border border-gray-200 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all ${draggedTask === tache.id ? 'opacity-50' : ''}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsx("h4", { className: "font-medium text-gray-900 text-sm leading-relaxed flex-1 pr-2", children: tache.titre }), _jsxs("div", { className: "flex flex-col items-end space-y-1", children: [_jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-md border ${getPrioriteColor(tache.priorite)}`, children: tache.priorite }), tache.estRetournee && (_jsx("span", { className: "px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200", children: "Retourn\u00E9e" }))] })] }), tache.description && (_jsx("p", { className: "text-gray-600 text-xs mb-3 leading-relaxed line-clamp-2", children: tache.description })), tache.progression > 0 && (_jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex justify-between text-xs text-gray-600 mb-2", children: [_jsx("span", { className: "font-medium", children: "Progression" }), _jsxs("span", { className: "font-semibold", children: [tache.progression, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-primary h-2 rounded-full transition-all duration-300", style: { width: `${tache.progression}%` } }) })] })), tache.tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mb-3", children: tache.tags.map(tag => (_jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium", children: tag }, tag))) })), _jsx("div", { className: "flex justify-between items-center text-xs text-gray-500", children: tache.dateEcheance && (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), _jsx("span", { className: "font-medium", children: (() => {
                                                                const d = new Date(tache.dateEcheance);
                                                                return isNaN(d.getTime()) ? 'Date invalide' : d.toLocaleDateString();
                                                            })() })] })) })] }, tache.id))) }) })] }, colonne.id))) })), modeVue === 'liste' && (_jsx("div", { className: "bg-white rounded-xl shadow-sm border", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase", children: "T\u00E2che" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase", children: "Statut" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase", children: "Priorit\u00E9" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase", children: "Progression" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase", children: "\u00C9ch\u00E9ance" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: colonnes.flatMap(col => filtrerTaches(col.taches)).map(tache => {
                                        var _a;
                                        return (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: tache.titre }), _jsx("div", { className: "text-sm text-gray-600 mt-1", children: tache.description })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full", children: (_a = colonnes.find(col => col.id === tache.statutColonne)) === null || _a === void 0 ? void 0 : _a.titre }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-2 py-1 text-xs font-medium rounded-md border ${getPrioriteColor(tache.priorite)}`, children: tache.priorite }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-20 bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-primary h-2 rounded-full transition-all", style: { width: `${tache.progression}%` } }) }), _jsxs("span", { className: "text-sm font-medium text-gray-900 w-10", children: [tache.progression, "%"] })] }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-600", children: tache.dateEcheance ? (_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsx("span", { children: (() => {
                                                                    const d = new Date(tache.dateEcheance);
                                                                    return isNaN(d.getTime()) ? 'Date invalide' : d.toLocaleDateString();
                                                                })() })] })) : (_jsx("span", { className: "text-gray-400", children: "-" })) })] }, tache.id));
                                    }) })] }) }) })), _jsx(AnimatePresence, { children: tacheSelectionnee && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "D\u00E9tails de la t\u00E2che" }), _jsx("button", { onClick: () => setTacheSelectionnee(null), className: "p-2 hover:bg-gray-100 transition-colors", children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900", children: tacheSelectionnee.titre }), tacheSelectionnee.estRetournee && (_jsx("div", { className: "flex items-center space-x-2 mt-2", children: _jsx("span", { className: "px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200", children: "T\u00E2che retourn\u00E9e" }) }))] }), _jsx("span", { className: `px-3 py-1 text-sm font-medium border ${getPrioriteColor(tacheSelectionnee.priorite)}`, children: tacheSelectionnee.priorite })] }), tacheSelectionnee.urgent && (_jsxs("div", { className: "flex items-center space-x-2 mt-2 text-red-600", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx("span", { className: "text-sm font-medium", children: "Urgent" })] }))] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Description" }), _jsx("p", { className: "text-gray-700", children: tacheSelectionnee.description })] }), tacheSelectionnee.consigne && (_jsx("div", { className: "bg-blue-50 border border-blue-200 p-4", children: _jsxs("div", { className: "flex items-start space-x-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-blue-900 mb-1", children: "Consigne" }), _jsx("p", { className: "text-blue-800 text-sm", children: tacheSelectionnee.consigne })] })] }) })), tacheSelectionnee.note && (_jsx("div", { className: "bg-blue-50 border border-blue-200 p-4", children: _jsxs("div", { className: "flex items-start space-x-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-blue-900 mb-1", children: "Note" }), _jsx("p", { className: "text-blue-800 text-sm", children: tacheSelectionnee.note })] })] }) })), tacheSelectionnee.estRetournee && tacheSelectionnee.feedbackRetour && (_jsx("div", { className: "bg-blue-50 border-2 border-blue-300 p-4", children: _jsxs("div", { className: "flex items-start space-x-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "font-semibold text-blue-900", children: "T\u00E2che retourn\u00E9e par l'encadrant" }), _jsx("span", { className: "text-xs text-blue-700", children: new Date(tacheSelectionnee.feedbackRetour.dateRetour).toLocaleDateString('fr-FR', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        }) })] }), _jsx("p", { className: "text-blue-800 text-sm", children: tacheSelectionnee.feedbackRetour.commentaire }), _jsx("p", { className: "text-xs text-blue-700 mt-2", children: "Les corrections ont \u00E9t\u00E9 ajout\u00E9es dans la liste des sous-\u00E9tapes ci-dessous." })] })] }) })), (() => {
                                            var _a, _b;
                                            // Combiner les sous-étapes existantes avec les corrections du feedback si la tâche est retournée
                                            let toutesSousEtapes = [];
                                            if (tacheSelectionnee.sousEtapes && tacheSelectionnee.sousEtapes.length > 0) {
                                                toutesSousEtapes = [...tacheSelectionnee.sousEtapes];
                                            }
                                            // Ajouter les corrections comme nouvelles sous-étapes si la tâche est retournée
                                            if (tacheSelectionnee.estRetournee && ((_a = tacheSelectionnee.feedbackRetour) === null || _a === void 0 ? void 0 : _a.corrections)) {
                                                const maxId = toutesSousEtapes.length > 0
                                                    ? Math.max(...toutesSousEtapes.map(e => e.id))
                                                    : 0;
                                                const correctionsEtapes = tacheSelectionnee.feedbackRetour.corrections.map((correction, index) => ({
                                                    id: maxId + index + 1,
                                                    titre: correction,
                                                    terminee: false
                                                }));
                                                toutesSousEtapes = [...toutesSousEtapes, ...correctionsEtapes];
                                            }
                                            if (toutesSousEtapes.length === 0)
                                                return null;
                                            // Séparer les sous-étapes originales des corrections
                                            const sousEtapesOriginales = tacheSelectionnee.sousEtapes || [];
                                            // Filtrer les corrections pour ne garder que celles qui ne sont pas encore dans les sous-étapes
                                            const correctionsNonAjoutees = tacheSelectionnee.estRetournee && ((_b = tacheSelectionnee.feedbackRetour) === null || _b === void 0 ? void 0 : _b.corrections)
                                                ? tacheSelectionnee.feedbackRetour.corrections.filter(correction => {
                                                    // Vérifier si cette correction existe déjà dans les sous-étapes
                                                    return !sousEtapesOriginales.some(se => se.titre === correction);
                                                })
                                                : [];
                                            // Créer les sous-étapes pour les corrections non ajoutées
                                            const sousEtapesCorrections = correctionsNonAjoutees.length > 0
                                                ? (() => {
                                                    const maxId = sousEtapesOriginales.length > 0
                                                        ? Math.max(...sousEtapesOriginales.map(e => e.id))
                                                        : 0;
                                                    return correctionsNonAjoutees.map((correction, index) => ({
                                                        id: maxId + index + 1,
                                                        titre: correction,
                                                        terminee: false
                                                    }));
                                                })()
                                                : [];
                                            return (_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-3", children: tacheSelectionnee.statutColonne === 'review' || tacheSelectionnee.statutColonne === 'done'
                                                            ? 'Sous-étapes réalisées'
                                                            : 'Sous-étapes à réaliser' }), sousEtapesOriginales.length > 0 && (_jsx("div", { className: "space-y-2 mb-4", children: sousEtapesOriginales.map((sousEtape) => (_jsxs("div", { className: `flex items-center space-x-3 p-3 bg-gray-50 transition-colors ${tacheSelectionnee.statutColonne === 'inprogress' ? 'hover:bg-gray-100 cursor-pointer' : ''}`, onClick: () => {
                                                                if (tacheSelectionnee.statutColonne === 'inprogress') {
                                                                    toggleSousEtape(tacheSelectionnee.id, sousEtape.id);
                                                                }
                                                            }, children: [sousEtape.terminee ? (_jsx(CheckCircle, { className: "h-5 w-5 text-blue-600 flex-shrink-0" })) : (_jsx(Circle, { className: "h-5 w-5 text-gray-400 flex-shrink-0" })), _jsx("span", { className: `flex-1 ${sousEtape.terminee ? 'text-gray-500 line-through' : 'text-gray-900'}`, children: sousEtape.titre })] }, sousEtape.id))) })), sousEtapesCorrections.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "mb-2", children: [_jsx("h5", { className: "text-sm font-semibold text-gray-900 mb-1", children: "Corrections \u00E0 apporter :" }), _jsx("p", { className: "text-xs text-gray-600", children: "Nouvelles sous-\u00E9tapes ajout\u00E9es suite au retour de l'encadrant" })] }), sousEtapesCorrections.map((sousEtape) => (_jsxs("div", { className: `flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 transition-colors ${tacheSelectionnee.statutColonne === 'inprogress' ? 'hover:bg-gray-100 cursor-pointer' : ''}`, onClick: () => {
                                                                    if (tacheSelectionnee.statutColonne === 'inprogress') {
                                                                        // Ajouter la correction comme sous-étape terminée
                                                                        setColonnes(prev => {
                                                                            return prev.map(colonne => (Object.assign(Object.assign({}, colonne), { taches: colonne.taches.map(tache => {
                                                                                    var _a;
                                                                                    if (tache.id === tacheSelectionnee.id) {
                                                                                        // Vérifier si la correction existe déjà (par titre pour éviter les doublons)
                                                                                        const existeDeja = (_a = tache.sousEtapes) === null || _a === void 0 ? void 0 : _a.some(se => se.titre === sousEtape.titre);
                                                                                        if (!existeDeja) {
                                                                                            const nouvellesSousEtapes = [
                                                                                                ...(tache.sousEtapes || []),
                                                                                                { id: sousEtape.id, titre: sousEtape.titre, terminee: true }
                                                                                            ];
                                                                                            const etapesTerminees = nouvellesSousEtapes.filter(e => e.terminee).length;
                                                                                            const nouvelleProgression = Math.round((etapesTerminees / nouvellesSousEtapes.length) * 100);
                                                                                            const tacheMiseAJour = Object.assign(Object.assign({}, tache), { sousEtapes: nouvellesSousEtapes, progression: nouvelleProgression });
                                                                                            // Mettre à jour la tâche sélectionnée immédiatement
                                                                                            setTimeout(() => {
                                                                                                setTacheSelectionnee(tacheMiseAJour);
                                                                                            }, 0);
                                                                                            return tacheMiseAJour;
                                                                                        }
                                                                                    }
                                                                                    return tache;
                                                                                }) })));
                                                                        });
                                                                    }
                                                                }, children: [_jsx(Circle, { className: "h-5 w-5 text-gray-400 flex-shrink-0" }), _jsx("span", { className: "flex-1 text-gray-900", children: sousEtape.titre })] }, sousEtape.id)))] })), tacheSelectionnee.statutColonne === 'inprogress' && (_jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Cliquez sur une sous-\u00E9tape pour la valider" })), tacheSelectionnee.statutColonne === 'review' && (_jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Toutes les sous-\u00E9tapes ont \u00E9t\u00E9 valid\u00E9es avant l'envoi en r\u00E9vision." })), tacheSelectionnee.statutColonne === 'done' && (_jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Toutes les sous-\u00E9tapes ont \u00E9t\u00E9 r\u00E9alis\u00E9es et la t\u00E2che a \u00E9t\u00E9 valid\u00E9e par l'encadrant." }))] }));
                                        })(), _jsxs("div", { className: "border-t border-gray-200 pt-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-3", children: "Informations" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [tacheSelectionnee.dateEcheance && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Clock, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Date d'\u00E9ch\u00E9ance" }), _jsx("p", { className: "font-medium text-gray-900", children: new Date(tacheSelectionnee.dateEcheance).toLocaleDateString('fr-FR', {
                                                                                day: 'numeric',
                                                                                month: 'long',
                                                                                year: 'numeric'
                                                                            }) })] })] })), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Calendar, { className: "h-5 w-5 text-gray-400" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Date de cr\u00E9ation" }), _jsx("p", { className: "font-medium text-gray-900", children: new Date(tacheSelectionnee.dateCreation).toLocaleDateString('fr-FR', {
                                                                                day: 'numeric',
                                                                                month: 'long',
                                                                                year: 'numeric'
                                                                            }) })] })] })] })] }), tacheSelectionnee.tags.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Tags" }), _jsx("div", { className: "flex flex-wrap gap-2", children: tacheSelectionnee.tags.map(tag => (_jsx("span", { className: "px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium", children: tag }, tag))) })] })), (tacheSelectionnee.statutColonne === 'todo' || tacheSelectionnee.statutColonne === 'inprogress' || tacheSelectionnee.statutColonne === 'review' || tacheSelectionnee.statutColonne === 'done') && (_jsxs("div", { className: "bg-gray-50 border border-gray-200 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: "Progression" }), _jsxs("span", { className: "text-sm font-bold text-gray-900", children: [tacheSelectionnee.progression, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 h-2", children: _jsx("div", { className: `h-2 transition-all duration-300 ${tacheSelectionnee.statutColonne === 'todo'
                                                            ? 'bg-gray-300'
                                                            : tacheSelectionnee.statutColonne === 'review'
                                                                ? 'bg-blue-600'
                                                                : tacheSelectionnee.statutColonne === 'done'
                                                                    ? 'bg-blue-600'
                                                                    : 'bg-primary'}`, style: { width: `${tacheSelectionnee.progression}%` } }) }), tacheSelectionnee.statutColonne === 'todo' ? (_jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Cette t\u00E2che n'a pas encore \u00E9t\u00E9 commenc\u00E9e." })) : tacheSelectionnee.statutColonne === 'review' ? (_jsx("p", { className: "text-xs text-gray-500 mt-2", children: "T\u00E2che en cours de r\u00E9vision par l'encadrant." })) : tacheSelectionnee.statutColonne === 'done' ? (_jsx("p", { className: "text-xs text-gray-500 mt-2", children: "T\u00E2che termin\u00E9e et valid\u00E9e par l'encadrant." })) : (_jsx("p", { className: "text-xs text-gray-500 mt-2", children: tacheSelectionnee.sousEtapes && tacheSelectionnee.sousEtapes.length > 0
                                                        ? `${tacheSelectionnee.sousEtapes.filter(e => e.terminee).length} sur ${tacheSelectionnee.sousEtapes.length} sous-étapes terminées`
                                                        : 'Tâche en cours de réalisation' }))] })), tacheSelectionnee.statutColonne === 'review' && tacheSelectionnee.livrable && (_jsxs("div", { className: "border-t border-gray-200 pt-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-3", children: "Document envoy\u00E9 en r\u00E9vision" }), _jsx("div", { className: "bg-gray-50 border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-red-600 flex items-center justify-center", children: _jsx(FileText, { className: "h-6 w-6 text-white" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h5", { className: "font-medium text-gray-900", children: tacheSelectionnee.livrable.nom }), _jsxs("div", { className: "flex items-center space-x-4 mt-1 text-xs text-gray-600", children: [_jsx("span", { children: tacheSelectionnee.livrable.taille }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Upload\u00E9 le ", new Date(tacheSelectionnee.livrable.dateUpload).toLocaleDateString('fr-FR', {
                                                                                        day: 'numeric',
                                                                                        month: 'long',
                                                                                        year: 'numeric',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })] })] })] }), _jsxs("button", { onClick: () => {
                                                                    var _a;
                                                                    // Simuler le téléchargement
                                                                    if ((_a = tacheSelectionnee.livrable) === null || _a === void 0 ? void 0 : _a.fichier) {
                                                                        const url = URL.createObjectURL(tacheSelectionnee.livrable.fichier);
                                                                        const a = document.createElement('a');
                                                                        a.href = url;
                                                                        a.download = tacheSelectionnee.livrable.nom;
                                                                        a.click();
                                                                        URL.revokeObjectURL(url);
                                                                    }
                                                                }, className: "px-4 py-2 bg-navy text-white hover:bg-navy-dark transition-colors flex items-center space-x-2 text-sm", title: "T\u00E9l\u00E9charger le document", children: [_jsx(Download, { className: "h-4 w-4" }), _jsx("span", { children: "T\u00E9l\u00E9charger" })] })] }) }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Ce document est en cours de r\u00E9vision par votre encadrant. Vous ne pouvez pas le modifier tant que la r\u00E9vision n'est pas termin\u00E9e." })] })), tacheSelectionnee.statutColonne === 'done' && tacheSelectionnee.livrable && (_jsxs("div", { className: "border-t border-gray-200 pt-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-3", children: "Document valid\u00E9" }), _jsx("div", { className: "bg-gray-50 border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-12 h-12 bg-blue-600 flex items-center justify-center", children: _jsx(FileText, { className: "h-6 w-6 text-white" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h5", { className: "font-medium text-gray-900", children: tacheSelectionnee.livrable.nom }), _jsxs("div", { className: "flex items-center space-x-4 mt-1 text-xs text-gray-600", children: [_jsx("span", { children: tacheSelectionnee.livrable.taille }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Valid\u00E9 le ", new Date(tacheSelectionnee.livrable.dateUpload).toLocaleDateString('fr-FR', {
                                                                                        day: 'numeric',
                                                                                        month: 'long',
                                                                                        year: 'numeric',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })] })] })] }), _jsxs("button", { onClick: () => {
                                                                    var _a;
                                                                    // Simuler le téléchargement
                                                                    if ((_a = tacheSelectionnee.livrable) === null || _a === void 0 ? void 0 : _a.fichier) {
                                                                        const url = URL.createObjectURL(tacheSelectionnee.livrable.fichier);
                                                                        const a = document.createElement('a');
                                                                        a.href = url;
                                                                        a.download = tacheSelectionnee.livrable.nom;
                                                                        a.click();
                                                                        URL.revokeObjectURL(url);
                                                                    }
                                                                }, className: "px-4 py-2 bg-navy text-white hover:bg-navy-dark transition-colors flex items-center space-x-2 text-sm", title: "T\u00E9l\u00E9charger le document", children: [_jsx(Download, { className: "h-4 w-4" }), _jsx("span", { children: "T\u00E9l\u00E9charger" })] })] }) }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Ce document a \u00E9t\u00E9 valid\u00E9 par votre encadrant. La t\u00E2che est termin\u00E9e." })] })), tacheSelectionnee.statutColonne === 'inprogress' && (_jsxs("div", { className: "border-t border-gray-200 pt-4", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-3", children: "Livrable (Document PDF)" }), (tacheSelectionnee.livrable || fichierLivrable) && (_jsx("div", { className: "bg-gray-50 border border-gray-200 p-4 mb-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-red-600 flex items-center justify-center", children: _jsx(FileText, { className: "h-5 w-5 text-white" }) }), _jsxs("div", { children: [_jsx("h5", { className: "font-medium text-gray-900 text-sm", children: fichierLivrable ? fichierLivrable.name : (_a = tacheSelectionnee.livrable) === null || _a === void 0 ? void 0 : _a.nom }), _jsxs("p", { className: "text-xs text-gray-600", children: [fichierLivrable
                                                                                        ? `${(fichierLivrable.size / 1024 / 1024).toFixed(2)} MB`
                                                                                        : (_b = tacheSelectionnee.livrable) === null || _b === void 0 ? void 0 : _b.taille, tacheSelectionnee.livrable && !fichierLivrable && (_jsxs("span", { className: "ml-2", children: ["\u2022 Upload\u00E9 le ", new Date(tacheSelectionnee.livrable.dateUpload).toLocaleDateString('fr-FR')] }))] })] })] }), _jsx("button", { onClick: supprimerLivrable, className: "p-2 hover:bg-gray-200 transition-colors", title: "Supprimer le livrable", children: _jsx(Trash2, { className: "h-4 w-4 text-gray-600" }) })] }) })), _jsxs("div", { className: "border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors", children: [_jsx("input", { type: "file", id: `file-upload-${tacheSelectionnee.id}`, accept: ".pdf", onChange: handleFileChange, className: "hidden" }), _jsxs("label", { htmlFor: `file-upload-${tacheSelectionnee.id}`, className: "cursor-pointer flex flex-col items-center space-y-2", children: [_jsx(Upload, { className: "h-8 w-8 text-gray-400" }), _jsxs("div", { children: [_jsx("span", { className: "text-sm font-medium text-gray-700", children: fichierLivrable || tacheSelectionnee.livrable
                                                                                ? 'Remplacer le document'
                                                                                : 'Cliquez pour uploader un document PDF' }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: fichierLivrable || tacheSelectionnee.livrable
                                                                                ? 'Le nouveau fichier remplacera l\'ancien'
                                                                                : 'Format accepté: PDF uniquement' })] })] })] }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Le document upload\u00E9 sera le livrable envoy\u00E9 pour r\u00E9vision. Chaque nouvel upload remplacera le pr\u00E9c\u00E9dent." })] })), _jsxs("div", { className: "flex justify-end pt-4 border-t border-gray-200", children: [tacheSelectionnee.statutColonne === 'todo' && (_jsxs("button", { onClick: () => migrerVersEnCours(tacheSelectionnee.id), className: "px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-colors flex items-center space-x-2 font-medium", children: [_jsx(ArrowRight, { className: "h-5 w-5" }), _jsx("span", { children: "Commencer la t\u00E2che" })] })), tacheSelectionnee.statutColonne === 'inprogress' && (_jsxs("button", { onClick: () => envoyerEnRevision(tacheSelectionnee.id), disabled: (!fichierLivrable && !tacheSelectionnee.livrable) ||
                                                        (tacheSelectionnee.sousEtapes && tacheSelectionnee.sousEtapes.length > 0 &&
                                                            !tacheSelectionnee.sousEtapes.every(etape => etape.terminee)), className: `px-6 py-3 flex items-center space-x-2 font-medium transition-colors ${(fichierLivrable || tacheSelectionnee.livrable) &&
                                                        (!tacheSelectionnee.sousEtapes || tacheSelectionnee.sousEtapes.length === 0 ||
                                                            tacheSelectionnee.sousEtapes.every(etape => etape.terminee))
                                                        ? 'bg-primary text-white hover:bg-primary-dark'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`, children: [_jsx(ArrowRight, { className: "h-5 w-5" }), _jsx("span", { children: "Envoyer en r\u00E9vision" })] }))] })] })] }) })) }), _jsx(AnimatePresence, { children: showAlertModal && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white shadow-2xl max-w-md w-full", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start space-x-4 mb-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center", children: _jsx(Info, { className: "h-5 w-5 text-blue-600" }) }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Information" }), _jsx("p", { className: "text-gray-700 text-sm", children: alertMessage })] }), _jsx("button", { onClick: () => setShowAlertModal(false), className: "p-1 hover:bg-gray-100 transition-colors flex-shrink-0", children: _jsx(X, { className: "h-5 w-5 text-gray-500" }) })] }), _jsx("div", { className: "flex justify-end mt-6", children: _jsx("button", { onClick: () => setShowAlertModal(false), className: "px-6 py-2 bg-navy text-white hover:bg-navy-dark transition-colors font-medium", children: "Compris" }) })] }) }) })) })] })) }, "espace-travail"));
};
export default EspaceTravail;
