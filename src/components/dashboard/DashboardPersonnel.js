var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Users, FileText, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
const API_BASE_URL = 'http://localhost:3001/api';
export const DashboardPersonnel = () => {
    const [stats, setStats] = useState(null);
    const [activites, setActivites] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const [statsRes, activitesRes] = yield Promise.all([
                    fetch(`${API_BASE_URL}/personnel/stats`),
                    fetch(`${API_BASE_URL}/personnel/activites-recentes`)
                ]);
                const statsData = yield statsRes.json();
                const activitesData = yield activitesRes.json();
                console.log('📊 Stats:', statsData);
                console.log('📋 Activités:', activitesData);
                setStats(statsData);
                setActivites(activitesData);
            }
            catch (error) {
                console.error('Erreur chargement données:', error);
            }
            finally {
                setLoading(false);
            }
        });
        fetchData();
    }, []);
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "text-primary", children: "Chargement..." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white rounded-xl shadow-sm border border-primary/20 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Candidats Inscrits" }), _jsx("p", { className: "text-3xl font-bold text-primary mt-2", children: (stats === null || stats === void 0 ? void 0 : stats.totalCandidats) || 0 })] }), _jsx("div", { className: "p-3 bg-primary/10 rounded-lg", children: _jsx(Users, { className: "h-6 w-6 text-primary" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "bg-white rounded-xl shadow-sm border border-primary/20 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Dossiers en Cours" }), _jsx("p", { className: "text-3xl font-bold text-primary mt-2", children: (stats === null || stats === void 0 ? void 0 : stats.totalDossiers) || 0 })] }), _jsx("div", { className: "p-3 bg-primary/10 rounded-lg", children: _jsx(FileText, { className: "h-6 w-6 text-primary" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-white rounded-xl shadow-sm border border-primary/20 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Encadrants Actifs" }), _jsx("p", { className: "text-3xl font-bold text-primary mt-2", children: (stats === null || stats === void 0 ? void 0 : stats.encadrantsActifs) || 0 })] }), _jsx("div", { className: "p-3 bg-primary/10 rounded-lg", children: _jsx(UserCheck, { className: "h-6 w-6 text-primary" }) })] }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "bg-white rounded-xl shadow-sm border border-primary/20 p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Inscriptions R\u00E9centes" }), _jsxs("div", { className: "space-y-3", children: [activites === null || activites === void 0 ? void 0 : activites.dernieresInscriptions.map((inscription, idx) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-primary/5 rounded-lg", children: [_jsxs("div", { children: [_jsxs("p", { className: "font-medium text-gray-900", children: [inscription.prenom, " ", inscription.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: inscription.email })] }), _jsx("span", { className: "text-xs text-primary", children: formatDate(inscription.createdAt) })] }, idx))), (!(activites === null || activites === void 0 ? void 0 : activites.dernieresInscriptions) || activites.dernieresInscriptions.length === 0) && (_jsx("p", { className: "text-sm text-gray-500 text-center py-4", children: "Aucune inscription r\u00E9cente" }))] })] })] }));
};
export default DashboardPersonnel;
