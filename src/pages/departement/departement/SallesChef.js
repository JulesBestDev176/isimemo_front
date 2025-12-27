import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Building, Users, CheckCircle, XCircle, Archive, Filter, X } from 'lucide-react';
import { mockSalles } from '../../../models/infrastructure/Salle';
// Badge Component
const Badge = ({ children, variant = 'neutral' }) => {
    const styles = {
        success: "bg-green-50 text-green-700 border border-green-200",
        error: "bg-gray-100 text-gray-700 border border-gray-200",
        neutral: "bg-gray-50 text-gray-600 border border-gray-200"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded ${styles[variant]}`, children: children }));
};
// Simple Button Component
const SimpleButton = ({ children, variant = 'ghost', onClick, size = 'sm', disabled = false, icon, type = 'button' }) => {
    const styles = {
        primary: 'bg-navy text-white border border-navy hover:bg-navy-dark disabled:bg-gray-300',
        secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
        ghost: 'bg-transparent text-gray-600 border border-transparent hover:bg-gray-50'
    };
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base'
    };
    return (_jsxs("button", { type: type, onClick: onClick, disabled: disabled, className: `${styles[variant]} ${sizeStyles[size]} rounded font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex items-center`, children: [icon && _jsx("span", { className: "mr-2", children: icon }), children] }));
};
const SallesChef = () => {
    const [salles, setSalles] = useState(mockSalles);
    const [searchQuery, setSearchQuery] = useState('');
    const [batimentFilter, setBatimentFilter] = useState('all');
    const [showArchived, setShowArchived] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [selectedSalle, setSelectedSalle] = useState(null);
    // Form state for new/edit salle
    const [formData, setFormData] = useState({
        nom: '',
        batiment: '',
        capacite: 0,
        equipements: []
    });
    // Filtrer les salles
    const sallesFiltrees = salles.filter(salle => {
        const matchSearch = searchQuery === '' ||
            salle.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            salle.batiment.toLowerCase().includes(searchQuery.toLowerCase());
        const matchBatiment = batimentFilter === 'all' || salle.batiment === batimentFilter;
        const matchArchived = showArchived || !salle.estArchive;
        return matchSearch && matchBatiment && matchArchived;
    });
    // Obtenir la liste des bâtiments uniques
    const batiments = Array.from(new Set(salles.map(s => s.batiment)));
    // Statistiques
    const stats = {
        total: salles.filter(s => !s.estArchive).length,
        actives: salles.filter(s => s.estDisponible && !s.estArchive).length,
        desactivees: salles.filter(s => !s.estDisponible && !s.estArchive).length,
        capaciteTotale: salles.filter(s => !s.estArchive).reduce((sum, s) => sum + s.capacite, 0)
    };
    // Handlers
    const handleToggleActivation = (idSalle) => {
        setSalles(salles.map(s => s.idSalle === idSalle ? Object.assign(Object.assign({}, s), { estDisponible: !s.estDisponible }) : s));
    };
    const handleArchiver = (idSalle) => {
        if (confirm('Êtes-vous sûr de vouloir archiver cette salle ?')) {
            setSalles(salles.map(s => s.idSalle === idSalle ? Object.assign(Object.assign({}, s), { estArchive: true, estDisponible: false }) : s));
        }
    };
    const handleDesarchiver = (idSalle) => {
        setSalles(salles.map(s => s.idSalle === idSalle ? Object.assign(Object.assign({}, s), { estArchive: false }) : s));
    };
    const handleEdit = (salle) => {
        setSelectedSalle(salle);
        setFormData({
            nom: salle.nom,
            batiment: salle.batiment,
            capacite: salle.capacite,
            equipements: salle.equipements || []
        });
        setShowModalEdit(true);
    };
    const handleAddSalle = (e) => {
        e.preventDefault();
        const newSalle = {
            idSalle: Math.max(...salles.map(s => s.idSalle)) + 1,
            nom: formData.nom,
            batiment: formData.batiment,
            capacite: formData.capacite,
            equipements: formData.equipements,
            estDisponible: true,
            estArchive: false
        };
        setSalles([...salles, newSalle]);
        setShowModalAdd(false);
        resetForm();
    };
    const handleUpdateSalle = (e) => {
        e.preventDefault();
        if (!selectedSalle)
            return;
        setSalles(salles.map(s => s.idSalle === selectedSalle.idSalle
            ? Object.assign(Object.assign({}, s), formData) : s));
        setShowModalEdit(false);
        resetForm();
    };
    const resetForm = () => {
        setFormData({
            nom: '',
            batiment: '',
            capacite: 0,
            equipements: []
        });
        setSelectedSalle(null);
    };
    return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-navy", children: "Gestion des Salles" }), _jsx("p", { className: "text-gray-600 mt-1", children: "G\u00E9rez les salles de soutenance du d\u00E9partement" })] }), _jsx(SimpleButton, { variant: "primary", onClick: () => setShowModalAdd(true), icon: _jsx(Plus, { className: "h-4 w-4" }), children: "Nouvelle Salle" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Salles" }), _jsx("p", { className: "text-3xl font-bold text-navy mt-2", children: stats.total })] }), _jsx("div", { className: "bg-gray-100 p-3 rounded-lg", children: _jsx(Building, { className: "h-8 w-8 text-navy" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Activ\u00E9es" }), _jsx("p", { className: "text-3xl font-bold text-green-600 mt-2", children: stats.actives })] }), _jsx("div", { className: "bg-green-50 p-3 rounded-lg", children: _jsx(CheckCircle, { className: "h-8 w-8 text-green-600" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "D\u00E9sactiv\u00E9es" }), _jsx("p", { className: "text-3xl font-bold text-gray-600 mt-2", children: stats.desactivees })] }), _jsx("div", { className: "bg-gray-100 p-3 rounded-lg", children: _jsx(XCircle, { className: "h-8 w-8 text-gray-600" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Capacit\u00E9 Totale" }), _jsx("p", { className: "text-3xl font-bold text-navy mt-2", children: stats.capaciteTotale })] }), _jsx("div", { className: "bg-gray-100 p-3 rounded-lg", children: _jsx(Users, { className: "h-8 w-8 text-navy" }) })] }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("h2", { className: "text-xl font-bold text-navy flex items-center", children: [_jsx(Filter, { className: "h-6 w-6 mr-2 text-navy" }), "Filtres et Recherche"] }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", id: "showArchived", checked: showArchived, onChange: (e) => setShowArchived(e.target.checked), className: "mr-2" }), _jsx("label", { htmlFor: "showArchived", className: "text-sm text-gray-600", children: "Afficher archiv\u00E9es" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Rechercher une salle...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent" })] }), _jsxs("select", { value: batimentFilter, onChange: (e) => setBatimentFilter(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent", children: [_jsx("option", { value: "all", children: "Tous les b\u00E2timents" }), batiments.map(bat => (_jsx("option", { value: bat, children: bat }, bat)))] })] })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.5 }, className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Salle" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "B\u00E2timent" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Capacit\u00E9" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: sallesFiltrees.map((salle, index) => (_jsxs(motion.tr, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Building, { className: "h-5 w-5 text-navy mr-2" }), _jsx("span", { className: "text-sm font-medium text-gray-900", children: salle.nom })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: "text-sm text-gray-900", children: salle.batiment }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Users, { className: "h-4 w-4 text-gray-400 mr-1" }), _jsxs("span", { className: "text-sm text-gray-900", children: [salle.capacite, " places"] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "flex gap-2", children: salle.estArchive ? (_jsxs(Badge, { variant: "error", children: [_jsx(Archive, { className: "h-3 w-3 inline mr-1" }), "Archiv\u00E9e"] })) : salle.estDisponible ? (_jsxs(Badge, { variant: "success", children: [_jsx(CheckCircle, { className: "h-3 w-3 inline mr-1" }), "Activ\u00E9e"] })) : (_jsxs(Badge, { variant: "error", children: [_jsx(XCircle, { className: "h-3 w-3 inline mr-1" }), "D\u00E9sactiv\u00E9e"] })) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsxs("div", { className: "flex justify-end gap-2", children: [!salle.estArchive && (_jsxs(_Fragment, { children: [_jsx(SimpleButton, { variant: "ghost", size: "sm", onClick: () => handleToggleActivation(salle.idSalle), children: salle.estDisponible ? 'Désactiver' : 'Activer' }), _jsx(SimpleButton, { variant: "ghost", size: "sm", onClick: () => handleEdit(salle), icon: _jsx(Edit, { className: "h-4 w-4" }), children: "Modifier" }), _jsx(SimpleButton, { variant: "secondary", size: "sm", onClick: () => handleArchiver(salle.idSalle), icon: _jsx(Archive, { className: "h-4 w-4" }), children: "Archiver" })] })), salle.estArchive && (_jsx(SimpleButton, { variant: "secondary", size: "sm", onClick: () => handleDesarchiver(salle.idSalle), children: "D\u00E9sarchiver" }))] }) })] }, salle.idSalle))) })] }) }), sallesFiltrees.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Building, { className: "h-16 w-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Aucune salle trouv\u00E9e" }), _jsx("p", { className: "text-gray-600", children: "Modifiez vos filtres ou ajoutez une nouvelle salle" })] }))] }), showModalAdd && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-bold text-navy", children: "Nouvelle Salle" }), _jsx("button", { onClick: () => { setShowModalAdd(false); resetForm(); }, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("form", { onSubmit: handleAddSalle, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom de la salle" }), _jsx("input", { type: "text", required: true, value: formData.nom, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { nom: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent", placeholder: "Ex: Amphi A" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "B\u00E2timent" }), _jsx("input", { type: "text", required: true, value: formData.batiment, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { batiment: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent", placeholder: "Ex: B\u00E2timent Principal" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Capacit\u00E9" }), _jsx("input", { type: "number", required: true, min: "1", value: formData.capacite, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { capacite: Number(e.target.value) })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent", placeholder: "Ex: 50" })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx(SimpleButton, { variant: "secondary", onClick: () => { setShowModalAdd(false); resetForm(); }, children: "Annuler" }), _jsx(SimpleButton, { variant: "primary", type: "submit", children: "Cr\u00E9er" })] })] })] }) })), showModalEdit && selectedSalle && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h2", { className: "text-xl font-bold text-navy", children: "Modifier la Salle" }), _jsx("button", { onClick: () => { setShowModalEdit(false); resetForm(); }, className: "text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "h-6 w-6" }) })] }), _jsxs("form", { onSubmit: handleUpdateSalle, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nom de la salle" }), _jsx("input", { type: "text", required: true, value: formData.nom, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { nom: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "B\u00E2timent" }), _jsx("input", { type: "text", required: true, value: formData.batiment, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { batiment: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Capacit\u00E9" }), _jsx("input", { type: "number", required: true, min: "1", value: formData.capacite, onChange: (e) => setFormData(Object.assign(Object.assign({}, formData), { capacite: Number(e.target.value) })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent" })] }), _jsxs("div", { className: "flex justify-end gap-3 mt-6", children: [_jsx(SimpleButton, { variant: "secondary", onClick: () => { setShowModalEdit(false); resetForm(); }, children: "Annuler" }), _jsx(SimpleButton, { variant: "primary", type: "submit", children: "Enregistrer" })] })] })] }) }))] }));
};
export default SallesChef;
