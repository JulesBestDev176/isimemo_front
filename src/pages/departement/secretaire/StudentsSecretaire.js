import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, GraduationCap, UserPlus, Download, Upload, Filter, Edit, Check, X, Eye, BarChart3, FileText, School, Mail, Calendar, Phone, MapPin, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
// Liste des classes disponibles
const CLASSES = [
    "Informatique - L1",
    "Informatique - L2",
    "Informatique - L3",
    "Informatique - M1",
    "Informatique - M2",
    "Réseaux - L1",
    "Réseaux - L2",
    "Réseaux - L3",
    "Management - L1",
    "Management - L2"
];
// Liste des niveaux
const LEVELS = [
    "Licence 1",
    "Licence 2",
    "Licence 3",
    "Master 1",
    "Master 2"
];
const STUDENTS_DATA = [
    {
        id: 1,
        firstName: "Amadou",
        lastName: "Diop",
        email: "amadou.diop@student.edu.sn",
        class: "Informatique - L1",
        level: "Licence 1",
        registrationDate: "01/09/2025",
        active: true,
        phoneNumber: "+221 77 123 45 67",
        address: "123 Rue Pompidou, Dakar",
        gpa: 15.6,
        lastUpdated: "2025-01-15"
    },
    {
        id: 2,
        firstName: "Fatou",
        lastName: "Ndiaye",
        email: "fatou.ndiaye@student.edu.sn",
        class: "Informatique - L1",
        level: "Licence 1",
        registrationDate: "02/09/2025",
        active: true,
        phoneNumber: "+221 76 987 65 43",
        address: "45 Avenue Cheikh Anta Diop, Dakar",
        gpa: 16.2,
        lastUpdated: "2025-01-10"
    },
    {
        id: 3,
        firstName: "Modou",
        lastName: "Sall",
        email: "modou.sall@student.edu.sn",
        class: "Informatique - L2",
        level: "Licence 2",
        registrationDate: "01/09/2024",
        active: true,
        phoneNumber: "+221 70 555 22 33",
        address: "78 Boulevard de la République, Dakar",
        gpa: 13.4,
        lastUpdated: "2025-01-12"
    },
    {
        id: 4,
        firstName: "Aïda",
        lastName: "Diallo",
        email: "aida.diallo@student.edu.sn",
        class: "Informatique - L2",
        level: "Licence 2",
        registrationDate: "03/09/2024",
        active: false,
        phoneNumber: "+221 77 888 99 00",
        address: "12 Rue de la Paix, Dakar",
        gpa: 11.8,
        lastUpdated: "2025-01-08"
    },
    {
        id: 5,
        firstName: "Abdoulaye",
        lastName: "Mbaye",
        email: "abdoulaye.mbaye@student.edu.sn",
        class: "Informatique - L3",
        level: "Licence 3",
        registrationDate: "01/09/2023",
        active: true,
        phoneNumber: "+221 76 111 22 33",
        address: "90 Rue des Écoles, Dakar",
        gpa: 14.7,
        lastUpdated: "2025-01-14"
    },
    {
        id: 6,
        firstName: "Mariama",
        lastName: "Sow",
        email: "mariama.sow@student.edu.sn",
        class: "Informatique - L3",
        level: "Licence 3",
        registrationDate: "02/09/2023",
        active: true,
        phoneNumber: "+221 77 444 55 66",
        address: "67 Avenue Georges Bush, Dakar",
        gpa: 15.9,
        lastUpdated: "2025-01-11"
    },
    {
        id: 7,
        firstName: "Ibrahima",
        lastName: "Fall",
        email: "ibrahima.fall@student.edu.sn",
        class: "Réseaux - L2",
        level: "Licence 2",
        registrationDate: "01/09/2024",
        active: true,
        phoneNumber: "+221 76 777 88 99",
        address: "34 Rue de la Liberté, Dakar",
        gpa: 12.3,
        lastUpdated: "2025-01-09"
    },
    {
        id: 8,
        firstName: "Sophie",
        lastName: "Mendy",
        email: "sophie.mendy@student.edu.sn",
        class: "Réseaux - L1",
        level: "Licence 1",
        registrationDate: "03/09/2025",
        active: true,
        phoneNumber: "+221 77 000 11 22",
        address: "56 Boulevard de la Corniche, Dakar",
        gpa: 16.8,
        lastUpdated: "2025-01-13"
    },
];
// Composants UI réutilisables
// Remplacement des couleurs blue/primary par navy
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
const Badge = ({ children, variant = 'info', className = '' }) => {
    const styles = {
        active: "bg-green-50 text-green-700 border border-green-200",
        inactive: "bg-red-50 text-red-600 border border-red-200",
        info: "bg-gray-50 text-gray-700 border border-gray-200",
        warning: "bg-orange-50 text-orange-700 border border-orange-200",
        primary: "bg-navy bg-opacity-10 text-navy border border-navy border-opacity-20"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className}`, children: children }));
};
// Composant SimpleToggle pour activer/désactiver un élément
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
// Modal pour afficher les détails d'un étudiant
const StudentDetailsModal = ({ studentItem, isOpen, onClose }) => {
    if (!isOpen || !studentItem)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: [studentItem.firstName, " ", studentItem.lastName] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: studentItem.active ? 'active' : 'inactive', children: studentItem.active ? 'Actif' : 'Inactif' }), _jsx(Badge, { variant: "primary", children: studentItem.level })] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Informations g\u00E9n\u00E9rales" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Email" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(Mail, { className: "h-4 w-4 text-gray-400 mr-2" }), studentItem.email] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Classe" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(School, { className: "h-4 w-4 text-gray-400 mr-2" }), studentItem.class] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Date d'inscription" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 text-gray-400 mr-2" }), studentItem.registrationDate] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Derni\u00E8re mise \u00E0 jour" }), _jsx("p", { className: "text-gray-900", children: studentItem.lastUpdated })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Informations personnelles" }), _jsxs("div", { className: "space-y-3", children: [studentItem.phoneNumber && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "T\u00E9l\u00E9phone" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(Phone, { className: "h-4 w-4 text-gray-400 mr-2" }), studentItem.phoneNumber] })] })), studentItem.address && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Adresse" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(MapPin, { className: "h-4 w-4 text-gray-400 mr-2" }), studentItem.address] })] })), studentItem.gpa && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Moyenne g\u00E9n\u00E9rale" }), _jsxs("p", { className: "text-gray-900 flex items-center", children: [_jsx(Award, { className: "h-4 w-4 text-gray-400 mr-2" }), studentItem.gpa, "/20"] })] }))] })] })] }), _jsx("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: _jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Fermer" }) })] }) }));
};
// Onglet Liste des étudiants
const StudentListTab = ({ students, onToggleActive, onViewDetails, onEditStudent }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');
    const [classFilter, setClassFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    // Filtrer les données
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = activeFilter === 'all' ||
            (activeFilter === 'active' && student.active) ||
            (activeFilter === 'inactive' && !student.active);
        const matchesLevel = levelFilter === 'all' ||
            student.level === levelFilter;
        const matchesClass = classFilter === 'all' ||
            student.class === classFilter;
        return matchesSearch && matchesStatus && matchesLevel && matchesClass;
    });
    return (_jsxs("div", { children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between mb-4", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Actions" }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx(SimpleButton, { variant: "primary", icon: _jsx(Upload, { className: "h-4 w-4" }), children: "Importer (CSV)" }), _jsx(SimpleButton, { variant: "secondary", icon: _jsx(Download, { className: "h-4 w-4" }), children: "Exporter" })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Filtres et recherche" }), _jsxs(SimpleButton, { variant: "ghost", onClick: () => setShowFilters(!showFilters), icon: _jsx(Filter, { className: "h-4 w-4" }), children: [showFilters ? 'Masquer' : 'Afficher', " les filtres"] })] }), _jsxs("div", { className: "relative mb-4", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Rechercher un \u00E9tudiant...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsx(AnimatePresence, { children: showFilters && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.3 }, className: "overflow-hidden", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\u00C9tat" }), _jsxs("select", { value: activeFilter, onChange: (e) => setActiveFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Tous les \u00E9tats" }), _jsx("option", { value: "active", children: "Actifs" }), _jsx("option", { value: "inactive", children: "Inactifs" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Niveau" }), _jsxs("select", { value: levelFilter, onChange: (e) => setLevelFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Tous les niveaux" }), LEVELS.map(level => (_jsx("option", { value: level, children: level }, level)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Classe" }), _jsxs("select", { value: classFilter, onChange: (e) => setClassFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", children: [_jsx("option", { value: "all", children: "Toutes les classes" }), CLASSES.map(cls => (_jsx("option", { value: cls, children: cls }, cls)))] })] })] }) })) })] }), filteredStudents.length === 0 ? (_jsxs("div", { className: "bg-white border border-gray-200 p-8 text-center", children: [_jsx(User, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-600 mb-2", children: "Aucun \u00E9tudiant trouv\u00E9" }), _jsx("p", { className: "text-gray-500", children: "Essayez de modifier vos crit\u00E8res de recherche ou filtres." })] })) : (_jsx("div", { className: "bg-white border border-gray-200 overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tudiant" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Niveau" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Classe" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Date d'inscription" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Moyenne" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "\u00C9tat" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredStudents.map((student, index) => (_jsxs(motion.tr, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3", children: _jsxs("span", { className: "text-gray-600 font-medium", children: [student.firstName.charAt(0), student.lastName.charAt(0)] }) }), _jsxs("div", { children: [_jsxs("div", { className: "text-sm font-medium text-gray-900", children: [student.lastName, " ", student.firstName] }), _jsx("div", { className: "text-sm text-gray-500", children: student.email })] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { variant: "primary", children: student.level }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs(Badge, { variant: "warning", children: [_jsx(GraduationCap, { className: "inline h-3 w-3 mr-1" }), student.class] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 text-navy mr-1" }), _jsx("span", { className: "text-sm text-gray-900", children: student.registrationDate })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Award, { className: "h-4 w-4 text-green-600 mr-1" }), _jsx("span", { className: "text-sm text-gray-900", children: student.gpa || 'N/A' })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(SimpleToggle, { isActive: student.active, onToggle: () => onToggleActive(student.id), activeLabel: "Actif", inactiveLabel: "Inactif" }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => onViewDetails(student), className: "p-2 text-gray-600 hover:text-navy hover:bg-navy-light border border-gray-300 hover:border-navy transition-colors duration-200", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => onEditStudent(student), className: "p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-300 hover:border-green-300 transition-colors duration-200", children: _jsx(Edit, { className: "h-4 w-4" }) })] }) })] }, student.id))) })] }) }) }))] }));
};
// Onglet Statistiques
const StatisticsTab = ({ students }) => {
    const activeStudents = students.filter(s => s.active);
    const totalGPA = students.reduce((sum, s) => sum + (s.gpa || 0), 0);
    const averageGPA = students.length > 0 ? (totalGPA / students.length).toFixed(1) : '0.0';
    // Statistiques par niveau
    const levelStats = LEVELS.map(level => {
        const levelStudents = students.filter(s => s.level === level);
        return {
            name: level,
            count: levelStudents.length,
            active: levelStudents.filter(s => s.active).length,
            avgGPA: levelStudents.length > 0
                ? (levelStudents.reduce((sum, s) => sum + (s.gpa || 0), 0) / levelStudents.length).toFixed(1)
                : '0.0'
        };
    }).filter(stat => stat.count > 0);
    // Statistiques par classe
    const classStats = CLASSES.map(cls => {
        const classStudents = students.filter(s => s.class === cls);
        return {
            name: cls,
            count: classStudents.length,
            active: classStudents.filter(s => s.active).length
        };
    }).filter(stat => stat.count > 0);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                    { title: "Total Étudiants", value: students.length, icon: User, color: "bg-navy-light text-navy" },
                    { title: "Étudiants Actifs", value: activeStudents.length, icon: Check, color: "bg-green-100 text-green-600" },
                    { title: "Moyenne GPA", value: averageGPA, icon: Award, color: "bg-orange-100 text-orange-600" },
                    { title: "Taux d'activité", value: `${Math.round((activeStudents.length / students.length) * 100)}%`, icon: BarChart3, color: "bg-purple-100 text-purple-600" }
                ].map((stat, index) => (_jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${stat.color} p-3 mr-4`, children: _jsx(stat.icon, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: stat.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.value })] })] }) }, stat.title))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par niveau" }), _jsx("div", { className: "space-y-3", children: levelStats.map(level => {
                                    const percentage = Math.round((level.count / students.length) * 100);
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: level.name }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3", children: _jsx("div", { className: "bg-navy h-2", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: level.count })] })] }, level.name));
                                }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par classe" }), _jsx("div", { className: "space-y-3", children: classStats.map(cls => {
                                    const percentage = Math.round((cls.count / students.length) * 100);
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: cls.name }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3", children: _jsx("div", { className: "bg-green-500 h-2", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: cls.count })] })] }, cls.name));
                                }) })] })] })] }));
};
// Formulaire d'ajout/modification
const AddStudentTab = ({ studentToEdit, onEditComplete }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        class: '',
        level: '',
        registrationDate: new Date().toISOString().split('T')[0],
        phoneNumber: '',
        address: '',
        active: true
    });
    const isEditing = Boolean(studentToEdit);
    // Pré-remplir le formulaire quand on édite
    React.useEffect(() => {
        if (studentToEdit) {
            setFormData({
                firstName: studentToEdit.firstName,
                lastName: studentToEdit.lastName,
                email: studentToEdit.email,
                class: studentToEdit.class,
                level: studentToEdit.level,
                registrationDate: studentToEdit.registrationDate,
                phoneNumber: studentToEdit.phoneNumber || '',
                address: studentToEdit.address || '',
                active: studentToEdit.active
            });
        }
        else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                class: '',
                level: '',
                registrationDate: new Date().toISOString().split('T')[0],
                phoneNumber: '',
                address: '',
                active: true
            });
        }
    }, [studentToEdit]);
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prevData => (Object.assign(Object.assign({}, prevData), { [name]: type === 'checkbox' ? e.target.checked : value })));
    };
    // Définir le niveau automatiquement selon la classe
    const handleClassChange = (e) => {
        const className = e.target.value;
        let level = '';
        if (className.includes('L1')) {
            level = 'Licence 1';
        }
        else if (className.includes('L2')) {
            level = 'Licence 2';
        }
        else if (className.includes('L3')) {
            level = 'Licence 3';
        }
        else if (className.includes('M1')) {
            level = 'Master 1';
        }
        else if (className.includes('M2')) {
            level = 'Master 2';
        }
        setFormData(prevData => (Object.assign(Object.assign({}, prevData), { class: className, level: level })));
    };
    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert(`Étudiant ${isEditing ? 'modifié' : 'créé'} avec succès !`);
        if (isEditing && onEditComplete) {
            onEditComplete();
        }
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            class: '',
            level: '',
            registrationDate: new Date().toISOString().split('T')[0],
            phoneNumber: '',
            address: '',
            active: true
        });
    };
    return (_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [isEditing && (_jsx("div", { className: "mb-6 p-4 bg-navy-light border border-navy-light", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Edit, { className: "h-5 w-5 text-navy mr-2" }), _jsxs("p", { className: "text-navy-dark font-medium", children: ["Mode \u00E9dition : ", studentToEdit === null || studentToEdit === void 0 ? void 0 : studentToEdit.firstName, " ", studentToEdit === null || studentToEdit === void 0 ? void 0 : studentToEdit.lastName] })] }) })), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nom *" }), _jsx("input", { name: "lastName", value: formData.lastName, onChange: handleChange, placeholder: "Ex: Diop", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Pr\u00E9nom *" }), _jsx("input", { name: "firstName", value: formData.firstName, onChange: handleChange, placeholder: "Ex: Amadou", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email *" }), _jsx("input", { name: "email", type: "email", value: formData.email, onChange: handleChange, placeholder: "Ex: amadou.diop@student.edu.sn", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "T\u00E9l\u00E9phone" }), _jsx("input", { name: "phoneNumber", value: formData.phoneNumber, onChange: handleChange, placeholder: "Ex: +221 77 123 45 67", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Classe *" }), _jsxs("select", { name: "class", value: formData.class, onChange: handleClassChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionner une classe" }), CLASSES.map(cls => (_jsx("option", { value: cls, children: cls }, cls)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Niveau" }), _jsx("input", { name: "level", value: formData.level, onChange: handleChange, placeholder: "Ex: Licence 1", className: "w-full px-3 py-2 border border-gray-300 bg-gray-50 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", disabled: true }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Le niveau est automatiquement d\u00E9fini selon la classe choisie" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Date d'inscription *" }), _jsx("input", { name: "registrationDate", type: "date", value: formData.registrationDate, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy", required: true })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { name: "active", type: "checkbox", checked: formData.active, onChange: handleChange, className: "h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded" }), _jsx("label", { className: "ml-2 block text-sm text-gray-900", children: "\u00C9tudiant actif" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Adresse" }), _jsx("textarea", { name: "address", value: formData.address, onChange: handleChange, placeholder: "Adresse compl\u00E8te...", rows: 3, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy" })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-6 border-t border-gray-200", children: [isEditing && (_jsx(SimpleButton, { type: "button", variant: "secondary", onClick: onEditComplete, children: "Annuler" })), _jsx(SimpleButton, { type: "button", variant: "primary", onClick: handleSubmit, children: isEditing ? 'Modifier l\'étudiant' : 'Créer l\'étudiant' })] })] })] }));
};
const StudentsChef = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('list');
    // États pour la modal et l'édition
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentToEdit, setStudentToEdit] = useState(null);
    const [studentsState, setStudentsState] = useState(STUDENTS_DATA);
    // Fonctions pour gérer les étudiants
    const toggleStudentActive = (id) => {
        setStudentsState(prev => prev.map(student => student.id === id ? Object.assign(Object.assign({}, student), { active: !student.active }) : student));
    };
    // Fonctions pour gérer la modal des détails
    const openStudentDetails = (studentItem) => {
        setSelectedStudent(studentItem);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setSelectedStudent(null);
        setIsModalOpen(false);
    };
    // Fonctions pour gérer l'édition
    const startEditStudent = (studentItem) => {
        setStudentToEdit(studentItem);
        setActiveTab('add');
    };
    const stopEditStudent = () => {
        setStudentToEdit(null);
        setActiveTab('list');
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-navy-light rounded-full p-3 mr-4", children: _jsx(User, { className: "h-7 w-7 text-navy" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Gestion des \u00C9tudiants" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "G\u00E9rez les \u00E9tudiants, inscriptions et informations personnelles" })] })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("nav", { className: "flex space-x-8 px-6", children: [_jsx(TabButton, { isActive: activeTab === 'list', onClick: () => {
                                            setStudentToEdit(null); // Reset l'édition quand on clique sur l'onglet
                                            setActiveTab('list');
                                        }, icon: _jsx(FileText, { className: "h-4 w-4" }), children: "Liste des \u00E9tudiants" }), _jsx(TabButton, { isActive: activeTab === 'add', onClick: () => {
                                            setStudentToEdit(null); // Reset l'édition quand on clique sur l'onglet
                                            setActiveTab('add');
                                        }, icon: _jsx(UserPlus, { className: "h-4 w-4" }), children: studentToEdit ? 'Modifier un étudiant' : 'Ajouter un étudiant' }), _jsx(TabButton, { isActive: activeTab === 'stats', onClick: () => setActiveTab('stats'), icon: _jsx(BarChart3, { className: "h-4 w-4" }), children: "Statistiques" })] }) }), _jsxs("div", { className: "p-6", children: [activeTab === 'list' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(StudentListTab, { students: studentsState, onToggleActive: toggleStudentActive, onViewDetails: openStudentDetails, onEditStudent: startEditStudent }) })), activeTab === 'add' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(AddStudentTab, { studentToEdit: studentToEdit, onEditComplete: stopEditStudent }) })), activeTab === 'stats' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(StatisticsTab, { students: studentsState }) }))] })] }), _jsx(StudentDetailsModal, { studentItem: selectedStudent, isOpen: isModalOpen, onClose: closeModal })] }) }));
};
export default StudentsChef;
