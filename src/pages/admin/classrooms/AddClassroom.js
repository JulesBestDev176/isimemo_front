import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiHome, FiLayout, FiUsers, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';
const AddClassroom = () => {
    const [donneeFormulaire, setDonneeFormulaire] = useState({
        nom: '',
        capacite: '',
        batiment: '',
        etage: '',
        description: '',
    });
    const gererChangement = (e) => {
        const { name, value } = e.target;
        setDonneeFormulaire(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const soumettreFormulaire = (e) => {
        e.preventDefault();
        // Logique pour soumettre le formulaire
        console.log('Formulaire soumis:', donneeFormulaire);
        alert('Salle de classe ajoutée avec succès!');
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Ajouter une salle de classe" }), _jsxs(Link, { to: "/classrooms", className: "btn-outline", children: [_jsx(FiArrowLeft, { className: "mr-2" }), " Retour \u00E0 la liste"] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "card p-6", children: _jsxs("form", { onSubmit: soumettreFormulaire, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "nom", className: "block text-sm font-medium text-gray-700 mb-1 flex items-center", children: [_jsx(FiInfo, { className: "mr-1 text-primary" }), " Nom de la salle*"] }), _jsx("input", { type: "text", id: "nom", name: "nom", required: true, value: donneeFormulaire.nom, onChange: gererChangement, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "Ex: Salle 101" })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "capacite", className: "block text-sm font-medium text-gray-700 mb-1 flex items-center", children: [_jsx(FiUsers, { className: "mr-1 text-primary" }), " Capacit\u00E9*"] }), _jsx("input", { type: "number", id: "capacite", name: "capacite", required: true, min: "1", value: donneeFormulaire.capacite, onChange: gererChangement, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "Ex: 30" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "batiment", className: "block text-sm font-medium text-gray-700 mb-1 flex items-center", children: [_jsx(FiHome, { className: "mr-1 text-primary" }), " B\u00E2timent*"] }), _jsx("input", { type: "text", id: "batiment", name: "batiment", required: true, value: donneeFormulaire.batiment, onChange: gererChangement, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "Ex: B\u00E2timent A" })] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "etage", className: "block text-sm font-medium text-gray-700 mb-1 flex items-center", children: [_jsx(FiLayout, { className: "mr-1 text-primary" }), " \u00C9tage*"] }), _jsx("input", { type: "text", id: "etage", name: "etage", required: true, value: donneeFormulaire.etage, onChange: gererChangement, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "Ex: 1er \u00E9tage" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-1 flex items-center", children: [_jsx(FiInfo, { className: "mr-1 text-primary" }), " Description"] }), _jsx("textarea", { id: "description", name: "description", rows: 4, value: donneeFormulaire.description, onChange: gererChangement, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "Description de la salle (\u00E9quipements, particularit\u00E9s, etc.)" })] }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { type: "submit", className: "btn-primary", children: [_jsx(FiSave, { className: "mr-2" }), " Enregistrer"] }) })] }) })] }));
};
export default AddClassroom;
