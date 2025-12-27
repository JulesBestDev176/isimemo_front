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
import { useMemo, useState, useEffect } from 'react';
import { Clock, UserCheck, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { StatutDossierMemoire, EtapeDossier } from '../../../models/dossier';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { mockSoutenances } from '../../../models/soutenance/Soutenance';
import { useAuth } from '../../../contexts/AuthContext';
// Retiré: import { getTicketsByDossier, PhaseTicket } from '../../../models/dossier/Ticket';
import { dossierService } from '../../../services/dossier.service';
const getEtapeLabel = (etape) => {
    const etapes = {
        [EtapeDossier.CHOIX_SUJET]: 'Choix du sujet',
        [EtapeDossier.CHOIX_BINOME]: 'Choix du binôme',
        [EtapeDossier.CHOIX_ENCADRANT]: 'Choix de l\'encadrant',
        [EtapeDossier.VALIDATION_SUJET]: 'Validation du sujet',
        [EtapeDossier.VALIDATION_COMMISSION]: 'Validation par commission',
        [EtapeDossier.REDACTION]: 'Rédaction en cours',
        [EtapeDossier.PRELECTURE]: 'Pré-lecture',
        [EtapeDossier.CORRECTION]: 'Corrections',
        [EtapeDossier.DEPOT_INTERMEDIAIRE]: 'Dépôt intermédiaire',
        [EtapeDossier.DEPOT_FINAL]: 'Dépôt final',
        [EtapeDossier.SOUTENANCE]: 'Soutenance',
        [EtapeDossier.TERMINE]: 'Terminé'
    };
    return etapes[etape] || etape;
};
const formatDate = (date) => {
    if (!date)
        return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    // Vérification de validité de date
    if (isNaN(dateObj.getTime()))
        return 'Date invalide';
    return dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
const DossierInformations = ({ dossier }) => {
    const { user } = useAuth();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [notes, setNotes] = useState([]);
    useEffect(() => {
        const fetchNotes = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = yield dossierService.getNotesSuiviByDossier(dossier.id);
                setNotes(data);
            }
            catch (error) {
                console.error("Erreur chargement notes:", error);
            }
        });
        fetchNotes();
    }, [dossier.id]);
    const isDossierTermine = useMemo(() => {
        return dossier.statut === StatutDossierMemoire.SOUTENU ||
            dossier.statut === StatutDossierMemoire.DEPOSE ||
            dossier.etape === EtapeDossier.TERMINE;
    }, [dossier.statut, dossier.etape]);
    // Récupérer la date de soutenance pour les dossiers terminés
    const dateSoutenance = useMemo(() => {
        if (!isDossierTermine)
            return null;
        const soutenance = mockSoutenances.find(s => { var _a; return ((_a = s.dossierMemoire) === null || _a === void 0 ? void 0 : _a.idDossierMemoire) === dossier.id; });
        return (soutenance === null || soutenance === void 0 ? void 0 : soutenance.dateSoutenance) || null;
    }, [isDossierTermine, dossier.id]);
    // Vérifier si toutes les tâches sont terminées via la progression
    const toutesTachesTerminees = useMemo(() => {
        // Si progression >= 100 ou si pré-lecture est déjà autorisée/effectuée
        return (dossier.progression && dossier.progression >= 100) || !!dossier.autorisePrelecture;
    }, [dossier.progression, dossier.autorisePrelecture]);
    // Statut de pré-lecture
    const statutPrelecture = useMemo(() => {
        if (!toutesTachesTerminees) {
            return { statut: 'non_eligible', message: 'Toutes les tâches doivent être terminées pour la pré-lecture' };
        }
        if (dossier.autorisePrelecture === false || dossier.autorisePrelecture === undefined) {
            return { statut: 'en_attente', message: 'En attente d\'autorisation de pré-lecture par l\'encadrant' };
        }
        if (dossier.autorisePrelecture === true && dossier.prelectureEffectuee === false) {
            return { statut: 'autorisee', message: 'Pré-lecture autorisée - En attente de validation' };
        }
        if (dossier.prelectureEffectuee === true) {
            return { statut: 'validee', message: 'Pré-lecture validée' };
        }
        return { statut: 'inconnu', message: 'Statut inconnu' };
    }, [dossier.autorisePrelecture, dossier.prelectureEffectuee, toutesTachesTerminees]);
    // Statut d'autorisation de soutenance
    const statutSoutenance = useMemo(() => {
        if (statutPrelecture.statut !== 'validee') {
            return { statut: 'non_eligible', message: 'La pré-lecture doit être validée avant l\'autorisation de soutenance' };
        }
        if (dossier.autoriseSoutenance === false || dossier.autoriseSoutenance === undefined) {
            return { statut: 'en_attente', message: 'En attente d\'autorisation de soutenance par l\'encadrant' };
        }
        if (dossier.autoriseSoutenance === true) {
            return { statut: 'autorisee', message: 'Autorisé à soutenir' };
        }
        return { statut: 'inconnu', message: 'Statut inconnu' };
    }, [dossier.autoriseSoutenance, statutPrelecture.statut]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Sujet du m\u00E9moire" }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: "font-medium text-gray-900 mb-2", children: dossier.titre }), _jsxs("div", { children: [_jsx("p", { className: `text-sm text-gray-600 ${!showFullDescription ? 'line-clamp-2' : ''}`, children: dossier.description }), dossier.description && dossier.description.length > 100 && (_jsx("button", { onClick: () => setShowFullDescription(!showFullDescription), className: "text-xs text-primary hover:underline mt-1", children: showFullDescription ? 'Voir moins' : 'Voir plus' }))] })] }) })] }), !isDossierTermine && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "\u00C9tape actuelle" }), _jsx(Card, { className: "border-primary-200 bg-primary-50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-primary-100 p-2 rounded-lg mr-4", children: _jsx(Clock, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: "En cours de traitement" }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: ["Statut: ", dossier.statut] })] })] }) }) })] })), isDossierTermine && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "\u00C9tape actuelle" }), _jsx(Card, { className: "border-primary-200 bg-primary-50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-primary-100 p-2 rounded-lg mr-4", children: _jsx(CheckCircle, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-900", children: getEtapeLabel(dossier.etape) }), _jsxs("p", { className: "text-sm text-gray-600 mt-1", children: ["Statut: ", dossier.statut] })] })] }) }) })] })), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Informations g\u00E9n\u00E9rales" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Calendar, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("p", { className: "text-sm text-gray-500", children: "Date de cr\u00E9ation" })] }), _jsx("p", { className: "font-medium text-gray-900", children: formatDate(dossier.dateCreation) })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("div", { className: "flex items-center mb-2", children: isDossierTermine && dateSoutenance ? (_jsxs(_Fragment, { children: [_jsx(Calendar, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("p", { className: "text-sm text-gray-500", children: "Date de soutenance" })] })) : (_jsxs(_Fragment, { children: [_jsx(Clock, { className: "h-4 w-4 text-gray-500 mr-2" }), _jsx("p", { className: "text-sm text-gray-500", children: "Derni\u00E8re modification" })] })) }), _jsx("p", { className: "font-medium text-gray-900", children: isDossierTermine && dateSoutenance
                                                ? formatDate(dateSoutenance)
                                                : formatDate(dossier.dateModification) })] }) }), dossier.anneeAcademique && (_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: "text-sm text-gray-500 mb-2", children: "Ann\u00E9e acad\u00E9mique" }), _jsx("p", { className: "font-medium text-gray-900", children: dossier.anneeAcademique })] }) })), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsx("p", { className: "text-sm text-gray-500 mb-2", children: "Compl\u00E9tude" }), _jsx("p", { className: "font-medium text-gray-900", children: dossier.estComplet ? 'Complet' : 'En cours' })] }) })] })] }), dossier.encadrant && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Encadrant" }), _jsx(Card, { className: "border-primary-200 bg-primary-50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: "bg-primary-100 p-3 rounded-lg mr-4", children: _jsx(UserCheck, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "font-semibold text-gray-900 mb-1", children: [dossier.encadrant.prenom, " ", dossier.encadrant.nom] }), _jsx("p", { className: "text-sm text-gray-600 mb-1", children: dossier.encadrant.email }), dossier.encadrant.departement && (_jsx("p", { className: "text-xs text-gray-500", children: dossier.encadrant.departement }))] })] }) }) })] })), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2", children: [_jsx(Clock, { className: "h-5 w-5 text-primary" }), " Historique de suivi"] }), _jsx(Card, { children: _jsx(CardContent, { className: "p-4", children: _jsx("div", { className: "space-y-4", children: notes.length > 0 ? (notes.map((note) => (_jsxs("div", { className: "border-l-2 border-primary-200 pl-4 py-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase", children: formatDate(note.dateCreation) }), note.type === 'ALERTE' && (_jsx(Badge, { variant: "destructive", className: "text-[8px] h-4", children: "ALERTE" }))] }), _jsx("p", { className: "text-sm text-gray-700 leading-relaxed", children: note.contenu })] }, note.id)))) : (_jsx("p", { className: "text-sm text-gray-500 italic text-center py-4", children: "Aucune note de suivi enregistr\u00E9e pour le moment." })) }) }) })] }), !isDossierTermine && statutPrelecture.statut === 'validee' && (_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Autorisation de soutenance" }), _jsx(Card, { className: statutSoutenance.statut === 'autorisee'
                            ? 'border-green-200 bg-green-50'
                            : statutSoutenance.statut === 'en_attente'
                                ? 'border-amber-200 bg-amber-50'
                                : 'border-gray-200 bg-gray-50', children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: `p-3 rounded-lg mr-4 ${statutSoutenance.statut === 'autorisee'
                                            ? 'bg-green-100'
                                            : statutSoutenance.statut === 'en_attente'
                                                ? 'bg-amber-100'
                                                : 'bg-gray-100'}`, children: statutSoutenance.statut === 'autorisee' ? (_jsx(CheckCircle, { className: "h-5 w-5 text-green-600" })) : statutSoutenance.statut === 'en_attente' ? (_jsx(Clock, { className: "h-5 w-5 text-amber-600" })) : (_jsx(XCircle, { className: "h-5 w-5 text-gray-600" })) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("p", { className: "font-semibold text-gray-900", children: "Autorisation de soutenance" }), _jsx(Badge, { variant: statutSoutenance.statut === 'autorisee'
                                                            ? 'default'
                                                            : statutSoutenance.statut === 'en_attente'
                                                                ? 'secondary'
                                                                : 'outline', children: statutSoutenance.statut === 'autorisee'
                                                            ? 'Autorisé'
                                                            : statutSoutenance.statut === 'en_attente'
                                                                ? 'En attente'
                                                                : 'Non éligible' })] }), _jsx("p", { className: "text-sm text-gray-600", children: statutSoutenance.message })] })] }) }) })] }))] }));
};
export default DossierInformations;
