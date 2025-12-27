import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, User, FileText, Search, Filter, Plus, Edit, Eye, Calendar, BarChart3, School, Save, X, Check } from 'lucide-react';
// Fonctions utilitaires pour les années scolaires
const getCurrentAcademicYear = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    if (currentMonth < 10) {
        return `${currentYear - 1}-${currentYear}`;
    }
    else {
        return `${currentYear}-${currentYear + 1}`;
    }
};
const generateAcademicYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 5; i > 0; i--) {
        const year = currentYear - i;
        years.push(`${year}-${year + 1}`);
    }
    years.push(`${currentYear - 1}-${currentYear}`);
    if (new Date().getMonth() + 1 >= 10) {
        years.push(`${currentYear}-${currentYear + 1}`);
    }
    for (let i = 1; i <= 3; i++) {
        const startYear = currentYear + i - 1;
        if (!(startYear === currentYear && new Date().getMonth() + 1 < 10)) {
            years.push(`${startYear}-${startYear + 1}`);
        }
    }
    return years;
};
const isAcademicYearPast = (academicYear) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const endYear = parseInt(academicYear.split('-')[1]);
    return (currentMonth > 7 && currentYear >= endYear) || (currentYear > endYear);
};
const formatAcademicYear = (academicYear) => {
    const [startYear, endYear] = academicYear.split('-');
    return `Oct ${startYear} - Juil ${endYear}`;
};
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
const CLASSES_DATA = [
    { id: 1, name: "Génie Logiciel - L1", department: "Informatique", level: "Licence 1", academicYear: "2024-2025", students: 45, courses: 8, active: true, lastUpdated: "2025-05-12" },
    { id: 2, name: "Génie Logiciel - L2", department: "Informatique", level: "Licence 2", academicYear: "2024-2025", students: 38, courses: 10, active: true, lastUpdated: "2025-05-10" },
    { id: 3, name: "Génie Logiciel - L3", department: "Informatique", level: "Licence 3", academicYear: "2024-2025", students: 32, courses: 12, active: true, lastUpdated: "2025-05-08" },
    { id: 4, name: "Intelligence Artificielle - M1", department: "Informatique", level: "Master 1", academicYear: "2024-2025", students: 25, courses: 8, active: true, lastUpdated: "2025-05-05" },
    { id: 5, name: "Intelligence Artificielle - M2", department: "Informatique", level: "Master 2", academicYear: "2024-2025", students: 20, courses: 6, active: true, lastUpdated: "2025-04-30" },
    { id: 6, name: "Réseaux et Sécurité - L1", department: "Réseaux", level: "Licence 1", academicYear: "2024-2025", students: 40, courses: 8, active: true, lastUpdated: "2025-04-28" },
    { id: 7, name: "Réseaux et Sécurité - L2", department: "Réseaux", level: "Licence 2", academicYear: "2023-2024", students: 35, courses: 10, active: false, lastUpdated: "2025-04-25" },
    { id: 8, name: "Gestion d'Entreprise - L1", department: "Management", level: "Licence 1", academicYear: "2024-2025", students: 50, courses: 8, active: true, lastUpdated: "2025-04-20" },
];
// Composant Toggle avec border radius
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
// Modal pour afficher les détails d'une classe
const ClassDetailsModal = ({ classItem, isOpen, onClose }) => {
    if (!isOpen || !classItem)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: classItem.name }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: classItem.active ? 'active' : 'inactive', children: classItem.active ? 'Active' : 'Inactive' }), _jsx(Badge, { variant: "primary", children: classItem.level })] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Informations g\u00E9n\u00E9rales" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "D\u00E9partement" }), _jsx("p", { className: "text-gray-900", children: classItem.department })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Niveau" }), _jsx("p", { className: "text-gray-900", children: classItem.level })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Ann\u00E9e scolaire" }), _jsx("p", { className: "text-gray-900", children: formatAcademicYear(classItem.academicYear) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Derni\u00E8re mise \u00E0 jour" }), _jsx("p", { className: "text-gray-900", children: classItem.lastUpdated })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Statistiques" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-green-50 border border-green-200 p-4 text-center", children: [_jsxs("div", { className: "flex items-center justify-center mb-2", children: [_jsx(User, { className: "h-6 w-6 text-green-600 mr-2" }), _jsx("span", { className: "text-3xl font-bold text-gray-900", children: classItem.students })] }), _jsx("p", { className: "text-sm text-green-700 font-medium", children: "\u00C9tudiants inscrits" })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 p-4 text-center", children: [_jsxs("div", { className: "flex items-center justify-center mb-2", children: [_jsx(FileText, { className: "h-6 w-6 text-blue-600 mr-2" }), _jsx("span", { className: "text-3xl font-bold text-gray-900", children: classItem.courses })] }), _jsx("p", { className: "text-sm text-blue-700 font-medium", children: "Cours programm\u00E9s" })] })] })] })] }), _jsx("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: _jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Fermer" }) })] }) }));
};
// Badge avec couleurs subtiles
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
// Bouton simplifié
const SimpleButton = ({ children, onClick, variant = 'primary', icon, disabled = false, type = 'button' }) => {
    const styles = {
        primary: `bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    };
    return (_jsxs("button", { onClick: disabled ? undefined : onClick, disabled: disabled, type: type, className: `px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center rounded-sm ${styles[variant]}`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
// Onglet simplifié
const TabButton = ({ children, isActive, onClick, icon }) => {
    return (_jsxs("button", { onClick: onClick, className: `
        flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'}
      `, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
// Statistiques
const StatisticsTab = ({ classes }) => {
    const activeClasses = classes.filter(c => c.active);
    const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
    const totalCourses = classes.reduce((sum, c) => sum + c.courses, 0);
    const departments = Array.from(new Set(classes.map(c => c.department)));
    const levels = Array.from(new Set(classes.map(c => c.level)));
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                    { title: "Total Classes", value: classes.length, icon: BookOpen, color: "bg-blue-100 text-blue-600" },
                    { title: "Total Étudiants", value: totalStudents, icon: User, color: "bg-green-100 text-green-600" },
                    { title: "Total Cours", value: totalCourses, icon: FileText, color: "bg-orange-100 text-orange-600" },
                    { title: "Classes Actives", value: activeClasses.length, icon: School, color: "bg-purple-100 text-purple-600" }
                ].map((stat, index) => (_jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${stat.color} p-3 mr-4 rounded-sm`, children: _jsx(stat.icon, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: stat.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.value })] })] }) }, stat.title))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par d\u00E9partement" }), _jsx("div", { className: "space-y-3", children: departments.map(dept => {
                                    const deptClasses = classes.filter(c => c.department === dept);
                                    const percentage = Math.round((deptClasses.length / classes.length) * 100);
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: dept }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3 rounded-full", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: deptClasses.length })] })] }, dept));
                                }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par niveau" }), _jsx("div", { className: "space-y-3", children: levels.map(level => {
                                    const levelClasses = classes.filter(c => c.level === level);
                                    const percentage = Math.round((levelClasses.length / classes.length) * 100);
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: level }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3 rounded-full", children: _jsx("div", { className: "bg-green-500 h-2 rounded-full", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: levelClasses.length })] })] }, level));
                                }) })] })] })] }));
};
// Formulaire d'ajout/modification
const AddClassTab = ({ classToEdit, onEditComplete }) => {
    const [formData, setFormData] = useState({
        name: '',
        level: '',
        department: '',
        academicYear: getCurrentAcademicYear(),
        description: '',
        active: true
    });
    const academicYears = generateAcademicYears();
    const isEditing = Boolean(classToEdit);
    // Pré-remplir le formulaire quand on édite
    React.useEffect(() => {
        if (classToEdit) {
            setFormData({
                name: classToEdit.name,
                level: classToEdit.level,
                department: classToEdit.department,
                academicYear: classToEdit.academicYear,
                description: '',
                active: classToEdit.active
            });
        }
        else {
            setFormData({
                name: '',
                level: '',
                department: '',
                academicYear: getCurrentAcademicYear(),
                description: '',
                active: true
            });
        }
    }, [classToEdit]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: value })));
    };
    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert(`Classe ${isEditing ? 'modifiée' : 'créée'} avec succès !`);
        if (isEditing && onEditComplete) {
            onEditComplete();
        }
        setFormData({
            name: '',
            level: '',
            department: '',
            academicYear: getCurrentAcademicYear(),
            description: '',
            active: true
        });
    };
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "max-w-4xl", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [isEditing && (_jsx("div", { className: "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Edit, { className: "h-5 w-5 text-blue-600 mr-2" }), _jsxs("p", { className: "text-blue-800 font-medium", children: ["Mode \u00E9dition : ", classToEdit === null || classToEdit === void 0 ? void 0 : classToEdit.name] })] }) })), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nom de la classe *" }), _jsx("input", { name: "name", value: formData.name, onChange: handleChange, placeholder: "Ex: G\u00E9nie Logiciel - L1", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Niveau *" }), _jsxs("select", { name: "level", value: formData.level, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionner un niveau" }), _jsx("option", { value: "Licence 1", children: "Licence 1" }), _jsx("option", { value: "Licence 2", children: "Licence 2" }), _jsx("option", { value: "Licence 3", children: "Licence 3" }), _jsx("option", { value: "Master 1", children: "Master 1" }), _jsx("option", { value: "Master 2", children: "Master 2" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "D\u00E9partement *" }), _jsxs("select", { name: "department", value: formData.department, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionner un d\u00E9partement" }), DEPARTMENTS.map(dept => (_jsx("option", { value: dept, children: dept }, dept)))] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Ann\u00E9e scolaire *" }), _jsx("select", { name: "academicYear", value: formData.academicYear, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true, children: academicYears.map(year => (_jsx("option", { value: year, children: formatAcademicYear(year) }, year))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleChange, placeholder: "Description optionnelle...", rows: 4, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm" })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-6 border-t border-gray-200", children: [isEditing && (_jsx(SimpleButton, { type: "button", variant: "secondary", onClick: onEditComplete, children: "Annuler" })), _jsx(SimpleButton, { type: "button", variant: "secondary", onClick: () => {
                                        setFormData({
                                            name: '',
                                            level: '',
                                            department: '',
                                            academicYear: getCurrentAcademicYear(),
                                            description: '',
                                            active: true
                                        });
                                    }, children: "R\u00E9initialiser" }), _jsx(SimpleButton, { type: "button", variant: "primary", icon: _jsx(Save, { className: "h-4 w-4" }), onClick: handleSubmit, children: isEditing ? 'Modifier la classe' : 'Créer la classe' })] })] })] }) }));
};
const ClassesChef = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    // États pour la modal et l'édition
    const [selectedClass, setSelectedClass] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [classToEdit, setClassToEdit] = useState(null);
    const [classesState, setClassesState] = useState(CLASSES_DATA.map(classItem => {
        const isPastAcademicYear = isAcademicYearPast(classItem.academicYear);
        return isPastAcademicYear ? Object.assign(Object.assign({}, classItem), { active: false }) : classItem;
    }));
    const filteredClasses = classesState.filter(classItem => {
        const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            classItem.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            classItem.level.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = activeFilter === 'all' ||
            (activeFilter === 'active' && classItem.active) ||
            (activeFilter === 'inactive' && !classItem.active);
        const matchesLevel = levelFilter === 'all' ||
            classItem.level.includes(levelFilter);
        return matchesSearch && matchesStatus && matchesLevel;
    });
    const toggleClassActive = (id) => {
        const classToToggle = classesState.find(c => c.id === id);
        if (!classToToggle)
            return;
        const isPastAcademicYear = isAcademicYearPast(classToToggle.academicYear);
        if (isPastAcademicYear && !classToToggle.active) {
            return;
        }
        setClassesState(prevState => prevState.map(classItem => classItem.id === id
            ? Object.assign(Object.assign({}, classItem), { active: !classItem.active }) : classItem));
    };
    // Fonctions pour gérer la modal des détails
    const openClassDetails = (classItem) => {
        setSelectedClass(classItem);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setSelectedClass(null);
        setIsModalOpen(false);
    };
    // Fonctions pour gérer l'édition
    const startEditClass = (classItem) => {
        setClassToEdit(classItem);
        setActiveTab('add');
    };
    const stopEditClass = () => {
        setClassToEdit(null);
        setActiveTab('list');
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6 rounded-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-blue-100 rounded-full p-3 mr-4", children: _jsx(BookOpen, { className: "h-7 w-7 text-blue-600" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Gestion des Classes" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "G\u00E9rez les classes, \u00E9tudiants et cours" })] })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6 rounded-sm", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("div", { className: "flex space-x-8 px-6", children: [_jsx(TabButton, { isActive: activeTab === 'list', onClick: () => setActiveTab('list'), icon: _jsx(BookOpen, { className: "h-4 w-4" }), children: "Liste des classes" }), _jsx(TabButton, { isActive: activeTab === 'add', onClick: () => {
                                            setClassToEdit(null); // Reset l'édition quand on clique sur l'onglet
                                            setActiveTab('add');
                                        }, icon: _jsx(Plus, { className: "h-4 w-4" }), children: classToEdit ? 'Modifier une classe' : 'Ajouter une classe' }), _jsx(TabButton, { isActive: activeTab === 'stats', onClick: () => setActiveTab('stats'), icon: _jsx(BarChart3, { className: "h-4 w-4" }), children: "Statistiques" })] }) }), _jsx("div", { className: "p-6", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'list' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6 rounded-sm", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4", children: [_jsxs("div", { className: "relative w-full md:w-1/2", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Rechercher une classe...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm" })] }), _jsx(SimpleButton, { variant: "ghost", onClick: () => setShowFilters(!showFilters), icon: _jsx(Filter, { className: "h-5 w-5" }), children: showFilters ? 'Masquer' : 'Filtres' })] }), _jsx(AnimatePresence, { children: showFilters && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "\u00C9tat" }), _jsxs("select", { value: activeFilter, onChange: (e) => setActiveFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", children: [_jsx("option", { value: "all", children: "Tous" }), _jsx("option", { value: "active", children: "Actives" }), _jsx("option", { value: "inactive", children: "Inactives" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Niveau" }), _jsxs("select", { value: levelFilter, onChange: (e) => setLevelFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", children: [_jsx("option", { value: "all", children: "Tous les niveaux" }), _jsx("option", { value: "Licence 1", children: "Licence 1" }), _jsx("option", { value: "Licence 2", children: "Licence 2" }), _jsx("option", { value: "Licence 3", children: "Licence 3" }), _jsx("option", { value: "Master 1", children: "Master 1" }), _jsx("option", { value: "Master 2", children: "Master 2" })] })] })] })) })] }), _jsx("div", { className: "mb-4", children: _jsxs("p", { className: "text-sm text-gray-600", children: [filteredClasses.length, " classe", filteredClasses.length !== 1 ? 's' : '', " trouv\u00E9e", filteredClasses.length !== 1 ? 's' : ''] }) }), filteredClasses.length === 0 ? (_jsxs("div", { className: "bg-white border border-gray-200 p-12 text-center rounded-sm", children: [_jsx(BookOpen, { className: "h-16 w-16 mx-auto text-gray-300 mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-700 mb-2", children: "Aucune classe trouv\u00E9e" }), _jsx("p", { className: "text-gray-500", children: "Modifiez vos crit\u00E8res de recherche" })] })) : (_jsx("div", { className: "bg-white border border-gray-200 rounded-sm overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-200", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Classe" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "D\u00E9partement" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Niveau" }), _jsx("th", { className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Ann\u00E9e scolaire" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tudiants" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Cours" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tat" }), _jsx("th", { className: "px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: filteredClasses.map((classItem, index) => (_jsxs(motion.tr, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "hover:bg-gray-50 transition-colors duration-150", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900 whitespace-nowrap", children: classItem.name }), _jsxs("div", { className: "text-sm text-gray-500 whitespace-nowrap", children: ["MAJ: ", classItem.lastUpdated] })] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(Badge, { variant: "info", children: classItem.department }) }), _jsx("td", { className: "px-6 py-4", children: _jsx(Badge, { variant: "primary", className: "whitespace-nowrap", children: classItem.level }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs(Badge, { variant: "warning", className: "whitespace-nowrap", children: [_jsx(Calendar, { className: "inline h-3 w-3 mr-1" }), formatAcademicYear(classItem.academicYear)] }) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsxs("div", { className: "flex items-center justify-center", children: [_jsx(User, { className: "h-4 w-4 text-green-600 mr-1" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: classItem.students })] }) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsxs("div", { className: "flex items-center justify-center", children: [_jsx(FileText, { className: "h-4 w-4 text-blue-600 mr-1" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: classItem.courses })] }) }), _jsx("td", { className: "px-6 py-4 text-center", children: _jsx("div", { className: "flex items-center justify-center", children: _jsx(SimpleToggle, { active: classItem.active, onChange: () => toggleClassActive(classItem.id), disabled: isAcademicYearPast(classItem.academicYear) }) }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex justify-center space-x-2", children: [_jsx("button", { onClick: () => openClassDetails(classItem), className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 hover:border-blue-300 transition-colors duration-200 rounded-sm", title: "Voir les d\u00E9tails", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => startEditClass(classItem), className: "p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-300 hover:border-green-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm", disabled: isAcademicYearPast(classItem.academicYear), title: "Modifier", children: _jsx(Edit, { className: "h-4 w-4" }) })] }) })] }, classItem.id))) })] }) }) }))] }, "list")), activeTab === 'add' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(AddClassTab, { classToEdit: classToEdit, onEditComplete: stopEditClass }) }, "add")), activeTab === 'stats' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(StatisticsTab, { classes: classesState }) }, "stats"))] }) })] }), _jsx(ClassDetailsModal, { classItem: selectedClass, isOpen: isModalOpen, onClose: closeModal })] }) }));
};
export default ClassesChef;
