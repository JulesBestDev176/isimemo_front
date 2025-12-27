import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = Object.assign({}, prev);
                delete newErrors[name];
                return newErrors;
            });
        }
    };
    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }
        if (!formData.subject.trim()) {
            newErrors.subject = 'Le sujet est requis';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Le message est requis';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form submitted:', formData);
            setSubmitted(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        }
    };
    return (_jsx("section", { className: "section bg-gradient-to-br from-primary-50 to-blue-50", id: "contact", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-start", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -50 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, children: [_jsx("h2", { className: "text-3xl font-bold mb-6 text-navy", children: "Contactez-nous" }), _jsx("p", { className: "text-lg mb-8 text-navy-700", children: "Des questions sur la plateforme ISIMemo ? Nous sommes l\u00E0 pour vous aider." }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "material-icons text-primary", children: "location_on" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-navy", children: "Adresse" }), _jsx("p", { className: "text-navy-700", children: "123 Rue de l'ISI, Dakar, S\u00E9n\u00E9gal" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "material-icons text-primary", children: "email" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-navy", children: "Email" }), _jsx("p", { className: "text-navy-700", children: "contact@isimemo.edu" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "material-icons text-primary", children: "phone" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-navy", children: "T\u00E9l\u00E9phone" }), _jsx("p", { className: "text-navy-700", children: "+221 33 123 45 67" })] })] })] })] }), _jsx(motion.div, { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "bg-white p-8 rounded-xl shadow-xl", children: submitted ? (_jsxs(motion.div, { className: "text-center py-12", initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 }, children: [_jsx("div", { className: "w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6", children: _jsx("span", { className: "material-icons text-green-500 text-4xl", children: "check_circle" }) }), _jsx("h3", { className: "text-2xl font-bold text-navy mb-4", children: "Message envoy\u00E9 !" }), _jsx("p", { className: "text-navy-700", children: "Merci de nous avoir contact\u00E9. Notre \u00E9quipe vous r\u00E9pondra dans les plus brefs d\u00E9lais." }), _jsxs("button", { onClick: () => setSubmitted(false), className: "mt-6 text-primary hover:text-primary-700 font-medium flex items-center gap-2 mx-auto", children: [_jsx("span", { className: "material-icons", children: "refresh" }), "Envoyer un autre message"] })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-navy-800 font-medium mb-2", children: "Nom" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, className: `w-full px-4 py-3 rounded-md border ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`, placeholder: "Votre nom" }), errors.name && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.name })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-navy-800 font-medium mb-2", children: "Email" }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, className: `w-full px-4 py-3 rounded-md border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`, placeholder: "Votre email" }), errors.email && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.email })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "subject", className: "block text-navy-800 font-medium mb-2", children: "Sujet" }), _jsxs("select", { id: "subject", name: "subject", value: formData.subject, onChange: handleChange, className: `w-full px-4 py-3 rounded-md border ${errors.subject ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white`, children: [_jsx("option", { value: "", children: "S\u00E9lectionnez un sujet" }), _jsx("option", { value: "information", children: "Demande d'information" }), _jsx("option", { value: "probleme", children: "Signaler un probl\u00E8me" }), _jsx("option", { value: "suggestion", children: "Suggestion" }), _jsx("option", { value: "autre", children: "Autre" })] }), errors.subject && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.subject })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "message", className: "block text-navy-800 font-medium mb-2", children: "Message" }), _jsx("textarea", { id: "message", name: "message", value: formData.message, onChange: handleChange, rows: 5, className: `w-full px-4 py-3 rounded-md border ${errors.message ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none`, placeholder: "Votre message" }), errors.message && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.message })] }), _jsx(motion.button, { type: "submit", className: "btn-primary w-full py-3", whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, children: "Envoyer le message" })] })) })] }) }));
};
export default ContactForm;
