import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiPlusCircle, FiCheck, FiX, FiEye, FiToggleLeft, FiToggleRight, FiX as FiClose } from 'react-icons/fi';
const ClassroomsList = () => {
    const navigate = useNavigate();
    // État pour les salles de classe
    const [classrooms, setClassrooms] = useState([
        {
            id: 1,
            name: 'Salle 101',
            capacity: 30,
            building: 'Bâtiment A',
            floor: '1er étage',
            active: true,
            description: 'Salle de cours standard avec vue sur le jardin.',
            equipments: {
                projector: true,
                computer: true,
                whiteboard: true,
                airConditioner: false
            }
        },
        {
            id: 2,
            name: 'Salle 102',
            capacity: 25,
            building: 'Bâtiment A',
            floor: '1er étage',
            active: true,
            description: 'Petite salle de cours idéale pour les travaux pratiques.',
            equipments: {
                projector: true,
                computer: false,
                whiteboard: true,
                airConditioner: false
            }
        },
        {
            id: 3,
            name: 'Salle 201',
            capacity: 40,
            building: 'Bâtiment B',
            floor: '2ème étage',
            active: false,
            description: 'Grande salle actuellement en rénovation.',
            equipments: {
                projector: false,
                computer: false,
                whiteboard: true,
                airConditioner: true
            }
        },
        {
            id: 4,
            name: 'Amphithéâtre',
            capacity: 120,
            building: 'Bâtiment C',
            floor: 'Rez-de-chaussée',
            active: true,
            description: 'Grand amphithéâtre pour les conférences et cours magistraux.',
            equipments: {
                projector: true,
                computer: true,
                whiteboard: true,
                airConditioner: true
            }
        },
        {
            id: 5,
            name: 'Laboratoire Info',
            capacity: 20,
            building: 'Bâtiment A',
            floor: '3ème étage',
            active: true,
            description: 'Laboratoire informatique avec 20 postes de travail.',
            equipments: {
                projector: true,
                computer: true,
                whiteboard: true,
                airConditioner: true
            }
        },
    ]);
    // État pour le modal de consultation
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    // Fonction pour basculer l'état actif d'une salle
    const toggleActive = (id) => {
        setClassrooms(prevClassrooms => prevClassrooms.map(classroom => classroom.id === id
            ? Object.assign(Object.assign({}, classroom), { active: !classroom.active }) : classroom));
    };
    // Fonction pour ouvrir le modal de consultation
    const openViewModal = (classroom) => {
        setSelectedClassroom(classroom);
        setIsViewModalOpen(true);
    };
    // Fonction pour fermer le modal
    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedClassroom(null);
    };
    // Fonction pour gérer la modification d'une salle
    const editClassroom = (classroom) => {
        // Rediriger vers le formulaire d'ajout avec les données de la salle
        navigate(`/classrooms/add`, { state: { classroom } });
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-primary", children: "Salles de classe" }), _jsxs(Link, { to: "/classrooms/add", className: "btn-primary", children: [_jsx(FiPlusCircle, { className: "mr-2 text-white" }), " Ajouter une salle"] })] }), _jsxs("div", { className: "card", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-secondary", children: _jsxs("tr", { children: [_jsx("th", { scope: "col", className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Salle" }), _jsx("th", { scope: "col", className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Capacit\u00E9" }), _jsx("th", { scope: "col", className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Localisation" }), _jsx("th", { scope: "col", className: "px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { scope: "col", className: "px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: classrooms.map((classroom) => (_jsxs("tr", { className: "hover:bg-secondary transition-colors duration-150", children: [_jsx("td", { className: "px-6 py-5 whitespace-nowrap", children: _jsx("div", { className: "font-medium text-gray-900", children: classroom.name }) }), _jsx("td", { className: "px-6 py-5 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "inline-flex items-center justify-center h-6 w-8 rounded-md bg-primary bg-opacity-10 text-white text-sm font-medium mr-2", children: classroom.capacity }), _jsx("span", { className: "text-sm text-gray-600", children: "places" })] }) }), _jsxs("td", { className: "px-6 py-5 whitespace-nowrap", children: [_jsx("div", { className: "text-sm text-gray-700 font-medium", children: classroom.building }), _jsx("div", { className: "text-sm text-gray-500", children: classroom.floor })] }), _jsx("td", { className: "px-6 py-5 whitespace-nowrap", children: classroom.active ? (_jsxs("span", { className: "px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-green-100 text-green-800", children: [_jsx(FiCheck, { className: "mr-1" }), " Active"] })) : (_jsxs("span", { className: "px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-red-100 text-red-800", children: [_jsx(FiX, { className: "mr-1" }), " Inactive"] })) }), _jsx("td", { className: "px-6 py-5 whitespace-nowrap text-right", children: _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx("button", { onClick: () => openViewModal(classroom), className: "text-gray-600 hover:text-gray-900 bg-secondary hover:bg-accent p-2 rounded-lg transition-colors duration-200", title: "Consulter", children: _jsx(FiEye, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => editClassroom(classroom), className: "text-white hover:text-white bg-primary hover:bg-primary-700 p-2 rounded-lg transition-colors duration-200", title: "Modifier", children: _jsx(FiEdit, { className: "h-5 w-5" }) }), _jsx("button", { onClick: () => toggleActive(classroom.id), className: `p-2 rounded-lg transition-colors duration-200 ${classroom.active
                                                                ? 'text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200'
                                                                : 'text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200'}`, title: classroom.active ? "Désactiver" : "Activer", children: classroom.active ? (_jsx(FiToggleRight, { className: "h-5 w-5" })) : (_jsx(FiToggleLeft, { className: "h-5 w-5" })) })] }) })] }, classroom.id))) })] }) }), classrooms.length === 0 && (_jsxs("div", { className: "text-center py-8", children: [_jsx("p", { className: "text-gray-500", children: "Aucune salle de classe disponible" }), _jsx(Link, { to: "/classrooms/add", className: "text-primary hover:text-primary-700 font-medium mt-2 inline-block", children: "Ajouter une nouvelle salle" })] }))] }), isViewModalOpen && selectedClassroom && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-3xl", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b", children: [_jsx("h2", { className: "text-xl font-bold text-primary", children: selectedClassroom.name }), _jsx("button", { onClick: closeViewModal, className: "text-gray-500 hover:text-gray-700 transition-colors duration-200", children: _jsx(FiClose, { className: "h-6 w-6" }) })] }), _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex flex-wrap -mx-2", children: [_jsx("div", { className: "w-full md:w-1/2 px-2 mb-4", children: _jsxs("div", { className: "bg-secondary bg-opacity-30 p-4 rounded-lg h-full", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-1", children: "Informations g\u00E9n\u00E9rales" }), _jsxs("div", { className: "space-y-3 mt-3", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500", children: "Capacit\u00E9" }), _jsxs("div", { className: "flex items-center mt-1", children: [_jsx("span", { className: "inline-flex items-center justify-center h-6 w-10 rounded-md bg-primary text-white text-sm font-medium mr-2", children: selectedClassroom.capacity }), _jsx("span", { className: "text-sm text-gray-600", children: "places" })] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500", children: "Statut" }), _jsx("div", { className: "mt-1", children: selectedClassroom.active ? (_jsxs("span", { className: "px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full bg-green-100 text-green-800", children: [_jsx(FiCheck, { className: "mr-1" }), " Active"] })) : (_jsxs("span", { className: "px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full bg-red-100 text-red-800", children: [_jsx(FiX, { className: "mr-1" }), " Inactive"] })) })] })] })] }) }), _jsx("div", { className: "w-full md:w-1/2 px-2 mb-4", children: _jsxs("div", { className: "bg-secondary bg-opacity-30 p-4 rounded-lg h-full", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-1", children: "Localisation" }), _jsxs("div", { className: "space-y-3 mt-3", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500", children: "B\u00E2timent" }), _jsx("p", { className: "text-base font-medium mt-1", children: selectedClassroom.building })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500", children: "\u00C9tage" }), _jsx("p", { className: "text-base font-medium mt-1", children: selectedClassroom.floor })] })] })] }) }), selectedClassroom.description && (_jsx("div", { className: "w-full px-2 mb-4", children: _jsxs("div", { className: "bg-secondary bg-opacity-30 p-4 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-1", children: "Description" }), _jsx("p", { className: "text-gray-700 mt-2", children: selectedClassroom.description })] }) })), selectedClassroom.equipments && (_jsx("div", { className: "w-full px-2", children: _jsxs("div", { className: "bg-secondary bg-opacity-30 p-4 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-gray-500 mb-3", children: "\u00C9quipements" }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mt-2", children: [_jsxs("div", { className: `flex items-center p-3 rounded-md ${selectedClassroom.equipments.projector ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`, children: [_jsx("span", { className: "mr-2", children: selectedClassroom.equipments.projector ? '✓' : '✗' }), _jsx("span", { children: "Projecteur" })] }), _jsxs("div", { className: `flex items-center p-3 rounded-md ${selectedClassroom.equipments.computer ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`, children: [_jsx("span", { className: "mr-2", children: selectedClassroom.equipments.computer ? '✓' : '✗' }), _jsx("span", { children: "Ordinateur" })] }), _jsxs("div", { className: `flex items-center p-3 rounded-md ${selectedClassroom.equipments.whiteboard ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`, children: [_jsx("span", { className: "mr-2", children: selectedClassroom.equipments.whiteboard ? '✓' : '✗' }), _jsx("span", { children: "Tableau blanc" })] }), _jsxs("div", { className: `flex items-center p-3 rounded-md ${selectedClassroom.equipments.airConditioner ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`, children: [_jsx("span", { className: "mr-2", children: selectedClassroom.equipments.airConditioner ? '✓' : '✗' }), _jsx("span", { children: "Climatiseur" })] })] })] }) }))] }) }), _jsxs("div", { className: "flex justify-end p-4 border-t bg-secondary bg-opacity-20", children: [_jsxs("button", { onClick: () => {
                                        closeViewModal();
                                        editClassroom(selectedClassroom);
                                    }, className: "btn-primary mr-3", children: [_jsx(FiEdit, { className: "mr-2 text-white" }), " Modifier"] }), _jsx("button", { onClick: closeViewModal, className: "btn-outline", children: "Fermer" })] })] }) }))] }));
};
export default ClassroomsList;
