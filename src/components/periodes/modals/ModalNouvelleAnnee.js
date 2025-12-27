import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
const ModalNouvelleAnnee = ({ open, onOpenChange, onCreate }) => {
    const [code, setCode] = useState('');
    const [libelle, setLibelle] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const handleSubmit = () => {
        if (code && libelle && dateDebut && dateFin) {
            onCreate({ code, libelle, dateDebut, dateFin });
            // Reset form
            setCode('');
            setLibelle('');
            setDateDebut('');
            setDateFin('');
            onOpenChange(false);
        }
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Cr\u00E9er une nouvelle ann\u00E9e acad\u00E9mique" }), _jsx(DialogDescription, { children: "Remplissez les informations pour cr\u00E9er une nouvelle ann\u00E9e acad\u00E9mique" })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "code", children: "Code" }), _jsx(Input, { id: "code", placeholder: "2025-2026", value: code, onChange: (e) => setCode(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "libelle", children: "Libell\u00E9" }), _jsx(Input, { id: "libelle", placeholder: "Ann\u00E9e acad\u00E9mique 2025-2026", value: libelle, onChange: (e) => setLibelle(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dateDebut", children: "Date de d\u00E9but" }), _jsx(Input, { id: "dateDebut", type: "date", value: dateDebut, onChange: (e) => setDateDebut(e.target.value) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dateFin", children: "Date de fin" }), _jsx(Input, { id: "dateFin", type: "date", value: dateFin, onChange: (e) => setDateFin(e.target.value) })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => onOpenChange(false), children: "Annuler" }), _jsx(Button, { onClick: handleSubmit, disabled: !code || !libelle || !dateDebut || !dateFin, children: "Cr\u00E9er" })] })] }) }));
};
export default ModalNouvelleAnnee;
