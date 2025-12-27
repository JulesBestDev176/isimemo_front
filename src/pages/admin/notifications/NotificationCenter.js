import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FiSend, FiBell } from 'react-icons/fi';
import { motion } from 'framer-motion';
const NotificationCenter = () => {
    const [notification, setNotification] = useState({
        title: '',
        message: '',
        recipientType: 'all', // 'all', 'chiefs', 'secretaries'
        departments: [],
    });
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Fermeture pendant les vacances',
            message: 'Les bureaux seront fermés du 1er au 15 août pour les vacances annuelles.',
            sentTo: 'Tous les départements',
            sentAt: '12/05/2025 09:30',
            read: 15,
            total: 20
        },
        {
            id: 2,
            title: 'Réunion mensuelle',
            message: 'La réunion mensuelle des chefs de département aura lieu le 20 mai à 14h dans la salle de conférence.',
            sentTo: 'Chefs de département',
            sentAt: '10/05/2025 11:45',
            read: 7,
            total: 8
        },
        {
            id: 3,
            title: 'Mise à jour du système',
            message: 'Une mise à jour du système de gestion des notes sera déployée ce weekend. Veuillez sauvegarder vos données.',
            sentTo: 'Secrétaires',
            sentAt: '08/05/2025 16:20',
            read: 12,
            total: 15
        },
    ]);
    const departments = [
        { id: 1, name: 'Informatique' },
        { id: 2, name: 'Génie Civil' },
        { id: 3, name: 'Management' },
        { id: 4, name: 'Électronique' },
        { id: 5, name: 'Mécanique' },
    ];
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNotification(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleDepartmentChange = (e) => {
        const { value, checked } = e.target;
        setNotification(prev => (Object.assign(Object.assign({}, prev), { departments: checked
                ? [...prev.departments, value]
                : prev.departments.filter(dept => dept !== value) })));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique pour envoyer la notification
        console.log('Notification envoyée:', notification);
        // Ajouter la notification à la liste (simulation)
        const recipientMap = {
            all: 'Tous les départements',
            chiefs: 'Chefs de département',
            secretaries: 'Secrétaires',
        };
        const newNotification = {
            id: notifications.length + 1,
            title: notification.title,
            message: notification.message,
            sentTo: recipientMap[notification.recipientType],
            sentAt: new Date().toLocaleString('fr-FR'),
            read: 0,
            total: notification.recipientType === 'all' ? 35 : notification.recipientType === 'chiefs' ? 8 : 15,
        };
        setNotifications([newNotification, ...notifications]);
        // Réinitialiser le formulaire
        setNotification({
            title: '',
            message: '',
            recipientType: 'all',
            departments: [],
        });
        alert('Notification envoyée avec succès!');
    };
    return (_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Centre de notifications" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "card p-6", children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center", children: [_jsx(FiSend, { className: "mr-2" }), " Envoyer une notification"] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700 mb-1", children: "Titre*" }), _jsx("input", { type: "text", id: "title", name: "title", required: true, value: notification.title, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "Titre de la notification" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 mb-1", children: "Message*" }), _jsx("textarea", { id: "message", name: "message", rows: 4, required: true, value: notification.message, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", placeholder: "Contenu de la notification" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "recipientType", className: "block text-sm font-medium text-gray-700 mb-1", children: "Destinataires*" }), _jsxs("select", { id: "recipientType", name: "recipientType", required: true, value: notification.recipientType, onChange: handleChange, className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", children: [_jsx("option", { value: "all", children: "Tous les utilisateurs" }), _jsx("option", { value: "chiefs", children: "Chefs de d\u00E9partement uniquement" }), _jsx("option", { value: "secretaries", children: "Secr\u00E9taires uniquement" })] })] }), notification.recipientType !== 'all' && (_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "S\u00E9lectionner les d\u00E9partements" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: departments.map(dept => (_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: `dept-${dept.id}`, name: `dept-${dept.id}`, type: "checkbox", value: dept.id.toString(), checked: notification.departments.includes(dept.id.toString()), onChange: handleDepartmentChange, className: "h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" }), _jsx("label", { htmlFor: `dept-${dept.id}`, className: "ml-2 block text-sm text-gray-700", children: dept.name })] }, dept.id))) })] })), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { type: "submit", className: "btn-primary", children: [_jsx(FiSend, { className: "mr-2" }), " Envoyer la notification"] }) })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.2 }, className: "card p-6", children: [_jsxs("h2", { className: "text-xl font-bold mb-4 flex items-center", children: [_jsx(FiBell, { className: "mr-2" }), " Notifications r\u00E9centes"] }), _jsx("div", { className: "space-y-4 max-h-[500px] overflow-y-auto", children: notifications.map(notif => (_jsxs("div", { className: "p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h3", { className: "font-semibold text-navy", children: notif.title }), _jsx("span", { className: "text-xs text-gray-500", children: notif.sentAt })] }), _jsx("p", { className: "text-sm text-gray-700 mt-1 mb-2", children: notif.message }), _jsxs("div", { className: "flex justify-between items-center text-xs text-gray-500", children: [_jsxs("span", { children: ["Envoy\u00E9 \u00E0: ", notif.sentTo] }), _jsxs("span", { children: ["Lu: ", notif.read, "/", notif.total] })] })] }, notif.id))) })] })] })] }));
};
export default NotificationCenter;
