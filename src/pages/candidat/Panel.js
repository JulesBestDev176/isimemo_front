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
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Filter, Video, MapPin, FileText, Download, Check, Plus, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { dossierService } from '../../services/dossier.service';
import CreateDossierModal from '../../components/dossier/CreateDossierModal';
import { getEncadrementActifByCandidat, getTicketsByEncadrement, PhaseTicket } from '../../models';
const Panel = () => {
    const { user } = useAuth();
    const [filtreMessage, setFiltreMessage] = useState('tous');
    const [lienCopie, setLienCopie] = useState(null);
    const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    // Charger les données du dossier
    React.useEffect(() => {
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
    // Récupérer les messages depuis l'API
    React.useEffect(() => {
        const fetchMessages = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(dossier === null || dossier === void 0 ? void 0 : dossier.anneeAcademique) || !(dossier === null || dossier === void 0 ? void 0 : dossier.encadrantId)) {
                setMessages([]);
                return;
            }
            setLoadingMessages(true);
            try {
                const response = yield fetch(`http://localhost:3001/api/encadrements/${dossier.anneeAcademique}/messages?encadrantId=${dossier.encadrantId}`);
                if (response.ok) {
                    const data = yield response.json();
                    console.log('📬 Messages récupérés pour candidat:', data.length);
                    // Convertir le format backend vers le format frontend
                    const formattedMessages = data
                        .sort((a, b) => new Date(a.dateEnvoi).getTime() - new Date(b.dateEnvoi).getTime())
                        .map((msg) => ({
                        id: msg.id,
                        expediteur: 'encadrant',
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
    }, [dossier]);
    // Données de l'encadrant - récupérer depuis le backend
    const [encadrant, setEncadrant] = React.useState(null);
    // Récupérer les données de l'encadrant
    React.useEffect(() => {
        const fetchEncadrant = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(dossier === null || dossier === void 0 ? void 0 : dossier.encadrantId)) {
                setEncadrant(null);
                return;
            }
            try {
                const response = yield fetch(`http://localhost:3001/api/encadrants/${dossier.encadrantId}`);
                if (response.ok) {
                    const data = yield response.json();
                    setEncadrant({
                        id: data.id,
                        nom: data.nom,
                        prenom: data.prenom,
                        email: data.email,
                        specialite: data.specialite || '',
                        bureau: data.bureau || '',
                        telephone: data.telephone || ''
                    });
                    console.log('📋 Encadrant récupéré:', data);
                }
                else {
                    console.error('❌ Erreur récupération encadrant:', response.status);
                }
            }
            catch (error) {
                console.error('❌ Erreur:', error);
            }
        });
        fetchEncadrant();
    }, [dossier === null || dossier === void 0 ? void 0 : dossier.encadrantId]);
    const candidat = {
        nom: (user === null || user === void 0 ? void 0 : user.nom) || 'Candidat',
        prenom: (user === null || user === void 0 ? void 0 : user.prenom) || '',
        sujet: (dossier === null || dossier === void 0 ? void 0 : dossier.titre) || 'Aucun dossier actif',
        progressionGlobale: 0 // Sera calculé ci-dessous
    };
    // Calculer la progression réelle basée sur les tickets (comme dans EtapeRedaction)
    const stats = React.useMemo(() => {
        const userId = user === null || user === void 0 ? void 0 : user.id;
        if (!userId)
            return { progression: 0, total: 0, termines: 0, enCours: 0 };
        const encadrement = getEncadrementActifByCandidat(parseInt(userId));
        if (!encadrement)
            return { progression: 0, total: 0, termines: 0, enCours: 0 };
        const tickets = getTicketsByEncadrement(encadrement.idEncadrement);
        if (tickets.length === 0)
            return { progression: 0, total: 0, termines: 0, enCours: 0 };
        const total = tickets.length;
        const termines = tickets.filter(t => t.phase === PhaseTicket.TERMINE).length;
        const enCours = tickets.filter(t => t.phase === PhaseTicket.EN_COURS || t.phase === PhaseTicket.EN_REVISION).length;
        const sumProgression = tickets.reduce((acc, t) => acc + t.progression, 0);
        const averageProgression = Math.round(sumProgression / total);
        return {
            progression: averageProgression,
            total,
            termines,
            enCours
        };
    }, [user]);
    // Mettre à jour la progression du candidat
    candidat.progressionGlobale = stats.progression;
    const getInitials = (nom, prenom) => {
        if (prenom) {
            return `${prenom[0]}${nom[0]}`.toUpperCase();
        }
        return nom.split(' ').map(n => n[0]).join('').toUpperCase();
    };
    const getTypeNotificationColor = (type) => {
        switch (type) {
            case 'Meet': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Pré-soutenance': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Document': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Feedback': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Rappel': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };
    const getTypeMessageColor = (type) => {
        switch (type) {
            case 'texte': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'reunion-meet': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'presentiel': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'document': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };
    const getTypeMessageIcon = (type) => {
        switch (type) {
            case 'texte': return _jsx(MessageSquare, { className: "h-4 w-4" });
            case 'reunion-meet': return _jsx(Video, { className: "h-4 w-4" });
            case 'presentiel': return _jsx(MapPin, { className: "h-4 w-4" });
            case 'document': return _jsx(FileText, { className: "h-4 w-4" });
            default: return _jsx(MessageSquare, { className: "h-4 w-4" });
        }
    };
    // Fonction pour copier le lien
    const copierLien = (lien, itemId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield navigator.clipboard.writeText(lien);
            setLienCopie(itemId);
            setTimeout(() => {
                setLienCopie(null);
            }, 2000);
        }
        catch (err) {
            console.error('Erreur lors de la copie:', err);
            const textArea = document.createElement('textarea');
            textArea.value = lien;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setLienCopie(itemId);
                setTimeout(() => {
                    setLienCopie(null);
                }, 2000);
            }
            catch (fallbackErr) {
                console.error('Erreur lors de la copie (fallback):', fallbackErr);
            }
            document.body.removeChild(textArea);
        }
    });
    // Combiner messages en une seule file de discussion (plus de notifications pour l'instant)
    const fileDiscussion = messages.map(msg => ({
        id: msg.id,
        type: 'message',
        expediteur: 'encadrant',
        contenu: msg.contenu,
        titre: msg.titre,
        date: msg.date,
        lu: msg.lu,
        messageType: msg.type,
        lienMeet: msg.lienMeet,
        lieu: msg.lieu,
        dateRendezVous: msg.dateRendezVous,
        heureRendezVous: msg.heureRendezVous,
        nomDocument: msg.nomDocument,
        cheminDocument: msg.cheminDocument,
        tailleDocument: msg.tailleDocument,
    })).sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    const [tachesActives, setTachesActives] = useState(0);
    // Charger le nombre de tâches actives
    React.useEffect(() => {
        const fetchTachesCount = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(dossier === null || dossier === void 0 ? void 0 : dossier.id))
                return;
            try {
                const response = yield fetch(`http://localhost:3001/api/demandes/${dossier.id}/taches`);
                if (response.ok) {
                    const data = yield response.json();
                    const activeTasks = data.filter((t) => t.statut === 'active').length;
                    setTachesActives(activeTasks);
                }
            }
            catch (error) {
                console.error("Erreur chargement tâches:", error);
            }
        });
        fetchTachesCount();
    }, [dossier === null || dossier === void 0 ? void 0 : dossier.id]);
    return (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, className: "space-y-6", children: [!dossier ? (_jsxs("div", { className: "bg-white border border-gray-200 p-12 text-center", children: [_jsx("div", { className: "bg-gray-50 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center", children: _jsx(FileText, { className: "h-10 w-10 text-gray-400" }) }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2", children: "Pas de dossier actif" }), _jsx("p", { className: "text-gray-600 max-w-md mx-auto mb-8", children: "Vous n'avez pas encore de dossier de m\u00E9moire pour l'ann\u00E9e acad\u00E9mique en cours. Commencez par cr\u00E9er votre dossier en saisissant un titre provisoire." }), _jsxs("button", { onClick: () => setShowCreateModal(true), className: "inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors", children: [_jsx(Plus, { className: "h-5 w-5" }), _jsx("span", { children: "Cr\u00E9er mon dossier de m\u00E9moire" })] })] })) : (_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Mon projet de m\u00E9moire" }), tachesActives > 0 && (_jsxs("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200", children: [_jsx(Clock, { className: "w-3 h-3 mr-1" }), tachesActives, " t\u00E2che", tachesActives > 1 ? 's' : '', " \u00E0 faire"] }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-700 mb-2", children: "Informations g\u00E9n\u00E9rales" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Sujet:" }), " ", candidat.sujet] }), dossier.encadrantId && encadrant ? (_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Encadrant:" }), " Prof. ", encadrant.prenom, " ", encadrant.nom] })) : dossier.encadrantId ? (_jsx("p", { className: "text-gray-500 italic", children: "Chargement encadrant..." })) : (_jsx("p", { className: "text-amber-600 italic", children: "Encadrant non encore d\u00E9sign\u00E9" }))] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-700 mb-2", children: "Progression globale" }), _jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-1", children: [_jsx("span", { children: "Avancement" }), _jsxs("span", { children: [candidat.progressionGlobale, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3", children: _jsx("div", { className: "bg-primary h-3 rounded-full transition-all duration-300", style: { width: `${candidat.progressionGlobale}%` } }) })] })] })] })), _jsx(CreateDossierModal, { isOpen: showCreateModal, onClose: () => setShowCreateModal(false), userId: (user === null || user === void 0 ? void 0 : user.id) || '', onSuccess: (newDossier) => setDossier(newDossier) }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Discussion avec votre encadrant" }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Filter, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsxs("select", { value: filtreMessage, onChange: (e) => setFiltreMessage(e.target.value), className: "pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "tous", children: "Tous les messages" }), _jsx("option", { value: "texte", children: "Texte" }), _jsx("option", { value: "reunion-meet", children: "R\u00E9union Meet" }), _jsx("option", { value: "presentiel", children: "Pr\u00E9sentiel" }), _jsx("option", { value: "document", children: "Document" })] })] }), _jsx("button", { className: "px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm", children: "Marquer tout comme lu" })] })] }), _jsx("div", { className: "space-y-4 max-h-[700px] overflow-y-auto", children: fileDiscussion.length === 0 ? (_jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx(MessageSquare, { className: "h-12 w-12 mx-auto mb-3 text-gray-400" }), _jsx("p", { children: "Aucun message" })] })) : (fileDiscussion.map(item => {
                            if (item.type === 'message' && filtreMessage !== 'tous') {
                                if (item.messageType !== filtreMessage)
                                    return null;
                            }
                            if (item.type === 'notification' && filtreMessage !== 'tous') {
                                return null;
                            }
                            return (_jsx("div", { className: "flex items-start justify-start", children: _jsxs("div", { className: "max-w-[70%] p-4 border border-gray-200 bg-gray-100 text-gray-900", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm font-medium", children: encadrant ? `Prof. ${encadrant.prenom} ${encadrant.nom}` : 'Encadrant' }), _jsx("span", { className: "text-xs text-gray-500", children: item.date })] }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [item.type === 'notification' && item.notificationType && (_jsxs("span", { className: `px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${getTypeNotificationColor(item.notificationType)}`, children: [item.notificationType === 'Meet' && _jsx(Video, { className: "h-3 w-3" }), item.notificationType === 'Pré-soutenance' && _jsx(MapPin, { className: "h-3 w-3" }), item.notificationType === 'Document' && _jsx(FileText, { className: "h-3 w-3" }), item.notificationType] })), item.type === 'message' && item.messageType && (_jsxs("span", { className: `px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${getTypeMessageColor(item.messageType)}`, children: [item.messageType === 'reunion-meet' && _jsx(Video, { className: "h-3 w-3" }), item.messageType === 'presentiel' && _jsx(MapPin, { className: "h-3 w-3" }), item.messageType === 'document' && _jsx(FileText, { className: "h-3 w-3" }), item.messageType === 'texte' && _jsx(MessageSquare, { className: "h-3 w-3" }), item.messageType === 'reunion-meet' ? 'Réunion Meet' :
                                                            item.messageType === 'presentiel' ? 'Présentiel' :
                                                                item.messageType === 'document' ? 'Document PDF' : 'Texte'] })), item.urgent && (_jsx("span", { className: "px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full", children: "Urgent" })), !item.lu && (_jsx("div", { className: "w-2 h-2 bg-primary rounded-full" }))] }), item.titre && (_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: item.titre })), _jsx("p", { className: "text-sm mb-3", children: item.contenu }), item.lienMeet && (_jsxs("div", { className: `${item.lu ? 'bg-white' : 'bg-white/90'} border border-gray-200 p-3 mt-3 rounded`, children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Video, { className: "h-4 w-4 text-primary" }), _jsx("h5", { className: "font-medium text-gray-900 text-sm", children: "D\u00E9tails de la r\u00E9union" })] }), _jsxs("div", { className: "space-y-2 text-xs", children: [item.dateRendezVous && (_jsxs("p", { className: "text-gray-700", children: [_jsx("span", { className: "font-medium", children: "Date:" }), " ", item.dateRendezVous, item.heureRendezVous && ` à ${item.heureRendezVous}`] })), _jsxs("div", { className: "pt-2 border-t border-gray-200", children: [_jsx("p", { className: "font-medium mb-2 text-gray-900", children: "Lien de la r\u00E9union:" }), _jsxs("div", { className: "flex items-center space-x-2 flex-wrap", children: [_jsx("a", { href: item.lienMeet, target: "_blank", rel: "noopener noreferrer", className: "text-primary hover:text-primary-700 underline break-all flex-1 min-w-0", children: item.lienMeet }), _jsx("button", { onClick: () => copierLien(item.lienMeet || '', item.id), className: `px-2 py-1 text-xs rounded flex-shrink-0 transition-colors flex items-center space-x-1 ${lienCopie === item.id
                                                                                ? 'bg-green-600 text-white'
                                                                                : 'bg-primary text-white hover:bg-primary-700'}`, title: "Copier le lien", children: lienCopie === item.id ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "h-3 w-3" }), _jsx("span", { children: "Copi\u00E9!" })] })) : (_jsx("span", { children: "Copier" })) })] }), _jsxs("a", { href: item.lienMeet, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center space-x-2 mt-2 px-3 py-2 bg-primary text-white rounded hover:bg-primary-700 transition-colors text-sm font-medium", children: [_jsx(Video, { className: "h-4 w-4" }), _jsx("span", { children: "Rejoindre la r\u00E9union" })] })] })] })] })), item.lieu && !item.lienMeet && (_jsxs("div", { className: `${item.lu ? 'bg-white' : 'bg-white/90'} border border-gray-200 p-3 mt-3 rounded`, children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(MapPin, { className: "h-4 w-4 text-primary" }), _jsx("h5", { className: "font-medium text-gray-900 text-sm", children: "D\u00E9tails du rendez-vous" })] }), _jsxs("div", { className: "space-y-1 text-xs text-gray-700", children: [item.dateRendezVous && (_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Date:" }), " ", item.dateRendezVous, item.heureRendezVous && ` à ${item.heureRendezVous}`] })), _jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Lieu:" }), " ", item.lieu] })] })] })), item.nomDocument && (_jsx("div", { className: `${item.lu ? 'bg-white' : 'bg-white/90'} border border-gray-200 p-3 mt-3 rounded`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-primary rounded-lg flex items-center justify-center", children: _jsx(FileText, { className: "h-5 w-5 text-white" }) }), _jsxs("div", { children: [_jsx("h5", { className: "font-medium text-gray-900 text-sm", children: item.nomDocument }), item.tailleDocument && (_jsx("p", { className: "text-xs text-gray-600", children: item.tailleDocument }))] })] }), _jsxs("button", { onClick: () => window.open(item.cheminDocument, '_blank'), className: "px-2 py-1.5 bg-primary text-white rounded hover:bg-primary-700 transition-colors flex items-center space-x-2 text-xs", children: [_jsx(Download, { className: "h-3 w-3" }), _jsx("span", { children: "T\u00E9l\u00E9charger" })] })] }) }))] }) }, item.id));
                        })) })] })] }, "panel"));
};
export default Panel;
