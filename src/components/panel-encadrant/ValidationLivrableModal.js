import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
export const ValidationLivrableModal = ({ isOpen, livrable, action, onClose, onConfirm }) => {
    const [feedback, setFeedback] = useState('');
    useEffect(() => {
        if (!isOpen) {
            setFeedback('');
        }
    }, [isOpen]);
    const handleConfirm = () => {
        if (action === 'rejeter' && !feedback.trim()) {
            alert('Veuillez fournir un feedback pour le rejet.');
            return;
        }
        onConfirm(feedback);
        setFeedback('');
    };
    if (!isOpen || !livrable)
        return null;
    return (_jsx(AnimatePresence, { children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: onClose, children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, onClick: (e) => e.stopPropagation(), className: "bg-white max-w-md w-full p-6", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-4", children: action === 'valider' ? 'Valider le livrable' : 'Rejeter le livrable' }), _jsxs("div", { className: "mb-4", children: [_jsxs("p", { className: "text-sm text-gray-600 mb-2", children: [_jsx("span", { className: "font-medium", children: "Livrable:" }), " ", livrable.titre] }), _jsxs("p", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium", children: "\u00C9tudiant:" }), " ", livrable.etudiant.prenom, " ", livrable.etudiant.nom] })] }), action === 'rejeter' && (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Feedback (obligatoire) *" }), _jsx("textarea", { value: feedback, onChange: (e) => setFeedback(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none", rows: 4, placeholder: "Indiquez les raisons du rejet et les corrections \u00E0 apporter..." })] })), action === 'valider' && (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Feedback (optionnel)" }), _jsx("textarea", { value: feedback, onChange: (e) => setFeedback(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none", rows: 4, placeholder: "Commentaires optionnels..." })] })), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors", children: "Annuler" }), _jsx("button", { onClick: handleConfirm, disabled: action === 'rejeter' && !feedback.trim(), className: `px-4 py-2 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${action === 'valider' ? 'bg-green-600' : 'bg-red-600'}`, children: action === 'valider' ? 'Valider' : 'Rejeter' })] })] }) }) }));
};
