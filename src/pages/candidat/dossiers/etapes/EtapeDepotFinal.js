import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Upload, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
const EtapeDepotFinal = ({ dossier, onComplete, estSuiveur = false }) => {
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Upload, { className: "h-5 w-5 text-primary" }), "\u00C9tape 2 : D\u00E9p\u00F4t final"] }), _jsx(CardDescription, { children: "D\u00E9posez la version finale de votre m\u00E9moire" })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsx("div", { className: "p-4 bg-primary-50 border border-primary-200 rounded-lg", children: _jsx("p", { className: "text-sm text-gray-700", children: "Cette \u00E9tape est en cours de d\u00E9veloppement. Vous pourrez bient\u00F4t d\u00E9poser la version finale de votre m\u00E9moire." }) }), _jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: onComplete, className: "gap-2", disabled: estSuiveur, children: [estSuiveur ? 'Attente de progression' : 'Passer à l\'étape suivante', _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] })] }) }));
};
export default EtapeDepotFinal;
