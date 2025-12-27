var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { dossierService } from '../../services/dossier.service';
import { getAnneeAcademiqueCourante } from '../../utils/anneeAcademique';
const CreateDossierModal = ({ isOpen, onClose, userId, onSuccess }) => {
    const [newDossierTitle, setNewDossierTitle] = useState('');
    const [creating, setCreating] = useState(false);
    const handleCreateDossier = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (!userId || !newDossierTitle.trim())
            return;
        try {
            setCreating(true);
            const newDossier = yield dossierService.createDossier({
                titre: newDossierTitle,
                candidatId: userId,
                anneeAcademique: getAnneeAcademiqueCourante()
            });
            onSuccess(newDossier);
            onClose();
            setNewDossierTitle('');
        }
        catch (error) {
            console.error("Erreur création dossier:", error);
        }
        finally {
            setCreating(false);
        }
    });
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "bg-white rounded-xl shadow-xl max-w-md w-full p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Nouveau dossier" }), _jsx("button", { onClick: () => !creating && onClose(), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("form", { onSubmit: handleCreateDossier, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Titre provisoire du m\u00E9moire" }), _jsx("input", { type: "text", required: true, value: newDossierTitle, onChange: (e) => setNewDossierTitle(e.target.value), placeholder: "Ex: Syst\u00E8me de gestion de...", className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all", autoFocus: true }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Le titre pourra \u00EAtre modifi\u00E9 ult\u00E9rieurement apr\u00E8s validation avec votre encadrant." })] }), _jsxs("div", { className: "flex space-x-3 pt-2", children: [_jsx("button", { type: "button", onClick: onClose, disabled: creating, className: "flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors", children: "Annuler" }), _jsx("button", { type: "submit", disabled: creating || !newDossierTitle.trim(), className: "flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2", children: creating ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), _jsx("span", { children: "Cr\u00E9ation..." })] })) : (_jsx("span", { children: "Confirmer" })) })] })] })] }) }));
};
export default CreateDossierModal;
