var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Gavel, Award, CheckCircle, XCircle, Search } from 'lucide-react';
import { useAnneesAcademiques } from '../../../hooks/useAnneesAcademiques';
import { useAttributionsRoles, useAttribuerRole, useRetirerRole } from '../../../hooks/useAttributionsRoles';
import { mockProfesseurs } from '../../../models/acteurs/Professeur';
import { TypeRole, getLibelleRole } from '../../../models/services/AttributionRole';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
// Badge Component
const Badge = ({ children, variant = 'info' }) => {
    const styles = {
        success: "bg-primary-50 text-primary-700 border border-primary-200",
        warning: "bg-primary-100 text-primary-800 border border-primary-300",
        info: "bg-primary-50 text-primary-700 border border-primary-200",
        error: "bg-primary-100 text-primary-800 border border-primary-300"
    };
    return (_jsx("span", { className: `inline-flex px-2 py-1 text-xs font-medium rounded ${styles[variant]}`, children: children }));
};
// Simple Button Component
const SimpleButton = ({ children, variant = 'ghost', onClick, size = 'sm', disabled = false }) => {
    const styles = {
        primary: 'bg-primary text-white border border-primary hover:bg-primary-700 disabled:bg-primary-300',
        secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
        ghost: 'bg-transparent text-gray-600 border border-transparent hover:bg-gray-50',
        danger: 'bg-primary text-white border border-primary hover:bg-primary-700'
    };
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base'
    };
    return (_jsx("button", { onClick: onClick, disabled: disabled, className: `${styles[variant]} ${sizeStyles[size]} rounded font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50`, children: children }));
};
const RolesChef = () => {
    const { anneeActive } = useAnneesAcademiques();
    const { attributions } = useAttributionsRoles(anneeActive === null || anneeActive === void 0 ? void 0 : anneeActive.code);
    const { attribuerRole } = useAttribuerRole();
    const { retirerRole } = useRetirerRole();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('ALL');
    // Filtrer les professeurs par recherche
    const professeursFiltres = mockProfesseurs.filter(prof => {
        var _a;
        const matchSearch = searchQuery === '' ||
            prof.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prof.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prof.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ((_a = prof.specialite) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchSearch;
    });
    // Obtenir les rôles d'un professeur pour l'année active
    const getRolesProfesseur = (idProfesseur) => {
        if (!anneeActive)
            return [];
        return attributions.filter(a => a.professeur.idProfesseur === idProfesseur && a.estActif);
    };
    // Vérifier si un professeur a un rôle spécifique
    const hasRole = (idProfesseur, typeRole) => {
        const roles = getRolesProfesseur(idProfesseur);
        return roles.some(r => r.typeRole === typeRole);
    };
    // Handler pour attribuer un rôle
    const handleAttribuerRole = (idProfesseur, typeRole) => __awaiter(void 0, void 0, void 0, function* () {
        if (!anneeActive)
            return;
        if (confirm(`Êtes-vous sûr de vouloir attribuer le rôle "${getLibelleRole(typeRole)}" à ce professeur ?`)) {
            yield attribuerRole(idProfesseur, typeRole, anneeActive.code, 2); // 2 = idChefDepartement
            window.location.reload();
        }
    });
    // Handler pour retirer un rôle
    const handleRetirerRole = (idProfesseur, typeRole) => __awaiter(void 0, void 0, void 0, function* () {
        if (!anneeActive)
            return;
        const attribution = attributions.find(a => a.professeur.idProfesseur === idProfesseur && a.typeRole === typeRole && a.estActif);
        if (!attribution)
            return;
        if (confirm(`Êtes-vous sûr de vouloir retirer le rôle "${getLibelleRole(typeRole)}" à ce professeur ?`)) {
            yield retirerRole(attribution.idAttribution);
            window.location.reload();
        }
    });
    // Icône pour chaque type de rôle
    const getRoleIcon = (typeRole) => {
        switch (typeRole) {
            case TypeRole.COMMISSION:
                return _jsx(Shield, { className: "h-4 w-4" });
            case TypeRole.JURIE:
                return _jsx(Gavel, { className: "h-4 w-4" });
            case TypeRole.PRESIDENT_JURY_POSSIBLE:
                return _jsx(Award, { className: "h-4 w-4" });
        }
    };
    // Statistiques
    const stats = {
        commission: attributions.filter(a => a.typeRole === TypeRole.COMMISSION && a.estActif).length,
        president: attributions.filter(a => a.typeRole === TypeRole.PRESIDENT_JURY_POSSIBLE && a.estActif).length
    };
    return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Gestion des R\u00F4les" }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["Attribuez des r\u00F4les aux professeurs pour l'ann\u00E9e acad\u00E9mique ", (anneeActive === null || anneeActive === void 0 ? void 0 : anneeActive.code) || 'en cours'] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Membres Commission" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.commission })] }), _jsx("div", { className: "bg-primary-100 p-3 rounded-lg", children: _jsx(Shield, { className: "h-8 w-8 text-primary" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Possibles Pr\u00E9sidents" }), _jsx("p", { className: "text-3xl font-bold text-gray-900 mt-2", children: stats.president })] }), _jsx("div", { className: "bg-primary-200 p-3 rounded-lg", children: _jsx(Award, { className: "h-8 w-8 text-primary-700" }) })] }) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "bg-white rounded-lg shadow p-6", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { type: "text", placeholder: "Rechercher un professeur...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" })] }), _jsxs("select", { value: selectedRole, onChange: (e) => setSelectedRole(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent", children: [_jsx("option", { value: "ALL", children: "Tous les r\u00F4les" }), _jsx("option", { value: TypeRole.COMMISSION, children: "Membres Commission" }), _jsx("option", { value: TypeRole.PRESIDENT_JURY_POSSIBLE, children: "Possibles Pr\u00E9sidents" })] })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "bg-white rounded-lg shadow overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Professeur" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Grade / Sp\u00E9cialit\u00E9" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "R\u00F4les Actuels" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: professeursFiltres.map((professeur) => {
                                    const roles = getRolesProfesseur(professeur.idProfesseur);
                                    // Filtrer par rôle sélectionné
                                    if (selectedRole !== 'ALL' && !hasRole(professeur.idProfesseur, selectedRole)) {
                                        return null;
                                    }
                                    return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center", children: _jsxs("span", { className: "text-primary font-medium", children: [professeur.prenom[0], professeur.nom[0]] }) }), _jsxs("div", { className: "ml-4", children: [_jsxs("div", { className: "text-sm font-medium text-gray-900", children: [professeur.prenom, " ", professeur.nom] }), _jsx("div", { className: "text-sm text-gray-500", children: professeur.email })] })] }) }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap", children: [_jsx("div", { className: "text-sm text-gray-900", children: professeur.grade }), _jsx("div", { className: "text-sm text-gray-500", children: professeur.specialite })] }), _jsx("td", { className: "px-6 py-4", children: _jsx("div", { className: "flex flex-wrap gap-2", children: roles.length === 0 ? (_jsx("span", { className: "text-sm text-gray-400", children: "Aucun r\u00F4le" })) : (roles.map((role) => (_jsxs(Badge, { variant: "info", children: [getRoleIcon(role.typeRole), _jsx("span", { className: "ml-1", children: getLibelleRole(role.typeRole) })] }, role.idAttribution)))) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs(Select, { onValueChange: (value) => {
                                                        if (value === 'AUCUN') {
                                                            // Retirer tous les rôles
                                                            roles.forEach(role => {
                                                                handleRetirerRole(professeur.idProfesseur, role.typeRole);
                                                            });
                                                        }
                                                        else {
                                                            const typeRole = value;
                                                            if (hasRole(professeur.idProfesseur, typeRole)) {
                                                                handleRetirerRole(professeur.idProfesseur, typeRole);
                                                            }
                                                            else {
                                                                handleAttribuerRole(professeur.idProfesseur, typeRole);
                                                            }
                                                        }
                                                    }, children: [_jsx(SelectTrigger, { className: "w-[240px]", children: _jsx(SelectValue, { placeholder: "G\u00E9rer les r\u00F4les", children: roles.length === 0
                                                                    ? 'Aucun rôle - Cliquez pour ajouter'
                                                                    : roles.length === 1
                                                                        ? getLibelleRole(roles[0].typeRole)
                                                                        : `${roles.length} rôles` }) }), _jsxs(SelectContent, { children: [roles.length > 0 && (_jsx(SelectItem, { value: "AUCUN", children: _jsxs("span", { className: "flex items-center gap-2", children: [_jsx(XCircle, { className: "h-4 w-4 text-primary" }), "Retirer tous les r\u00F4les"] }) })), _jsx(SelectItem, { value: TypeRole.COMMISSION, children: _jsx("span", { className: "flex items-center gap-2", children: hasRole(professeur.idProfesseur, TypeRole.COMMISSION) ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "h-4 w-4 text-primary" }), _jsx("span", { className: "line-through", children: getLibelleRole(TypeRole.COMMISSION) }), _jsx("span", { className: "text-xs text-gray-500 ml-2", children: "(Retirer)" })] })) : (_jsxs(_Fragment, { children: [_jsx(Shield, { className: "h-4 w-4 text-primary" }), getLibelleRole(TypeRole.COMMISSION), _jsx("span", { className: "text-xs text-gray-500 ml-2", children: "(Ajouter)" })] })) }) }), _jsx(SelectItem, { value: TypeRole.PRESIDENT_JURY_POSSIBLE, children: _jsx("span", { className: "flex items-center gap-2", children: hasRole(professeur.idProfesseur, TypeRole.PRESIDENT_JURY_POSSIBLE) ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "h-4 w-4 text-primary" }), _jsx("span", { className: "line-through", children: getLibelleRole(TypeRole.PRESIDENT_JURY_POSSIBLE) }), _jsx("span", { className: "text-xs text-gray-500 ml-2", children: "(Retirer)" })] })) : (_jsxs(_Fragment, { children: [_jsx(Award, { className: "h-4 w-4 text-primary" }), getLibelleRole(TypeRole.PRESIDENT_JURY_POSSIBLE), _jsx("span", { className: "text-xs text-gray-500 ml-2", children: "(Ajouter)" })] })) }) })] })] }) })] }, professeur.idProfesseur));
                                }) })] }) }) })] }));
};
export default RolesChef;
