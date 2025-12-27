import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, FileText, Clock, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getEncadrementById, StatutEncadrement } from '../../models';
// Badge Component
const Badge = ({ children, variant = 'info' }) => {
    const variants = {
        success: 'bg-green-50 text-green-700 border border-green-200',
        info: 'bg-blue-50 text-blue-700 border border-blue-200',
        neutral: 'bg-gray-50 text-gray-700 border border-gray-200'
    };
    return (_jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${variants[variant]}`, children: children }));
};
// Formatage des dates
const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};
const EncadrementDetail = () => {
    var _a, _b, _c;
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    // Récupérer l'encadrement
    const encadrement = id ? getEncadrementById(parseInt(id)) : null;
    if (!encadrement) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(AlertCircle, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Encadrement introuvable" }), _jsx("p", { className: "text-gray-600 mb-4", children: "L'encadrement demand\u00E9 n'existe pas." }), _jsx("button", { onClick: () => navigate('/professeur/encadrements'), className: "px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors", children: "Retour aux encadrements" })] }) }));
    }
    const getStatutBadge = (statut) => {
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
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("button", { onClick: () => navigate('/professeur/encadrements'), className: "flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors", children: [_jsx(ArrowLeft, { className: "h-5 w-5 mr-2" }), "Retour aux encadrements"] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { className: "flex-1", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: ((_a = encadrement.dossierMemoire) === null || _a === void 0 ? void 0 : _a.titre) || `Encadrement #${encadrement.idEncadrement}` }), _jsxs("div", { className: "flex items-center gap-3", children: [getStatutBadge(encadrement.statut), _jsx(Badge, { variant: "neutral", children: encadrement.anneeAcademique })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-6", children: [_jsxs("div", { className: "flex items-center text-gray-700", children: [_jsx(Calendar, { className: "h-5 w-5 mr-3 text-gray-400" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Date de d\u00E9but" }), _jsx("div", { className: "font-medium", children: formatDate(encadrement.dateDebut) })] })] }), encadrement.dateFin && (_jsxs("div", { className: "flex items-center text-gray-700", children: [_jsx(CheckCircle, { className: "h-5 w-5 mr-3 text-gray-400" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Date de fin" }), _jsx("div", { className: "font-medium", children: formatDate(encadrement.dateFin) })] })] }))] })] }), ((_b = encadrement.dossierMemoire) === null || _b === void 0 ? void 0 : _b.candidats) && encadrement.dossierMemoire.candidats.length > 0 && (_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(Users, { className: "h-5 w-5 mr-2 text-gray-700" }), _jsxs("h2", { className: "text-lg font-semibold text-gray-900", children: ["Candidat", encadrement.dossierMemoire.candidats.length > 1 ? 's' : ''] })] }), _jsx("div", { className: "space-y-3", children: encadrement.dossierMemoire.candidats.map((candidat, index) => (_jsxs("div", { className: "flex items-center p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold mr-3", children: [candidat.prenom.charAt(0), candidat.nom.charAt(0)] }), _jsxs("div", { children: [_jsxs("div", { className: "font-medium text-gray-900", children: [candidat.prenom, " ", candidat.nom] }), candidat.email && (_jsx("div", { className: "text-sm text-gray-500", children: candidat.email }))] })] }, index))) })] })), ((_c = encadrement.dossierMemoire) === null || _c === void 0 ? void 0 : _c.description) && (_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx(FileText, { className: "h-5 w-5 mr-2 text-gray-700" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Description du m\u00E9moire" })] }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: encadrement.dossierMemoire.description })] })), encadrement.messages && encadrement.messages.length > 0 && (_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(MessageSquare, { className: "h-5 w-5 mr-2 text-gray-700" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Messages r\u00E9cents" })] }), _jsx(Badge, { variant: "neutral", children: encadrement.messages.length })] }), _jsx("div", { className: "space-y-3", children: encadrement.messages.slice(0, 5).map((message, index) => (_jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "font-medium text-gray-900", children: message.expediteur || 'Utilisateur' }), _jsx("span", { className: "text-sm text-gray-500", children: message.dateEnvoi ? formatDate(message.dateEnvoi) : 'Date inconnue' })] }), _jsx("p", { className: "text-gray-700 text-sm", children: message.contenu || 'Contenu du message' })] }, index))) })] })), encadrement.tickets && encadrement.tickets.length > 0 && (_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(AlertCircle, { className: "h-5 w-5 mr-2 text-gray-700" }), _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Tickets" })] }), _jsx(Badge, { variant: "neutral", children: encadrement.tickets.length })] }), _jsx("div", { className: "space-y-3", children: encadrement.tickets.map((ticket, index) => (_jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("span", { className: "font-medium text-gray-900", children: ["Ticket #", ticket.idTicket || index + 1] }), _jsx(Badge, { variant: ticket.statut === 'RESOLU' ? 'success' : 'neutral', children: ticket.statut || 'EN_COURS' })] }), _jsx("p", { className: "text-gray-700 text-sm", children: ticket.description || 'Description du ticket' })] }, index))) })] })), encadrement.statut === StatutEncadrement.ACTIF && (user === null || user === void 0 ? void 0 : user.estEncadrant) && (_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Panel d'encadrement" }), _jsx("p", { className: "text-sm text-gray-600", children: "Acc\u00E9dez au panel pour g\u00E9rer les messages, t\u00E2ches, dossiers et livrables" })] }), _jsxs("button", { onClick: () => navigate(`/professeur/encadrements/${encadrement.idEncadrement}/panel`), className: "px-6 py-3 bg-primary text-white hover:bg-primary-700 transition-colors flex items-center gap-2", children: [_jsx(MessageSquare, { className: "h-5 w-5" }), "Ouvrir le panel"] })] }) })), (!encadrement.messages || encadrement.messages.length === 0) &&
                    (!encadrement.tickets || encadrement.tickets.length === 0) && (_jsxs("div", { className: "bg-white border border-gray-200 p-12 text-center", children: [_jsx(Clock, { className: "h-16 w-16 text-gray-300 mx-auto mb-4" }), _jsx("p", { className: "text-gray-500", children: "Aucune activit\u00E9 r\u00E9cente pour cet encadrement" })] }))] }) }));
};
export default EncadrementDetail;
