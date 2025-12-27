import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiCheck, FiAlertCircle, FiUserPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
const AddDepartement = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        chief: '',
        active: true
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Le nom du département est obligatoire";
        }
        else if (formData.name.length < 3) {
            newErrors.name = "Le nom doit contenir au moins 3 caractères";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
        // Effacer l'erreur pour ce champ si elle existe
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = Object.assign({}, prev);
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        if (validateForm()) {
            // Logique pour soumettre le formulaire
            console.log('Formulaire soumis:', formData);
            // Afficher une animation de succès et rediriger après un délai
            setTimeout(() => {
                navigate('/departements');
            }, 2000);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Ajouter un d\u00E9partement" }), _jsxs(Link, { to: "/departements", className: "btn-outline", children: [_jsx(FiArrowLeft, { className: "mr-2" }), " Retour \u00E0 la liste"] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "card p-6", children: formSubmitted && Object.keys(errors).length === 0 ? (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, className: "flex flex-col items-center justify-center py-8", children: [_jsx("div", { className: "h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4", children: _jsx(FiCheck, { className: "h-8 w-8" }) }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "D\u00E9partement ajout\u00E9 avec succ\u00E8s!" }), _jsx("p", { className: "text-gray-600 text-center mb-6", children: "Le d\u00E9partement a \u00E9t\u00E9 cr\u00E9\u00E9 et est maintenant disponible." }), _jsxs("div", { className: "flex space-x-4", children: [_jsx(Link, { to: "/departements", className: "btn-outline", children: "Retour \u00E0 la liste" }), _jsx(Link, { to: "/departements/add", className: "btn-primary", onClick: () => {
                                        setFormData({
                                            name: '',
                                            description: '',
                                            chief: '',
                                            active: true
                                        });
                                        setFormSubmitted(false);
                                    }, children: "Ajouter un autre" })] })] })) : (_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center mb-1", children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700", children: "Nom du d\u00E9partement*" }), errors.name && (_jsxs("span", { className: "ml-2 text-xs text-red-600 flex items-center", children: [_jsx(FiAlertCircle, { className: "mr-1" }), " ", errors.name] }))] }), _jsx("input", { type: "text", id: "name", name: "name", required: true, value: formData.name, onChange: handleChange, className: `w-full rounded-md border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`, placeholder: "Ex: Informatique" }), errors.name && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.name }))] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("label", { htmlFor: "chief", className: "block text-sm font-medium text-gray-700", children: "Chef de d\u00E9partement" }), _jsxs(Link, { to: "/staff/add", className: "text-primary text-sm flex items-center hover:underline", children: [_jsx(FiUserPlus, { className: "mr-1 h-4 w-4" }), " Ajouter un nouveau chef"] })] }), _jsxs("select", { id: "chief", name: "chief", value: formData.chief, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", children: [_jsx("option", { value: "", children: "S\u00E9lectionner un chef de d\u00E9partement" }), _jsx("option", { value: "1", children: "Dr. Ahmed Diop" }), _jsx("option", { value: "2", children: "Dr. Fatou Sow" }), _jsx("option", { value: "3", children: "Dr. Ousmane Fall" }), _jsx("option", { value: "4", children: "Dr. Marie Faye" }), _jsx("option", { value: "5", children: "Dr. Ibrahima Ndiaye" })] }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Vous pourrez modifier cette affectation ult\u00E9rieurement." })] }), _jsxs("div", { className: "mb-6", children: [_jsx("div", { className: "flex items-center mb-1", children: _jsx("label", { htmlFor: "active", className: "block text-sm font-medium text-gray-700", children: "Statut du d\u00E9partement" }) }), _jsxs("div", { className: "mt-2", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "active", name: "active", type: "checkbox", checked: formData.active, onChange: handleCheckboxChange, className: "h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" }), _jsx("label", { htmlFor: "active", className: "ml-2 block text-sm text-gray-700", children: "Activer imm\u00E9diatement ce d\u00E9partement" })] }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Un d\u00E9partement actif sera visible et utilisable dans tout le syst\u00E8me." })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { id: "description", name: "description", rows: 4, value: formData.description, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "Description du d\u00E9partement, son champ d'activit\u00E9 et ses missions principales..." }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Fournissez une description d\u00E9taill\u00E9e pour aider les utilisateurs \u00E0 comprendre le r\u00F4le de ce d\u00E9partement." })] }), _jsx("div", { className: "flex justify-end pt-4 border-t border-gray-100", children: _jsxs("div", { className: "flex space-x-3", children: [_jsx(Link, { to: "/departements", className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center", children: "Annuler" }), _jsxs("button", { type: "submit", className: "btn-primary", children: [_jsx(FiSave, { className: "mr-2" }), " Enregistrer"] })] }) })] })) })] }));
};
export default AddDepartement;
