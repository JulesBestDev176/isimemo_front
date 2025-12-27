import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
export const AddTacheModal = ({ isOpen, onClose, onAdd, demandes = [] }) => {
    var _a, _b;
    const [newTache, setNewTache] = useState({
        titre: '',
        description: '',
        dateEcheance: '',
        priorite: 'Moyenne',
        etudiantsAssignes: [],
        ordre: 1
    });
    const [searchEtudiant, setSearchEtudiant] = useState('');
    // Initialiser avec toutes les demandes sélectionnées par défaut
    useEffect(() => {
        if (isOpen && demandes.length > 0) {
            setNewTache(prev => (Object.assign(Object.assign({}, prev), { etudiantsAssignes: demandes.map(d => d.idDemande) })));
        }
    }, [isOpen, demandes]);
    const handleSubmit = () => {
        if (!newTache.titre.trim() || !newTache.description.trim())
            return;
        onAdd(newTache);
        setNewTache({
            titre: '',
            description: '',
            dateEcheance: '',
            priorite: 'Moyenne',
            etudiantsAssignes: [],
            ordre: 1
        });
        onClose();
    };
    const toggleEtudiant = (id) => {
        const currentAssignes = newTache.etudiantsAssignes || [];
        const isAssigned = currentAssignes.includes(id);
        if (isAssigned) {
            setNewTache(Object.assign(Object.assign({}, newTache), { etudiantsAssignes: currentAssignes.filter(eid => eid !== id) }));
        }
        else {
            setNewTache(Object.assign(Object.assign({}, newTache), { etudiantsAssignes: [...currentAssignes, id] }));
        }
    };
    const toggleAllEtudiants = () => {
        const currentAssignes = newTache.etudiantsAssignes || [];
        const allSelected = currentAssignes.length === demandes.length;
        if (allSelected) {
            setNewTache(Object.assign(Object.assign({}, newTache), { etudiantsAssignes: [] }));
        }
        else {
            setNewTache(Object.assign(Object.assign({}, newTache), { etudiantsAssignes: demandes.map(d => d.idDemande) }));
        }
    };
    // Fonction pour afficher le nom du groupe ou candidat
    const getDemandeLabel = (demande) => {
        if (demande.candidats && demande.candidats.length > 1) {
            // Binôme
            const noms = demande.candidats.map((c) => `${c.prenom} ${c.nom}`).join(' & ');
            return `Groupe: ${noms}`;
        }
        else {
            // Solo
            const c = demande.candidat || (demande.candidats && demande.candidats[0]);
            if (!c)
                return 'Candidat inconnu';
            return `Candidat: ${c.prenom} ${c.nom}`;
        }
    };
    if (!isOpen)
        return null;
    return (_jsx(AnimatePresence, { children: _jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", onClick: onClose, children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, onClick: (e) => e.stopPropagation(), className: "bg-white max-w-md w-full p-6 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: "Ajouter une t\u00E2che commune" }), _jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Titre *" }), _jsx("input", { type: "text", value: newTache.titre, onChange: (e) => setNewTache(Object.assign(Object.assign({}, newTache), { titre: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent", placeholder: "Titre de la t\u00E2che" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Description *" }), _jsx("textarea", { value: newTache.description, onChange: (e) => setNewTache(Object.assign(Object.assign({}, newTache), { description: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none", rows: 3, placeholder: "Description de la t\u00E2che" })] }), demandes.length > 0 && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Assign\u00E9 \u00E0" }), _jsxs("div", { className: "border border-gray-200 rounded-md p-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-3 pb-2 border-b border-gray-100", children: [_jsxs("label", { className: "flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: ((_a = newTache.etudiantsAssignes) === null || _a === void 0 ? void 0 : _a.length) === demandes.length, onChange: toggleAllEtudiants, className: "rounded border-gray-300 text-primary focus:ring-primary mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Tous les groupes/candidats" })] }), _jsxs("span", { className: "text-xs text-gray-500", children: [((_b = newTache.etudiantsAssignes) === null || _b === void 0 ? void 0 : _b.length) || 0, "/", demandes.length] })] }), _jsx("input", { type: "text", placeholder: "Rechercher...", value: searchEtudiant, onChange: (e) => setSearchEtudiant(e.target.value), className: "w-full px-3 py-1.5 text-sm border border-gray-200 rounded mb-2 focus:outline-none focus:border-primary" }), _jsxs("div", { className: "max-h-32 overflow-y-auto space-y-1", children: [demandes
                                                        .filter(d => {
                                                        const label = getDemandeLabel(d).toLowerCase();
                                                        return label.includes(searchEtudiant.toLowerCase());
                                                    })
                                                        .map(demande => {
                                                        var _a;
                                                        return (_jsxs("label", { className: "flex items-center px-1 py-1 hover:bg-gray-50 rounded cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: (_a = newTache.etudiantsAssignes) === null || _a === void 0 ? void 0 : _a.includes(demande.idDemande), onChange: () => toggleEtudiant(demande.idDemande), className: "rounded border-gray-300 text-primary focus:ring-primary mr-2" }), _jsx("span", { className: "text-sm text-gray-700", children: getDemandeLabel(demande) })] }, demande.idDemande));
                                                    }), demandes.filter(d => getDemandeLabel(d).toLowerCase().includes(searchEtudiant.toLowerCase())).length === 0 && (_jsx("p", { className: "text-xs text-gray-500 text-center py-2", children: "Aucun r\u00E9sultat trouv\u00E9" }))] })] })] })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Date d'\u00E9ch\u00E9ance" }), _jsx("input", { type: "date", value: newTache.dateEcheance, onChange: (e) => setNewTache(Object.assign(Object.assign({}, newTache), { dateEcheance: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Priorit\u00E9" }), _jsxs("select", { value: newTache.priorite, onChange: (e) => setNewTache(Object.assign(Object.assign({}, newTache), { priorite: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent", children: [_jsx("option", { value: "Basse", children: "Basse" }), _jsx("option", { value: "Moyenne", children: "Moyenne" }), _jsx("option", { value: "Haute", children: "Haute" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Ordre de r\u00E9alisation (ex: 1 pour Livrable 1)" }), _jsx("input", { type: "number", min: "1", value: newTache.ordre, onChange: (e) => setNewTache(Object.assign(Object.assign({}, newTache), { ordre: parseInt(e.target.value) || 1 })), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent", placeholder: "Ex: 1, 2, 3..." })] })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100", children: [_jsx("button", { onClick: onClose, className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors", children: "Annuler" }), _jsx("button", { onClick: handleSubmit, disabled: !newTache.titre.trim() || !newTache.description.trim(), className: "px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Ajouter la t\u00E2che" })] })] }) }) }));
};
