import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, BookOpen, UserPlus, Phone, Filter, Check, X, BarChart3, FileText, Layers, PlusCircle, Trash2, Clock, Users, CheckCircle, AlertCircle, Info, AlertTriangle, Calendar } from 'lucide-react';
const DEPARTMENTS = [
    "Informatique",
    "Réseaux",
    "Management",
    "Génie Civil",
    "Électronique",
    "Mathématiques",
    "Physique",
    "Chimie"
];
// Données des cours disponibles
const AVAILABLE_COURSES = [
    { id: 1, name: "Programmation Orientée Objet", department: "Informatique", hours: 45, students: 35, active: true, description: "Cours fondamental sur la programmation orientée objet avec Java" },
    { id: 2, name: "Algorithmes Avancés", department: "Informatique", hours: 40, students: 28, active: true, description: "Étude des algorithmes complexes et optimisation" },
    { id: 3, name: "Base de Données", department: "Informatique", hours: 50, students: 32, active: true, description: "Conception et gestion des bases de données relationnelles" },
    { id: 4, name: "Réseaux Informatiques", department: "Réseaux", hours: 48, students: 30, active: true, description: "Architecture et protocoles des réseaux informatiques" },
    { id: 5, name: "Sécurité Informatique", department: "Réseaux", hours: 35, students: 25, active: true, description: "Principes de sécurité et protection des systèmes" },
    { id: 6, name: "Intelligence Artificielle", department: "Informatique", hours: 45, students: 22, active: true, description: "Introduction aux techniques d'intelligence artificielle" },
    { id: 7, name: "Gestion de Projet", department: "Management", hours: 30, students: 38, active: true, description: "Méthodologies de gestion de projet informatique" },
    { id: 8, name: "Développement Web", department: "Informatique", hours: 60, students: 40, active: true, description: "Technologies web modernes et frameworks" },
];
const PROFESSORS_DATA = [
    { id: 1, firstName: "Moussa", lastName: "Diop", email: "moussa.diop@faculty.edu.sn", phone: "77 123 45 67", departments: ["Informatique"], assignedCourses: [1, 8], hireDate: "01/09/2020", active: true },
    { id: 2, firstName: "Fatou", lastName: "Ndiaye", email: "fatou.ndiaye@faculty.edu.sn", phone: "76 234 56 78", departments: ["Informatique", "Réseaux"], assignedCourses: [2, 5], hireDate: "15/10/2019", active: true },
    { id: 3, firstName: "Omar", lastName: "Sall", email: "omar.sall@faculty.edu.sn", phone: "78 345 67 89", departments: ["Informatique"], assignedCourses: [3], hireDate: "01/09/2021", active: true },
    { id: 4, firstName: "Aminata", lastName: "Diallo", email: "aminata.diallo@faculty.edu.sn", phone: "70 456 78 90", departments: ["Réseaux"], assignedCourses: [4], hireDate: "01/09/2022", active: true },
    { id: 5, firstName: "Ibrahim", lastName: "Sow", email: "ibrahim.sow@faculty.edu.sn", phone: "77 567 89 01", departments: ["Réseaux"], assignedCourses: [], hireDate: "15/01/2023", active: false },
    { id: 6, firstName: "Cheikh", lastName: "Diop", email: "cheikh.diop@faculty.edu.sn", phone: "76 678 90 12", departments: ["Informatique"], assignedCourses: [6], hireDate: "01/09/2021", active: true },
    { id: 7, firstName: "Aïda", lastName: "Fall", email: "aida.fall@faculty.edu.sn", phone: "70 789 01 23", departments: ["Management"], assignedCourses: [7], hireDate: "01/09/2020", active: true },
    { id: 8, firstName: "Khadija", lastName: "Ba", email: "khadija.ba@faculty.edu.sn", phone: "76 890 12 34", departments: [], assignedCourses: [], hireDate: "01/03/2024", active: true },
];
// Composants UI réutilisables - même style que StudentsChef
const SimpleButton = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon }) => {
    const styles = {
        primary: `bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    };
    return (_jsxs("button", { onClick: disabled ? undefined : onClick, disabled: disabled, type: type, className: `px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center rounded-sm ${styles[variant]}`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
const TabButton = ({ children, isActive, onClick, icon }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
const Badge = ({ children, variant = 'info', className = '' }) => {
    const styles = {
        active: "bg-green-50 text-green-700 border border-green-200",
        inactive: "bg-red-50 text-red-600 border border-red-200",
        info: "bg-gray-50 text-gray-700 border border-gray-200",
        warning: "bg-orange-50 text-orange-700 border border-orange-200",
        primary: "bg-blue-50 text-blue-700 border border-blue-200"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded-sm ${styles[variant]} ${className}`, children: children }));
};
const SimpleToggle = ({ isActive, onToggle, activeLabel = 'Actif', inactiveLabel = 'Inactif', disabled = false }) => {
    return (_jsx("button", { onClick: disabled ? undefined : onToggle, disabled: disabled, className: `
        w-12 h-6 rounded-full border-2 transition-colors duration-200 flex items-center
        ${isActive ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
      `, children: _jsx("div", { className: `
        w-4 h-4 bg-white rounded-full transition-transform duration-200 flex items-center justify-center
        ${isActive ? 'translate-x-6' : 'translate-x-0'}
      `, children: isActive ?
                _jsx(Check, { className: "h-2 w-2 text-green-500" }) :
                _jsx(X, { className: "h-2 w-2 text-red-400" }) }) }));
};
// Hook pour gérer les toasts
const useToast = () => {
    const [toasts, setToasts] = useState([]);
    const addToast = (type, title, message) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message }]);
    };
    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };
    return {
        toasts,
        addToast,
        removeToast,
        showSuccess: (title, message) => addToast('success', title, message),
        showError: (title, message) => addToast('error', title, message),
        showWarning: (title, message) => addToast('warning', title, message),
        showInfo: (title, message) => addToast('info', title, message),
    };
};
// Composant Toast
const ToastComponent = ({ toast, onRemove }) => {
    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info
    };
    const styles = {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-orange-50 border-orange-200 text-orange-800",
        info: "bg-blue-50 border-blue-200 text-blue-800"
    };
    const IconComponent = icons[toast.type];
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);
    return (_jsxs(motion.div, { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -50 }, className: `flex items-start p-4 mb-2 border rounded-md shadow-md ${styles[toast.type]}`, children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(IconComponent, { className: "w-5 h-5" }) }), _jsxs("div", { className: "ml-3 w-full", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("p", { className: "text-sm font-medium", children: toast.title }), _jsx("button", { onClick: () => onRemove(toast.id), className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-4 h-4" }) })] }), _jsx("p", { className: "mt-1 text-sm", children: toast.message })] })] }));
};
// Container des toasts
const ToastContainer = ({ toasts, onRemove }) => {
    return (_jsx("div", { className: "fixed top-4 right-4 z-50 space-y-2", children: _jsx(AnimatePresence, { children: toasts.map(toast => (_jsx(ToastComponent, { toast: toast, onRemove: onRemove }, toast.id))) }) }));
};
// Modal de confirmation
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmer", type = "info" }) => {
    if (!isOpen)
        return null;
    const typeStyles = {
        danger: "bg-red-600 hover:bg-red-700 text-white",
        warning: "bg-orange-600 hover:bg-orange-700 text-white",
        info: "bg-blue-600 text-white hover:bg-blue-700"
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-md w-full mx-4 rounded-sm", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: title }), _jsx("p", { className: "text-gray-600 mb-6", children: message }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx(SimpleButton, { onClick: onClose, variant: "secondary", children: "Annuler" }), _jsx("button", { onClick: () => {
                                onConfirm();
                                onClose();
                            }, className: `px-4 py-2 text-sm font-medium rounded-sm transition-colors duration-200 ${typeStyles[type]}`, children: confirmText })] })] }) }));
};
// Modal d'attribution de cours
const AssignCoursesModal = ({ professor, isOpen, onClose, onAssignCourses, currentDepartment }) => {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    React.useEffect(() => {
        if (professor) {
            setSelectedCourses(professor.assignedCourses);
        }
    }, [professor]);
    if (!isOpen || !professor)
        return null;
    const availableCourses = AVAILABLE_COURSES.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isFromCurrentDepartment = course.department === currentDepartment;
        return matchesSearch && isFromCurrentDepartment;
    });
    const assignedCourses = AVAILABLE_COURSES.filter(course => professor.assignedCourses.includes(course.id) && course.department === currentDepartment);
    const handleCourseToggle = (courseId) => {
        setSelectedCourses(prev => prev.includes(courseId)
            ? prev.filter(id => id !== courseId)
            : [...prev, courseId]);
    };
    const handleSave = () => {
        onAssignCourses(professor.id, selectedCourses);
        onClose();
    };
    const totalHours = selectedCourses.reduce((total, courseId) => {
        const course = AVAILABLE_COURSES.find(c => c.id === courseId);
        return total + ((course === null || course === void 0 ? void 0 : course.hours) || 0);
    }, 0);
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-sm", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold text-gray-900", children: ["Attribuer des cours \u00E0 ", professor.firstName, " ", professor.lastName] }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["D\u00E9partement: ", currentDepartment, " \u2022 Professeur dans: ", professor.departments.join(', ')] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center", children: [_jsx(BookOpen, { className: "h-5 w-5 mr-2 text-blue-600" }), "Cours actuellement assign\u00E9s (", assignedCourses.length, ")"] }), assignedCourses.length === 0 ? (_jsx("div", { className: "bg-gray-50 border border-gray-200 p-4 text-center rounded-sm", children: _jsx("p", { className: "text-gray-500", children: "Aucun cours assign\u00E9" }) })) : (_jsx("div", { className: "space-y-3", children: assignedCourses.map(course => (_jsx("div", { className: "bg-blue-50 border border-blue-200 p-4 rounded-sm", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-medium text-blue-900", children: course.name }), _jsx("p", { className: "text-sm text-blue-700", children: course.department }), _jsxs("div", { className: "flex items-center gap-4 mt-2", children: [_jsxs("span", { className: "flex items-center text-xs text-blue-700", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), course.hours, "h"] }), _jsxs("span", { className: "flex items-center text-xs text-blue-700", children: [_jsx(Users, { className: "h-3 w-3 mr-1" }), course.students, " \u00E9tudiants"] })] })] }), _jsx("button", { onClick: () => handleCourseToggle(course.id), className: "p-1 text-red-600 hover:bg-red-50 rounded-sm", title: "Retirer le cours", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) }, course.id))) }))] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900 mb-4 flex items-center", children: [_jsx(PlusCircle, { className: "h-5 w-5 mr-2 text-blue-600" }), "Cours disponibles"] }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsx("input", { type: "text", placeholder: "Rechercher un cours...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm rounded-sm" })] }) }), _jsx("div", { className: "space-y-3 max-h-64 overflow-y-auto", children: availableCourses.length === 0 ? (_jsx("div", { className: "bg-gray-50 border border-gray-200 p-4 text-center rounded-sm", children: _jsx("p", { className: "text-gray-500", children: "Aucun cours disponible" }) })) : (availableCourses.map(course => (_jsx("div", { className: `border p-4 cursor-pointer transition-colors rounded-sm ${selectedCourses.includes(course.id)
                                            ? 'bg-blue-50 border-blue-300'
                                            : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`, onClick: () => handleCourseToggle(course.id), children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-medium text-gray-900", children: course.name }), _jsx("p", { className: "text-sm text-gray-500", children: course.department }), course.description && (_jsx("p", { className: "text-xs text-gray-600 mt-1", children: course.description })), _jsxs("div", { className: "flex items-center gap-4 mt-2", children: [_jsxs("span", { className: "flex items-center text-xs text-gray-600", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), course.hours, "h"] }), _jsxs("span", { className: "flex items-center text-xs text-gray-600", children: [_jsx(Users, { className: "h-3 w-3 mr-1" }), course.students, " \u00E9tudiants"] })] })] }), _jsx("div", { className: "flex items-center", children: selectedCourses.includes(course.id) ? (_jsx(Check, { className: "h-5 w-5 text-blue-600" })) : (_jsx(PlusCircle, { className: "h-5 w-5 text-gray-400" })) })] }) }, course.id)))) })] })] }), _jsx("div", { className: "mt-6 pt-6 border-t border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium", children: selectedCourses.length }), " cours s\u00E9lectionn\u00E9s \u2022", _jsxs("span", { className: "font-medium ml-1", children: [totalHours, "h"] }), " total"] }), _jsxs("div", { className: "flex space-x-3", children: [_jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Annuler" }), _jsx(SimpleButton, { variant: "primary", onClick: handleSave, children: "Enregistrer les attributions" })] })] }) })] }) }));
};
// Onglet Liste des professeurs
const ProfessorListTab = ({ professors, onToggleActive, onEditProfessor, onAssignCourses, currentUserDepartment }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const filteredProfessors = professors.filter(professor => {
        const matchesSearch = professor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            professor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            professor.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = activeFilter === 'all' ||
            (activeFilter === 'active' && professor.active) ||
            (activeFilter === 'inactive' && !professor.active);
        const matchesDepartment = departmentFilter === 'all' ||
            professor.departments.some(dept => dept === departmentFilter);
        return matchesSearch && matchesStatus && matchesDepartment;
    });
    return (_jsxs("div", { children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6 rounded-sm", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Filtres et recherche" }), _jsx(SimpleButton, { onClick: () => setShowFilters(!showFilters), variant: "ghost", icon: _jsx(Filter, { className: "h-4 w-4" }), children: showFilters ? 'Masquer' : 'Filtres' })] }), _jsxs("div", { className: "relative mb-4", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Rechercher un professeur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm" })] }), _jsx(AnimatePresence, { children: showFilters && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.3 }, className: "overflow-hidden", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\u00C9tat" }), _jsxs("select", { value: activeFilter, onChange: (e) => setActiveFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", children: [_jsx("option", { value: "all", children: "Tous les \u00E9tats" }), _jsx("option", { value: "active", children: "Actifs" }), _jsx("option", { value: "inactive", children: "Bloqu\u00E9s" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "D\u00E9partement" }), _jsxs("select", { value: departmentFilter, onChange: (e) => setDepartmentFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", children: [_jsx("option", { value: "all", children: "Tous les d\u00E9partements" }), DEPARTMENTS.map(dept => (_jsx("option", { value: dept, children: dept }, dept)))] })] })] }) })) })] }), _jsx("div", { className: "mb-4", children: _jsxs("p", { className: "text-sm text-gray-600", children: [filteredProfessors.length, " professeur", filteredProfessors.length !== 1 ? 's' : '', " trouv\u00E9", filteredProfessors.length !== 1 ? 's' : ''] }) }), filteredProfessors.length === 0 ? (_jsxs("div", { className: "bg-white border border-gray-200 p-12 text-center rounded-sm", children: [_jsx(User, { className: "h-16 w-16 mx-auto text-gray-300 mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-700 mb-2", children: "Aucun professeur trouv\u00E9" }), _jsx("p", { className: "text-gray-500", children: "Modifiez vos crit\u00E8res de recherche" })] })) : (_jsx("div", { className: "bg-white border border-gray-200 rounded-sm overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Professeur" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "D\u00E9partements" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Cours" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Contact" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date d'embauche" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tat" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: filteredProfessors.map((professor, index) => (_jsxs(motion.tr, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "hover:bg-gray-50 transition-colors duration-150", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3", children: _jsxs("span", { className: "text-gray-600 font-medium", children: [professor.firstName.charAt(0), professor.lastName.charAt(0)] }) }), _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-gray-900", children: [professor.lastName, " ", professor.firstName] }), _jsx("div", { className: "text-sm text-gray-500", children: professor.email })] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "flex flex-wrap gap-1 max-w-32", children: professor.departments.length > 0 ? (_jsxs(_Fragment, { children: [professor.departments.slice(0, 2).map((dept, index) => (_jsx(Badge, { variant: "primary", children: dept }, index))), professor.departments.length > 2 && (_jsxs(Badge, { variant: "info", children: ["+", professor.departments.length - 2] }))] })) : (_jsx("span", { className: "text-sm text-gray-500", children: "-" })) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(BookOpen, { className: "h-4 w-4 text-blue-600 mr-1" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: professor.assignedCourses.length }), professor.assignedCourses.length > 0 && (_jsxs("span", { className: "ml-2 text-xs text-gray-500 truncate max-w-32", children: [AVAILABLE_COURSES
                                                                .filter(course => professor.assignedCourses.includes(course.id))
                                                                .slice(0, 1)
                                                                .map(course => course.name), professor.assignedCourses.length > 1 && '...'] }))] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "text-sm text-gray-900 flex items-center", children: [_jsx(Phone, { className: "h-4 w-4 text-blue-600 mr-1" }), professor.phone] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 text-blue-600 mr-1" }), _jsx("span", { className: "text-sm text-gray-900", children: professor.hireDate })] }) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsx(SimpleToggle, { isActive: professor.active, onToggle: () => onToggleActive(professor.id), activeLabel: "Actif", inactiveLabel: "Bloqu\u00E9" }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "flex justify-center space-x-2", children: _jsx("button", { onClick: () => onAssignCourses(professor), className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 hover:border-blue-300 transition-colors duration-200 rounded-sm", title: "Attribuer des cours", children: _jsx(Layers, { className: "h-4 w-4" }) }) }) })] }, professor.id))) })] }) }) }))] }));
};
// Onglet Statistiques
const StatisticsTab = ({ professors }) => {
    const activeProfessors = professors.filter(p => p.active);
    const totalAssignedCourses = professors.reduce((total, prof) => total + prof.assignedCourses.length, 0);
    const averageCoursesPerProfessor = professors.length > 0 ? (totalAssignedCourses / professors.length).toFixed(1) : '0';
    const departmentStats = DEPARTMENTS.map(dept => {
        const deptProfs = professors.filter(p => p.departments.includes(dept));
        return {
            name: dept,
            count: deptProfs.length,
            active: deptProfs.filter(p => p.active).length
        };
    }).filter(stat => stat.count > 0);
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                    { title: "Total Professeurs", value: professors.length, icon: User, color: "bg-blue-100 text-blue-600" },
                    { title: "Professeurs Actifs", value: activeProfessors.length, icon: Check, color: "bg-green-100 text-green-600" },
                    { title: "Cours Assignés", value: totalAssignedCourses, icon: BookOpen, color: "bg-purple-100 text-purple-600" },
                    { title: "Moyenne/Cours", value: averageCoursesPerProfessor, icon: BarChart3, color: "bg-orange-100 text-orange-600" }
                ].map((stat, index) => (_jsx("div", { className: "bg-white border border-gray-200 p-6 rounded-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${stat.color} p-3 mr-4 rounded-sm`, children: _jsx(stat.icon, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: stat.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.value })] })] }) }, stat.title))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6 rounded-sm", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par d\u00E9partement" }), _jsx("div", { className: "space-y-3", children: departmentStats.map(dept => {
                                    const percentage = Math.round((dept.count / professors.length) * 100);
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: dept.name }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3 rounded-full", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: dept.count })] })] }, dept.name));
                                }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6 rounded-sm", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Cours assign\u00E9s par d\u00E9partement" }), _jsx("div", { className: "space-y-4", children: departmentStats.slice(0, 3).map(dept => {
                                    const deptCourses = AVAILABLE_COURSES.filter(course => course.department === dept.name);
                                    const assignedCourses = professors
                                        .filter(prof => prof.departments.includes(dept.name))
                                        .flatMap(prof => prof.assignedCourses);
                                    const uniqueAssignedCourses = assignedCourses.filter((course, index, self) => self.indexOf(course) === index);
                                    return (_jsxs("div", { className: "border border-gray-200 p-4 rounded-sm", children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h4", { className: "font-medium text-gray-900", children: dept.name }), _jsxs(Badge, { variant: "primary", children: [uniqueAssignedCourses.length, " / ", deptCourses.length, " cours assign\u00E9s"] })] }), _jsx("div", { className: "w-full bg-gray-200 h-2 rounded-full", children: _jsx("div", { className: "bg-green-500 h-2 rounded-full", style: { width: `${deptCourses.length > 0 ? (uniqueAssignedCourses.length / deptCourses.length) * 100 : 0}%` } }) })] }, dept.name));
                                }) })] })] })] }));
};
// Onglet pour ajouter des professeurs existants au département
const AddToDepartmentTab = ({ currentUserDepartment, availableProfessors, onProfessorToggle, selectedProfessors, onSave }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const filteredProfessors = availableProfessors.filter(professor => {
        const matchesSearch = professor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            professor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            professor.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "max-w-4xl", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6 rounded-sm", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "bg-blue-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full", children: _jsx(UserPlus, { className: "h-8 w-8 text-blue-600" }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Ajouter des professeurs \u00E0 votre d\u00E9partement" }), _jsxs("p", { className: "text-gray-600 max-w-2xl mx-auto", children: ["Vous \u00EAtes connect\u00E9 en tant que chef du d\u00E9partement ", _jsx("strong", { children: currentUserDepartment }), ". S\u00E9lectionnez les professeurs que vous souhaitez ajouter \u00E0 votre \u00E9quipe. Les professeurs peuvent appartenir \u00E0 plusieurs d\u00E9partements."] })] }), currentUserDepartment && (_jsxs("div", { children: [_jsx("div", { className: "bg-gray-50 border border-gray-200 p-4 mb-6 rounded-sm", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" }), _jsx("input", { type: "text", placeholder: "Rechercher un professeur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm rounded-sm" })] }), _jsxs("div", { className: "text-sm text-gray-600 bg-gray-100 px-3 py-2 border rounded-sm", children: ["D\u00E9partement actuel : ", _jsx("strong", { children: currentUserDepartment })] })] }) }), _jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: filteredProfessors.length === 0 ? (_jsxs("div", { className: "bg-gray-50 border border-gray-200 p-8 text-center rounded-sm", children: [_jsx(User, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-gray-600 mb-2", children: "Aucun professeur disponible" }), _jsx("p", { className: "text-gray-500", children: "Tous les professeurs sont d\u00E9j\u00E0 dans votre d\u00E9partement ou ne correspondent pas aux crit\u00E8res de recherche." })] })) : (filteredProfessors.map(professor => (_jsx("div", { className: `border p-4 cursor-pointer transition-colors rounded-sm ${selectedProfessors.includes(professor.id)
                                    ? 'bg-blue-50 border-blue-300'
                                    : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`, onClick: () => onProfessorToggle(professor.id), children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center mb-2", children: [_jsx("div", { className: "flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3", children: _jsxs("span", { className: "text-gray-600 font-medium text-sm", children: [professor.firstName.charAt(0), professor.lastName.charAt(0)] }) }), _jsxs("div", { children: [_jsxs("h4", { className: "font-medium text-gray-900", children: [professor.lastName, " ", professor.firstName] }), _jsx("p", { className: "text-sm text-gray-500", children: professor.email })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: professor.active ? 'active' : 'inactive', children: professor.active ? 'Actif' : 'Bloqué' }), professor.departments.map((dept, index) => (_jsx(Badge, { variant: "primary", children: dept }, index))), _jsxs(Badge, { variant: "info", children: [_jsx(BookOpen, { className: "inline h-3 w-3 mr-1" }), professor.assignedCourses.length, " cours"] })] })] }), _jsx("div", { className: "flex items-center", children: selectedProfessors.includes(professor.id) ? (_jsx(Check, { className: "h-5 w-5 text-blue-600" })) : (_jsx(PlusCircle, { className: "h-5 w-5 text-gray-400" })) })] }) }, professor.id)))) }), selectedProfessors.length > 0 && (_jsx("div", { className: "mt-6 pt-6 border-t border-gray-200", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("span", { className: "font-medium", children: selectedProfessors.length }), " professeur(s) s\u00E9lectionn\u00E9(s)"] }), _jsxs(SimpleButton, { variant: "primary", onClick: onSave, children: ["Ajouter au d\u00E9partement ", currentUserDepartment] })] }) }))] }))] }) }));
};
const ProfessorsChef = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [professorsState, setProfessorsState] = useState(PROFESSORS_DATA);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [selectedProfessors, setSelectedProfessors] = useState([]);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { }, type: 'info' });
    // Hook pour les toasts
    const { toasts, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();
    // Mock user data
    const currentUserDepartment = 'Informatique';
    const toggleProfessorActive = (id) => {
        showWarning('Action non autorisée', 'En tant que chef de département, vous ne pouvez pas bloquer ou débloquer les professeurs.');
    };
    const startEditProfessor = (prof) => {
        showWarning('Action non autorisée', 'En tant que chef de département, vous ne pouvez pas modifier les informations des professeurs.');
    };
    const openAssignModal = (prof) => {
        if (!currentUserDepartment) {
            showError('Erreur de configuration', 'Département non identifié pour l\'utilisateur connecté.');
            return;
        }
        if (!prof.departments.includes(currentUserDepartment)) {
            setConfirmModal({
                isOpen: true,
                title: 'Ajouter au département',
                message: `Le professeur ${prof.firstName} ${prof.lastName} n'est pas encore dans votre département (${currentUserDepartment}). Voulez-vous l'ajouter automatiquement à votre département pour pouvoir lui attribuer des cours ?`,
                onConfirm: () => {
                    setProfessorsState(prev => prev.map(p => p.id === prof.id
                        ? Object.assign(Object.assign({}, p), { departments: [...p.departments, currentUserDepartment] }) : p));
                    showSuccess('Professeur ajouté', `${prof.firstName} ${prof.lastName} a été ajouté au département ${currentUserDepartment}`);
                    setSelectedProfessor(prof);
                    setAssignModalOpen(true);
                },
                type: 'info'
            });
            return;
        }
        setSelectedProfessor(prof);
        setAssignModalOpen(true);
    };
    const closeAssignModal = () => {
        setSelectedProfessor(null);
        setAssignModalOpen(false);
    };
    const handleProfessorToggle = (professorId) => {
        setSelectedProfessors(prev => prev.includes(professorId)
            ? prev.filter(id => id !== professorId)
            : [...prev, professorId]);
    };
    const handleSaveToDepartment = () => {
        if (selectedProfessors.length === 0)
            return;
        setProfessorsState(prev => prev.map(prof => selectedProfessors.includes(prof.id)
            ? Object.assign(Object.assign({}, prof), { departments: [...prof.departments, currentUserDepartment] }) : prof));
        showSuccess('Professeurs ajoutés', `${selectedProfessors.length} professeur(s) ont été ajoutés avec succès au département ${currentUserDepartment}`);
        setSelectedProfessors([]);
    };
    const handleAssignCourses = (professorId, courseIds) => {
        setProfessorsState(prev => prev.map(prof => prof.id === professorId
            ? Object.assign(Object.assign({}, prof), { assignedCourses: courseIds }) : prof));
        const professor = professorsState.find(p => p.id === professorId);
        showSuccess('Cours attribués', `Les cours ont été attribués avec succès à ${professor === null || professor === void 0 ? void 0 : professor.firstName} ${professor === null || professor === void 0 ? void 0 : professor.lastName}`);
    };
    const availableProfessors = currentUserDepartment
        ? PROFESSORS_DATA.filter(prof => !prof.departments.includes(currentUserDepartment))
        : [];
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6 rounded-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-blue-100 rounded-full p-3 mr-4", children: _jsx(User, { className: "h-7 w-7 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Gestion des Professeurs" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Consultez les professeurs de votre d\u00E9partement et attribuez-leur des cours" })] })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6 rounded-sm", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("div", { className: "flex space-x-8 px-6", children: [_jsx(TabButton, { isActive: activeTab === 'list', onClick: () => setActiveTab('list'), icon: _jsx(FileText, { className: "h-4 w-4" }), children: "Liste des professeurs" }), _jsx(TabButton, { isActive: activeTab === 'add', onClick: () => setActiveTab('add'), icon: _jsx(UserPlus, { className: "h-4 w-4" }), children: "Ajouter \u00E0 mon d\u00E9partement" }), _jsx(TabButton, { isActive: activeTab === 'stats', onClick: () => setActiveTab('stats'), icon: _jsx(BarChart3, { className: "h-4 w-4" }), children: "Statistiques" })] }) }), _jsx("div", { className: "p-6", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'list' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(ProfessorListTab, { professors: professorsState, onToggleActive: toggleProfessorActive, onEditProfessor: startEditProfessor, onAssignCourses: openAssignModal, currentUserDepartment: currentUserDepartment }) }, "list")), activeTab === 'add' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(AddToDepartmentTab, { currentUserDepartment: currentUserDepartment, availableProfessors: availableProfessors, onProfessorToggle: handleProfessorToggle, selectedProfessors: selectedProfessors, onSave: handleSaveToDepartment }) }, "add")), activeTab === 'stats' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(StatisticsTab, { professors: professorsState }) }, "stats"))] }) })] }), _jsx(AssignCoursesModal, { professor: selectedProfessor, isOpen: assignModalOpen, onClose: closeAssignModal, onAssignCourses: handleAssignCourses, currentDepartment: currentUserDepartment }), _jsx(ConfirmationModal, { isOpen: confirmModal.isOpen, onClose: () => setConfirmModal(prev => (Object.assign(Object.assign({}, prev), { isOpen: false }))), onConfirm: confirmModal.onConfirm, title: confirmModal.title, message: confirmModal.message, type: confirmModal.type }), _jsx(ToastContainer, { toasts: toasts, onRemove: removeToast })] }) }));
};
export default ProfessorsChef;
