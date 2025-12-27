import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
/**
 * Composant de section de recommandations simplifié
 * Version Netflix/TikTok : pas d'indicateurs visibles de recommandation
 * Les ressources apparaissent naturellement sans révéler qu'elles sont recommandées
 */
export const RecommendationSection = ({ recommendations, onResourceClick, isLoading = false }) => {
    if (isLoading) {
        return (_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [1, 2, 3, 4, 5, 6].map(i => (_jsx("div", { className: "animate-pulse", children: _jsx("div", { className: "h-32 bg-gray-200 rounded" }) }, i))) }) }));
    }
    if (recommendations.length === 0) {
        return null;
    }
    return (_jsx("div", { className: "bg-white border border-gray-200 p-6 mb-6", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: recommendations.map((recommendation, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, onClick: () => onResourceClick(recommendation.ressource), className: "bg-white border border-gray-200 p-4 cursor-pointer hover:shadow-lg transition-all group", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors", children: recommendation.ressource.titre }), _jsx("p", { className: "text-xs text-gray-600 mb-2 line-clamp-2", children: recommendation.ressource.description }), _jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-500", children: [recommendation.ressource.categorie && (_jsx("span", { className: "px-2 py-0.5 bg-gray-100 text-gray-700 rounded", children: recommendation.ressource.categorie })), recommendation.ressource.datePublication && (_jsx("span", { children: new Date(recommendation.ressource.datePublication).getFullYear() }))] }), _jsx("div", { className: "mt-2 opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx("span", { className: "text-xs text-blue-600 font-medium", children: "Cliquez pour consulter \u2192" }) })] }, recommendation.ressource.idRessource))) }) }));
};
export default RecommendationSection;
