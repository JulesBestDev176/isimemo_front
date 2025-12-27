import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useMemo, useState } from "react";
import { Calendar, Clock, Users, Presentation, FileText, AlertCircle, Globe, MapPin, Filter, X, Bell, Plus, BarChart3, ChevronDown, Eye, Edit, Trash2, Video, Building } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
// Utilitaires de date
const formatDate = (date, format = 'short') => {
    const options = {
        weekday: format === 'long' ? 'long' : undefined,
        year: 'numeric',
        month: format === 'long' ? 'long' : 'short',
        day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
};
const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
};
const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
};
const isAfter = (date1, date2) => {
    return date1.getTime() > date2.getTime();
};
const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const addMonths = (date, months) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
};
// Hook pour les toasts (simplifié)
const useToast = () => ({
    addToast: (type, title, message) => {
        console.log(`${type}: ${title} - ${message}`);
        alert(`${title}: ${message}`);
    }
});
// Badge Component
const Badge = ({ children, variant = 'info' }) => {
    const styles = {
        success: "bg-green-50 text-green-800 border border-green-200",
        warning: "bg-orange-50 text-orange-800 border border-orange-200",
        info: "bg-slate-50 text-slate-700 border border-slate-200",
        error: "bg-red-50 text-red-800 border border-red-200",
        primary: "bg-navy-50 text-navy-800 border border-navy-200"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium ${styles[variant]}`, children: children }));
};
// Simple Button Component
const SimpleButton = ({ children, variant = 'secondary', onClick, size = 'md', disabled = false }) => {
    const styles = {
        primary: 'bg-navy text-white border border-navy hover:bg-navy-dark',
        secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
        ghost: 'bg-transparent text-slate-600 border border-transparent hover:bg-slate-50',
        danger: 'bg-red-600 text-white border border-red-600 hover:bg-red-700'
    };
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm'
    };
    return (_jsx("button", { onClick: onClick, disabled: disabled, className: `font-medium transition-colors duration-200 flex items-center ${styles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`, children: children }));
};
// Tab Button Component
const TabButton = ({ children, isActive, onClick, icon, count }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-navy text-navy bg-white'
            : 'border-transparent text-slate-500 hover:text-navy-700 bg-slate-50'}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children, count !== undefined && (_jsx("span", { className: `ml-2 px-2 py-0.5 text-xs font-medium border ${isActive
                    ? 'bg-navy-50 text-navy-700 border-navy-200'
                    : 'bg-navy-200 text-navy-600 border-navy-300'}`, children: count }))] }));
};
// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: title }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), children] }) }));
};
// Dropdown pour les filtres
const FilterDropdown = ({ filtres, toggleFiltre }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs("div", { className: "relative", children: [_jsxs(SimpleButton, { variant: "secondary", onClick: () => setIsOpen(!isOpen), children: [_jsx(Filter, { className: "mr-2 h-4 w-4" }), "Filtres", !filtres.toutes && (_jsxs("span", { className: "ml-2 text-xs bg-navy-dark text-white px-2 py-0.5", children: [Object.values(filtres).slice(1).filter(Boolean).length, "/4"] })), _jsx(ChevronDown, { className: "ml-2 h-4 w-4" })] }), isOpen && (_jsx("div", { className: "absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 shadow-lg z-10", children: _jsxs("div", { className: "p-3", children: [_jsx("p", { className: "text-sm font-medium text-slate-700 mb-3", children: "Types d'\u00E9v\u00E9nements" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: filtres.toutes, onChange: () => toggleFiltre("toutes"), className: "mr-2" }), _jsx(Calendar, { className: "mr-2 h-4 w-4" }), "Tous les \u00E9v\u00E9nements"] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: filtres.reunion, onChange: () => toggleFiltre("reunion"), className: "mr-2" }), _jsx(Users, { className: "mr-2 h-4 w-4 text-slate-600" }), "R\u00E9unions"] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: filtres.seminaire, onChange: () => toggleFiltre("seminaire"), className: "mr-2" }), _jsx(Presentation, { className: "mr-2 h-4 w-4 text-slate-600" }), "S\u00E9minaires"] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: filtres.deadline, onChange: () => toggleFiltre("deadline"), className: "mr-2" }), _jsx(Clock, { className: "mr-2 h-4 w-4 text-slate-600" }), "Dates limites"] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: filtres.autre, onChange: () => toggleFiltre("autre"), className: "mr-2" }), _jsx(FileText, { className: "mr-2 h-4 w-4 text-slate-600" }), "Autres"] })] })] }) }))] }));
};
// Calendrier simple
const SimpleCalendar = ({ selectedDate, onDateSelect, eventsOnDays }) => {
    const today = new Date();
    const [displayedMonth, setDisplayedMonth] = React.useState(selectedDate ? selectedDate.getMonth() : today.getMonth());
    const [displayedYear, setDisplayedYear] = React.useState(selectedDate ? selectedDate.getFullYear() : today.getFullYear());
    React.useEffect(() => {
        if (selectedDate) {
            setDisplayedMonth(selectedDate.getMonth());
            setDisplayedYear(selectedDate.getFullYear());
        }
    }, [selectedDate]);
    const currentMonth = new Date(displayedYear, displayedMonth, 1);
    const year = displayedYear;
    const month = displayedMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - ((firstDay.getDay() + 6) % 7));
    const days = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < 42; i++) {
        days.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    const handlePrevMonth = () => {
        if (month === 0) {
            setDisplayedMonth(11);
            setDisplayedYear(year - 1);
        }
        else {
            setDisplayedMonth(month - 1);
        }
    };
    const handleNextMonth = () => {
        if (month === 11) {
            setDisplayedMonth(0);
            setDisplayedYear(year + 1);
        }
        else {
            setDisplayedMonth(month + 1);
        }
    };
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return (_jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("button", { onClick: handlePrevMonth, className: "p-2 hover:bg-navy-100 transition-colors", children: "<" }), _jsxs("div", { className: "text-lg font-medium", children: [months[month], " ", year] }), _jsx("button", { onClick: handleNextMonth, className: "p-2 hover:bg-navy-100 transition-colors", children: ">" })] }), _jsx("div", { className: "grid grid-cols-7 gap-1 text-center mb-2", children: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day, i) => (_jsx("div", { className: "text-xs font-medium text-slate-500 py-2", children: day }, i))) }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: days.map((day, index) => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, today);
                    const isCurrentMonth = day.getMonth() === month;
                    const hasEvent = eventsOnDays.includes(formatDateKey(day));
                    return (_jsxs("button", { onClick: () => onDateSelect(day), className: `
                h-10 w-10 text-sm transition-colors duration-200 relative border
                ${isSelected
                            ? 'bg-navy text-white border-navy'
                            : isToday
                                ? 'bg-navy-100 text-navy-dark font-medium border-slate-300'
                                : isCurrentMonth
                                    ? 'text-slate-700 hover:bg-navy-50 border-transparent'
                                    : 'text-slate-400 border-transparent'}
              `, children: [day.getDate(), hasEvent && (_jsx("div", { className: "absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-navy rounded-full" }))] }, index));
                }) })] }));
};
// Formulaire d'ajout d'événement
const FormulaireEvenement = () => {
    const [formData, setFormData] = useState({
        titre: '',
        date: '',
        heure: '',
        type: 'reunion',
        modalite: 'presentiel',
        lieu: '',
        lien: '',
        description: '',
        participants: ''
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Titre *" }), _jsx("input", { type: "text", value: formData.titre, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { titre: e.target.value })), placeholder: "Titre de l'\u00E9v\u00E9nement", className: "w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Type *" }), _jsxs("select", { value: formData.type, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { type: e.target.value })), className: "w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark", children: [_jsx("option", { value: "reunion", children: "R\u00E9union" }), _jsx("option", { value: "seminaire", children: "S\u00E9minaire" }), _jsx("option", { value: "deadline", children: "Date limite" }), _jsx("option", { value: "autre", children: "Autre" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Date *" }), _jsx("input", { type: "date", value: formData.date, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { date: e.target.value })), className: "w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Heure" }), _jsx("input", { type: "time", value: formData.heure, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { heure: e.target.value })), className: "w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark" })] })] }), (formData.type === 'reunion' || formData.type === 'seminaire') && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Modalit\u00E9" }), _jsxs("select", { value: formData.modalite, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { modalite: e.target.value })), className: "w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark", children: [_jsx("option", { value: "presentiel", children: "Pr\u00E9sentiel" }), _jsx("option", { value: "ligne", children: "En ligne" })] })] }), formData.modalite === 'presentiel' ? (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: [_jsx(MapPin, { className: "w-4 h-4 inline mr-1" }), "Lieu"] }), _jsx("input", { type: "text", value: formData.lieu, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { lieu: e.target.value })), placeholder: "Salle de r\u00E9union, adresse...", className: "w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark" })] })) : (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: [_jsx(Video, { className: "w-4 h-4 inline mr-1" }), "Lien de la r\u00E9union"] }), _jsx("input", { type: "url", value: formData.lien, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { lien: e.target.value })), placeholder: "https://meet.google.com/... ou https://zoom.us/...", className: "w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark" })] }))] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Description" }), _jsx("textarea", { rows: 4, value: formData.description, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { description: e.target.value })), placeholder: "Description de l'\u00E9v\u00E9nement...", className: "w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Participants" }), _jsx("input", { type: "text", value: formData.participants, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { participants: e.target.value })), placeholder: "Noms des participants, s\u00E9par\u00E9s par des virgules", className: "w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy" })] }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx(SimpleButton, { variant: "secondary", children: "Annuler" }), _jsxs(SimpleButton, { variant: "primary", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Cr\u00E9er l'\u00E9v\u00E9nement"] })] })] }));
};
// Statistiques améliorées
const StatistiquesAvancees = ({ evenements }) => {
    const today = new Date();
    const nextMonth = addMonths(today, 1);
    const stats = {
        total: evenements.length,
        aVenir: evenements.filter(e => isAfter(e.date, today) || isSameDay(e.date, today)).length,
        reunions: evenements.filter(e => e.type === 'reunion').length,
        seminaires: evenements.filter(e => e.type === 'seminaire').length,
        deadlines: evenements.filter(e => e.type === 'deadline').length,
        moisActuel: evenements.filter(e => e.date.getMonth() === today.getMonth() &&
            e.date.getFullYear() === today.getFullYear()).length,
        moisProchain: evenements.filter(e => e.date.getMonth() === nextMonth.getMonth() &&
            e.date.getFullYear() === nextMonth.getFullYear()).length,
        enLigne: evenements.filter(e => e.modalite === 'ligne').length,
        presentiel: evenements.filter(e => e.modalite === 'presentiel').length
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx("div", { className: "bg-white border border-slate-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy-100 p-3 mr-4", children: _jsx(Calendar, { className: "h-6 w-6 text-slate-700" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-slate-900", children: stats.total }), _jsx("div", { className: "text-sm text-slate-600", children: "Total \u00E9v\u00E9nements" })] })] }) }), _jsx("div", { className: "bg-white border border-slate-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy-100 p-3 mr-4", children: _jsx(Clock, { className: "h-6 w-6 text-slate-700" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-slate-900", children: stats.aVenir }), _jsx("div", { className: "text-sm text-slate-600", children: "\u00C0 venir" })] })] }) }), _jsx("div", { className: "bg-white border border-slate-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy-100 p-3 mr-4", children: _jsx(Users, { className: "h-6 w-6 text-slate-700" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-slate-900", children: stats.reunions }), _jsx("div", { className: "text-sm text-slate-600", children: "R\u00E9unions" })] })] }) }), _jsx("div", { className: "bg-white border border-slate-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy-100 p-3 mr-4", children: _jsx(Presentation, { className: "h-6 w-6 text-slate-700" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-slate-900", children: stats.seminaires }), _jsx("div", { className: "text-sm text-slate-600", children: "S\u00E9minaires" })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-slate-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-4", children: "R\u00E9partition par p\u00E9riode" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-slate-600", children: "Ce mois-ci" }), _jsx("span", { className: "font-medium", children: stats.moisActuel })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-slate-600", children: "Mois prochain" }), _jsx("span", { className: "font-medium", children: stats.moisProchain })] }), _jsxs("div", { className: "flex justify-between items-center pt-2 border-t border-slate-200", children: [_jsx("span", { className: "text-slate-600", children: "Dates limites" }), _jsx("span", { className: "font-medium text-navy-600", children: stats.deadlines })] })] })] }), _jsxs("div", { className: "bg-white border border-slate-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-4", children: "Modalit\u00E9s" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Building, { className: "h-4 w-4 text-slate-500 mr-2" }), _jsx("span", { className: "text-slate-600", children: "Pr\u00E9sentiel" })] }), _jsx("span", { className: "font-medium", children: stats.presentiel })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Video, { className: "h-4 w-4 text-slate-500 mr-2" }), _jsx("span", { className: "text-slate-600", children: "En ligne" })] }), _jsx("span", { className: "font-medium", children: stats.enLigne })] }), _jsxs("div", { className: "flex justify-between items-center pt-2 border-t border-slate-200", children: [_jsx("span", { className: "text-slate-600", children: "Taux en ligne" }), _jsxs("span", { className: "font-medium", children: [stats.total > 0 ? Math.round((stats.enLigne / (stats.enLigne + stats.presentiel)) * 100) : 0, "%"] })] })] })] })] })] }));
};
const PageCalendrier = () => {
    const { addToast } = useToast();
    const { user } = useAuth();
    const [date, setDate] = React.useState(new Date());
    const [filtres, setFiltres] = useState({
        toutes: true,
        reunion: true,
        seminaire: true,
        deadline: true,
        autre: true,
    });
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageNotification, setMessageNotification] = useState("");
    const [activeTab, setActiveTab] = useState('calendrier');
    // Données des événements avec plus d'exemples
    const evenements = [
        // Juillet 2025
        {
            id: 1,
            titre: "Réunion équipe pédagogique",
            date: new Date(2025, 6, 16, 9, 0),
            dateFin: new Date(2025, 6, 16, 11, 0),
            type: "reunion",
            modalite: "presentiel",
            lieu: "Salle des professeurs",
            participants: ["Prof. Diop", "Prof. Seck", "Dr. Ndiaye", "Mme Fall"],
            description: "Préparation de la rentrée scolaire 2025-2026",
        },
        {
            id: 2,
            titre: "Webinaire innovation pédagogique",
            date: new Date(2025, 6, 18, 14, 0),
            dateFin: new Date(2025, 6, 18, 16, 0),
            type: "seminaire",
            modalite: "ligne",
            lien: "https://meet.google.com/abc-defg-hij",
            participants: ["Enseignants", "Directeurs pédagogiques"],
            description: "Nouvelles approches d'enseignement numérique",
        },
        {
            id: 3,
            titre: "Date limite inscription examens",
            date: new Date(2025, 6, 20, 17, 0),
            dateFin: new Date(2025, 6, 20, 17, 0),
            type: "deadline",
            important: true,
            description: "Dernier jour pour s'inscrire aux examens de fin d'année",
        },
        {
            id: 4,
            titre: "Conférence parents d'élèves",
            date: new Date(2025, 6, 22, 18, 0),
            dateFin: new Date(2025, 6, 22, 20, 0),
            type: "reunion",
            modalite: "presentiel",
            lieu: "Amphithéâtre principal",
            participants: ["Parents", "Direction", "Professeurs principaux"],
            description: "Bilan de l'année scolaire et perspectives",
        },
        {
            id: 5,
            titre: "Formation Moodle",
            date: new Date(2025, 6, 25, 10, 0),
            dateFin: new Date(2025, 6, 25, 12, 0),
            type: "seminaire",
            modalite: "ligne",
            lien: "https://zoom.us/j/987654321",
            participants: ["Professeurs", "Assistants pédagogiques"],
            description: "Maîtrise de la plateforme d'apprentissage en ligne",
        },
        // Août 2025
        {
            id: 6,
            titre: "Conseil d'administration",
            date: new Date(2025, 7, 5, 14, 0),
            dateFin: new Date(2025, 7, 5, 17, 0),
            type: "reunion",
            modalite: "presentiel",
            lieu: "Salle du conseil",
            participants: ["Membres du CA", "Direction", "Représentants élèves"],
            description: "Validation du budget et des projets pour la nouvelle année",
        },
        {
            id: 7,
            titre: "Séminaire d'intégration nouveaux enseignants",
            date: new Date(2025, 7, 12, 9, 0),
            dateFin: new Date(2025, 7, 12, 17, 0),
            type: "seminaire",
            modalite: "presentiel",
            lieu: "Centre de formation",
            participants: ["Nouveaux enseignants", "Équipe RH", "Mentors"],
            description: "Accueil et formation des nouveaux membres de l'équipe",
        },
        {
            id: 8,
            titre: "Réunion préparation rentrée",
            date: new Date(2025, 7, 18, 8, 30),
            dateFin: new Date(2025, 7, 18, 12, 0),
            type: "reunion",
            modalite: "ligne",
            lien: "https://teams.microsoft.com/l/meetup-join/123",
            participants: ["Directeurs", "Chefs de département", "Secrétaires"],
            description: "Coordination générale pour la rentrée scolaire",
        },
        {
            id: 9,
            titre: "Date limite commande manuels",
            date: new Date(2025, 7, 25, 23, 59),
            dateFin: new Date(2025, 7, 25, 23, 59),
            type: "deadline",
            important: true,
            description: "Dernière date pour commander les manuels scolaires",
        },
        {
            id: 10,
            titre: "Journée portes ouvertes",
            date: new Date(2025, 7, 30, 9, 0),
            dateFin: new Date(2025, 7, 30, 16, 0),
            type: "autre",
            modalite: "presentiel",
            lieu: "Campus principal",
            participants: ["Futurs élèves", "Familles", "Personnel"],
            description: "Présentation de l'établissement aux futurs élèves et familles",
        }
    ];
    const envoyerNotification = (evenement) => {
        addToast('success', 'Notification envoyée', `Les participants ont été notifiés pour l'événement "${evenement.titre}"`);
        if (evenement.participants) {
            console.log(`Notification envoyée à: ${evenement.participants.join(', ')}`);
            console.log(`Message: ${messageNotification || `Rappel: ${evenement.titre} - ${formatDate(evenement.date, 'long')} à ${formatTime(evenement.date)}`}`);
        }
    };
    const toggleFiltre = (type) => {
        if (type === "toutes") {
            const newState = !filtres.toutes;
            setFiltres({
                toutes: newState,
                reunion: newState,
                seminaire: newState,
                deadline: newState,
                autre: newState,
            });
        }
        else {
            setFiltres((prev) => {
                const newFiltres = Object.assign(Object.assign({}, prev), { [type]: !prev[type], toutes: false });
                if (newFiltres.reunion &&
                    newFiltres.seminaire &&
                    newFiltres.deadline &&
                    newFiltres.autre) {
                    newFiltres.toutes = true;
                }
                return newFiltres;
            });
        }
    };
    const openEventDetails = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };
    const evenementsFiltres = useMemo(() => {
        if (filtres.toutes)
            return evenements;
        return evenements.filter((evenement) => filtres[evenement.type]);
    }, [evenements, filtres]);
    const evenementsPourDateSelectionnee = useMemo(() => {
        if (!date)
            return [];
        return evenementsFiltres.filter((evenement) => isSameDay(evenement.date, date));
    }, [date, evenementsFiltres]);
    const evenementsAVenir = useMemo(() => {
        const aujourdhui = new Date();
        return evenementsFiltres
            .filter((evenement) => isAfter(evenement.date, aujourdhui) ||
            isSameDay(evenement.date, aujourdhui))
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 6);
    }, [evenementsFiltres]);
    const joursAvecEvenements = useMemo(() => {
        return evenementsFiltres.map((ev) => formatDateKey(ev.date));
    }, [evenementsFiltres]);
    const obtenirIconeEvenement = (type) => {
        switch (type) {
            case "reunion":
                return _jsx(Users, { className: "h-5 w-5 text-slate-700" });
            case "seminaire":
                return _jsx(Presentation, { className: "h-5 w-5 text-slate-700" });
            case "deadline":
                return _jsx(Clock, { className: "h-5 w-5 text-slate-700" });
            default:
                return _jsx(FileText, { className: "h-5 w-5 text-slate-700" });
        }
    };
    const obtenirLibelleType = (type) => {
        switch (type) {
            case "reunion":
                return "Réunion";
            case "seminaire":
                return "Séminaire";
            case "deadline":
                return "Date limite";
            default:
                return "Autre";
        }
    };
    // Un professeur seul = estProfesseur && !estChef && !estSecretaire
    const isProfSeul = (user === null || user === void 0 ? void 0 : user.estProfesseur) && !(user === null || user === void 0 ? void 0 : user.estChef) && !(user === null || user === void 0 ? void 0 : user.estSecretaire);
    // Encadrant = estEncadrant (quel que soit le cumul)
    const isEncadrant = !!(user === null || user === void 0 ? void 0 : user.estEncadrant);
    // Les deux profils n'ont accès qu'à la vue calendrier
    const isProfSeulOuEncadrant = isProfSeul || isEncadrant;
    const tabs = [
        {
            id: 'calendrier',
            label: 'Calendrier',
            icon: _jsx(Calendar, { className: "h-4 w-4" }),
            count: evenements.length
        },
        // Onglet ajout/stats seulement si pas prof seul ni encadrant
        ...(!isProfSeulOuEncadrant ? [{
                id: 'ajouter',
                label: 'Ajouter un événement',
                icon: _jsx(Plus, { className: "h-4 w-4" })
            }] : []),
        ...(!isProfSeulOuEncadrant ? [{
                id: 'stats',
                label: 'Statistiques',
                icon: _jsx(BarChart3, { className: "h-4 w-4" })
            }] : [])
    ];
    return (_jsx("div", { className: "min-h-screen bg-slate-50 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("div", { className: "bg-white border border-slate-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-slate-100 p-3 mr-4", children: _jsx(Calendar, { className: "h-6 w-6 text-slate-700" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-slate-900", children: "Calendrier des \u00E9v\u00E9nements" }), _jsx("p", { className: "text-sm text-slate-500 mt-1", children: "G\u00E9rez vos r\u00E9unions, s\u00E9minaires et \u00E9ch\u00E9ances" })] })] }) }), _jsxs("div", { className: "bg-white border border-slate-200 mb-6", children: [_jsx("div", { className: "border-b border-slate-200", children: _jsx("div", { className: "flex", children: tabs.map((tab) => (_jsx(TabButton, { isActive: activeTab === tab.id, onClick: () => setActiveTab(tab.id), icon: tab.icon, count: tab.count, children: tab.label }, tab.id))) }) }), _jsx("div", { className: "p-6", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'calendrier' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(FilterDropdown, { filtres: filtres, toggleFiltre: toggleFiltre }), !filtres.toutes && (_jsxs("div", { className: "text-sm text-slate-500", children: ["Filtres actifs: ", Object.entries(filtres)
                                                                    .filter(([type, active]) => active && type !== "toutes")
                                                                    .map(([type]) => obtenirLibelleType(type))
                                                                    .join(", ")] }))] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "bg-white border border-slate-200 p-6", children: [_jsx("h2", { className: "text-xl font-bold text-slate-900 mb-4", children: "Calendrier" }), _jsx(SimpleCalendar, { selectedDate: date, onDateSelect: setDate, eventsOnDays: joursAvecEvenements }), _jsx("div", { className: "mt-4", children: _jsx(SimpleButton, { variant: "secondary", onClick: () => setDate(new Date()), children: "Aujourd'hui" }) })] }), _jsxs("div", { className: "lg:col-span-2 bg-white border border-slate-200 p-6", children: [_jsxs("h2", { className: "text-xl font-bold text-slate-900 mb-4", children: ["\u00C9v\u00E9nements du ", date ? formatDate(date, 'long') : ''] }), _jsxs("p", { className: "text-sm text-slate-500 mb-6", children: [evenementsPourDateSelectionnee.length, " \u00E9v\u00E9nement(s) pr\u00E9vu(s)"] }), _jsx("div", { className: "space-y-4 max-h-96 overflow-y-auto", children: evenementsPourDateSelectionnee.length > 0 ? (evenementsPourDateSelectionnee.map((evenement) => {
                                                                    var _a, _b;
                                                                    return (_jsxs("div", { className: `border border-slate-200 p-4 ${evenement.important ? "border-red-300 bg-red-50" : "bg-white"}`, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx("div", { className: "bg-slate-100 p-2", children: obtenirIconeEvenement(evenement.type) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-lg text-slate-900", children: evenement.titre }), _jsxs("div", { className: "flex mt-2 space-x-2", children: [_jsx(Badge, { variant: "info", children: obtenirLibelleType(evenement.type) }), evenement.modalite && (_jsx(Badge, { variant: "info", children: evenement.modalite === "ligne" ? "En ligne" : "Présentiel" })), evenement.important && (_jsx(Badge, { variant: "error", children: "Important" }))] })] })] }), _jsxs("div", { className: "text-sm text-slate-500 flex items-center", children: [_jsx(Clock, { className: "mr-1 h-4 w-4" }), formatTime(evenement.date), evenement.type !== "deadline" && evenement.type !== "autre" && (_jsxs(_Fragment, { children: [" ", " - ", " ", formatTime(evenement.dateFin)] }))] })] }), evenement.description && (_jsx("div", { className: "mt-3 text-sm text-slate-700", children: evenement.description })), (evenement.type === "reunion" || evenement.type === "seminaire") && (_jsx("div", { className: "mt-3", children: evenement.modalite === "presentiel" && evenement.lieu ? (_jsxs("div", { className: "flex items-center text-sm text-slate-600", children: [_jsx(MapPin, { className: "h-4 w-4 text-slate-400 mr-1" }), "Lieu: ", evenement.lieu] })) : evenement.modalite === "ligne" && evenement.lien ? (_jsxs("div", { className: "flex flex-col text-sm text-slate-600", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Globe, { className: "h-4 w-4 text-slate-400 mr-1" }), "Plateforme: ", ((_b = (_a = evenement.lien) === null || _a === void 0 ? void 0 : _a.split("//")[1]) === null || _b === void 0 ? void 0 : _b.split("/")[0]) || "Plateforme virtuelle"] }), _jsx("a", { href: evenement.lien, target: "_blank", rel: "noreferrer", className: "text-navy hover:underline mt-1", children: "Rejoindre la r\u00E9union" })] })) : null })), evenement.participants && evenement.participants.length > 0 && (_jsx("div", { className: "mt-3 text-sm text-slate-600", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "h-4 w-4 text-slate-400 mr-1" }), "Participants: ", evenement.participants.join(", ")] }) })), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsxs(SimpleButton, { variant: "secondary", size: "sm", onClick: () => openEventDetails(evenement), children: [_jsx(Eye, { className: "h-4 w-4 mr-1" }), "D\u00E9tails"] }), !isProfSeulOuEncadrant && (_jsxs(SimpleButton, { variant: "secondary", size: "sm", children: [_jsx(Edit, { className: "h-4 w-4 mr-1" }), "Modifier"] })), !isProfSeulOuEncadrant && (_jsxs(SimpleButton, { variant: "danger", size: "sm", onClick: () => {
                                                                                            addToast('success', 'Événement annulé', `L'événement "${evenement.titre}" a été annulé.`);
                                                                                        }, children: [_jsx(Trash2, { className: "h-4 w-4 mr-1" }), "Annuler"] }))] })] }, evenement.id));
                                                                })) : (_jsxs("div", { className: "flex flex-col items-center justify-center h-64 text-center", children: [_jsx(Calendar, { className: "h-12 w-12 text-slate-300 mb-4" }), _jsx("p", { className: "text-slate-500 mb-4", children: "Aucun \u00E9v\u00E9nement pr\u00E9vu pour cette date" }), !isProfSeulOuEncadrant && (_jsxs(SimpleButton, { variant: "primary", children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Ajouter un \u00E9v\u00E9nement"] }))] })) })] })] }), _jsxs("div", { className: "bg-white border border-slate-200 p-6", children: [_jsx("h2", { className: "text-xl font-bold text-slate-900 mb-6", children: "\u00C9v\u00E9nements \u00E0 venir" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: evenementsAVenir.map((evenement) => {
                                                            var _a, _b;
                                                            return (_jsxs("div", { className: `border border-slate-200 overflow-hidden ${evenement.important ? "border-red-300" : ""}`, children: [_jsx("div", { className: `h-1 ${evenement.type === "reunion" ? "bg-navy" :
                                                                            evenement.type === "seminaire" ? "bg-navy" :
                                                                                evenement.type === "deadline" ? "bg-red-500" : "bg-slate-500"}` }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-start gap-2 mb-3", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("h3", { className: "text-lg font-semibold text-slate-900 flex items-center gap-2", children: [evenement.titre, evenement.important && (_jsx(AlertCircle, { className: "h-4 w-4 text-red-500" }))] }), _jsx("p", { className: "text-sm text-slate-500", children: formatDate(evenement.date, 'long') })] }), _jsx(Badge, { variant: "info", children: obtenirLibelleType(evenement.type) })] }), _jsxs("div", { className: "flex items-center mb-2", children: [_jsx(Clock, { className: "h-4 w-4 text-slate-400 mr-1" }), _jsxs("span", { className: "text-sm text-slate-500", children: [formatTime(evenement.date), evenement.type !== "deadline" && evenement.type !== "autre" && (_jsxs(_Fragment, { children: [" ", " - ", " ", formatTime(evenement.dateFin)] }))] })] }), (evenement.type === "reunion" || evenement.type === "seminaire") && evenement.modalite && (_jsx("div", { className: "flex items-center mb-2", children: evenement.modalite === "presentiel" ? (_jsxs("div", { className: "flex items-center text-sm text-slate-600", children: [_jsx(MapPin, { className: "h-4 w-4 text-slate-400 mr-1" }), evenement.lieu] })) : (_jsxs("div", { className: "flex items-center text-sm text-slate-600", children: [_jsx(Globe, { className: "h-4 w-4 text-slate-400 mr-1" }), ((_b = (_a = evenement.lien) === null || _a === void 0 ? void 0 : _a.split("//")[1]) === null || _b === void 0 ? void 0 : _b.split("/")[0]) || "Plateforme virtuelle"] })) })), evenement.description && (_jsx("p", { className: "text-sm text-slate-600 mt-2 line-clamp-2", children: evenement.description })), _jsx("div", { className: "mt-4", children: _jsx(SimpleButton, { variant: "ghost", size: "sm", onClick: () => openEventDetails(evenement), children: "Voir d\u00E9tails" }) })] })] }, evenement.id));
                                                        }) })] })] }, "calendrier")), activeTab === 'ajouter' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsxs("div", { className: "max-w-2xl", children: [_jsx("h2", { className: "text-xl font-bold text-slate-900 mb-6", children: "Ajouter un \u00E9v\u00E9nement" }), _jsx("p", { className: "text-sm text-slate-500 mb-6", children: "Remplissez le formulaire pour ajouter un \u00E9v\u00E9nement au calendrier." }), _jsx(FormulaireEvenement, {})] }) }, "ajouter")), activeTab === 'stats' && !isProfSeulOuEncadrant && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-slate-900 mb-6", children: "Statistiques" }), _jsx(StatistiquesAvancees, { evenements: evenements })] }) }, "stats"))] }) })] }), _jsx(Modal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), title: "D\u00E9tails de l'\u00E9v\u00E9nement", children: selectedEvent && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [obtenirIconeEvenement(selectedEvent.type), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold text-slate-900", children: selectedEvent.titre }), _jsx("p", { className: "text-sm text-slate-500", children: formatDate(selectedEvent.date, 'long') })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Badge, { variant: "info", children: obtenirLibelleType(selectedEvent.type) }), selectedEvent.modalite && (_jsx(Badge, { variant: "info", children: selectedEvent.modalite === "ligne" ? "En ligne" : "Présentiel" })), selectedEvent.important && (_jsx(Badge, { variant: "error", children: "Important" }))] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "h-4 w-4 mr-2 text-slate-500" }), _jsxs("span", { children: [formatTime(selectedEvent.date), selectedEvent.type !== "deadline" && selectedEvent.type !== "autre" && (_jsxs(_Fragment, { children: [" ", " - ", " ", formatTime(selectedEvent.dateFin)] }))] })] }), selectedEvent.modalite === "presentiel" && selectedEvent.lieu && (_jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "h-4 w-4 mr-2 text-slate-500" }), _jsxs("span", { children: ["Lieu: ", selectedEvent.lieu] })] })), selectedEvent.modalite === "ligne" && selectedEvent.lien && (_jsxs("div", { className: "flex items-center", children: [_jsx(Globe, { className: "h-4 w-4 mr-2 text-slate-500" }), _jsxs("span", { children: ["Lien: ", " ", _jsx("a", { href: selectedEvent.lien, target: "_blank", rel: "noreferrer", className: "text-navy hover:underline", children: selectedEvent.lien })] })] }))] }), selectedEvent.description && (_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-slate-900 mb-2", children: "Description" }), _jsx("p", { className: "text-slate-700", children: selectedEvent.description })] })), selectedEvent.participants && selectedEvent.participants.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-slate-900 mb-3", children: "Participants" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedEvent.participants.map((participant, index) => (_jsx(Badge, { variant: "info", children: participant }, index))) })] })), _jsx("div", { className: "space-y-4", children: !isProfSeulOuEncadrant && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Message de notification" }), _jsx("input", { type: "text", value: messageNotification, onChange: (e) => setMessageNotification(e.target.value), placeholder: "Message personnalis\u00E9 (optionnel)", className: "w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy" })] }), _jsxs(SimpleButton, { variant: "secondary", onClick: () => envoyerNotification(selectedEvent), children: [_jsx(Bell, { className: "mr-2 h-4 w-4" }), "Envoyer notification aux participants"] })] })) }), _jsxs("div", { className: "flex justify-end gap-3 pt-6 border-t border-slate-200", children: [!isProfSeulOuEncadrant && (_jsxs(SimpleButton, { variant: "secondary", children: [_jsx(Edit, { className: "h-4 w-4 mr-2" }), "Modifier"] })), !isProfSeulOuEncadrant && (_jsxs(SimpleButton, { variant: "danger", onClick: () => {
                                            addToast('success', 'Événement annulé', `L'événement "${selectedEvent.titre}" a été annulé.`);
                                            setIsModalOpen(false);
                                        }, children: [_jsx(Trash2, { className: "h-4 w-4 mr-2" }), "Annuler l'\u00E9v\u00E9nement"] }))] })] })) })] }) }));
};
export default PageCalendrier;
