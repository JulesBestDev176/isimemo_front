import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket as TicketIcon, Calendar, Clock, AlertCircle, CheckCircle, RefreshCw, FileText, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { PhaseTicket, Priorite, getTicketsByEncadrement, getTicketById } from '../../models';
import { getEncadrementActifByCandidat } from '../../models';
const TabButton = ({ label, isActive, onClick, count, icon }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2
        ${isActive
            ? 'border-primary text-primary bg-white'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 bg-gray-50'}
      `, children: [icon && icon, _jsx("span", { children: label }), count !== undefined && count > 0 && (_jsx(Badge, { className: `text-xs ${isActive
                    ? 'bg-primary-50 text-primary-700 border-primary-200'
                    : 'bg-gray-200 text-gray-700 border-gray-300'}`, children: count }))] }));
};
const Tickets = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('a-faire');
    const [selectedTicket, setSelectedTicket] = useState(null);
    // Récupérer l'encadrement actif du candidat
    const encadrement = useMemo(() => {
        if (!(user === null || user === void 0 ? void 0 : user.estCandidat) || !user.id)
            return null;
        // Pour un candidat, on doit trouver l'encadrement qui le contient
        // On suppose que user.id correspond à idCandidat dans les données mock
        return getEncadrementActifByCandidat(parseInt(user.id));
    }, [user]);
    // Récupérer les tickets associés à l'encadrement
    const allTickets = useMemo(() => {
        if (!encadrement)
            return [];
        return getTicketsByEncadrement(encadrement.idEncadrement);
    }, [encadrement]);
    // Filtrer les tickets par phase selon l'onglet actif
    const filteredTickets = useMemo(() => {
        switch (activeTab) {
            case 'a-faire':
                return allTickets.filter(t => t.phase === PhaseTicket.A_FAIRE);
            case 'en-cours':
                return allTickets.filter(t => t.phase === PhaseTicket.EN_COURS);
            case 'en-revision':
                return allTickets.filter(t => t.phase === PhaseTicket.EN_REVISION);
            case 'termines':
                return allTickets.filter(t => t.phase === PhaseTicket.TERMINE);
            default:
                return [];
        }
    }, [allTickets, activeTab]);
    // Compter les tickets par phase
    const counts = useMemo(() => {
        return {
            'a-faire': allTickets.filter(t => t.phase === PhaseTicket.A_FAIRE).length,
            'en-cours': allTickets.filter(t => t.phase === PhaseTicket.EN_COURS).length,
            'en-revision': allTickets.filter(t => t.phase === PhaseTicket.EN_REVISION).length,
            'termines': allTickets.filter(t => t.phase === PhaseTicket.TERMINE).length
        };
    }, [allTickets]);
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
    // Helper pour obtenir la couleur de la priorité
    const getPrioriteColor = (priorite) => {
        switch (priorite) {
            case Priorite.URGENTE:
                return 'bg-red-50 text-red-700 border-red-200';
            case Priorite.HAUTE:
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case Priorite.MOYENNE:
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case Priorite.BASSE:
                return 'bg-gray-50 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };
    // Récupérer le ticket sélectionné pour consultation
    const ticketDetail = selectedTicket ? getTicketById(selectedTicket) : null;
    // Vérifier que l'utilisateur est un candidat
    if (!(user === null || user === void 0 ? void 0 : user.estCandidat)) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Acc\u00E8s non autoris\u00E9" }), _jsx("p", { className: "text-gray-600", children: "Vous devez \u00EAtre un candidat pour acc\u00E9der \u00E0 cette page." })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs(Card, { className: "mb-6", children: [_jsxs(CardHeader, { className: "pb-0", children: [_jsx(CardTitle, { children: "Mes Tickets" }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: "Consultez et suivez l'avancement de vos tickets de suivi" })] }), _jsx("div", { className: "border-b border-gray-200 px-6", children: _jsxs("div", { className: "flex space-x-1 -mb-px", children: [_jsx(TabButton, { label: "\u00C0 faire", isActive: activeTab === 'a-faire', onClick: () => setActiveTab('a-faire'), count: counts['a-faire'], icon: _jsx(AlertCircle, { className: "h-4 w-4" }) }), _jsx(TabButton, { label: "En cours", isActive: activeTab === 'en-cours', onClick: () => setActiveTab('en-cours'), count: counts['en-cours'], icon: _jsx(RefreshCw, { className: "h-4 w-4" }) }), _jsx(TabButton, { label: "En r\u00E9vision", isActive: activeTab === 'en-revision', onClick: () => setActiveTab('en-revision'), count: counts['en-revision'], icon: _jsx(FileText, { className: "h-4 w-4" }) }), _jsx(TabButton, { label: "Termin\u00E9s", isActive: activeTab === 'termines', onClick: () => setActiveTab('termines'), count: counts['termines'], icon: _jsx(CheckCircle, { className: "h-4 w-4" }) })] }) }), _jsx(CardContent, { children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.2 }, children: filteredTickets.length === 0 ? (_jsxs("div", { className: "text-center py-12 text-gray-500", children: [_jsx(TicketIcon, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { children: "Aucun ticket dans cette cat\u00E9gorie." })] })) : (_jsx("div", { className: "space-y-4", children: filteredTickets.map((ticket) => (_jsx("div", { className: `bg-white border p-4 hover:shadow-md transition-shadow cursor-pointer ${ticket.phase === PhaseTicket.EN_COURS
                                                ? 'border-blue-300 shadow-md'
                                                : ticket.phase === PhaseTicket.EN_REVISION
                                                    ? 'border-orange-300'
                                                    : 'border-gray-200'}`, onClick: () => setSelectedTicket(ticket.idTicket), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2 flex-wrap", children: [_jsx(TicketIcon, { className: "h-5 w-5 text-gray-400" }), _jsx("h4", { className: "font-medium text-gray-900", children: ticket.titre }), _jsx(Badge, { className: `text-xs ${getPhaseBadgeColor(ticket.phase)}`, children: getPhaseLabel(ticket.phase) }), _jsx(Badge, { className: `text-xs ${getPrioriteColor(ticket.priorite)}`, children: ticket.priorite })] }), _jsx("p", { className: "text-sm text-gray-600 mb-2 line-clamp-2", children: ticket.description }), _jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-gray-600 mb-1", children: [_jsx("span", { children: "Progression" }), _jsxs("span", { children: [ticket.progression, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: `h-2 rounded-full transition-all ${ticket.phase === PhaseTicket.EN_REVISION
                                                                                ? 'bg-orange-500'
                                                                                : ticket.phase === PhaseTicket.TERMINE
                                                                                    ? 'bg-green-500'
                                                                                    : 'bg-primary'}`, style: { width: `${ticket.progression}%` } }) })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("span", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 mr-1" }), ticket.dateCreation.toLocaleDateString('fr-FR')] }), ticket.dateEcheance && (_jsxs("span", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), "\u00C9ch\u00E9ance: ", ticket.dateEcheance.toLocaleDateString('fr-FR')] }))] })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: (e) => {
                                                            e.stopPropagation();
                                                            setSelectedTicket(ticket.idTicket);
                                                        }, children: [_jsx(Eye, { className: "h-4 w-4 mr-2" }), "Voir le d\u00E9tail"] })] }) }, ticket.idTicket))) })) }, activeTab) }) })] }), ticketDetail && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: () => setSelectedTicket(null), children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: ticketDetail.titre }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Badge, { className: getPhaseBadgeColor(ticketDetail.phase), children: getPhaseLabel(ticketDetail.phase) }), _jsx(Badge, { className: getPrioriteColor(ticketDetail.priorite), children: ticketDetail.priorite })] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedTicket(null), children: "\u00D7" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Description" }), _jsx("p", { className: "text-sm text-gray-600", children: ticketDetail.description })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-1", children: "Date de cr\u00E9ation" }), _jsx("p", { className: "text-sm text-gray-600", children: ticketDetail.dateCreation.toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            }) })] }), ticketDetail.dateEcheance && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-1", children: "\u00C9ch\u00E9ance" }), _jsx("p", { className: "text-sm text-gray-600", children: ticketDetail.dateEcheance.toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'long',
                                                                year: 'numeric'
                                                            }) })] }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Progression" }), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-600 mb-1", children: [_jsx("span", { children: "Avancement" }), _jsxs("span", { children: [ticketDetail.progression, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-3", children: _jsx("div", { className: `h-3 rounded-full transition-all ${ticketDetail.phase === PhaseTicket.EN_REVISION
                                                            ? 'bg-orange-500'
                                                            : ticketDetail.phase === PhaseTicket.TERMINE
                                                                ? 'bg-green-500'
                                                                : 'bg-primary'}`, style: { width: `${ticketDetail.progression}%` } }) })] }), ticketDetail.livrables && ticketDetail.livrables.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-700 mb-2", children: "Livrables" }), _jsx("div", { className: "space-y-2", children: ticketDetail.livrables.map((livrable, index) => (_jsx("div", { className: "p-3 bg-gray-50 border border-gray-200 rounded", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: livrable.nomFichier }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Version ", livrable.version, " - ", livrable.dateSubmission.toLocaleDateString('fr-FR')] })] }), _jsx(Badge, { className: livrable.statut === 'VALIDE'
                                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                                        : livrable.statut === 'REJETE'
                                                                            ? 'bg-red-50 text-red-700 border-red-200'
                                                                            : 'bg-yellow-50 text-yellow-700 border-yellow-200', children: livrable.statut })] }) }, index))) })] }))] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx(Button, { onClick: () => setSelectedTicket(null), children: "Fermer" }) })] }) }) }))] }) }));
};
export default Tickets;
