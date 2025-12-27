import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiUpload, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';
const AddStaff = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        departement: '',
        role: 'chief', // 'chief' ou 'secretary'
        password: '',
        confirmPassword: '',
        title: '',
        specialization: '',
        photo: null,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [photoPreview, setPhotoPreview] = useState(null);
    // Les départements
    const departments = [
        { id: '1', name: 'Informatique' },
        { id: '2', name: 'Génie Civil' },
        { id: '3', name: 'Management' },
        { id: '4', name: 'Électronique' },
        { id: '5', name: 'Mécanique' },
    ];
    const validateForm = () => {
        const newErrors = {};
        // Validation du prénom et nom
        if (!formData.firstname.trim()) {
            newErrors.firstname = "Le prénom est obligatoire";
        }
        if (!formData.lastname.trim()) {
            newErrors.lastname = "Le nom est obligatoire";
        }
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "L'email est obligatoire";
        }
        else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Veuillez entrer un email valide";
        }
        // Validation téléphone
        const phoneRegex = /^[0-9]{2}[\s][0-9]{3}[\s][0-9]{2}[\s][0-9]{2}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = "Le téléphone est obligatoire";
        }
        else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Le format doit être: 77 123 45 67";
        }
        // Validation département
        if (!formData.departement) {
            newErrors.departement = "Veuillez sélectionner un département";
        }
        // Validation du mot de passe
        if (!formData.password) {
            newErrors.password = "Le mot de passe est obligatoire";
        }
        else if (formData.password.length < 6) {
            newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
        }
        // Validation de la confirmation du mot de passe
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
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
    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => (Object.assign(Object.assign({}, prev), { photo: file })));
            // Créer un aperçu de l'image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Logique pour soumettre le formulaire
            console.log('Formulaire soumis:', formData);
            setFormSubmitted(true);
            // Simuler un délai avant la redirection
            setTimeout(() => {
                navigate(formData.role === 'chief' ? '/staff/chiefs' : '/staff/secretaries');
            }, 2000);
        }
    };
    const formatPhoneNumber = (value) => {
        // Supprimer tous les caractères non numériques
        const numbers = value.replace(/\D/g, '');
        // Format: XX XXX XX XX
        if (numbers.length <= 2)
            return numbers;
        if (numbers.length <= 5)
            return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
        if (numbers.length <= 7)
            return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5)}`;
        return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 7)} ${numbers.slice(7, 9)}`;
    };
    const handlePhoneChange = (e) => {
        const formattedValue = formatPhoneNumber(e.target.value);
        setFormData(prev => (Object.assign(Object.assign({}, prev), { phone: formattedValue })));
        // Effacer l'erreur pour ce champ si elle existe
        if (errors.phone) {
            setErrors(prev => {
                const newErrors = Object.assign({}, prev);
                delete newErrors.phone;
                return newErrors;
            });
        }
    };
    const getReturnLink = () => {
        return formData.role === 'chief' ? '/staff/chiefs' : '/staff/secretaries';
    };
    const getReturnText = () => {
        return formData.role === 'chief' ? 'Retour aux chefs' : 'Retour aux secrétaires';
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4", children: [_jsxs("h1", { className: "text-2xl font-bold", children: ["Ajouter ", formData.role === 'chief' ? 'un chef de département' : 'une secrétaire'] }), _jsxs(Link, { to: getReturnLink(), className: "btn-outline", children: [_jsx(FiArrowLeft, { className: "mr-2" }), " ", getReturnText()] })] }), formSubmitted ? (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, className: "card p-8 text-center", children: [_jsx("div", { className: "h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4", children: _jsx(FiCheck, { className: "h-8 w-8" }) }), _jsxs("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: [formData.role === 'chief' ? 'Chef de département' : 'Secrétaire', " ajout\u00E9(e) avec succ\u00E8s!"] }), _jsxs("p", { className: "text-gray-600 mb-6", children: ["Un email a \u00E9t\u00E9 envoy\u00E9 \u00E0 ", formData.email, " avec les instructions de connexion."] }), _jsxs("div", { className: "flex space-x-4 justify-center", children: [_jsxs(Link, { to: getReturnLink(), className: "btn-outline", children: [_jsx(FiArrowLeft, { className: "mr-2" }), " ", getReturnText()] }), _jsxs(Link, { to: "/staff/add", className: "btn-primary", onClick: () => {
                                    setFormData({
                                        firstname: '',
                                        lastname: '',
                                        email: '',
                                        phone: '',
                                        departement: '',
                                        role: 'chief',
                                        password: '',
                                        confirmPassword: '',
                                        title: '',
                                        specialization: '',
                                        photo: null
                                    });
                                    setPhotoPreview(null);
                                    setFormSubmitted(false);
                                    setErrors({});
                                }, children: [_jsx(FiUser, { className: "mr-2" }), " Ajouter un autre"] })] })] })) : (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "card p-6", children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-6 mb-6", children: [_jsxs("div", { className: "w-full md:w-1/3 flex flex-col items-center", children: [_jsxs("div", { className: "mb-4 text-center", children: [_jsx("div", { className: "h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-primary transition-colors duration-200", onClick: () => { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, children: photoPreview ? (_jsx("img", { src: photoPreview, alt: "Aper\u00E7u", className: "h-full w-full object-cover" })) : (_jsx(FiUser, { className: "h-16 w-16 text-gray-400" })) }), _jsx("input", { type: "file", ref: fileInputRef, className: "hidden", accept: "image/*", onChange: handlePhotoChange }), _jsxs("button", { type: "button", className: "mt-2 text-primary hover:text-primary-700 flex items-center mx-auto text-sm font-medium", onClick: () => { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, children: [_jsx(FiUpload, { className: "mr-1" }), " ", photoPreview ? 'Changer' : 'Ajouter', " la photo"] }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Formats accept\u00E9s: JPG, PNG. Max 2MB" })] }), _jsxs("div", { className: "w-full", children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "role", className: "block text-sm font-medium text-gray-700 mb-1", children: "Type de compte*" }), _jsxs("div", { className: "flex border border-gray-300 rounded-md overflow-hidden", children: [_jsx("button", { type: "button", className: `flex-1 py-2 px-4 text-center ${formData.role === 'chief'
                                                                        ? 'bg-primary text-white'
                                                                        : 'bg-white text-gray-700 hover:bg-gray-50'}`, onClick: () => setFormData(prev => (Object.assign(Object.assign({}, prev), { role: 'chief' }))), children: "Chef" }), _jsx("button", { type: "button", className: `flex-1 py-2 px-4 text-center ${formData.role === 'secretary'
                                                                        ? 'bg-primary text-white'
                                                                        : 'bg-white text-gray-700 hover:bg-gray-50'}`, onClick: () => setFormData(prev => (Object.assign(Object.assign({}, prev), { role: 'secretary' }))), children: "Secr\u00E9taire" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "departement", className: "block text-sm font-medium text-gray-700 mb-1", children: "D\u00E9partement*" }), _jsxs("div", { className: errors.departement ? "relative" : "", children: [_jsxs("select", { id: "departement", name: "departement", required: true, value: formData.departement, onChange: handleChange, className: `w-full rounded-md border ${errors.departement
                                                                        ? 'border-red-300 bg-red-50'
                                                                        : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`, children: [_jsx("option", { value: "", children: "S\u00E9lectionner un d\u00E9partement" }), departments.map(dept => (_jsx("option", { value: dept.id, children: dept.name }, dept.id)))] }), errors.departement && (_jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx(FiAlertCircle, { className: "h-5 w-5 text-red-500" }) }))] }), errors.departement && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.departement }))] })] })] }), _jsxs("div", { className: "w-full md:w-2/3", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: "Informations personnelles" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "firstname", className: "block text-sm font-medium text-gray-700 mb-1", children: "Pr\u00E9nom*" }), _jsxs("div", { className: errors.firstname ? "relative" : "", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(FiUser, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", id: "firstname", name: "firstname", required: true, value: formData.firstname, onChange: handleChange, className: `w-full rounded-md border ${errors.firstname
                                                                        ? 'border-red-300 bg-red-50'
                                                                        : 'border-gray-300'} pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`, placeholder: "John" }), errors.firstname && (_jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx(FiAlertCircle, { className: "h-5 w-5 text-red-500" }) }))] }), errors.firstname && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.firstname }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "lastname", className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom*" }), _jsxs("div", { className: errors.lastname ? "relative" : "", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(FiUser, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", id: "lastname", name: "lastname", required: true, value: formData.lastname, onChange: handleChange, className: `w-full rounded-md border ${errors.lastname
                                                                        ? 'border-red-300 bg-red-50'
                                                                        : 'border-gray-300'} pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`, placeholder: "Doe" }), errors.lastname && (_jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx(FiAlertCircle, { className: "h-5 w-5 text-red-500" }) }))] }), errors.lastname && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.lastname }))] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email*" }), _jsxs("div", { className: errors.email ? "relative" : "", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(FiMail, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "email", id: "email", name: "email", required: true, value: formData.email, onChange: handleChange, className: `w-full rounded-md border ${errors.email
                                                                        ? 'border-red-300 bg-red-50'
                                                                        : 'border-gray-300'} pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`, placeholder: "john.doe@isi.edu" }), errors.email && (_jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx(FiAlertCircle, { className: "h-5 w-5 text-red-500" }) }))] }), errors.email && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.email }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700 mb-1", children: "T\u00E9l\u00E9phone*" }), _jsxs("div", { className: errors.phone ? "relative" : "", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(FiPhone, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "tel", id: "phone", name: "phone", required: true, value: formData.phone, onChange: handlePhoneChange, className: `w-full rounded-md border ${errors.phone
                                                                        ? 'border-red-300 bg-red-50'
                                                                        : 'border-gray-300'} pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`, placeholder: "77 123 45 67" }), errors.phone && (_jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none", children: _jsx(FiAlertCircle, { className: "h-5 w-5 text-red-500" }) }))] }), errors.phone && (_jsx("p", { className: "mt-1 text-xs text-red-600", children: errors.phone })), !errors.phone && (_jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Format: 77 123 45 67" }))] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-1", children: "Titre" }), _jsx("input", { type: "text", id: "title", name: "title", value: formData.title, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: formData.role === 'chief' ? "Docteur en Informatique" : "Licence en Secrétariat" }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Par exemple: Docteur, Professeur, Licence, etc." })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "specialization", className: "block text-sm font-medium text-gray-700 mb-1", children: "Sp\u00E9cialisation" }), _jsx("input", { type: "text", id: "specialization", name: "specialization", value: formData.specialization, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: formData.role === 'chief' ? "Intelligence Artificielle" : "Gestion administrative" })] })] }), _jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4 mt-6", children: "Informations de connexion" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-1", children: "Mot de passe*" }), _jsxs("div", { className: `relative ${errors.password ? "mb-1" : ""}`, children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(FiLock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: showPassword ? "text" : "password", id: "password", name: "password", required: true, value: formData.password, onChange: handleChange, className: `w-full rounded-md border ${errors.password
                                                                        ? 'border-red-300 bg-red-50'
                                                                        : 'border-gray-300'} pl-10 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary` }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword(!showPassword), children: showPassword ? (_jsx(FiEyeOff, { className: "h-5 w-5 text-gray-400" })) : (_jsx(FiEye, { className: "h-5 w-5 text-gray-400" })) })] }), errors.password && (_jsx("p", { className: "text-xs text-red-600", children: errors.password })), !errors.password && (_jsx("p", { className: "mt-1 text-xs text-gray-500", children: "Minimum 6 caract\u00E8res" }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirmer le mot de passe*" }), _jsxs("div", { className: `relative ${errors.confirmPassword ? "mb-1" : ""}`, children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(FiLock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: showConfirmPassword ? "text" : "password", id: "confirmPassword", name: "confirmPassword", required: true, value: formData.confirmPassword, onChange: handleChange, className: `w-full rounded-md border ${errors.confirmPassword
                                                                        ? 'border-red-300 bg-red-50'
                                                                        : 'border-gray-300'} pl-10 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary` }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowConfirmPassword(!showConfirmPassword), children: showConfirmPassword ? (_jsx(FiEyeOff, { className: "h-5 w-5 text-gray-400" })) : (_jsx(FiEye, { className: "h-5 w-5 text-gray-400" })) })] }), errors.confirmPassword && (_jsx("p", { className: "text-xs text-red-600", children: errors.confirmPassword }))] })] }), _jsx("div", { className: "mt-2 text-sm text-gray-500", children: _jsx("p", { children: "Un email sera automatiquement envoy\u00E9 \u00E0 l'adresse fournie avec les instructions de connexion." }) })] })] }), _jsx("div", { className: "flex justify-end pt-4 border-t border-gray-100", children: _jsxs("div", { className: "flex space-x-3", children: [_jsx(Link, { to: getReturnLink(), className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center", children: "Annuler" }), _jsxs("button", { type: "submit", className: "btn-primary", children: [_jsx(FiSave, { className: "mr-2" }), " Enregistrer"] })] }) })] }) }))] }));
};
export default AddStaff;
