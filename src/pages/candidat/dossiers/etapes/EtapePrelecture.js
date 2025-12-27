import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Eye, ArrowRight, Clock, CheckCircle, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
// Mock data pour la prélecture
const PRELECTURE_MOCK = {
    id: 1,
    dossierMemoire: {
        id: 0,
        titre: 'Nouveau dossier de mémoire'
    },
    dateDemande: new Date(),
    statut: 'en_attente'
};
const EtapePrelecture = ({ dossier, onComplete, estSuiveur = false }) => {
    const [prelecture, setPrelecture] = useState(() => {
        // Chercher une prélecture existante pour ce dossier, sinon créer une nouvelle
        const existing = PRELECTURE_MOCK.dossierMemoire.id === dossier.id
            ? PRELECTURE_MOCK
            : Object.assign(Object.assign({}, PRELECTURE_MOCK), { id: Date.now(), dossierMemoire: {
                    id: dossier.id,
                    titre: dossier.titre
                }, dateDemande: new Date(), statut: 'en_attente' });
        return existing;
    });
    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const handleValider = () => {
        // Simuler la terminaison de la prélecture
        setPrelecture(Object.assign(Object.assign({}, prelecture), { statut: 'termine', dateTerminaison: new Date(), feedbacks: 'Votre mémoire a été prélecturé avec succès. Vous pouvez maintenant procéder au dépôt final.' }));
        // Appeler onComplete après un court délai
        setTimeout(() => {
            onComplete();
        }, 100);
    };
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Eye, { className: "h-5 w-5 text-primary" }), "\u00C9tape 1 : Pr\u00E9lecture"] }), _jsx(CardDescription, { children: "La commission de validation effectue la pr\u00E9lecture de votre m\u00E9moire et vous enverra des feedbacks" })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsx("div", { className: "p-4 bg-primary-50 border border-primary-200 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-2", children: _jsx(Eye, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-1", children: "Pr\u00E9lecture en cours" }), _jsx("p", { className: "text-sm text-gray-600", children: prelecture.dossierMemoire.titre }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Demand\u00E9e le ", formatDate(prelecture.dateDemande)] })] }), prelecture.statut === 'en_attente' && (_jsxs(Badge, { variant: "secondary", className: "bg-yellow-100 text-yellow-800 border-yellow-300", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), "En attente"] })), prelecture.statut === 'termine' && (_jsxs(Badge, { variant: "default", className: "bg-green-600 text-white", children: [_jsx(CheckCircle, { className: "h-3 w-3 mr-1" }), "Termin\u00E9"] }))] }) }), prelecture.statut === 'en_attente' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Clock, { className: "h-5 w-5 text-blue-600 mt-0.5" }), _jsx("div", { className: "flex-1", children: _jsx("p", { className: "text-sm text-blue-900", children: "La commission de validation est en train d'examiner votre m\u00E9moire. Vous recevrez des feedbacks une fois la pr\u00E9lecture termin\u00E9e." }) })] }) }), !estSuiveur && (_jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: handleValider, className: "gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Valider (simulation)"] }) }))] })), prelecture.statut === 'termine' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CheckCircle, { className: "h-5 w-5 text-green-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-green-900 mb-1", children: "Pr\u00E9lecture termin\u00E9e !" }), prelecture.dateTerminaison && (_jsxs("p", { className: "text-xs text-green-600 mb-2", children: ["Termin\u00E9e le ", formatDate(prelecture.dateTerminaison)] }))] })] }) }), prelecture.feedbacks && (_jsx("div", { className: "p-4 bg-gray-50 border border-gray-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-3 mb-3", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-2", children: _jsx(FileText, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Feedbacks de la commission" }), _jsx("div", { className: "p-3 bg-white rounded-lg border border-gray-200", children: _jsx("p", { className: "text-sm text-gray-700 whitespace-pre-wrap", children: prelecture.feedbacks }) })] })] }) })), _jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: onComplete, className: "gap-2", disabled: estSuiveur, children: [estSuiveur ? 'Attente de progression' : 'Passer à l\'étape suivante', _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] }))] })] }) }));
};
export default EtapePrelecture;
