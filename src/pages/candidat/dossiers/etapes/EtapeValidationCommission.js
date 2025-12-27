import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Scale, CheckCircle, XCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';
const EtapeValidationCommission = ({ dossier, validationCommission, onComplete, estSuiveur = false }) => {
    // Mock data - dans la vraie app, cela viendrait de l'API
    const [validation, setValidation] = useState(validationCommission);
    if (!validation) {
        // Si pas de validation, on en crée une en attente
        const nouvelleValidation = {
            id: Date.now(),
            dossierMemoire: {
                id: dossier.id,
                titre: dossier.titre
            },
            dateDemande: new Date(),
            statut: 'en_attente'
        };
        setValidation(nouvelleValidation);
        return null;
    }
    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Scale, { className: "h-5 w-5 text-primary" }), "Validation par la commission"] }), _jsx(CardDescription, { children: "Votre dossier est en cours d'examen par la commission de validation" })] }), _jsxs(CardContent, { className: "space-y-6", children: [_jsx("div", { className: "p-4 bg-primary-50 border border-primary-200 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-2", children: _jsx(Scale, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-1", children: "Dossier soumis \u00E0 la commission" }), _jsx("p", { className: "text-sm text-gray-600", children: validation.dossierMemoire.titre }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Soumis le ", formatDate(validation.dateDemande)] })] }), validation.statut === 'en_attente' && (_jsxs(Badge, { variant: "secondary", className: "bg-yellow-100 text-yellow-800 border-yellow-300", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), "En attente"] })), validation.statut === 'acceptee' && (_jsxs(Badge, { variant: "default", className: "bg-green-600 text-white", children: [_jsx(CheckCircle, { className: "h-3 w-3 mr-1" }), "Valid\u00E9"] })), validation.statut === 'refusee' && (_jsxs(Badge, { variant: "secondary", className: "bg-red-100 text-red-800 border-red-300", children: [_jsx(XCircle, { className: "h-3 w-3 mr-1" }), "Refus\u00E9"] }))] }) }), validation.statut === 'en_attente' && (_jsx(_Fragment, { children: _jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Clock, { className: "h-5 w-5 text-blue-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm text-blue-900", children: "Votre dossier est en cours d'examen par la commission de validation. Vous recevrez une notification d\u00E8s qu'une d\u00E9cision sera prise." }), _jsx("p", { className: "text-xs text-blue-700 mt-2", children: "La commission examine votre sujet, votre encadrant et la faisabilit\u00E9 de votre projet." })] })] }) }) })), validation.statut === 'acceptee' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CheckCircle, { className: "h-5 w-5 text-green-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-green-900 mb-1", children: "Dossier valid\u00E9 par la commission !" }), _jsx("p", { className: "text-sm text-green-700", children: "F\u00E9licitations ! Votre dossier a \u00E9t\u00E9 valid\u00E9. Vous pouvez maintenant commencer la r\u00E9daction de votre m\u00E9moire." }), validation.dateReponse && (_jsxs("p", { className: "text-xs text-green-600 mt-2", children: ["Validation re\u00E7ue le ", formatDate(validation.dateReponse)] }))] })] }) }), onComplete && (_jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: onComplete, className: "gap-2", disabled: estSuiveur, children: [estSuiveur ? 'Attente de progression' : 'Passer à l\'étape suivante', _jsx(ArrowRight, { className: "h-4 w-4" })] }) }))] })), validation.statut === 'refusee' && validation.motifRefus && (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-red-900 mb-1", children: "Motif de refus" }), _jsx("p", { className: "text-sm text-red-700", children: validation.motifRefus }), validation.dateReponse && (_jsxs("p", { className: "text-xs text-red-600 mt-2", children: ["Refus re\u00E7u le ", formatDate(validation.dateReponse)] }))] })] }) }), _jsx("div", { className: "p-4 bg-orange-50 border border-orange-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-orange-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-orange-900 mb-1", children: "Dossier refus\u00E9" }), _jsx("p", { className: "text-sm text-orange-700", children: "Votre dossier a \u00E9t\u00E9 refus\u00E9 par la commission. Vous devrez refaire le processus depuis le d\u00E9but." })] })] }) })] }))] })] }) }));
};
export default EtapeValidationCommission;
