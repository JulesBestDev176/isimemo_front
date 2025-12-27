import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiPlusCircle, FiCheck, FiX, FiUsers, FiToggleLeft, FiToggleRight, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
const DepartementsList = () => {
    // État pour gérer les départements
    const [departements, setDepartements] = useState([
        {
            id: 1,
            name: 'Informatique',
            chief: 'Dr. Ahmed Diop',
            active: true,
            staff: 12,
            description: 'Département responsable de l\'enseignement des technologies de l\'information et de la communication.',
            createdAt: '10/01/2020',
            location: 'Bâtiment A, 2ème étage'
        },
        {
            id: 2,
            name: 'Génie Civil',
            chief: 'Dr. Fatou Sow',
            active: true,
            staff: 8,
            description: 'Département axé sur les principes d\'ingénierie pour la conception et la construction d\'infrastructures.',
            createdAt: '15/03/2020',
            location: 'Bâtiment B, 1er étage'
        },
        {
            id: 3,
            name: 'Management',
            chief: 'Dr. Ousmane Fall',
            active: false,
            staff: 10,
            description: 'Département qui forme les étudiants à la gestion des entreprises et au leadership.',
            createdAt: '05/09/2020',
            location: 'Bâtiment C, Rez-de-chaussée'
        },
        {
            id: 4,
            name: 'Électronique',
            chief: 'Dr. Marie Faye',
            active: true,
            staff: 6,
            description: 'Département focalisé sur l\'étude et la conception des systèmes électroniques.',
            createdAt: '20/02/2021',
            location: 'Bâtiment A, 3ème étage'
        },
        {
            id: 5,
            name: 'Mécanique',
            chief: 'Dr. Ibrahima Ndiaye',
            active: true,
            staff: 9,
            description: 'Département axé sur l\'étude des forces et des mouvements dans les systèmes mécaniques.',
            createdAt: '12/11/2021',
            location: 'Bâtiment B, 2ème étage'
        },
    ]);
    // État pour la recherche
    const [searchQuery, setSearchQuery] = useState('');
    // État pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    // État pour le modal de consultation
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    // État pour le modal de confirmation
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [departmentToToggle, setDepartmentToToggle] = useState(null);
    // Filtrer les départements en fonction de la recherche
    const filteredDepartments = departements.filter(dept => dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.chief.toLowerCase().includes(searchQuery.toLowerCase()));
    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
    // Fonctions de pagination
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    // Fonction pour ouvrir le modal de consultation
    const handleView = (dept) => {
        setSelectedDepartment(dept);
        setViewModalOpen(true);
    };
    // Fonction pour ouvrir le modal de confirmation d'activation/désactivation
    const handleToggleConfirm = (dept) => {
        setDepartmentToToggle(dept);
        setConfirmModalOpen(true);
    };
    // Fonction pour basculer l'état actif/inactif
    const toggleActive = () => {
        if (departmentToToggle) {
            setDepartements(prevDepts => prevDepts.map(dept => dept.id === departmentToToggle.id
                ? Object.assign(Object.assign({}, dept), { active: !dept.active }) : dept));
            setConfirmModalOpen(false);
            setDepartmentToToggle(null);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "D\u00E9partements" }), _jsxs("div", { className: "flex space-x-4 items-center", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Rechercher un d\u00E9partement...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-64" }), _jsx(FiSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" })] }), _jsxs(Link, { to: "/departements/add", className: "btn-primary", children: [_jsx(FiPlusCircle, { className: "mr-2" }), " Ajouter"] })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "card", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Nom" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Chef de d\u00E9partement" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Personnel" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: currentItems.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-10 text-center text-gray-500", children: "Aucun d\u00E9partement trouv\u00E9" }) })) : (currentItems.map((dept) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "px-6 py-4", children: [_jsx("div", { className: "font-medium text-gray-900", children: dept.name }), dept.location && (_jsx("div", { className: "text-xs text-gray-500 mt-1", children: dept.location }))] }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "text-sm text-gray-700", children: dept.chief }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center text-sm text-gray-700", children: [_jsx(FiUsers, { className: "mr-1 text-gray-400" }), _jsxs("span", { children: [dept.staff, " membres"] })] }) }), _jsx("td", { className: "px-6 py-4", children: dept.active ? (_jsxs("span", { className: "px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-100 text-green-800", children: [_jsx(FiCheck, { className: "mr-1" }), " Actif"] })) : (_jsxs("span", { className: "px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-800", children: [_jsx(FiX, { className: "mr-1" }), " Inactif"] })) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-center text-sm font-medium", children: _jsxs("div", { className: "flex justify-center space-x-3", children: [_jsx("button", { onClick: () => handleView(dept), className: "text-white bg-primary p-1.5 rounded-full transition-colors duration-200 hover:bg-primary-700", title: "Consulter", children: _jsx(FiEye, { className: "h-5 w-5" }) }), _jsx(Link, { to: `/departements/edit/${dept.id}`, className: "text-blue-600 hover:text-blue-800 bg-blue-100 p-1.5 rounded-full transition-colors duration-200", title: "Modifier", children: _jsx(FiEdit, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleToggleConfirm(dept), className: `p-1.5 rounded-full transition-colors duration-200 ${dept.active
                                                                ? 'text-red-600 hover:text-red-800 bg-red-100'
                                                                : 'text-green-600 hover:text-green-800 bg-green-100'}`, title: dept.active ? 'Désactiver' : 'Activer', children: dept.active ? (_jsx(FiToggleRight, { className: "h-5 w-5" })) : (_jsx(FiToggleLeft, { className: "h-5 w-5" })) })] }) })] }, dept.id)))) })] }) }), totalPages > 1 && (_jsxs("div", { className: "px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-500", children: ["Affichage de ", indexOfFirstItem + 1, " \u00E0 ", Math.min(indexOfLastItem, filteredDepartments.length), " sur ", filteredDepartments.length, " d\u00E9partements"] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => goToPage(currentPage - 1), disabled: currentPage === 1, className: `p-2 rounded-md ${currentPage === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-gray-100'}`, children: _jsx(FiChevronLeft, { className: "h-5 w-5" }) }), [...Array(totalPages)].map((_, index) => (_jsx("button", { onClick: () => goToPage(index + 1), className: `w-8 h-8 rounded-md ${currentPage === index + 1
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:bg-gray-100'}`, children: index + 1 }, index))), _jsx("button", { onClick: () => goToPage(currentPage + 1), disabled: currentPage === totalPages, className: `p-2 rounded-md ${currentPage === totalPages
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-gray-100'}`, children: _jsx(FiChevronRight, { className: "h-5 w-5" }) })] })] }))] }), _jsx(AnimatePresence, { children: viewModalOpen && selectedDepartment && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { duration: 0.2 }, className: "bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4", children: [_jsxs("div", { className: "border-b p-4 flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-semibold text-navy", children: "D\u00E9tails du d\u00E9partement" }), _jsx("button", { onClick: () => setViewModalOpen(false), className: "text-gray-500 hover:text-gray-700", children: _jsx(FiX, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary bg-opacity-10 text-primary", children: _jsx("span", { className: "text-2xl font-bold", children: selectedDepartment.name.charAt(0) }) }) }), _jsxs("div", { className: "ml-4", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: selectedDepartment.name }), _jsxs("div", { className: "mt-1 flex items-center", children: [_jsx("div", { className: `inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${selectedDepartment.active
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'}`, children: selectedDepartment.active ? 'Actif' : 'Inactif' }), selectedDepartment.location && (_jsx("span", { className: "ml-2 text-sm text-gray-500", children: selectedDepartment.location }))] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Chef de d\u00E9partement" }), _jsx("div", { className: "text-base font-semibold", children: selectedDepartment.chief })] }), _jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Personnel" }), _jsxs("div", { className: "text-base font-semibold", children: [selectedDepartment.staff, " membres"] })] }), selectedDepartment.createdAt && (_jsxs("div", { className: "bg-gray-50 p-3 rounded-lg", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Date de cr\u00E9ation" }), _jsx("div", { className: "text-base", children: selectedDepartment.createdAt })] }))] }), selectedDepartment.description && (_jsxs("div", { className: "bg-gray-50 p-3 rounded-lg mt-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-500", children: "Description" }), _jsx("div", { className: "text-base", children: selectedDepartment.description })] }))] }), _jsxs("div", { className: "border-t p-4 flex justify-end space-x-3", children: [_jsx("button", { onClick: () => setViewModalOpen(false), className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50", children: "Fermer" }), _jsxs(Link, { to: `/departements/edit/${selectedDepartment.id}`, className: "btn-primary", onClick: () => setViewModalOpen(false), children: [_jsx(FiEdit, { className: "mr-2" }), " Modifier"] })] })] }) })) }), _jsx(AnimatePresence, { children: confirmModalOpen && departmentToToggle && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { duration: 0.2 }, className: "bg-white rounded-lg shadow-lg w-full max-w-md", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-3", children: "Confirmation" }), _jsx("p", { className: "text-gray-700 mb-6", children: departmentToToggle.active
                                        ? `Êtes-vous sûr de vouloir désactiver le département "${departmentToToggle.name}" ?`
                                        : `Êtes-vous sûr de vouloir activer le département "${departmentToToggle.name}" ?` }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx("button", { onClick: () => setConfirmModalOpen(false), className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50", children: "Annuler" }), _jsx("button", { onClick: toggleActive, className: `px-4 py-2 rounded-md text-white ${departmentToToggle.active
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-green-600 hover:bg-green-700'}`, children: departmentToToggle.active ? 'Désactiver' : 'Activer' })] })] }) }) })) })] }));
};
export default DepartementsList;
