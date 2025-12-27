import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, MessageSquare, AlertCircle, TrendingUp, ArrowRight, Calendar, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDate } from './utils';
import { StatutDossierMemoire, PhaseTicket, getTicketsByEncadrement } from '../../models';
export const DashboardEncadrant = ({ encadrement, encadrementId, tachesCommunes, dossiersEtudiants, onTabChange }) => {
    const navigate = useNavigate();
    // Calculer les statistiques
    const stats = useMemo(() => {
        const tickets = getTicketsByEncadrement(encadrement.idEncadrement);
        const ticketsEnCours = tickets.filter(t => t.phase === PhaseTicket.EN_COURS).length;
        const ticketsEnRevision = tickets.filter(t => t.phase === PhaseTicket.EN_REVISION).length;
        const ticketsAfaire = tickets.filter(t => t.phase === PhaseTicket.A_FAIRE).length;
        const progressionMoyenne = dossiersEtudiants.length > 0
            ? Math.round(dossiersEtudiants.reduce((sum, d) => sum + d.dossierMemoire.progression, 0) / dossiersEtudiants.length)
            : 0;
        const tachesActives = tachesCommunes.filter(t => t.active).length;
        const tachesUrgentes = tachesCommunes.filter(t => t.active &&
            t.priorite === 'Haute' &&
            t.dateEcheance &&
            new Date(t.dateEcheance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
        ).length;
        return {
            nbEtudiants: dossiersEtudiants.length,
            progressionMoyenne,
            tachesActives,
            tachesUrgentes,
            ticketsEnCours,
            ticketsEnRevision,
            ticketsAfaire
        };
    }, [encadrement.idEncadrement, dossiersEtudiants, tachesCommunes]);
    // Tâches urgentes
    const tachesUrgentes = useMemo(() => {
        return tachesCommunes
            .filter(t => t.active &&
            t.priorite === 'Haute' &&
            t.dateEcheance &&
            new Date(t.dateEcheance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
            .slice(0, 3);
    }, [tachesCommunes]);
    // Dossiers nécessitant attention (progression faible ou statut en attente)
    const dossiersAttention = useMemo(() => {
        return dossiersEtudiants
            .filter(d => d.dossierMemoire.progression < 50 ||
            d.dossierMemoire.statut === StatutDossierMemoire.EN_ATTENTE_VALIDATION)
            .slice(0, 3);
    }, [dossiersEtudiants]);
    // Tickets nécessitant attention
    const ticketsAttention = useMemo(() => {
        const tickets = getTicketsByEncadrement(encadrement.idEncadrement);
        return tickets
            .filter(t => t.phase === PhaseTicket.EN_REVISION || t.phase === PhaseTicket.EN_COURS)
            .slice(0, 3);
    }, [encadrement.idEncadrement]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx("div", { className: "bg-white border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "\u00C9tudiants encadr\u00E9s" }), _jsx("p", { className: "text-2xl font-semibold text-gray-900", children: stats.nbEtudiants })] }), _jsx("div", { className: "p-3 bg-blue-50 rounded-lg", children: _jsx(Users, { className: "h-6 w-6 text-primary" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Progression moyenne" }), _jsxs("p", { className: "text-2xl font-semibold text-gray-900", children: [stats.progressionMoyenne, "%"] })] }), _jsx("div", { className: "p-3 bg-green-50 rounded-lg", children: _jsx(TrendingUp, { className: "h-6 w-6 text-green-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "T\u00E2ches actives" }), _jsx("p", { className: "text-2xl font-semibold text-gray-900", children: stats.tachesActives }), stats.tachesUrgentes > 0 && (_jsxs("p", { className: "text-xs text-orange-600 mt-1", children: [stats.tachesUrgentes, " urgentes"] }))] }), _jsx("div", { className: "p-3 bg-yellow-50 rounded-lg", children: _jsx(FileText, { className: "h-6 w-6 text-yellow-600" }) })] }) }), _jsx("div", { className: "bg-white border border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-1", children: "Tickets en cours" }), _jsx("p", { className: "text-2xl font-semibold text-gray-900", children: stats.ticketsEnCours + stats.ticketsEnRevision }), stats.ticketsEnRevision > 0 && (_jsxs("p", { className: "text-xs text-orange-600 mt-1", children: [stats.ticketsEnRevision, " en r\u00E9vision"] }))] }), _jsx("div", { className: "p-3 bg-purple-50 rounded-lg", children: _jsx(AlertCircle, { className: "h-6 w-6 text-purple-600" }) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Dossiers n\u00E9cessitant attention" }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => onTabChange('dossiers'), className: "text-primary", children: ["Voir tout ", _jsx(ArrowRight, { className: "h-4 w-4 ml-1" })] })] }), dossiersAttention.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "Aucun dossier ne n\u00E9cessite d'attention particuli\u00E8re." })) : (_jsx("div", { className: "space-y-3", children: dossiersAttention.map((dossier) => (_jsx("div", { className: "p-3 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer", onClick: () => navigate(`/professeur/encadrements/${encadrementId}/dossier/${dossier.dossierMemoire.id}`), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "font-medium text-gray-900 text-sm", children: [dossier.etudiant.prenom, " ", dossier.etudiant.nom] }), _jsx("p", { className: "text-xs text-gray-600 mt-1 line-clamp-1", children: dossier.dossierMemoire.titre }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx(Badge, { className: dossier.dossierMemoire.statut === StatutDossierMemoire.EN_ATTENTE_VALIDATION
                                                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                                    : 'bg-blue-50 text-blue-700 border-blue-200', children: dossier.dossierMemoire.statut }), _jsxs("span", { className: "text-xs text-gray-500", children: [dossier.dossierMemoire.progression, "% compl\u00E9t\u00E9"] })] })] }), dossier.dossierMemoire.progression < 50 && (_jsx(AlertTriangle, { className: "h-4 w-4 text-orange-500" }))] }) }, dossier.id))) }))] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "T\u00E2ches urgentes" }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => onTabChange('taches'), className: "text-primary", children: ["Voir tout ", _jsx(ArrowRight, { className: "h-4 w-4 ml-1" })] })] }), tachesUrgentes.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "Aucune t\u00E2che urgente." })) : (_jsx("div", { className: "space-y-3", children: tachesUrgentes.map((tache) => (_jsx("div", { className: "p-3 border border-gray-200 hover:bg-gray-50 transition-colors", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900 text-sm", children: tache.titre }), _jsx("p", { className: "text-xs text-gray-600 mt-1 line-clamp-2", children: tache.description }), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx(Badge, { className: "bg-red-50 text-red-700 border-red-200", children: tache.priorite }), tache.dateEcheance && (_jsxs("span", { className: "text-xs text-gray-500 flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), "\u00C9ch\u00E9ance: ", formatDate(tache.dateEcheance)] }))] })] }), _jsx(AlertTriangle, { className: "h-4 w-4 text-orange-500" })] }) }, tache.id))) }))] })] }), _jsx("div", { className: "grid grid-cols-1 gap-6", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Tickets n\u00E9cessitant attention" }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => onTabChange('dossiers'), className: "text-primary", children: ["Voir tout ", _jsx(ArrowRight, { className: "h-4 w-4 ml-1" })] })] }), ticketsAttention.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "Aucun ticket ne n\u00E9cessite d'attention." })) : (_jsx("div", { className: "space-y-3", children: ticketsAttention.map((ticket) => {
                                const dossier = dossiersEtudiants.find(d => { var _a; return d.dossierMemoire.id === ((_a = ticket.dossierMemoire) === null || _a === void 0 ? void 0 : _a.idDossierMemoire); });
                                return (_jsx("div", { className: "p-3 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer", onClick: () => {
                                        if (dossier) {
                                            navigate(`/professeur/encadrements/${encadrementId}/dossier/${dossier.dossierMemoire.id}`);
                                        }
                                    }, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-900 text-sm", children: ticket.titre }), dossier && (_jsxs("p", { className: "text-xs text-gray-600 mt-1", children: [dossier.etudiant.prenom, " ", dossier.etudiant.nom] })), _jsxs("div", { className: "flex items-center gap-2 mt-2", children: [_jsx(Badge, { className: ticket.phase === PhaseTicket.EN_REVISION
                                                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                                                    : 'bg-blue-50 text-blue-700 border-blue-200', children: ticket.phase === PhaseTicket.EN_REVISION ? 'En révision' : 'En cours' }), _jsxs("span", { className: "text-xs text-gray-500", children: [ticket.progression, "% compl\u00E9t\u00E9"] })] })] }), ticket.phase === PhaseTicket.EN_REVISION && (_jsx(AlertCircle, { className: "h-4 w-4 text-orange-500" }))] }) }, ticket.idTicket));
                            }) }))] }) }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Actions rapides" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs(Button, { variant: "outline", className: "justify-start h-auto p-4", onClick: () => onTabChange('messages'), children: [_jsx(MessageSquare, { className: "h-5 w-5 mr-3 text-primary" }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "font-medium", children: "Envoyer un message" }), _jsx("p", { className: "text-xs text-gray-500", children: "Communiquer avec les \u00E9tudiants" })] })] }), _jsxs(Button, { variant: "outline", className: "justify-start h-auto p-4", onClick: () => onTabChange('taches'), children: [_jsx(FileText, { className: "h-5 w-5 mr-3 text-primary" }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "font-medium", children: "Ajouter une t\u00E2che" }), _jsx("p", { className: "text-xs text-gray-500", children: "Cr\u00E9er une t\u00E2che commune" })] })] }), _jsxs(Button, { variant: "outline", className: "justify-start h-auto p-4", onClick: () => onTabChange('dossiers'), children: [_jsx(Users, { className: "h-5 w-5 mr-3 text-primary" }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "font-medium", children: "Consulter les dossiers" }), _jsx("p", { className: "text-xs text-gray-500", children: "Voir tous les dossiers \u00E9tudiants" })] })] })] })] })] }));
};
