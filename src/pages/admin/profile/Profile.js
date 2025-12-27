import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { FiEdit, FiSave, FiUser, FiMail, FiPhone, FiLock, FiCalendar, FiCamera, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
const Profile = () => {
    const [editing, setEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [profileData, setProfileData] = useState({
        firstName: 'Admin',
        lastName: 'ISIMemo',
        email: 'admin@isimemo.edu.sn',
        phone: '(+221) 77 123 45 67',
        role: 'Administrateur',
        department: 'Administration',
        lastLogin: '12/05/2025 08:45',
        photo: null,
    });
    // État temporaire pour la photo pendant l'édition
    const [tempPhoto, setTempPhoto] = useState(null);
    const [newPassword, setNewPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setNewPassword(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const saveProfile = (e) => {
        e.preventDefault();
        // Sauvegarde de la photo temporaire dans les données du profil
        setProfileData(prev => (Object.assign(Object.assign({}, prev), { photo: tempPhoto })));
        setEditing(false);
        // Simuler une sauvegarde
        alert('Profil mis à jour avec succès!');
    };
    const changePassword = (e) => {
        e.preventDefault();
        if (newPassword.new !== newPassword.confirm) {
            alert('Les nouveaux mots de passe ne correspondent pas!');
            return;
        }
        // Simuler un changement de mot de passe
        setNewPassword({
            current: '',
            new: '',
            confirm: '',
        });
        alert('Mot de passe changé avec succès!');
    };
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleFileChange = (e) => {
        var _a;
        const file = (_a = e.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                var _a;
                if ((_a = event.target) === null || _a === void 0 ? void 0 : _a.result) {
                    // Seulement mettre à jour la photo temporaire
                    setTempPhoto(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };
    const cancelEdit = () => {
        setEditing(false);
        // Réinitialiser la photo temporaire
        setTempPhoto(profileData.photo);
    };
    const startEditing = () => {
        // Initialiser la photo temporaire avec la photo actuelle
        setTempPhoto(profileData.photo);
        setEditing(true);
    };
    const removePhoto = () => {
        setTempPhoto(null);
    };
    return (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Mon Profil" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-1", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "card p-6 text-center", children: [_jsxs("div", { className: "relative mx-auto mb-4", children: [_jsx("div", { className: "h-24 w-24 rounded-full bg-primary text-white flex items-center justify-center mx-auto overflow-hidden", children: (editing ? tempPhoto : profileData.photo) ? (_jsx("img", { src: editing ? tempPhoto : profileData.photo, alt: "Profile", className: "h-full w-full object-cover" })) : (_jsx(FiUser, { className: "h-12 w-12" })) }), editing && (_jsxs("div", { className: "mt-3", children: [_jsxs("div", { className: "flex justify-center space-x-2", children: [_jsxs("button", { type: "button", onClick: triggerFileInput, className: "text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center transition-colors", children: [_jsx(FiCamera, { className: "mr-1" }), " Changer"] }), tempPhoto && (_jsxs("button", { type: "button", onClick: removePhoto, className: "text-sm px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md flex items-center transition-colors", children: [_jsx(FiX, { className: "mr-1" }), " Supprimer"] }))] }), _jsx("input", { type: "file", ref: fileInputRef, onChange: handleFileChange, accept: "image/*", className: "hidden" }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Les changements seront appliqu\u00E9s apr\u00E8s validation" })] }))] }), _jsxs("h2", { className: "text-xl font-semibold text-navy", children: [profileData.firstName, " ", profileData.lastName] }), _jsx("p", { className: "text-gray-600 mt-1", children: profileData.role }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: profileData.department }), _jsxs("div", { className: "mt-6 pt-6 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center justify-center space-x-2", children: [_jsx(FiMail, { className: "text-gray-500" }), _jsx("span", { className: "text-sm text-gray-600", children: profileData.email })] }), _jsxs("div", { className: "flex items-center justify-center space-x-2 mt-2", children: [_jsx(FiPhone, { className: "text-gray-500" }), _jsx("span", { className: "text-sm text-gray-600", children: profileData.phone })] }), _jsxs("div", { className: "flex items-center justify-center space-x-2 mt-2", children: [_jsx(FiCalendar, { className: "text-gray-500" }), _jsxs("span", { className: "text-sm text-gray-600", children: ["Derni\u00E8re connexion: ", profileData.lastLogin] })] })] })] }) }), _jsxs("div", { className: "lg:col-span-2", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.1 }, className: "card p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-lg font-semibold text-navy", children: "Informations personnelles" }), !editing ? (_jsxs("button", { onClick: startEditing, className: "text-primary hover:text-primary-700 focus:outline-none flex items-center text-sm", children: [_jsx(FiEdit, { className: "mr-1" }), " Modifier"] })) : null] }), _jsxs("form", { onSubmit: saveProfile, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "firstName", className: "block text-sm font-medium text-gray-700 mb-1", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", id: "firstName", name: "firstName", value: profileData.firstName, onChange: handleProfileChange, disabled: !editing, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "lastName", className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom" }), _jsx("input", { type: "text", id: "lastName", name: "lastName", value: profileData.lastName, onChange: handleProfileChange, disabled: !editing, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("input", { type: "email", id: "email", name: "email", value: profileData.email, onChange: handleProfileChange, disabled: !editing, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "phone", className: "block text-sm font-medium text-gray-700 mb-1", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "text", id: "phone", name: "phone", value: profileData.phone, onChange: handleProfileChange, disabled: !editing, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500" })] })] }), editing && (_jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: cancelEdit, className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50", children: "Annuler" }), _jsxs("button", { type: "submit", className: "btn-primary", children: [_jsx(FiSave, { className: "mr-2" }), " Enregistrer les modifications"] })] }))] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "card p-6 mt-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-navy mb-4 flex items-center", children: [_jsx(FiLock, { className: "mr-2" }), " Changer le mot de passe"] }), _jsxs("form", { onSubmit: changePassword, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "current", className: "block text-sm font-medium text-gray-700 mb-1", children: "Mot de passe actuel*" }), _jsx("input", { type: "password", id: "current", name: "current", required: true, value: newPassword.current, onChange: handlePasswordChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "new", className: "block text-sm font-medium text-gray-700 mb-1", children: "Nouveau mot de passe*" }), _jsx("input", { type: "password", id: "new", name: "new", required: true, value: newPassword.new, onChange: handlePasswordChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirm", className: "block text-sm font-medium text-gray-700 mb-1", children: "Confirmer le mot de passe*" }), _jsx("input", { type: "password", id: "confirm", name: "confirm", required: true, value: newPassword.confirm, onChange: handlePasswordChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" })] })] }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { type: "submit", className: "btn-primary", children: [_jsx(FiLock, { className: "mr-2" }), " Changer le mot de passe"] }) })] })] })] })] })] }));
};
export default Profile;
