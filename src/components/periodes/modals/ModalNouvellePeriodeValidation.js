import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { TypePeriodeValidation } from '../../../models/commission/PeriodeValidation';
const ModalNouvellePeriodeValidation = ({ open, onOpenChange, onCreate, etapeAModifier }) => {
    const isModification = !!etapeAModifier;
    // Formater une date pour l'input type="date"
    const formatDateForInput = (date) => {
        return date.toISOString().split('T')[0];
    };
    const [type, setType] = useState((etapeAModifier === null || etapeAModifier === void 0 ? void 0 : etapeAModifier.type) || '');
    const [dateDebut, setDateDebut] = useState(etapeAModifier ? formatDateForInput(etapeAModifier.dateDebut) : '');
    const [dateFin, setDateFin] = useState((etapeAModifier === null || etapeAModifier === void 0 ? void 0 : etapeAModifier.dateFin) ? formatDateForInput(etapeAModifier.dateFin) : '');
    // Réinitialiser les champs quand le modal s'ouvre avec une nouvelle étape
    useEffect(() => {
        if (open && etapeAModifier) {
            setType(etapeAModifier.type);
            setDateDebut(formatDateForInput(etapeAModifier.dateDebut));
            setDateFin(etapeAModifier.dateFin ? formatDateForInput(etapeAModifier.dateFin) : '');
        }
        else if (open && !etapeAModifier) {
            setType('');
            setDateDebut('');
            setDateFin('');
        }
    }, [open, etapeAModifier]);
    const handleSubmit = () => {
        if (type && dateDebut) {
            onCreate({
                type: type,
                dateDebut,
                dateFin: dateFin || undefined
            });
            // Reset form
            setType('');
            setDateDebut('');
            setDateFin('');
            onOpenChange(false);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: isModification ? 'Modifier la période de validation' : 'Créer une nouvelle période de validation' }), _jsx(DialogDescription, { children: isModification ? 'Modifiez les informations de la période de validation' : 'Définissez une période pour la validation des sujets ou des corrections' })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "typePeriode", children: "Type de p\u00E9riode" }), _jsxs(Select, { value: type, onValueChange: (value) => setType(value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "S\u00E9lectionnez un type" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: TypePeriodeValidation.VALIDATION_SUJETS, children: "Validation des Sujets" }), _jsx(SelectItem, { value: TypePeriodeValidation.VALIDATION_CORRECTIONS, children: "Validation des Corrections" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dateDebutPeriode", children: "Date de d\u00E9but" }), _jsx(Input, { id: "dateDebutPeriode", type: "date", value: dateDebut, onChange: (e) => setDateDebut(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dateFinPeriode", children: "Date de fin (optionnel)" }), _jsx(Input, { id: "dateFinPeriode", type: "date", value: dateFin, onChange: (e) => setDateFin(e.target.value) })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Annuler" }), _jsx(Button, { onClick: handleSubmit, disabled: !type || !dateDebut, children: isModification ? 'Modifier' : 'Créer' })] })] }) }));
};
export default ModalNouvellePeriodeValidation;
