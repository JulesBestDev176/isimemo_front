import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, User, Clock, Calendar, Edit, Plus, Filter, Check, X, Eye, BarChart3, FileText, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
// Liste des départements disponibles
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
// Conteneur de Toasts
const ToastContainer = ({ toasts, onRemove }) => {
    return (_jsx("div", { className: "fixed top-4 right-4 z-50 space-y-2", children: _jsx(AnimatePresence, { children: toasts.map(toast => (_jsx(ToastComponent, { toast: toast, onRemove: onRemove }, toast.id))) }) }));
};
// Hook personnalisé pour les toasts
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
const COURSES_DATA = [
    {
        id: 1,
        name: "Programmation Orientée Objet",
        department: "Informatique",
        professor: "Dr. Moussa Diop",
        students: 35,
        hours: 45,
        startDate: "15/09/2025",
        active: true,
        description: "Cours fondamental sur la programmation orientée objet avec Java",
        lastUpdated: "2025-01-15"
    },
    {
        id: 2,
        name: "Algorithmes Avancés",
        department: "Informatique",
        professor: "Dr. Fatou Ndiaye",
        students: 28,
        hours: 40,
        startDate: "18/09/2025",
        active: true,
        description: "Étude des algorithmes complexes et optimisation",
        lastUpdated: "2025-01-10"
    },
    {
        id: 3,
        name: "Base de Données",
        department: "Informatique",
        professor: "Dr. Omar Sall",
        students: 32,
        hours: 50,
        startDate: "20/09/2025",
        active: true,
        description: "Conception et gestion des bases de données relationnelles",
        lastUpdated: "2025-01-12"
    },
    {
        id: 4,
        name: "Réseaux Informatiques",
        department: "Réseaux",
        professor: "Dr. Aminata Diallo",
        students: 30,
        hours: 48,
        startDate: "22/09/2025",
        active: true,
        description: "Architecture et protocoles des réseaux informatiques",
        lastUpdated: "2025-01-08"
    },
    {
        id: 5,
        name: "Sécurité Informatique",
        department: "Réseaux",
        professor: "Dr. Ibrahim Sow",
        students: 25,
        hours: 35,
        startDate: "25/09/2025",
        active: false,
        description: "Principes de sécurité et protection des systèmes",
        lastUpdated: "2025-01-05"
    },
    {
        id: 6,
        name: "Intelligence Artificielle",
        department: "Informatique",
        professor: "Dr. Cheikh Diop",
        students: 22,
        hours: 45,
        startDate: "01/10/2025",
        active: true,
        description: "Introduction aux techniques d'intelligence artificielle",
        lastUpdated: "2025-01-14"
    },
    {
        id: 7,
        name: "Gestion de Projet",
        department: "Management",
        professor: "Dr. Aïda Fall",
        students: 38,
        hours: 30,
        startDate: "05/10/2025",
        active: true,
        description: "Méthodologies de gestion de projet informatique",
        lastUpdated: "2025-01-11"
    },
    {
        id: 8,
        name: "Développement Web",
        department: "Informatique",
        professor: "Dr. Moussa Diop",
        students: 40,
        hours: 60,
        startDate: "10/10/2025",
        active: true,
        description: "Technologies web modernes et frameworks",
        lastUpdated: "2025-01-13"
    },
];
// Composants UI réutilisables
const SimpleButton = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon }) => {
    const styles = {
        primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    };
    return (_jsxs("button", { onClick: onClick, disabled: disabled, type: type, className: `px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${styles[variant]}`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
const TabButton = ({ children, isActive, onClick, icon }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-navy text-navy'
            : 'border-transparent text-gray-500 hover:text-gray-700'}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
// Badge avec couleurs subtiles
const Badge = ({ children, variant = 'info', className }) => {
    const styles = {
        active: "bg-green-50 text-green-700 border border-green-200",
        inactive: "bg-red-50 text-red-600 border border-red-200",
        info: "bg-gray-50 text-gray-700 border border-gray-200",
        warning: "bg-orange-50 text-orange-700 border border-orange-200",
        primary: "bg-navy bg-opacity-10 text-navy border border-navy border-opacity-20"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className || ''}`, children: children }));
};
// Toggle switch pour activer/désactiver un cours
const SimpleToggle = ({ active, onChange, disabled = false }) => {
    return (_jsx("button", { onClick: disabled ? undefined : onChange, disabled: disabled, className: `
        w-12 h-6 rounded-full border-2 transition-colors duration-200 flex items-center
        ${active ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
      `, children: _jsx("div", { className: `
        w-4 h-4 bg-white rounded-full transition-transform duration-200 flex items-center justify-center
        ${active ? 'translate-x-6' : 'translate-x-0'}
      `, children: active ?
                _jsx(Check, { className: "h-2 w-2 text-green-500" }) :
                _jsx(X, { className: "h-2 w-2 text-red-400" }) }) }));
};
// Modal pour afficher les détails d'un cours
const CourseDetailsModal = ({ courseItem, isOpen, onClose }) => {
    if (!isOpen || !courseItem)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: courseItem.name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: courseItem.active ? 'active' : 'inactive', children: courseItem.active ? 'Actif' : 'Inactif' }), _jsx(Badge, { variant: "primary", children: courseItem.department })] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Informations g\u00E9n\u00E9rales" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "D\u00E9partement" }), _jsx("p", { className: "text-gray-900", children: courseItem.department })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Professeur" }), _jsx("p", { className: "text-gray-900", children: courseItem.professor })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Date de d\u00E9but" }), _jsx("p", { className: "text-gray-900", children: courseItem.startDate })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Derni\u00E8re mise \u00E0 jour" }), _jsx("p", { className: "text-gray-900", children: courseItem.lastUpdated })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Statistiques" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-green-50 border border-green-200 p-4 text-center", children: [_jsxs("div", { className: "flex items-center justify-center mb-2", children: [_jsx(User, { className: "h-6 w-6 text-green-600 mr-2" }), _jsx("span", { className: "text-3xl font-bold text-gray-900", children: courseItem.students })] }), _jsx("p", { className: "text-sm text-green-700 font-medium", children: "\u00C9tudiants inscrits" })] }), _jsxs("div", { className: "bg-navy-50 border border-navy-200 p-4 text-center", children: [_jsxs("div", { className: "flex items-center justify-center mb-2", children: [_jsx(Clock, { className: "h-6 w-6 text-navy-600 mr-2" }), _jsx("span", { className: "text-3xl font-bold text-gray-900", children: courseItem.hours })] }), _jsx("p", { className: "text-sm text-navy-700 font-medium", children: "Heures de cours" })] })] })] })] }), courseItem.description && (_jsxs("div", { className: "mt-6 pt-6 border-t border-gray-200", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Description" }), _jsx("p", { className: "text-gray-700", children: courseItem.description })] })), _jsx("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: _jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Fermer" }) })] }) }));
};
// Onglet Liste des cours
const CourseListTab = ({ courses, onToggleActive, onViewDetails, onEditCourse }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    // Filtrer les données
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.professor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = activeFilter === 'all' ||
            (activeFilter === 'active' && course.active) ||
            (activeFilter === 'inactive' && !course.active);
        const matchesDepartment = departmentFilter === 'all' ||
            course.department === departmentFilter;
        return matchesSearch && matchesStatus && matchesDepartment;
    });
    return (_jsxs("div", { children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Filtres et recherche" }), _jsx(SimpleButton, { variant: "ghost", onClick: () => setShowFilters(!showFilters), icon: _jsx(Filter, { className: "h-5 w-5" }), children: showFilters ? 'Masquer' : 'Filtres' })] }), _jsxs("div", { className: "relative mb-4", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Rechercher un cours ou professeur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsx(AnimatePresence, { children: showFilters && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "\u00C9tat" }), _jsxs("select", { value: activeFilter, onChange: (e) => setActiveFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy rounded-sm", children: [_jsx("option", { value: "all", children: "Tous" }), _jsx("option", { value: "active", children: "Actifs" }), _jsx("option", { value: "inactive", children: "Inactifs" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "D\u00E9partement" }), _jsxs("select", { value: departmentFilter, onChange: (e) => setDepartmentFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy rounded-sm", children: [_jsx("option", { value: "all", children: "Tous les d\u00E9partements" }), DEPARTMENTS.map(dept => (_jsx("option", { value: dept, children: dept }, dept)))] })] })] })) })] }), _jsx("div", { className: "mb-4", children: _jsxs("p", { className: "text-sm text-gray-600", children: [filteredCourses.length, " cours", filteredCourses.length !== 1 ? '' : '', " trouv\u00E9", filteredCourses.length !== 1 ? 's' : ''] }) }), filteredCourses.length === 0 ? (_jsxs("div", { className: "bg-white border border-gray-200 p-12 text-center rounded-sm", children: [_jsx(BookOpen, { className: "h-16 w-16 mx-auto text-gray-300 mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-700 mb-2", children: "Aucun cours trouv\u00E9" }), _jsx("p", { className: "text-gray-500", children: "Modifiez vos crit\u00E8res de recherche" })] })) : (_jsx("div", { className: "bg-white border border-gray-200 rounded-sm overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Cours" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "D\u00E9partement" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Professeur" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date de d\u00E9but" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tudiants" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Heures" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tat" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: filteredCourses.map((course, index) => (_jsxs(motion.tr, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "hover:bg-gray-50 transition-colors duration-150", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900 whitespace-nowrap", children: course.name }), _jsxs("div", { className: "text-sm text-gray-500 whitespace-nowrap", children: ["MAJ: ", course.lastUpdated] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(Badge, { variant: "primary", className: "whitespace-nowrap", children: course.department }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs(Badge, { variant: "warning", className: "whitespace-nowrap", children: [_jsx(User, { className: "inline h-3 w-3 mr-1" }), course.professor] }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs(Badge, { variant: "info", className: "whitespace-nowrap", children: [_jsx(Calendar, { className: "inline h-3 w-3 mr-1" }), course.startDate] }) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsxs("div", { className: "flex items-center justify-center", children: [_jsx(User, { className: "h-4 w-4 text-green-600 mr-1" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: course.students })] }) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsxs("div", { className: "flex items-center justify-center", children: [_jsx(Clock, { className: "h-4 w-4 text-blue-600 mr-1" }), _jsxs("span", { className: "text-sm font-medium text-gray-900", children: [course.hours, "h"] })] }) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsx("div", { className: "flex items-center justify-center", children: _jsx(SimpleToggle, { active: course.active, onChange: () => onToggleActive(course.id) }) }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex justify-center space-x-2", children: [_jsx("button", { onClick: () => onViewDetails(course), className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 hover:border-blue-300 transition-colors duration-200 rounded-sm", title: "Voir les d\u00E9tails", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => onEditCourse(course), className: "p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-300 hover:border-green-300 transition-colors duration-200 rounded-sm", title: "Modifier", children: _jsx(Edit, { className: "h-4 w-4" }) })] }) })] }, course.id))) })] }) }) }))] }));
};
// Onglet Statistiques
const StatisticsTab = ({ courses }) => {
    const activeCourses = courses.filter(c => c.active);
    const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
    const totalHours = courses.reduce((sum, c) => sum + c.hours, 0);
    // Statistiques par département
    const departmentStats = DEPARTMENTS.map(dept => {
        const deptCourses = courses.filter(c => c.department === dept);
        return {
            name: dept,
            count: deptCourses.length,
            students: deptCourses.reduce((sum, c) => sum + c.students, 0),
            hours: deptCourses.reduce((sum, c) => sum + c.hours, 0)
        };
    }).filter(stat => stat.count > 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                    { title: "Total Cours", value: courses.length, icon: BookOpen, color: "bg-navy-100 text-navy-600" },
                    { title: "Total Étudiants", value: totalStudents, icon: User, color: "bg-green-100 text-green-600" },
                    { title: "Total Heures", value: totalHours, icon: Clock, color: "bg-orange-100 text-orange-600" },
                    { title: "Cours Actifs", value: activeCourses.length, icon: Check, color: "bg-purple-100 text-purple-600" }
                ].map((stat, index) => (_jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${stat.color} p-3 mr-4`, children: _jsx(stat.icon, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: stat.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.value })] })] }) }, stat.title))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par d\u00E9partement" }), _jsx("div", { className: "space-y-3", children: departmentStats.map(dept => {
                                    const percentage = Math.round((dept.count / courses.length) * 100);
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: dept.name }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3", children: _jsx("div", { className: "bg-navy-500 h-2", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: dept.count })] })] }, dept.name));
                                }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Heures par d\u00E9partement" }), _jsx("div", { className: "space-y-3", children: departmentStats.map(dept => {
                                    const percentage = Math.round((dept.hours / totalHours) * 100);
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: dept.name }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3", children: _jsx("div", { className: "bg-green-500 h-2", style: { width: `${percentage}%` } }) }), _jsxs("span", { className: "text-sm font-medium text-gray-900", children: [dept.hours, "h"] })] })] }, dept.name));
                                }) })] })] })] }));
};
// Formulaire d'ajout/modification
const AddCourseTab = ({ courseToEdit, onEditComplete }) => {
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        professor: '',
        hours: '',
        startDate: '',
        description: '',
        active: true
    });
    const isEditing = Boolean(courseToEdit);
    // Pré-remplir le formulaire quand on édite
    React.useEffect(() => {
        if (courseToEdit) {
            setFormData({
                name: courseToEdit.name,
                department: courseToEdit.department,
                professor: courseToEdit.professor,
                hours: courseToEdit.hours.toString(),
                startDate: courseToEdit.startDate,
                description: courseToEdit.description || '',
                active: courseToEdit.active
            });
        }
        else {
            setFormData({
                name: '',
                department: '',
                professor: '',
                hours: '',
                startDate: '',
                description: '',
                active: true
            });
        }
    }, [courseToEdit]);
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prevData => (Object.assign(Object.assign({}, prevData), { [name]: type === 'checkbox' ? e.target.checked : value })));
    };
    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert(`Cours ${isEditing ? 'modifié' : 'créé'} avec succès !`);
        if (isEditing && onEditComplete) {
            onEditComplete();
        }
        setFormData({
            name: '',
            department: '',
            professor: '',
            hours: '',
            startDate: '',
            description: '',
            active: true
        });
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [isEditing && (_jsx("div", { className: "mb-6 p-4 bg-navy-50 border border-navy-200", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Edit, { className: "h-5 w-5 text-navy-600 mr-2" }), _jsxs("p", { className: "text-navy-800 font-medium", children: ["Mode \u00E9dition : ", courseToEdit === null || courseToEdit === void 0 ? void 0 : courseToEdit.name] })] }) })), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nom du cours *" }), _jsx("input", { name: "name", value: formData.name, onChange: handleChange, placeholder: "Ex: Programmation Orient\u00E9e Objet", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "D\u00E9partement *" }), _jsxs("select", { name: "department", value: formData.department, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionner un d\u00E9partement" }), DEPARTMENTS.map(dept => (_jsx("option", { value: dept, children: dept }, dept)))] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Professeur *" }), _jsx("input", { name: "professor", value: formData.professor, onChange: handleChange, placeholder: "Ex: Dr. Moussa Diop", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Heures de cours *" }), _jsx("input", { name: "hours", type: "number", min: "1", value: formData.hours, onChange: handleChange, placeholder: "Ex: 45", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Date de d\u00E9but *" }), _jsx("input", { name: "startDate", type: "date", value: formData.startDate, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { name: "active", type: "checkbox", checked: formData.active, onChange: handleChange, className: "h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded" }), _jsx("label", { className: "ml-2 block text-sm text-gray-900", children: "Cours actif" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleChange, placeholder: "Description du cours...", rows: 4, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-6 border-t border-gray-200", children: [isEditing && (_jsx(SimpleButton, { type: "button", variant: "secondary", onClick: onEditComplete, children: "Annuler" })), _jsx(SimpleButton, { type: "button", variant: "primary", onClick: handleSubmit, children: isEditing ? 'Modifier le cours' : 'Créer le cours' })] })] })] }));
};
const CoursesChef = () => {
    const { user } = useAuth();
    const isChef = user === null || user === void 0 ? void 0 : user.estChef;
    const [activeTab, setActiveTab] = useState('list');
    // États pour la modal et l'édition
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseToEdit, setCourseToEdit] = useState(null);
    const [coursesState, setCoursesState] = useState(COURSES_DATA);
    // Hook pour les toasts
    const { toasts, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();
    // Fonctions pour gérer les cours
    const toggleCourseActive = (id) => {
        const course = coursesState.find(c => c.id === id);
        if (!course)
            return;
        const newActiveState = !course.active;
        setCoursesState(prev => prev.map(course => course.id === id ? Object.assign(Object.assign({}, course), { active: newActiveState }) : course));
        if (newActiveState) {
            showSuccess('Cours activé', `Le cours "${course.name}" a été activé avec succès.`);
        }
        else {
            showWarning('Cours désactivé', `Le cours "${course.name}" a été désactivé.`);
        }
    };
    // Fonctions pour gérer la modal des détails
    const openCourseDetails = (courseItem) => {
        setSelectedCourse(courseItem);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setSelectedCourse(null);
        setIsModalOpen(false);
    };
    // Fonctions pour gérer l'édition
    const startEditCourse = (courseItem) => {
        setCourseToEdit(courseItem);
        setActiveTab('add');
    };
    const stopEditCourse = () => {
        setCourseToEdit(null);
        setActiveTab('list');
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(ToastContainer, { toasts: toasts, onRemove: removeToast }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy-light rounded-full p-3 mr-4", children: _jsx(BookOpen, { className: "h-7 w-7 text-navy" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Gestion des Cours" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "G\u00E9rez les cours, professeurs et emplois du temps" })] })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("nav", { className: "flex space-x-8 px-6", children: [_jsx(TabButton, { isActive: activeTab === 'list', onClick: () => {
                                                setCourseToEdit(null); // Reset l'édition quand on clique sur l'onglet
                                                setActiveTab('list');
                                            }, icon: _jsx(FileText, { className: "h-4 w-4" }), children: "Liste des cours" }), _jsx(TabButton, { isActive: activeTab === 'add', onClick: () => {
                                                setCourseToEdit(null); // Reset l'édition quand on clique sur l'onglet
                                                setActiveTab('add');
                                            }, icon: _jsx(Plus, { className: "h-4 w-4" }), children: courseToEdit ? 'Modifier un cours' : 'Ajouter un cours' }), _jsx(TabButton, { isActive: activeTab === 'stats', onClick: () => setActiveTab('stats'), icon: _jsx(BarChart3, { className: "h-4 w-4" }), children: "Statistiques" })] }) }), _jsxs("div", { className: "p-6", children: [activeTab === 'list' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(CourseListTab, { courses: coursesState, onToggleActive: toggleCourseActive, onViewDetails: openCourseDetails, onEditCourse: startEditCourse }) })), activeTab === 'add' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(AddCourseTab, { courseToEdit: courseToEdit, onEditComplete: stopEditCourse }) })), activeTab === 'stats' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(StatisticsTab, { courses: coursesState }) }))] })] }), _jsx(CourseDetailsModal, { courseItem: selectedCourse, isOpen: isModalOpen, onClose: closeModal })] })] }));
};
export default CoursesChef;
