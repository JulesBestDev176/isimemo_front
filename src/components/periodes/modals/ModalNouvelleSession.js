import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
const ModalNouvelleSession = ({ open, onOpenChange, onCreate, etapeAModifier }) => {
    const isModification = !!etapeAModifier;
    // Formater une date pour l'input type="date"
    const formatDateForInput = (date) => {
        return date.toISOString().split('T')[0];
    };
    const [nom, setNom] = useState((etapeAModifier === null || etapeAModifier === void 0 ? void 0 : etapeAModifier.nom) || '');
    const [dateDebut, setDateDebut] = useState(etapeAModifier ? formatDateForInput(etapeAModifier.dateDebut) : '');
    const [dateFin, setDateFin] = useState(etapeAModifier ? formatDateForInput(etapeAModifier.dateFin) : '');
    const [typeSession, setTypeSession] = useState((etapeAModifier === null || etapeAModifier === void 0 ? void 0 : etapeAModifier.typeSession) || '');
    // Réinitialiser les champs quand le modal s'ouvre avec une nouvelle étape
    useEffect(() => {
        if (open && etapeAModifier) {
            setNom(etapeAModifier.nom);
            setDateDebut(formatDateForInput(etapeAModifier.dateDebut));
            setDateFin(formatDateForInput(etapeAModifier.dateFin));
            setTypeSession(etapeAModifier.typeSession || '');
        }
        else if (open && !etapeAModifier) {
            setNom('');
            setDateDebut('');
            setDateFin('');
            setTypeSession('');
        }
    }, [open, etapeAModifier]);
    const handleSubmit = () => {
        if (nom && dateDebut && dateFin) {
            onCreate({
                nom,
                dateDebut,
                dateFin,
                typeSession: typeSession || undefined
            });
            setNom('');
            setDateDebut('');
            setDateFin('');
            setTypeSession('');
            onOpenChange(false);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: isModification ? 'Modifier la session de soutenance' : 'Créer une nouvelle session de soutenance' }), _jsx(DialogDescription, { children: isModification ? 'Modifiez les informations de la session de soutenance' : 'Définissez la période de la session de soutenance' })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "nomSession", children: "Nom de la session" }), _jsx(Input, { id: "nomSession", placeholder: "Session Juin 2025", value: nom, onChange: (e) => setNom(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "typeSession", children: "Type de session (optionnel)" }), _jsx(Input, { id: "typeSession", placeholder: "Juin, Septembre, D\u00E9cembre, Sp\u00E9ciale", value: typeSession, onChange: (e) => setTypeSession(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dateDebut", children: "Date de d\u00E9but" }), _jsx(Input, { id: "dateDebut", type: "date", value: dateDebut, onChange: (e) => setDateDebut(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dateFin", children: "Date de fin" }), _jsx(Input, { id: "dateFin", type: "date", value: dateFin, onChange: (e) => setDateFin(e.target.value) })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Annuler" }), _jsx(Button, { onClick: handleSubmit, disabled: !nom || !dateDebut || !dateFin, children: isModification ? 'Modifier' : 'Créer' })] })] }) }));
};
export default ModalNouvelleSession;
