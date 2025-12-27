import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, Circle, Clock, Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StatutEtape } from '../../models/services/PipelinePeriodes';
const PipelinePeriodes = ({ etapes, onActiver, onDesactiver, onModifier }) => {
    const getStatutBadge = (statut) => {
        switch (statut) {
            case StatutEtape.PAS_COMMENCEE:
                return _jsx(Badge, { variant: "outline", className: "bg-gray-50", children: "Pas commenc\u00E9e" });
            case StatutEtape.PLANIFIEE:
                return _jsx(Badge, { variant: "secondary", className: "bg-blue-50 text-blue-700", children: "Planifi\u00E9e" });
            case StatutEtape.ACTIVE:
                return _jsx(Badge, { className: "bg-primary text-white", children: "Active" });
            case StatutEtape.TERMINEE:
                return _jsx(Badge, { variant: "outline", className: "bg-green-50 text-green-700", children: "Termin\u00E9e" });
            case StatutEtape.BLOQUEE:
                return _jsx(Badge, { variant: "destructive", children: "Bloqu\u00E9e" });
            default:
                return _jsx(Badge, { variant: "outline", children: "Inconnu" });
        }
    };
    const getStatutIcon = (statut) => {
        switch (statut) {
            case StatutEtape.PAS_COMMENCEE:
                return _jsx(Circle, { className: "h-5 w-5 text-gray-400" });
            case StatutEtape.PLANIFIEE:
                return _jsx(Clock, { className: "h-5 w-5 text-blue-500" });
            case StatutEtape.ACTIVE:
                return _jsx(CheckCircle2, { className: "h-5 w-5 text-primary" });
            case StatutEtape.TERMINEE:
                return _jsx(CheckCircle2, { className: "h-5 w-5 text-green-600" });
            case StatutEtape.BLOQUEE:
                return _jsx(Lock, { className: "h-5 w-5 text-red-500" });
            default:
                return _jsx(Circle, { className: "h-5 w-5 text-gray-400" });
        }
    };
    const formatDate = (date) => {
        if (!date)
            return 'Non définie';
        return format(date, 'dd MMM yyyy', { locale: fr });
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex items-center justify-between mb-6", children: _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Pipeline des P\u00E9riodes" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Suivi s\u00E9quentiel des p\u00E9riodes acad\u00E9miques" })] }) }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" }), _jsx("div", { className: "space-y-6", children: etapes.map((etape, index) => {
                            const estDerniere = index === etapes.length - 1;
                            const estActive = etape.statut === StatutEtape.ACTIVE;
                            const estTerminee = etape.statut === StatutEtape.TERMINEE;
                            const estBloquee = etape.statut === StatutEtape.BLOQUEE;
                            // Créer une clé unique en combinant l'id et l'ordre
                            const uniqueKey = `${etape.id}-${etape.ordre}-${index}`;
                            return (_jsxs("div", { className: "relative flex items-start gap-4", children: [_jsx("div", { className: `relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 ${estActive ? 'bg-primary border-primary text-white' :
                                            estTerminee ? 'bg-green-100 border-green-500 text-green-700' :
                                                estBloquee ? 'bg-red-100 border-red-500 text-red-700' :
                                                    'bg-white border-gray-300 text-gray-500'}`, children: getStatutIcon(etape.statut) }), _jsxs(Card, { className: `flex-1 ${estActive ? 'border-primary shadow-md' :
                                            estTerminee ? 'border-green-200' :
                                                estBloquee ? 'border-red-200' :
                                                    'border-gray-200'}`, children: [_jsx(CardHeader, { children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(CardTitle, { className: "text-lg", children: etape.nom }), getStatutBadge(etape.statut), etape.estRepetitive && (_jsx(Badge, { variant: "outline", className: "text-xs", children: "R\u00E9p\u00E9titive" }))] }), _jsx(CardDescription, { children: etape.description })] }) }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "D\u00E9but :" }), _jsx("span", { className: "ml-2 font-medium", children: formatDate(etape.dateDebut) })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Fin :" }), _jsx("span", { className: "ml-2 font-medium", children: formatDate(etape.dateFin) })] })] }), _jsxs("div", { className: "flex items-center gap-2 pt-2 border-t", children: [etape.peutActiver && !estActive && !estTerminee && (_jsx(Button, { size: "sm", onClick: () => onActiver === null || onActiver === void 0 ? void 0 : onActiver(etape), className: "bg-primary hover:bg-primary/90", children: "Activer" })), etape.peutDesactiver && estActive && (_jsx(Button, { size: "sm", variant: "outline", onClick: () => onDesactiver === null || onDesactiver === void 0 ? void 0 : onDesactiver(etape), children: "D\u00E9sactiver" })), onModifier && (_jsx(Button, { size: "sm", variant: "ghost", onClick: () => onModifier === null || onModifier === void 0 ? void 0 : onModifier(etape), children: "Modifier" }))] }), estBloquee && (_jsx("div", { className: "text-sm text-red-600 bg-red-50 p-2 rounded", children: "Cette \u00E9tape est bloqu\u00E9e car les \u00E9tapes pr\u00E9c\u00E9dentes ne sont pas termin\u00E9es." }))] }) })] }), !estDerniere && (_jsx("div", { className: "absolute left-8 top-16 flex items-center justify-center w-16", children: _jsx(ArrowRight, { className: "h-6 w-6 text-gray-400" }) }))] }, uniqueKey));
                        }) })] }), _jsxs(Card, { className: "mt-8", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "L\u00E9gende" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Circle, { className: "h-4 w-4 text-gray-400" }), _jsx("span", { children: "Pas commenc\u00E9e" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4 text-blue-500" }), _jsx("span", { children: "Planifi\u00E9e" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-primary" }), _jsx("span", { children: "Active" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" }), _jsx("span", { children: "Termin\u00E9e" })] })] }) })] })] }));
};
export default PipelinePeriodes;
