import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar, Play, FileCheck, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { StatutSession } from '../../models/services/SessionSoutenance';
import { TypePeriodeValidation } from '../../models/commission/PeriodeValidation';
const PeriodesOverview = ({ anneeActive, totalAnnees, sessions, periodeValidationActive }) => {
    const sessionsOuvertes = sessions.filter(s => s.statut === StatutSession.OUVERTE).length;
    const totalSessions = sessions.length;
    const getTypePeriodeValidationLabel = (type) => {
        switch (type) {
            case TypePeriodeValidation.VALIDATION_SUJETS:
                return 'Validation des Sujets';
            case TypePeriodeValidation.VALIDATION_CORRECTIONS:
                return 'Validation des Corrections';
            case TypePeriodeValidation.AUCUNE:
                return 'Aucune période active';
        }
    };
    return (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Ann\u00E9e Active" }), _jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: anneeActive ? 1 : 0 }), _jsx("p", { className: "text-xs text-muted-foreground", children: anneeActive ? anneeActive.code : 'Aucune année active' })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Sessions Ouvertes" }), _jsx(Play, { className: "h-4 w-4 text-green-600" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: sessionsOuvertes }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [totalSessions, " session(s) au total"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "P\u00E9riode de Validation" }), _jsx(FileCheck, { className: "h-4 w-4 text-primary" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: periodeValidationActive ? 1 : 0 }), _jsx("p", { className: "text-xs text-muted-foreground", children: periodeValidationActive
                                    ? getTypePeriodeValidationLabel(periodeValidationActive.type)
                                    : 'Aucune période active' })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Ann\u00E9es" }), _jsx(CalendarDays, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: totalAnnees }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Ann\u00E9es acad\u00E9miques enregistr\u00E9es" })] })] })] }));
};
export default PeriodesOverview;
