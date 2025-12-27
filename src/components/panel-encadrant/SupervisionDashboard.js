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
import { useState, useEffect, useMemo } from 'react';
import { Search, CheckCircle, FileText, ExternalLink, ArrowLeft, X, Users, Plus, Eye } from 'lucide-react';
export const SupervisionDashboard = ({ demandes, encadrantId, anneeAcademique }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [taches, setTaches] = useState([]);
    const [loadingTaches, setLoadingTaches] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showReviewModal, setShowReviewModal] = useState(null);
    const [feedback, setFeedback] = useState({
        commentaire: '',
        corrections: ['']
    });
    // Filtrer les demandes selon la recherche
    const filteredDemandes = useMemo(() => {
        return demandes.filter(d => {
            var _a, _b, _c;
            const nomComplet = d.candidats
                ? d.candidats.map(c => `${c.prenom} ${c.nom}`).join(' ')
                : `${(_a = d.candidat) === null || _a === void 0 ? void 0 : _a.prenom} ${(_b = d.candidat) === null || _b === void 0 ? void 0 : _b.nom}`;
            const search = searchQuery.toLowerCase();
            return (nomComplet.toLowerCase().includes(search) ||
                ((_c = d.dossierMemoire) === null || _c === void 0 ? void 0 : _c.titre.toLowerCase().includes(search)));
        });
    }, [demandes, searchQuery]);
    const [demandePrelecture, setDemandePrelecture] = useState(null);
    // Charger les tâches et la pré-lecture quand une demande est sélectionnée
    useEffect(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!selectedDemande)
                return;
            setLoadingTaches(true);
            try {
                const [tachesRes, prelectureRes] = yield Promise.all([
                    fetch(`http://localhost:3001/api/demandes/${selectedDemande.idDemande}/taches`),
                    fetch(`http://localhost:3001/api/demandes/${selectedDemande.idDemande}/prelecture`)
                ]);
                if (tachesRes.ok) {
                    const tachesData = yield tachesRes.json();
                    setTaches(tachesData);
                    console.log('📋 Tâches chargées:', tachesData);
                }
                if (prelectureRes.ok) {
                    const prelectureData = yield prelectureRes.json();
                    setDemandePrelecture(prelectureData);
                    console.log('📄 Pré-lecture chargée:', prelectureData);
                }
                else {
                    setDemandePrelecture(null);
                    console.log('📄 Aucune pré-lecture trouvée');
                }
            }
            catch (error) {
                console.error("Erreur chargement données:", error);
            }
            finally {
                setLoadingTaches(false);
            }
        });
        fetchData();
    }, [selectedDemande]);
    const handleUpdateStatus = (tacheId, nouveauStatut, feedbackData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:3001/api/taches/${tacheId}/statut`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    statut: nouveauStatut,
                    feedbackRetour: feedbackData ? {
                        commentaire: feedbackData.commentaire,
                        corrections: feedbackData.corrections.filter((c) => c.trim())
                    } : undefined
                })
            });
            if (response.ok) {
                // Rafraîchir les tâches
                const updatedResponse = yield fetch(`http://localhost:3001/api/demandes/${selectedDemande.idDemande}/taches`);
                const data = yield updatedResponse.json();
                setTaches(data);
                setShowReviewModal(null);
                setFeedback({ commentaire: '', corrections: [''] });
            }
        }
        catch (error) {
            console.error("Erreur mise à jour statut:", error);
        }
    });
    const handleValiderPrelecture = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!selectedDemande)
            return;
        if (!window.confirm("Êtes-vous sûr de vouloir de lancer l'analyse anti-plagiat et la pré-lecture ?")) {
            return;
        }
        try {
            const response = yield fetch(`http://localhost:3001/api/demandes/${selectedDemande.idDemande}/autoriser-prelecture`, {
                method: 'PUT'
            });
            if (response.ok) {
                const data = yield response.json();
                setDemandePrelecture(data.demandePrelecture);
                alert("Analyse anti-plagiat lancée ! Consultez le rapport ci-dessous.");
                // Recharger les données pour mettre à jour l'étape
                const updatedDossier = data.dossier;
                setSelectedDemande(Object.assign(Object.assign({}, selectedDemande), { dossierMemoire: Object.assign(Object.assign({}, selectedDemande.dossierMemoire), updatedDossier) }));
            }
            else {
                const error = yield response.json();
                alert(`Erreur : ${error.error}`);
            }
        }
        catch (error) {
            console.error("Erreur validation pré-lecture:", error);
            alert("Erreur de connexion au serveur.");
        }
    });
    const handleTraiterPlagiat = (action) => __awaiter(void 0, void 0, void 0, function* () {
        if (!demandePrelecture)
            return;
        const commentaire = action === 'rejeter' ? prompt("Motif du rejet :") : null;
        if (action === 'rejeter' && !commentaire)
            return;
        try {
            const response = yield fetch(`http://localhost:3001/api/prelecture/${demandePrelecture.id}/traiter-plagiat`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, commentaire })
            });
            if (response.ok) {
                const data = yield response.json();
                setDemandePrelecture(data.demandePrelecture);
                alert(action === 'rejeter' ? "Dossier rejeté pour plagiat." : "Dossier envoyé à la commission TRI.");
            }
        }
        catch (error) {
            console.error("Erreur traitement plagiat:", error);
        }
    });
    const handleBouclageFinal = (action) => __awaiter(void 0, void 0, void 0, function* () {
        if (!demandePrelecture)
            return;
        const commentaire = action === 'creer_tache' ? prompt("Tâches correctives à effectuer :") : null;
        if (action === 'creer_tache' && !commentaire)
            return;
        try {
            const response = yield fetch(`http://localhost:3001/api/prelecture/${demandePrelecture.id}/bouclage-encadrant`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, commentaire })
            });
            if (response.ok) {
                const data = yield response.json();
                setDemandePrelecture(data.demandePrelecture);
                alert(action === 'cloturer' ? "Phase de pré-lecture bouclée avec succès !" : "Tâches correctives envoyées.");
                if (action === 'cloturer')
                    setSelectedDemande(null);
            }
        }
        catch (error) {
            console.error("Erreur bouclage:", error);
        }
    });
    const renderTaskColumn = (title, status, count) => {
        const columnTasks = taches.filter(t => t.statut === status);
        return (_jsxs("div", { className: "flex-1 min-w-[300px] flex flex-col bg-gray-50 border border-gray-200 rounded-sm", children: [_jsxs("div", { className: "p-3 border-b border-gray-200 bg-white flex justify-between items-center", children: [_jsx("h3", { className: "font-bold text-sm text-gray-700 uppercase tracking-wider", children: title }), _jsx("span", { className: "text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full", children: columnTasks.length })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-2 space-y-2", children: [columnTasks.map(tache => (_jsxs("div", { className: `bg-white p-3 border border-gray-200 shadow-sm hover:border-gray-400 transition-colors cursor-pointer group ${tache.statut === 'review' ? 'border-l-4 border-l-primary' : ''}`, onClick: () => tache.statut === 'review' && setShowReviewModal(tache), children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsx("h4", { className: "font-semibold text-gray-900 text-sm", children: tache.titre }), tache.estRetournee && (_jsx("span", { className: "text-[10px] font-bold text-red-600 border border-red-200 px-1 rounded bg-red-50", children: "REJET\u00C9" }))] }), _jsx("p", { className: "text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed", children: tache.description }), _jsxs("div", { className: "flex items-center justify-between mt-auto", children: [_jsx("span", { className: `text-[10px] font-bold px-1.5 py-0.5 rounded ${tache.priorite === 'Critique' ? 'bg-red-600 text-white' :
                                                tache.priorite === 'Haute' ? 'bg-orange-500 text-white' :
                                                    'bg-gray-200 text-gray-700'}`, children: tache.priorite.toUpperCase() }), tache.statut === 'review' && (_jsxs("span", { className: "text-primary text-xs font-bold group-hover:underline flex items-center gap-1", children: [_jsx(FileText, { className: "h-3 w-3" }), "R\u00C9VISER"] }))] })] }, tache.id))), columnTasks.length === 0 && (_jsx("div", { className: "text-center py-6 text-gray-400 text-xs", children: "Aucune t\u00E2che" }))] })] }));
    };
    if (selectedDemande) {
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("button", { onClick: () => setSelectedDemande(null), className: "flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold", children: [_jsx(ArrowLeft, { className: "h-4 w-4" }), "RETOUR \u00C0 LA LISTE"] }), _jsxs("div", { className: "bg-white border border-gray-200 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: (_a = selectedDemande.dossierMemoire) === null || _a === void 0 ? void 0 : _a.titre }), _jsxs("div", { className: "flex items-center gap-2 text-gray-600 text-sm mt-1", children: [_jsx(Users, { className: "h-4 w-4" }), _jsx("span", { className: "font-medium", children: selectedDemande.candidats
                                                ? selectedDemande.candidats.map(c => `${c.prenom} ${c.nom}`).join(' & ')
                                                : `${(_b = selectedDemande.candidat) === null || _b === void 0 ? void 0 : _b.prenom} ${(_c = selectedDemande.candidat) === null || _c === void 0 ? void 0 : _c.nom}` })] })] }), _jsxs("div", { className: "w-full md:w-auto flex flex-col items-end", children: [_jsxs("div", { className: "text-xs font-bold text-gray-500 uppercase mb-1", children: ["Avancement global : ", (_d = selectedDemande.dossierMemoire) === null || _d === void 0 ? void 0 : _d.progression, "%"] }), _jsx("div", { className: "w-48 bg-gray-100 h-1.5 rounded-full overflow-hidden", children: _jsx("div", { className: "bg-primary h-full transition-all duration-500", style: { width: `${(_e = selectedDemande.dossierMemoire) === null || _e === void 0 ? void 0 : _e.progression}%` } }) })] }), (() => {
                            // Conditions pour afficher le bouton "Autoriser pré-lecture":
                            // 1. Il y a au moins une tâche
                            // 2. Toutes les tâches sont à "done"
                            // 3. Il n'y a pas encore de demande de pré-lecture créée
                            const condition1 = taches.length > 0;
                            const condition2 = taches.every(t => t.statut === 'done');
                            const condition3 = !demandePrelecture;
                            const showButton = condition1 && condition2 && condition3;
                            console.log('🔍 DEBUG BOUTON PRÉ-LECTURE:');
                            console.log('  taches.length:', taches.length);
                            console.log('  taches:', taches.map(t => ({ id: t.id, titre: t.titre, statut: t.statut })));
                            console.log('  condition1 (au moins 1 tâche):', condition1);
                            console.log('  condition2 (toutes done):', condition2);
                            console.log('  condition3 (pas de prelecture):', condition3);
                            console.log('  demandePrelecture:', demandePrelecture);
                            console.log('  → AFFICHER BOUTON?', showButton);
                            return showButton ? (_jsxs("div", { className: "flex flex-col items-end gap-2", children: [_jsxs("button", { onClick: handleValiderPrelecture, className: "px-4 py-2 bg-green-600 text-white font-bold text-sm shadow hover:bg-green-700 transition-colors flex items-center gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "AUTORISER PR\u00C9-LECTURE"] }), demandePrelecture && (_jsxs("div", { className: "flex flex-col items-end gap-3 p-3 bg-gray-50 border border-gray-200 rounded", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-[10px] font-bold text-gray-500 uppercase", children: "Score Plagiat" }), _jsxs("span", { className: `text-lg font-black ${demandePrelecture.scorePlagiat > 70 ? 'text-red-600' : 'text-green-600'}`, children: [demandePrelecture.scorePlagiat, "%"] })] }), _jsxs("a", { href: `http://localhost:3001/${demandePrelecture.rapportAntiPlagiatUrl}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs font-bold text-primary flex items-center gap-1 hover:underline", children: [_jsx(Eye, { className: "h-3 w-3" }), " VOIR LE RAPPORT"] })] }), demandePrelecture.statut === 'EN_ATTENTE_ANTI_PLAGIAT' && (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleTraiterPlagiat('rejeter'), className: "px-3 py-1.5 bg-red-600 text-white font-bold text-[10px] uppercase rounded hover:bg-red-700 transition-colors", children: "Rejeter (Plagiat)" }), _jsx("button", { onClick: () => handleTraiterPlagiat('accepter'), className: "px-3 py-1.5 bg-primary text-white font-bold text-[10px] uppercase rounded hover:bg-primary/90 transition-colors", children: "Confirmer & Envoyer TRI" })] })), demandePrelecture.statut === 'EN_COURS_TRI' && (_jsx("span", { className: "text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold border border-amber-200", children: "EN COURS DE LECTURE (TRI)" })), demandePrelecture.statut === 'VALIDE_TRI' && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "p-2 bg-blue-50 border border-blue-100 rounded text-[11px]", children: [_jsx("p", { className: "font-bold text-blue-800 mb-1", children: "Feedback TRI :" }), _jsxs("p", { className: "italic text-gray-700", children: ["\"", demandePrelecture.feedbackTRI, "\""] })] }), _jsxs("div", { className: "flex gap-2 justify-end", children: [_jsx("button", { onClick: () => handleBouclageFinal('creer_tache'), className: "px-3 py-1.5 bg-gray-600 text-white font-bold text-[10px] uppercase rounded hover:bg-gray-700 transition-colors", children: "Cr\u00E9er t\u00E2che corrective" }), _jsx("button", { onClick: () => handleBouclageFinal('cloturer'), className: "px-3 py-1.5 bg-green-600 text-white font-bold text-[10px] uppercase rounded hover:bg-green-700 transition-colors", children: "Boucler la pr\u00E9-lecture" })] })] }))] }))] })) : null;
                        })()] }), _jsxs("div", { className: "flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-280px)] min-h-[500px]", children: [renderTaskColumn('À faire', 'todo', 0), renderTaskColumn('En cours', 'inprogress', 0), renderTaskColumn('En révision', 'review', 0), renderTaskColumn('Terminé', 'done', 0)] }), showReviewModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4", children: _jsxs("div", { className: "bg-white border border-gray-300 w-full max-w-xl shadow-2xl overflow-hidden flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center", children: [_jsxs("h3", { className: "font-bold text-gray-900 uppercase", children: ["R\u00E9vision : ", showReviewModal.titre] }), _jsx("button", { onClick: () => setShowReviewModal(null), className: "p-1 hover:bg-gray-200 transition-colors", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "p-6 space-y-6 overflow-y-auto max-h-[70vh]", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border border-blue-100 bg-blue-50 rounded", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(FileText, { className: "h-6 w-6 text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm", children: ((_f = showReviewModal.livrable) === null || _f === void 0 ? void 0 : _f.nom) || 'Document livrable' }), _jsxs("p", { className: "text-[10px] text-gray-500", children: ["Upload\u00E9 le ", new Date(((_g = showReviewModal.livrable) === null || _g === void 0 ? void 0 : _g.dateUpload) || '').toLocaleDateString('fr-FR')] })] })] }), _jsxs("a", { href: `http://localhost:3001/${(_h = showReviewModal.livrable) === null || _h === void 0 ? void 0 : _h.chemin}`, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-bold hover:bg-primary-700 transition-colors", children: [_jsx(ExternalLink, { className: "h-3.5 w-3.5" }), "CONSULTER PDF"] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-700 uppercase mb-2", children: "Commentaires globaux" }), _jsx("textarea", { value: feedback.commentaire, onChange: (e) => setFeedback(Object.assign(Object.assign({}, feedback), { commentaire: e.target.value })), placeholder: "Vos remarques sur ce travail...", className: "w-full p-3 border border-gray-300 text-sm focus:border-primary outline-none min-h-[100px]" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-700 uppercase mb-2", children: "Corrections demand\u00E9es (une par ligne)" }), _jsxs("div", { className: "space-y-2", children: [feedback.corrections.map((correction, index) => (_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: correction, onChange: (e) => {
                                                                            const newCorr = [...feedback.corrections];
                                                                            newCorr[index] = e.target.value;
                                                                            setFeedback(Object.assign(Object.assign({}, feedback), { corrections: newCorr }));
                                                                        }, placeholder: `Correction #${index + 1}`, className: "flex-1 p-2 border border-gray-300 text-sm outline-none focus:border-primary" }), feedback.corrections.length > 1 && (_jsx("button", { onClick: () => setFeedback(Object.assign(Object.assign({}, feedback), { corrections: feedback.corrections.filter((_, i) => i !== index) })), className: "px-2 text-gray-400 hover:text-red-600", children: _jsx(X, { className: "h-4 w-4" }) }))] }, index))), _jsxs("button", { onClick: () => setFeedback(Object.assign(Object.assign({}, feedback), { corrections: [...feedback.corrections, ''] })), className: "text-primary text-[10px] font-bold uppercase hover:underline flex items-center gap-1", children: [_jsx(Plus, { className: "h-3 w-3" }), "AJOUTER UNE LIGNE"] })] })] })] })] }), _jsxs("div", { className: "p-4 border-t border-gray-200 bg-gray-50 flex gap-3", children: [_jsx("button", { onClick: () => handleUpdateStatus(showReviewModal.id, 'inprogress', feedback), className: "flex-1 py-2 px-4 border border-red-500 text-red-600 font-bold text-xs uppercase hover:bg-red-50 transition-colors", children: "REJETER / \u00C0 CORRIGER" }), _jsx("button", { onClick: () => handleUpdateStatus(showReviewModal.id, 'done', feedback.commentaire ? feedback : undefined), className: "flex-1 py-2 px-4 bg-green-600 text-white font-bold text-xs uppercase hover:bg-green-700 transition-colors shadow-sm", children: "VALIDER LE TRAVAIL" })] })] }) }))] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-gray-200", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 uppercase tracking-tight", children: "Supervision des Groupes" }), _jsxs("p", { className: "text-xs text-gray-500 font-medium", children: ["LISTE DES ", demandes.length, " ENCADREMENTS ACTIFS - ", anneeAcademique] })] }), _jsxs("div", { className: "relative w-full md:w-80", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Rechercher un groupe ou un \u00E9tudiant...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 text-sm focus:border-primary outline-none" })] })] }), _jsx("div", { className: "bg-white border border-gray-200 overflow-hidden shadow-sm", children: _jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider", children: "Groupe / \u00C9tudiants" }), _jsx("th", { className: "px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider", children: "Titre du M\u00E9moire" }), _jsx("th", { className: "px-6 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider", children: "Avancement" }), _jsx("th", { className: "px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: filteredDemandes.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-6 py-12 text-center text-gray-400 text-sm italic", children: "Aucun groupe trouv\u00E9" }) })) : (filteredDemandes.map(demande => {
                                var _a, _b, _c, _d, _e;
                                const names = demande.candidats
                                    ? demande.candidats.map(c => `${c.prenom} ${c.nom}`).join(' & ')
                                    : `${(_a = demande.candidat) === null || _a === void 0 ? void 0 : _a.prenom} ${(_b = demande.candidat) === null || _b === void 0 ? void 0 : _b.nom}`;
                                return (_jsxs("tr", { className: "hover:bg-gray-50 transition-colors group", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 bg-gray-100 text-gray-600 rounded flex items-center justify-center font-bold text-xs border border-gray-200", children: names.charAt(0) }), _jsx("div", { className: "font-bold text-gray-900 text-sm", children: names })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-xs text-gray-600 max-w-md line-clamp-1 font-medium", children: (_c = demande.dossierMemoire) === null || _c === void 0 ? void 0 : _c.titre }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex-1 w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden", children: _jsx("div", { className: "bg-primary h-full", style: { width: `${((_d = demande.dossierMemoire) === null || _d === void 0 ? void 0 : _d.progression) || 0}%` } }) }), _jsxs("span", { className: "text-xs font-bold text-primary", children: [((_e = demande.dossierMemoire) === null || _e === void 0 ? void 0 : _e.progression) || 0, "%"] })] }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("button", { onClick: () => setSelectedDemande(demande), className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-[10px] font-bold uppercase hover:bg-gray-50 transition-colors", children: [_jsx(Eye, { className: "h-3.5 w-3.5" }), "SUPERVISER"] }) })] }, demande.idDemande));
                            })) })] }) })] }));
};
