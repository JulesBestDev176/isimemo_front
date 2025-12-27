import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiEye, FiPlusCircle, FiCheck, FiX, FiMessageSquare, FiSearch, FiChevronLeft, FiChevronRight, FiToggleLeft, FiToggleRight, FiMail, FiPhone } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
const StaffList = ({ role }) => {
    // Données fictives pour l'affichage avec photos
    const [staffMembers, setStaffMembers] = useState([
        {
            id: 1,
            name: 'Dr. Ahmed Diop',
            departement: 'Informatique',
            email: 'ahmed.diop@isi.edu',
            phone: '77 123 45 67',
            active: true,
            photo: 'https://randomuser.me/api/portraits/men/1.jpg',
            role: 'chief',
            title: 'Docteur en Informatique',
            joinDate: '10/03/2020',
            specialization: 'Intelligence Artificielle'
        },
        {
            id: 2,
            name: 'Dr. Fatou Sow',
            departement: 'Génie Civil',
            email: 'fatou.sow@isi.edu',
            phone: '77 234 56 78',
            active: true,
            photo: 'https://randomuser.me/api/portraits/women/1.jpg',
            role: 'chief',
            title: 'Docteur en Génie Civil',
            joinDate: '15/05/2020',
            specialization: 'Matériaux de construction'
        },
        {
            id: 3,
            name: 'Dr. Ousmane Fall',
            departement: 'Management',
            email: 'ousmane.fall@isi.edu',
            phone: '77 345 67 89',
            active: false,
            photo: 'https://randomuser.me/api/portraits/men/2.jpg',
            role: 'chief',
            title: 'Docteur en Management',
            joinDate: '20/09/2020',
            specialization: 'Gestion des ressources humaines'
        },
        {
            id: 4,
            name: 'Dr. Marie Faye',
            departement: 'Électronique',
            email: 'marie.faye@isi.edu',
            phone: '77 456 78 90',
            active: true,
            photo: 'https://randomuser.me/api/portraits/women/2.jpg',
            role: 'chief',
            title: 'Docteur en Électronique',
            joinDate: '05/02/2021',
            specialization: 'Systèmes embarqués'
        },
        {
            id: 5,
            name: 'Dr. Ibrahima Ndiaye',
            departement: 'Mécanique',
            email: 'ibrahima.ndiaye@isi.edu',
            phone: '77 567 89 01',
            active: true,
            photo: 'https://randomuser.me/api/portraits/men/3.jpg',
            role: 'chief',
            title: 'Docteur en Mécanique',
            joinDate: '15/11/2021',
            specialization: 'Mécanique des fluides'
        },
        {
            id: 6,
            name: 'Aminata Diallo',
            departement: 'Informatique',
            email: 'aminata.diallo@isi.edu',
            phone: '77 678 90 12',
            active: true,
            photo: 'https://randomuser.me/api/portraits/women/3.jpg',
            role: 'secretary',
            title: 'Licence en Secrétariat',
            joinDate: '10/01/2020',
            specialization: 'Gestion administrative'
        },
        {
            id: 7,
            name: 'Mamadou Sarr',
            departement: 'Génie Civil',
            email: 'mamadou.sarr@isi.edu',
            phone: '77 789 01 23',
            active: true,
            photo: 'https://randomuser.me/api/portraits/men/4.jpg',
            role: 'secretary',
            title: 'BTS en Assistanat de Direction',
            joinDate: '20/02/2020',
            specialization: 'Coordination des projets'
        },
        {
            id: 8,
            name: 'Aïssatou Ba',
            departement: 'Management',
            email: 'aissatou.ba@isi.edu',
            phone: '77 890 12 34',
            active: false,
            photo: 'https://randomuser.me/api/portraits/women/4.jpg',
            role: 'secretary',
            title: 'Licence en Administration',
            joinDate: '15/03/2020',
            specialization: 'Communication interne'
        },
    ]);
    const title = role === 'chief' ? 'Chefs de département' : 'Secrétaires';
    // Filtrage par rôle
    const filteredStaff = staffMembers.filter(staff => staff.role === role);
    // États pour le modal de détails, la pagination et la recherche
    const [viewModal, setViewModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [staffToToggle, setStaffToToggle] = useState(null);
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [message, setMessage] = useState('');
    // Pagination
    const itemsPerPage = 4;
    // Filtrages multiples
    const filterStaff = () => {
        return filteredStaff.filter(staff => {
            // Filtre par recherche
            const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.departement.toLowerCase().includes(searchQuery.toLowerCase());
            // Filtre par département
            const matchesDepartment = departmentFilter === 'all' || staff.departement === departmentFilter;
            // Filtre par statut
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && staff.active) ||
                (statusFilter === 'inactive' && !staff.active);
            return matchesSearch && matchesDepartment && matchesStatus;
        });
    };
    const filteredResults = filterStaff();
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
    // Obtenir la liste unique des départements pour le filtre
    const departments = Array.from(new Set(filteredStaff.map(staff => staff.departement)));
    // Fonctions
    const handleView = (staff) => {
        setSelectedStaff(staff);
        setViewModal(true);
    };
    const handleMessageOpen = (staff) => {
        setSelectedStaff(staff);
        setMessageModalOpen(true);
    };
    const handleToggleConfirm = (staff) => {
        setStaffToToggle(staff);
        setConfirmModalOpen(true);
    };
    const toggleActive = () => {
        if (staffToToggle) {
            setStaffMembers(prevStaff => prevStaff.map(staff => staff.id === staffToToggle.id
                ? Object.assign(Object.assign({}, staff), { active: !staff.active }) : staff));
            setConfirmModalOpen(false);
            setStaffToToggle(null);
        }
    };
    const sendMessage = () => {
        if (message.trim() && selectedStaff) {
            // Simuler l'envoi du message
            console.log(`Message envoyé à ${selectedStaff.name}: ${message}`);
            // Réinitialiser et fermer
            setMessage('');
            setMessageModalOpen(false);
            setSelectedStaff(null);
            // Afficher une notification de succès (ici simulée par une alerte)
            alert(`Message envoyé à ${selectedStaff.name} avec succès !`);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: title }), _jsxs(Link, { to: "/staff/add", className: "btn-primary", children: [_jsx(FiPlusCircle, { className: "mr-2" }), " Ajouter ", role === 'chief' ? 'un chef' : 'une secrétaire'] })] }), _jsx("div", { className: "bg-white border border-gray-200 p-4 mb-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Rechercher...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" }), _jsx(FiSearch, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" })] }), _jsx("div", { children: _jsxs("select", { value: departmentFilter, onChange: (e) => setDepartmentFilter(e.target.value), className: "w-full pl-4 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", children: [_jsx("option", { value: "all", children: "Tous les d\u00E9partements" }), departments.map((dept, index) => (_jsx("option", { value: dept, children: dept }, index)))] }) }), _jsx("div", { children: _jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "w-full pl-4 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary", children: [_jsx("option", { value: "all", children: "Tous les statuts" }), _jsx("option", { value: "active", children: "Actifs" }), _jsx("option", { value: "inactive", children: "Bloqu\u00E9s" })] }) })] }) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "card", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Nom" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "D\u00E9partement" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Contact" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { scope: "col", className: "px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: currentItems.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-10 text-center text-gray-500", children: "Aucun membre du personnel trouv\u00E9." }) })) : (currentItems.map((staff) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10", children: _jsx("img", { className: "h-10 w-10 rounded-full object-cover", src: staff.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=random`, alt: staff.name, onError: (e) => {
                                                                    const target = e.target;
                                                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=random`;
                                                                } }) }), _jsxs("div", { className: "ml-4", children: [_jsx("div", { className: "font-medium text-gray-900", children: staff.name }), _jsx("div", { className: "text-xs text-gray-500", children: staff.title })] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-700", children: staff.departement }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsxs("div", { className: "flex items-center text-sm text-gray-700 mb-1", children: [_jsx(FiMail, { className: "mr-1 text-gray-400" }), _jsx("span", { children: staff.email })] }), _jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(FiPhone, { className: "mr-1 text-gray-400" }), _jsx("span", { children: staff.phone })] })] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: staff.active ? (_jsxs("span", { className: "px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-100 text-green-800", children: [_jsx(FiCheck, { className: "mr-1" }), " Actif"] })) : (_jsxs("span", { className: "px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-800", children: [_jsx(FiX, { className: "mr-1" }), " Bloqu\u00E9"] })) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-center", children: _jsxs("div", { className: "flex justify-center space-x-2", children: [_jsx("button", { onClick: () => handleMessageOpen(staff), className: "text-blue-600 hover:text-blue-800 bg-blue-100 p-1.5 rounded-full transition-colors duration-200", title: "Envoyer un message", children: _jsx(FiMessageSquare, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleView(staff), className: "text-white bg-primary p-1.5 rounded-full transition-colors duration-200 hover:bg-primary-700", title: "Consulter", children: _jsx(FiEye, { className: "h-5 w-5" }) }), _jsx(Link, { to: `/staff/edit/${staff.id}`, className: "text-indigo-600 hover:text-indigo-800 bg-indigo-100 p-1.5 rounded-full transition-colors duration-200", title: "Modifier", children: _jsx(FiEdit, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => handleToggleConfirm(staff), className: `p-1.5 rounded-full transition-colors duration-200 ${staff.active
                                                                ? 'text-red-600 hover:text-red-800 bg-red-100'
                                                                : 'text-green-600 hover:text-green-800 bg-green-100'}`, title: staff.active ? 'Bloquer' : 'Débloquer', children: staff.active ? (_jsx(FiToggleRight, { className: "h-5 w-5" })) : (_jsx(FiToggleLeft, { className: "h-5 w-5" })) })] }) })] }, staff.id)))) })] }) }), totalPages > 1 && (_jsxs("div", { className: "px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-500", children: ["Affichage de ", indexOfFirstItem + 1, " \u00E0 ", Math.min(indexOfLastItem, filteredResults.length), " sur ", filteredResults.length, " ", role === 'chief' ? 'chefs' : 'secrétaires'] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { onClick: () => setCurrentPage(prev => Math.max(prev - 1, 1)), disabled: currentPage === 1, className: `p-2 rounded-md ${currentPage === 1
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-gray-100'}`, children: _jsx(FiChevronLeft, { className: "h-5 w-5" }) }), [...Array(totalPages)].map((_, index) => (_jsx("button", { onClick: () => setCurrentPage(index + 1), className: `w-8 h-8 rounded-md ${currentPage === index + 1
                                            ? 'bg-primary text-white'
                                            : 'text-gray-600 hover:bg-gray-100'}`, children: index + 1 }, index))), _jsx("button", { onClick: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)), disabled: currentPage === totalPages, className: `p-2 rounded-md ${currentPage === totalPages
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-gray-100'}`, children: _jsx(FiChevronRight, { className: "h-5 w-5" }) })] })] }))] }), _jsx(AnimatePresence, { children: viewModal && selectedStaff && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { duration: 0.2 }, className: "bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4", children: [_jsxs("div", { className: "border-b p-4 flex justify-between items-center", children: [_jsx("h3", { className: "text-xl font-semibold text-navy", children: "D\u00E9tails du personnel" }), _jsx("button", { onClick: () => setViewModal(false), className: "text-gray-500 hover:text-gray-700", children: _jsx(FiX, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "p-4", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-start md:space-x-6 mb-6", children: [_jsx("div", { className: "flex-shrink-0 w-full md:w-1/3 flex justify-center mb-4 md:mb-0", children: _jsx("img", { src: selectedStaff.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff.name)}&size=200&background=random`, alt: selectedStaff.name, className: "h-40 w-40 rounded-full object-cover shadow-md", onError: (e) => {
                                                    const target = e.target;
                                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff.name)}&size=200&background=random`;
                                                } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: selectedStaff.name }), _jsx("p", { className: "text-gray-500 mt-1", children: selectedStaff.title }), _jsxs("div", { className: "mt-4 grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-gray-500 uppercase", children: "D\u00E9partement" }), _jsx("p", { className: "text-gray-800", children: selectedStaff.departement })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-gray-500 uppercase", children: "Statut" }), _jsx("div", { className: `inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${selectedStaff.active
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'}`, children: selectedStaff.active ? 'Actif' : 'Bloqué' })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-gray-500 uppercase", children: "Email" }), _jsx("p", { className: "text-gray-800", children: selectedStaff.email })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-gray-500 uppercase", children: "T\u00E9l\u00E9phone" }), _jsx("p", { className: "text-gray-800", children: selectedStaff.phone })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-gray-500 uppercase", children: "Date d'entr\u00E9e" }), _jsx("p", { className: "text-gray-800", children: selectedStaff.joinDate })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-gray-500 uppercase", children: "Sp\u00E9cialisation" }), _jsx("p", { className: "text-gray-800", children: selectedStaff.specialization })] })] })] })] }) }), _jsxs("div", { className: "border-t p-4 flex justify-end space-x-3", children: [_jsxs("button", { onClick: () => {
                                            setViewModal(false);
                                            handleMessageOpen(selectedStaff);
                                        }, className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center", children: [_jsx(FiMessageSquare, { className: "mr-2" }), " Envoyer un message"] }), _jsx("button", { onClick: () => setViewModal(false), className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50", children: "Fermer" })] })] }) })) }), _jsx(AnimatePresence, { children: confirmModalOpen && staffToToggle && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsx(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { duration: 0.2 }, className: "bg-white rounded-lg shadow-lg w-full max-w-md mx-4", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Confirmation" }), _jsxs("div", { className: "flex items-center mb-6", children: [_jsx("img", { src: staffToToggle.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(staffToToggle.name)}&background=random`, alt: staffToToggle.name, className: "h-12 w-12 rounded-full object-cover mr-4", onError: (e) => {
                                                const target = e.target;
                                                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staffToToggle.name)}&background=random`;
                                            } }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: staffToToggle.name }), _jsx("p", { className: "text-sm text-gray-500", children: staffToToggle.departement })] })] }), _jsx("p", { className: "text-gray-700 mb-6", children: staffToToggle.active
                                        ? `Êtes-vous sûr de vouloir bloquer ce membre du personnel ? Il ne pourra plus accéder au système.`
                                        : `Êtes-vous sûr de vouloir débloquer ce membre du personnel ? Cela lui redonnera accès au système.` }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx("button", { onClick: () => setConfirmModalOpen(false), className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50", children: "Annuler" }), _jsx("button", { onClick: toggleActive, className: `px-4 py-2 rounded-md text-white flex items-center ${staffToToggle.active
                                                ? 'bg-red-600 hover:bg-red-700'
                                                : 'bg-green-600 hover:bg-green-700'}`, children: staffToToggle.active
                                                ? _jsxs(_Fragment, { children: [_jsx(FiX, { className: "mr-2" }), " Bloquer"] })
                                                : _jsxs(_Fragment, { children: [_jsx(FiCheck, { className: "mr-2" }), " D\u00E9bloquer"] }) })] })] }) }) })) }), _jsx(AnimatePresence, { children: messageModalOpen && selectedStaff && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { duration: 0.2 }, className: "bg-white rounded-lg shadow-lg w-full max-w-md mx-4", children: [_jsxs("div", { className: "p-4 border-b border-gray-100 flex justify-between items-center", children: [_jsx("h3", { className: "text-lg font-semibold text-navy", children: "Envoyer un message" }), _jsx("button", { onClick: () => setMessageModalOpen(false), className: "text-gray-500 hover:text-gray-700", children: _jsx(FiX, { className: "h-5 w-5" }) })] }), _jsxs("div", { className: "p-4", children: [_jsxs("div", { className: "flex items-center mb-4", children: [_jsx("img", { src: selectedStaff.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff.name)}&background=random`, alt: selectedStaff.name, className: "h-10 w-10 rounded-full object-cover mr-3", onError: (e) => {
                                                    const target = e.target;
                                                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff.name)}&background=random`;
                                                } }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: selectedStaff.name }), _jsx("p", { className: "text-xs text-gray-500", children: selectedStaff.email })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "message", className: "block text-sm font-medium text-gray-700 mb-1", children: "Message" }), _jsx("textarea", { id: "message", rows: 5, value: message, onChange: (e) => setMessage(e.target.value), placeholder: "\u00C9crivez votre message ici...", className: "w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" })] })] }), _jsxs("div", { className: "p-4 border-t border-gray-100 flex justify-end space-x-3", children: [_jsx("button", { onClick: () => setMessageModalOpen(false), className: "px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50", children: "Annuler" }), _jsxs("button", { onClick: sendMessage, disabled: !message.trim(), className: `px-4 py-2 rounded-md text-white flex items-center ${message.trim()
                                            ? 'bg-primary hover:bg-primary-700'
                                            : 'bg-gray-300 cursor-not-allowed'}`, children: [_jsx(FiMessageSquare, { className: "mr-2" }), " Envoyer"] })] })] }) })) })] }));
};
export default StaffList;
