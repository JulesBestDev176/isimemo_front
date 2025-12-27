import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
const EditDepartement = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        chief: '',
        active: true,
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Simulation d'une requête API pour récupérer les données du département
        setTimeout(() => {
            // Données fictives pour l'exemple
            setFormData({
                name: 'Informatique',
                description: 'Département spécialisé dans les technologies de l\'information et de la communication.',
                location: 'Bâtiment A, 2ème étage',
                chief: '1',
                active: true,
            });
            setLoading(false);
        }, 500);
    }, [id]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: checked })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique pour soumettre le formulaire
        console.log('Formulaire soumis:', formData);
        alert('Département modifié avec succès!');
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }) }));
    }
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Modifier le d\u00E9partement" }), _jsxs(Link, { to: "/departements", className: "btn-outline", children: [_jsx(FiArrowLeft, { className: "mr-2" }), " Retour \u00E0 la liste"] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "card p-6", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom du d\u00E9partement*" }), _jsx("input", { type: "text", id: "name", name: "name", required: true, value: formData.name, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "location", className: "block text-sm font-medium text-gray-700 mb-1", children: "Localisation" }), _jsx("input", { type: "text", id: "location", name: "location", value: formData.location, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "chief", className: "block text-sm font-medium text-gray-700 mb-1", children: "Chef de d\u00E9partement" }), _jsxs("select", { id: "chief", name: "chief", value: formData.chief, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", children: [_jsx("option", { value: "", children: "S\u00E9lectionner un chef de d\u00E9partement" }), _jsx("option", { value: "1", children: "Dr. Ahmed Diop" }), _jsx("option", { value: "2", children: "Dr. Fatou Sow" }), _jsx("option", { value: "3", children: "Dr. Ousmane Fall" })] })] }), _jsxs("div", { className: "flex items-center mt-8", children: [_jsx("input", { id: "active", name: "active", type: "checkbox", checked: formData.active, onChange: handleCheckboxChange, className: "h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" }), _jsx("label", { htmlFor: "active", className: "ml-2 block text-sm text-gray-700", children: "D\u00E9partement actif" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700 mb-1", children: "Description" }), _jsx("textarea", { id: "description", name: "description", rows: 4, value: formData.description, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" })] }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { type: "submit", className: "btn-primary", children: [_jsx(FiSave, { className: "mr-2" }), " Enregistrer les modifications"] }) })] }) })] }));
};
export default EditDepartement;
