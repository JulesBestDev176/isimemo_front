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
import React, { useMemo } from 'react';
import { FileText, ArrowRight, Layout, CheckCircle, Clock, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Progress } from '../../../../components/ui/progress';
import { useAuth } from '../../../../contexts/AuthContext';
import { getEncadrementActifByCandidat, getTicketsByEncadrement, PhaseTicket } from '../../../../models';
const EtapeRedaction = ({ dossier, onComplete, estSuiveur = false }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [taches, setTaches] = React.useState([]);
    // Charger les tickets locaux ET les tâches de l'encadrant
    React.useEffect(() => {
        const fetchAllTaches = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id) || !(dossier === null || dossier === void 0 ? void 0 : dossier.id))
                return;
            try {
                const response = yield fetch(`http://localhost:3001/api/demandes/${dossier.id}/taches`);
                if (response.ok) {
                    const data = yield response.json();
                    setTaches(data);
                }
            }
            catch (error) {
                console.error("Erreur chargement tâches:", error);
            }
        });
        fetchAllTaches();
    }, [user, dossier]);
    // Récupérer l'encadrement et les tickets pour calculer la progression réelle
    const stats = useMemo(() => {
        const userId = user === null || user === void 0 ? void 0 : user.id;
        if (!userId)
            return { progression: 0, total: 0, termines: 0, enCours: 0 };
        const encadrement = getEncadrementActifByCandidat(parseInt(userId));
        // Tickets locaux (modèle existant)
        const tickets = encadrement ? getTicketsByEncadrement(encadrement.idEncadrement) : [];
        // Tâches de l'encadrant (nouvel API)
        const encadrantTaches = taches.map(t => ({
            id: t.id,
            phase: t.statut === 'active' ? PhaseTicket.A_FAIRE : PhaseTicket.TERMINE,
            progression: t.statut === 'active' ? 0 : 100
        }));
        // Combiner les deux listes
        const allWork = [...tickets, ...encadrantTaches];
        if (allWork.length === 0)
            return { progression: 0, total: 0, termines: 0, enCours: 0 };
        const total = allWork.length;
        const termines = allWork.filter(t => t.phase === PhaseTicket.TERMINE).length;
        const enCours = allWork.filter(t => t.phase === PhaseTicket.EN_COURS || t.phase === PhaseTicket.EN_REVISION).length;
        const aFaire = allWork.filter(t => t.phase === PhaseTicket.A_FAIRE).length;
        const sumProgression = allWork.reduce((acc, t) => acc + t.progression, 0);
        const averageProgression = Math.round(sumProgression / total);
        return {
            progression: averageProgression,
            total,
            termines,
            enCours,
            aFaire
        };
    }, [user, taches]);
    const handleGoToWorkspace = () => {
        // Naviguer vers l'encadrement (l'espace de travail est un onglet là-bas)
        navigate('/candidat/encadrement', { state: { activeTab: 'espace-travail' } });
    };
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { className: "border-gray-200 shadow-sm overflow-hidden", children: [_jsx(CardHeader, { className: "bg-primary border-b border-primary text-white", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-white", children: [_jsx(FileText, { className: "h-6 w-6" }), "\u00C9tape : R\u00E9daction du M\u00E9moire"] }), _jsx(CardDescription, { className: "text-blue-50 mt-1", children: "Suivez votre avancement et g\u00E9rez vos t\u00E2ches de r\u00E9daction" })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-3xl font-bold text-white", children: [stats.progression, "%"] }), _jsx("div", { className: "text-[10px] text-blue-100 font-bold uppercase tracking-wider", children: "Progression" })] })] }) }), _jsxs(CardContent, { className: "pt-6 space-y-8", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center mb-1 text-sm font-semibold text-gray-700", children: [_jsx("span", { children: "Avancement des travaux" }), _jsxs("span", { className: "text-primary", children: [stats.progression, "%"] })] }), _jsx(Progress, { value: stats.progression, className: "h-3 bg-gray-100" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-4 rounded-lg flex items-center gap-4", children: [_jsx("div", { className: "p-2 bg-primary/10 text-primary rounded-md", children: _jsx(CheckCircle, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-xl font-bold text-gray-900", children: stats.termines }), _jsx("div", { className: "text-xs text-gray-500 font-medium", children: "T\u00E2ches termin\u00E9es" })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-4 rounded-lg flex items-center gap-4", children: [_jsx("div", { className: "p-2 bg-primary/10 text-primary rounded-md", children: _jsx(Clock, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-xl font-bold text-gray-900", children: stats.enCours }), _jsx("div", { className: "text-xs text-gray-500 font-medium", children: "En cours / R\u00E9vision" })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-4 rounded-lg flex items-center gap-4", children: [_jsx("div", { className: "p-2 bg-gray-100 text-gray-500 rounded-md", children: _jsx(AlertCircle, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-xl font-bold text-gray-900", children: stats.aFaire }), _jsx("div", { className: "text-xs text-gray-500 font-medium", children: "\u00C0 faire" })] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100", children: [_jsxs(Button, { variant: "outline", onClick: handleGoToWorkspace, className: "flex-1 gap-2 h-12 border-primary text-primary hover:bg-primary hover:text-white transition-all", children: [_jsx(Layout, { className: "h-5 w-5" }), "Acc\u00E9der \u00E0 l'espace de travail"] }), !estSuiveur && (_jsxs(Button, { onClick: onComplete, disabled: stats.progression < 100, className: "flex-1 gap-2 h-12 bg-primary hover:bg-primary/90 text-white shadow-md", children: ["Soumettre pour pr\u00E9-lecture", _jsx(ArrowRight, { className: "h-5 w-5" })] }))] }), stats.progression < 100 && !estSuiveur && (_jsxs("div", { className: "flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-primary flex-shrink-0 mt-0.5" }), _jsx("p", { children: "Vous devez terminer toutes vos t\u00E2ches (100%) avant de pouvoir soumettre votre m\u00E9moire pour pr\u00E9-lecture." })] })), estSuiveur && (_jsxs("div", { className: "flex items-start gap-2 text-xs text-primary bg-primary/5 p-3 rounded-lg border border-primary/20", children: [_jsx(Info, { className: "h-4 w-4 flex-shrink-0 mt-0.5" }), _jsx("p", { children: "En tant que bin\u00F4me, vous avez acc\u00E8s \u00E0 l'espace de travail en lecture seule. Votre partenaire est responsable de la soumission finale." })] }))] })] }) }));
};
export default EtapeRedaction;
