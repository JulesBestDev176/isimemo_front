import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Edit, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
const EtapeCorrection = ({ dossier, onComplete }) => {
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Edit, { className: "h-5 w-5 text-primary" }), "\u00C9tape 4 : Correction (optionnelle)"] }), _jsx(CardDescription, { children: "Effectuez les corrections demand\u00E9es par le jury" })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsx("div", { className: "p-4 bg-primary-50 border border-primary-200 rounded-lg", children: _jsx("p", { className: "text-sm text-gray-700", children: "Cette \u00E9tape est optionnelle. Si le jury demande des corrections, vous pourrez les effectuer ici." }) }), _jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: onComplete, className: "gap-2", children: ["Terminer le processus", _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] })] }) }));
};
export default EtapeCorrection;
