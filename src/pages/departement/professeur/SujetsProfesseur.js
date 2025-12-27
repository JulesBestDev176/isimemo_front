import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Filter, Plus, Edit, Trash2, Eye, Calendar, BarChart3, Users, Save, X, Check, Target, TrendingUp } from 'lucide-react';
// Données d'exemple
const SUBJECTS_DATA = [
    {
        id: 1,
        title: "Intelligence Artificielle pour la Détection de Fraudes",
        description: "Développement d'un système de détection de fraudes utilisant des algorithmes d'apprentissage automatique et de deep learning.",
        type: "memoire",
        level: "Master 2",
        department: "Informatique",
        maxStudents: 2,
        currentStudents: 1,
        status: "approved",
        submittedDate: "2024-09-15",
        approvedDate: "2024-09-20",
        academicYear: "2024-2025",
        keywords: ["IA", "Machine Learning", "Sécurité", "Détection"],
        requirements: "Bonnes connaissances en Python, statistiques et algorithmes",
        objectives: "Maîtriser les techniques de ML pour la sécurité informatique",
        createdDate: "2024-09-10",
        lastModified: "2024-09-15"
    },
    {
        id: 2,
        title: "Application Mobile de Gestion de Bibliothèque",
        description: "Conception et développement d'une application mobile cross-platform pour la gestion automatisée d'une bibliothèque universitaire.",
        type: "projet",
        level: "Licence 3",
        department: "Informatique",
        maxStudents: 3,
        currentStudents: 3,
        status: "approved",
        submittedDate: "2024-10-01",
        approvedDate: "2024-10-05",
        academicYear: "2024-2025",
        keywords: ["Mobile", "React Native", "Base de données", "UX/UI"],
        requirements: "Connaissances en développement mobile et bases de données",
        objectives: "Développer une solution mobile complète",
        createdDate: "2024-09-25",
        lastModified: "2024-10-01"
    },
    {
        id: 3,
        title: "Optimisation des Réseaux de Neurones pour IoT",
        description: "Recherche sur l'optimisation des architectures de réseaux de neurones pour les dispositifs IoT avec contraintes de ressources.",
        type: "memoire",
        level: "Master 1",
        department: "Informatique",
        maxStudents: 1,
        currentStudents: 0,
        status: "submitted",
        submittedDate: "2024-11-10",
        academicYear: "2024-2025",
        keywords: ["IoT", "Réseaux de neurones", "Optimisation", "Edge Computing"],
        requirements: "Solides bases en IA et programmation embarquée",
        objectives: "Optimiser les performances des IA sur dispositifs contraints",
        createdDate: "2024-11-05",
        lastModified: "2024-11-10"
    },
    {
        id: 4,
        title: "Stage en Cybersécurité - Audit de Sécurité",
        description: "Stage de 6 mois dans une entreprise spécialisée en cybersécurité pour réaliser des audits de sécurité et tests de pénétration.",
        type: "stage",
        level: "Master 2",
        department: "Informatique",
        maxStudents: 1,
        currentStudents: 1,
        status: "approved",
        submittedDate: "2024-08-20",
        approvedDate: "2024-08-25",
        academicYear: "2024-2025",
        keywords: ["Cybersécurité", "Audit", "Pentesting", "Entreprise"],
        requirements: "Certification en sécurité informatique souhaitée",
        objectives: "Acquérir une expérience professionnelle en cybersécurité",
        createdDate: "2024-08-15",
        lastModified: "2024-08-20"
    },
    {
        id: 5,
        title: "Blockchain pour la Traçabilité Alimentaire",
        description: "Conception d'une solution blockchain pour assurer la traçabilité des produits alimentaires de la production à la consommation.",
        type: "memoire",
        level: "Master 2",
        department: "Informatique",
        maxStudents: 2,
        currentStudents: 0,
        status: "draft",
        submittedDate: "",
        academicYear: "2024-2025",
        keywords: ["Blockchain", "Traçabilité", "Smart Contracts", "Supply Chain"],
        requirements: "Connaissances en blockchain et cryptographie",
        objectives: "Maîtriser la technologie blockchain appliquée à l'industrie",
        createdDate: "2024-11-15",
        lastModified: "2024-11-18"
    },
    {
        id: 6,
        title: "Système de Recommandation E-commerce",
        description: "Développement d'un système de recommandation personnalisé pour une plateforme e-commerce utilisant le filtrage collaboratif.",
        type: "projet",
        level: "Master 1",
        department: "Informatique",
        maxStudents: 2,
        currentStudents: 1,
        status: "rejected",
        submittedDate: "2024-10-15",
        academicYear: "2024-2025",
        keywords: ["Recommandation", "E-commerce", "Filtrage collaboratif", "Big Data"],
        requirements: "Bonnes connaissances en algorithmes et bases de données",
        objectives: "Comprendre les systèmes de recommandation modernes",
        createdDate: "2024-10-10",
        lastModified: "2024-10-15"
    }
];
const SUBJECT_TYPES = [
    { value: 'memoire', label: 'Mémoire', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'projet', label: 'Projet', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'stage', label: 'Stage', color: 'bg-green-100 text-green-700 border-green-200' }
];
const LEVELS = ["Licence 3", "Master 1", "Master 2"];
const DEPARTMENTS = ["Informatique", "Réseaux", "Management", "Génie Civil"];
// Composants utilitaires
const Badge = ({ children, variant = 'info', className = '' }) => {
    const styles = {
        approved: "bg-green-50 text-green-700 border border-green-200",
        submitted: "bg-blue-50 text-blue-700 border border-blue-200",
        draft: "bg-gray-50 text-gray-700 border border-gray-200",
        rejected: "bg-red-50 text-red-600 border border-red-200",
        info: "bg-gray-50 text-gray-700 border border-gray-200",
        warning: "bg-orange-50 text-orange-700 border border-orange-200",
        primary: "bg-blue-50 text-blue-700 border border-blue-200"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded-sm ${styles[variant]} ${className}`, children: children }));
};
const SimpleButton = ({ children, onClick, variant = 'primary', icon, disabled = false, type = 'button' }) => {
    const styles = {
        primary: `bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
        danger: `bg-red-600 text-white border border-red-600 hover:bg-red-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
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
// Modal pour voir les détails d'un sujet
const SubjectDetailsModal = ({ subject, isOpen, onClose }) => {
    if (!isOpen || !subject)
        return null;
    const getTypeConfig = (type) => {
        return SUBJECT_TYPES.find(t => t.value === type) || SUBJECT_TYPES[0];
    };
    const typeConfig = getTypeConfig(subject.type);
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: subject.title }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx(Badge, { variant: subject.status, children: subject.status === 'approved' ? 'Approuvé' :
                                                subject.status === 'submitted' ? 'Soumis' :
                                                    subject.status === 'draft' ? 'Brouillon' : 'Rejeté' }), _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${typeConfig.color}`, children: typeConfig.label }), _jsx(Badge, { variant: "primary", children: subject.level })] })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 transition-colors", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Description" }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: subject.description })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Objectifs" }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: subject.objectives })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Pr\u00E9requis" }), _jsx("p", { className: "text-gray-700 leading-relaxed", children: subject.requirements })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Mots-cl\u00E9s" }), _jsx("div", { className: "flex flex-wrap gap-2", children: subject.keywords.map((keyword, index) => (_jsx("span", { className: "inline-flex px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full", children: keyword }, index))) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-gray-50 border border-gray-200 p-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Informations" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "D\u00E9partement" }), _jsx("p", { className: "text-gray-900", children: subject.department })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Ann\u00E9e acad\u00E9mique" }), _jsx("p", { className: "text-gray-900", children: subject.academicYear })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Date de cr\u00E9ation" }), _jsx("p", { className: "text-gray-900", children: subject.createdDate })] }), subject.submittedDate && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Date de soumission" }), _jsx("p", { className: "text-gray-900", children: subject.submittedDate })] })), subject.approvedDate && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-500", children: "Date d'approbation" }), _jsx("p", { className: "text-gray-900", children: subject.approvedDate })] }))] })] }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 p-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "\u00C9tudiants" }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-3xl font-bold text-blue-600 mb-2", children: [subject.currentStudents, "/", subject.maxStudents] }), _jsx("p", { className: "text-sm text-blue-700", children: "Places occup\u00E9es" }), _jsx("div", { className: "mt-3", children: _jsx("div", { className: "w-full bg-blue-200 h-2 rounded-full", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full transition-all duration-300", style: { width: `${(subject.currentStudents / subject.maxStudents) * 100}%` } }) }) })] })] })] })] }), _jsx("div", { className: "flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200", children: _jsx(SimpleButton, { variant: "secondary", onClick: onClose, children: "Fermer" }) })] }) }));
};
// Formulaire d'ajout/modification de sujet
const AddSubjectTab = ({ subjectToEdit, onEditComplete }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'memoire',
        level: '',
        department: '',
        maxStudents: 1,
        keywords: '',
        requirements: '',
        objectives: '',
        academicYear: '2024-2025'
    });
    const isEditing = Boolean(subjectToEdit);
    React.useEffect(() => {
        if (subjectToEdit) {
            setFormData({
                title: subjectToEdit.title,
                description: subjectToEdit.description,
                type: subjectToEdit.type,
                level: subjectToEdit.level,
                department: subjectToEdit.department,
                maxStudents: subjectToEdit.maxStudents,
                keywords: subjectToEdit.keywords.join(', '),
                requirements: subjectToEdit.requirements,
                objectives: subjectToEdit.objectives,
                academicYear: subjectToEdit.academicYear
            });
        }
        else {
            setFormData({
                title: '',
                description: '',
                type: 'memoire',
                level: '',
                department: '',
                maxStudents: 1,
                keywords: '',
                requirements: '',
                objectives: '',
                academicYear: '2024-2025'
            });
        }
    }, [subjectToEdit]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => (Object.assign(Object.assign({}, prev), { [name]: name === 'maxStudents' ? parseInt(value) || 1 : value })));
    };
    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert(`Sujet ${isEditing ? 'modifié' : 'créé'} avec succès !`);
        if (isEditing && onEditComplete) {
            onEditComplete();
        }
        setFormData({
            title: '',
            description: '',
            type: 'memoire',
            level: '',
            department: '',
            maxStudents: 1,
            keywords: '',
            requirements: '',
            objectives: '',
            academicYear: '2024-2025'
        });
    };
    const saveDraft = () => {
        console.log('Draft saved:', formData);
        alert('Brouillon sauvegardé !');
    };
    return (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "max-w-4xl", children: _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [isEditing && (_jsx("div", { className: "mb-6 p-4 bg-blue-50 border border-blue-200 rounded-sm", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Edit, { className: "h-5 w-5 text-blue-600 mr-2" }), _jsxs("p", { className: "text-blue-800 font-medium", children: ["Mode \u00E9dition : ", subjectToEdit === null || subjectToEdit === void 0 ? void 0 : subjectToEdit.title] })] }) })), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Titre du sujet *" }), _jsx("input", { name: "title", value: formData.title, onChange: handleChange, placeholder: "Ex: Intelligence Artificielle pour la D\u00E9tection de Fraudes", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Type de sujet *" }), _jsx("select", { name: "type", value: formData.type, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true, children: SUBJECT_TYPES.map(type => (_jsx("option", { value: type.value, children: type.label }, type.value))) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Niveau *" }), _jsxs("select", { name: "level", value: formData.level, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionner" }), LEVELS.map(level => (_jsx("option", { value: level, children: level }, level)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nombre max d'\u00E9tudiants" }), _jsx("input", { name: "maxStudents", type: "number", min: "1", max: "5", value: formData.maxStudents, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "D\u00E9partement *" }), _jsxs("select", { name: "department", value: formData.department, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionner un d\u00E9partement" }), DEPARTMENTS.map(dept => (_jsx("option", { value: dept, children: dept }, dept)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Mots-cl\u00E9s (s\u00E9par\u00E9s par des virgules)" }), _jsx("input", { name: "keywords", value: formData.keywords, onChange: handleChange, placeholder: "Ex: IA, Machine Learning, S\u00E9curit\u00E9", className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description *" }), _jsx("textarea", { name: "description", value: formData.description, onChange: handleChange, placeholder: "Description d\u00E9taill\u00E9e du sujet...", rows: 4, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Objectifs *" }), _jsx("textarea", { name: "objectives", value: formData.objectives, onChange: handleChange, placeholder: "Objectifs p\u00E9dagogiques et comp\u00E9tences \u00E0 acqu\u00E9rir...", rows: 3, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Pr\u00E9requis *" }), _jsx("textarea", { name: "requirements", value: formData.requirements, onChange: handleChange, placeholder: "Connaissances et comp\u00E9tences requises...", rows: 3, className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", required: true })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-4 pt-6 border-t border-gray-200", children: [isEditing && (_jsx(SimpleButton, { type: "button", variant: "secondary", onClick: onEditComplete, children: "Annuler" })), _jsx(SimpleButton, { type: "button", variant: "secondary", onClick: saveDraft, icon: _jsx(Save, { className: "h-4 w-4" }), children: "Sauvegarder brouillon" }), _jsx(SimpleButton, { type: "button", variant: "primary", onClick: handleSubmit, icon: _jsx(Target, { className: "h-4 w-4" }), children: isEditing ? 'Modifier le sujet' : 'Soumettre le sujet' })] })] })] }) }));
};
// Onglet Statistiques
const StatisticsTab = ({ subjects }) => {
    const totalSubjects = subjects.length;
    const approvedSubjects = subjects.filter(s => s.status === 'approved').length;
    const submittedSubjects = subjects.filter(s => s.status === 'submitted').length;
    const draftSubjects = subjects.filter(s => s.status === 'draft').length;
    const rejectedSubjects = subjects.filter(s => s.status === 'rejected').length;
    const totalStudents = subjects.reduce((sum, s) => sum + s.currentStudents, 0);
    const totalCapacity = subjects.reduce((sum, s) => sum + s.maxStudents, 0);
    const occupancyRate = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;
    const subjectsByType = SUBJECT_TYPES.map(type => (Object.assign(Object.assign({}, type), { count: subjects.filter(s => s.type === type.value).length })));
    const subjectsByLevel = LEVELS.map(level => ({
        level,
        count: subjects.filter(s => s.level === level).length
    }));
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
                    { title: "Total Sujets", value: totalSubjects, icon: FileText, color: "bg-blue-100 text-blue-600" },
                    { title: "Sujets Approuvés", value: approvedSubjects, icon: Check, color: "bg-green-100 text-green-600" },
                    { title: "Étudiants Assignés", value: totalStudents, icon: Users, color: "bg-purple-100 text-purple-600" },
                    { title: "Taux d'Occupation", value: `${occupancyRate}%`, icon: TrendingUp, color: "bg-orange-100 text-orange-600" }
                ].map((stat, index) => (_jsx("div", { className: "bg-white border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `${stat.color} p-3 mr-4 rounded-sm`, children: _jsx(stat.icon, { className: "h-6 w-6" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: stat.title }), _jsx("p", { className: "text-2xl font-bold text-gray-900", children: stat.value })] })] }) }, stat.title))) }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Statut des sujets" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center p-4 bg-green-50 border border-green-200 rounded-sm", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: approvedSubjects }), _jsx("div", { className: "text-sm text-green-700", children: "Approuv\u00E9s" })] }), _jsxs("div", { className: "text-center p-4 bg-blue-50 border border-blue-200 rounded-sm", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: submittedSubjects }), _jsx("div", { className: "text-sm text-blue-700", children: "Soumis" })] }), _jsxs("div", { className: "text-center p-4 bg-gray-50 border border-gray-200 rounded-sm", children: [_jsx("div", { className: "text-2xl font-bold text-gray-600", children: draftSubjects }), _jsx("div", { className: "text-sm text-gray-700", children: "Brouillons" })] }), _jsxs("div", { className: "text-center p-4 bg-red-50 border border-red-200 rounded-sm", children: [_jsx("div", { className: "text-2xl font-bold text-red-600", children: rejectedSubjects }), _jsx("div", { className: "text-sm text-red-700", children: "Rejet\u00E9s" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par type" }), _jsx("div", { className: "space-y-3", children: subjectsByType.map(type => {
                                    const percentage = totalSubjects > 0 ? Math.round((type.count / totalSubjects) * 100) : 0;
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "flex items-center", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded-sm border mr-3 ${type.color}`, children: type.label }) }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3 rounded-full", children: _jsx("div", { className: "bg-blue-600 h-2 rounded-full", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900 w-8", children: type.count })] })] }, type.value));
                                }) })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "R\u00E9partition par niveau" }), _jsx("div", { className: "space-y-3", children: subjectsByLevel.map(level => {
                                    const percentage = totalSubjects > 0 ? Math.round((level.count / totalSubjects) * 100) : 0;
                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-600", children: level.level }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-24 bg-gray-200 h-2 mr-3 rounded-full", children: _jsx("div", { className: "bg-green-500 h-2 rounded-full", style: { width: `${percentage}%` } }) }), _jsx("span", { className: "text-sm font-medium text-gray-900 w-8", children: level.count })] })] }, level.level));
                                }) })] })] }), _jsxs("div", { className: "bg-white border border-gray-200 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Occupation des places" }), _jsx("div", { className: "space-y-4", children: subjects.filter(s => s.status === 'approved').map(subject => {
                            const occupancyRate = Math.round((subject.currentStudents / subject.maxStudents) * 100);
                            return (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-sm", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: subject.title }), _jsxs("p", { className: "text-xs text-gray-500", children: [subject.type, " - ", subject.level] })] }), _jsxs("div", { className: "flex items-center ml-4", children: [_jsx("div", { className: "w-32 bg-gray-200 h-2 mr-3 rounded-full", children: _jsx("div", { className: `h-2 rounded-full ${occupancyRate === 100 ? 'bg-green-500' :
                                                        occupancyRate >= 80 ? 'bg-yellow-500' : 'bg-blue-500'}`, style: { width: `${occupancyRate}%` } }) }), _jsxs("span", { className: "text-sm font-medium text-gray-900 w-16", children: [subject.currentStudents, "/", subject.maxStudents] })] })] }, subject.id));
                        }) })] })] }));
};
// Composant principal
const SujetsProfesseur = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [levelFilter, setLevelFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    // États pour la modal et l'édition
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjectToEdit, setSubjectToEdit] = useState(null);
    const [subjectsState, setSubjectsState] = useState(SUBJECTS_DATA);
    const filteredSubjects = subjectsState.filter(subject => {
        const matchesSearch = subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            subject.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || subject.status === statusFilter;
        const matchesType = typeFilter === 'all' || subject.type === typeFilter;
        const matchesLevel = levelFilter === 'all' || subject.level === levelFilter;
        return matchesSearch && matchesStatus && matchesType && matchesLevel;
    });
    // Fonctions pour gérer la modal des détails
    const openSubjectDetails = (subject) => {
        setSelectedSubject(subject);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setSelectedSubject(null);
        setIsModalOpen(false);
    };
    // Fonctions pour gérer l'édition
    const startEditSubject = (subject) => {
        setSubjectToEdit(subject);
        setActiveTab('add');
    };
    const stopEditSubject = () => {
        setSubjectToEdit(null);
        setActiveTab('list');
    };
    // Fonction pour supprimer un sujet
    const deleteSubject = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sujet ?')) {
            setSubjectsState(prev => prev.filter(s => s.id !== id));
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 p-6", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6 rounded-sm", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "bg-purple-100 rounded-full p-3 mr-4", children: _jsx(FileText, { className: "h-7 w-7 text-purple-600" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Mes Sujets" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "G\u00E9rez vos sujets de m\u00E9moires, projets et stages" })] })] }), _jsxs("div", { className: "text-right", children: [_jsx(Badge, { variant: "primary", children: "Professeur" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Prof. Martin Dubois" })] })] }) }), _jsxs("div", { className: "bg-white border border-gray-200 mb-6 rounded-sm", children: [_jsx("div", { className: "border-b border-gray-200", children: _jsxs("div", { className: "flex space-x-8 px-6", children: [_jsxs(TabButton, { isActive: activeTab === 'list', onClick: () => setActiveTab('list'), icon: _jsx(FileText, { className: "h-4 w-4" }), children: ["Mes sujets (", subjectsState.length, ")"] }), _jsx(TabButton, { isActive: activeTab === 'add', onClick: () => {
                                            setSubjectToEdit(null);
                                            setActiveTab('add');
                                        }, icon: _jsx(Plus, { className: "h-4 w-4" }), children: subjectToEdit ? 'Modifier un sujet' : 'Proposer un sujet' }), _jsx(TabButton, { isActive: activeTab === 'stats', onClick: () => setActiveTab('stats'), icon: _jsx(BarChart3, { className: "h-4 w-4" }), children: "Statistiques" })] }) }), _jsx("div", { className: "p-6", children: _jsxs(AnimatePresence, { mode: "wait", children: [activeTab === 'list' && (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [_jsxs("div", { className: "bg-white border border-gray-200 p-6 mb-6 rounded-sm", children: [_jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4", children: [_jsxs("div", { className: "relative w-full md:w-1/2", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Search, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Rechercher un sujet...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm" })] }), _jsx(SimpleButton, { variant: "ghost", onClick: () => setShowFilters(!showFilters), icon: _jsx(Filter, { className: "h-5 w-5" }), children: showFilters ? 'Masquer' : 'Filtres' })] }), _jsx(AnimatePresence, { children: showFilters && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Statut" }), _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", children: [_jsx("option", { value: "all", children: "Tous" }), _jsx("option", { value: "approved", children: "Approuv\u00E9s" }), _jsx("option", { value: "submitted", children: "Soumis" }), _jsx("option", { value: "draft", children: "Brouillons" }), _jsx("option", { value: "rejected", children: "Rejet\u00E9s" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Type" }), _jsxs("select", { value: typeFilter, onChange: (e) => setTypeFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", children: [_jsx("option", { value: "all", children: "Tous les types" }), SUBJECT_TYPES.map(type => (_jsx("option", { value: type.value, children: type.label }, type.value)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Niveau" }), _jsxs("select", { value: levelFilter, onChange: (e) => setLevelFilter(e.target.value), className: "w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm", children: [_jsx("option", { value: "all", children: "Tous les niveaux" }), LEVELS.map(level => (_jsx("option", { value: level, children: level }, level)))] })] })] })) })] }), _jsx("div", { className: "mb-4", children: _jsxs("p", { className: "text-sm text-gray-600", children: [filteredSubjects.length, " sujet", filteredSubjects.length !== 1 ? 's' : '', " trouv\u00E9", filteredSubjects.length !== 1 ? 's' : ''] }) }), filteredSubjects.length === 0 ? (_jsxs("div", { className: "bg-white border border-gray-200 p-12 text-center rounded-sm", children: [_jsx(FileText, { className: "h-16 w-16 mx-auto text-gray-300 mb-4" }), _jsx("h2", { className: "text-xl font-semibold text-gray-700 mb-2", children: "Aucun sujet trouv\u00E9" }), _jsx("p", { className: "text-gray-500", children: "Modifiez vos crit\u00E8res de recherche ou cr\u00E9ez votre premier sujet" })] })) : (_jsx("div", { className: "grid grid-cols-1 gap-6", children: filteredSubjects.map((subject, index) => {
                                                    const typeConfig = SUBJECT_TYPES.find(t => t.value === subject.type);
                                                    const occupancyRate = Math.round((subject.currentStudents / subject.maxStudents) * 100);
                                                    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.05 }, className: "bg-white border border-gray-200 p-6 rounded-sm hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: subject.title }), _jsx(Badge, { variant: subject.status, children: subject.status === 'approved' ? 'Approuvé' :
                                                                                            subject.status === 'submitted' ? 'Soumis' :
                                                                                                subject.status === 'draft' ? 'Brouillon' : 'Rejeté' })] }), _jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${typeConfig === null || typeConfig === void 0 ? void 0 : typeConfig.color}`, children: typeConfig === null || typeConfig === void 0 ? void 0 : typeConfig.label }), _jsx(Badge, { variant: "primary", children: subject.level }), _jsx(Badge, { variant: "info", children: subject.department })] }), _jsx("p", { className: "text-gray-600 text-sm mb-3 line-clamp-2", children: subject.description }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: [subject.currentStudents, "/", subject.maxStudents, " \u00E9tudiants"] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Calendar, { className: "h-4 w-4 mr-1" }), _jsxs("span", { children: ["Cr\u00E9\u00E9 le ", subject.createdDate] })] })] })] }), _jsx("div", { className: "ml-6 text-center", children: _jsxs("div", { className: "w-16 h-16 relative", children: [_jsxs("svg", { className: "w-16 h-16 transform -rotate-90", viewBox: "0 0 36 36", children: [_jsx("path", { className: "text-gray-200", stroke: "currentColor", strokeWidth: "3", fill: "none", d: "M18 2.0845\r\n                                        a 15.9155 15.9155 0 0 1 0 31.831\r\n                                        a 15.9155 15.9155 0 0 1 0 -31.831" }), _jsx("path", { className: occupancyRate === 100 ? 'text-green-500' :
                                                                                                occupancyRate >= 80 ? 'text-yellow-500' : 'text-blue-500', stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", fill: "none", strokeDasharray: `${occupancyRate}, 100`, d: "M18 2.0845\r\n                                        a 15.9155 15.9155 0 0 1 0 31.831\r\n                                        a 15.9155 15.9155 0 0 1 0 -31.831" })] }), _jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("span", { className: "text-xs font-medium", children: [occupancyRate, "%"] }) })] }) })] }), _jsx("div", { className: "mb-4", children: _jsxs("div", { className: "flex flex-wrap gap-1", children: [subject.keywords.slice(0, 4).map((keyword, idx) => (_jsx("span", { className: "inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full", children: keyword }, idx))), subject.keywords.length > 4 && (_jsxs("span", { className: "inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full", children: ["+", subject.keywords.length - 4] }))] }) }), _jsxs("div", { className: "flex justify-end space-x-2 pt-4 border-t border-gray-200", children: [_jsx(SimpleButton, { variant: "ghost", onClick: () => openSubjectDetails(subject), icon: _jsx(Eye, { className: "h-4 w-4" }), children: "D\u00E9tails" }), _jsx(SimpleButton, { variant: "ghost", onClick: () => startEditSubject(subject), icon: _jsx(Edit, { className: "h-4 w-4" }), children: "Modifier" }), _jsx(SimpleButton, { variant: "ghost", onClick: () => deleteSubject(subject.id), icon: _jsx(Trash2, { className: "h-4 w-4" }), children: "Supprimer" })] })] }, subject.id));
                                                }) }))] }, "list")), activeTab === 'add' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(AddSubjectTab, { subjectToEdit: subjectToEdit, onEditComplete: stopEditSubject }) }, "add")), activeTab === 'stats' && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(StatisticsTab, { subjects: subjectsState }) }, "stats"))] }) })] }), _jsx(SubjectDetailsModal, { subject: selectedSubject, isOpen: isModalOpen, onClose: closeModal })] }) }));
};
export default SujetsProfesseur;
