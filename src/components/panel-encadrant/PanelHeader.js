import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const PanelHeader = ({ encadrement, encadrementId }) => {
    var _a, _b;
    const navigate = useNavigate();
    return (_jsxs("div", { className: "mb-6", children: [_jsxs("button", { onClick: () => navigate(`/professeur/encadrements/${encadrementId}`), className: "flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors", children: [_jsx(ArrowLeft, { className: "h-5 w-5 mr-2" }), "Retour \u00E0 l'encadrement"] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Panel d'Encadrement" }), _jsx("p", { className: "text-gray-600", children: ((_a = encadrement.dossierMemoire) === null || _a === void 0 ? void 0 : _a.titre) || `Encadrement #${encadrement.idEncadrement}` }), ((_b = encadrement.dossierMemoire) === null || _b === void 0 ? void 0 : _b.candidats) && encadrement.dossierMemoire.candidats.length > 0 && (_jsxs("div", { className: "mt-4 flex items-center gap-2", children: [_jsx(Users, { className: "h-4 w-4 text-gray-400" }), _jsx("span", { className: "text-sm text-gray-600", children: encadrement.dossierMemoire.candidats.map(c => `${c.prenom} ${c.nom}`).join(', ') })] }))] })] }));
};
