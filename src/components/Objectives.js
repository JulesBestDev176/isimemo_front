import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
const objectives = [
    {
        title: 'Digitalisation',
        description: 'Digitaliser et centraliser l\'ensemble du processus de gestion des mémoires',
        icon: 'cloud_upload',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        title: 'Efficacité administrative',
        description: 'Réduire la charge administrative pour les départements et le personnel académique',
        icon: 'speed',
        color: 'bg-green-100 text-green-600'
    },
    {
        title: 'Expérience utilisateur',
        description: 'Améliorer l\'expérience des étudiants et encadreurs grâce à un suivi transparent',
        icon: 'people',
        color: 'bg-amber-100 text-amber-600'
    },
    {
        title: 'Bibliothèque numérique',
        description: 'Créer une bibliothèque numérique intelligente des mémoires passés',
        icon: 'menu_book',
        color: 'bg-purple-100 text-purple-600'
    },
    {
        title: 'Intelligence artificielle',
        description: 'Intégrer des fonctionnalités d\'IA pour l\'analyse et la validation des contenus',
        icon: 'psychology',
        color: 'bg-red-100 text-red-600'
    }
];
const Objectives = () => {
    return (_jsx("section", { className: "section bg-gradient-to-br from-gray-50 to-white py-20", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "text-center max-w-3xl mx-auto mb-16", children: [_jsx("h2", { className: "text-3xl font-bold mb-4 text-navy", children: "Nos Objectifs" }), _jsx("div", { className: "w-20 h-1 bg-gradient-to-r from-primary-300 to-primary rounded-full mx-auto mb-6" }), _jsx("p", { className: "text-lg text-navy-700", children: "ISIMemo vise \u00E0 r\u00E9volutionner la gestion des m\u00E9moires acad\u00E9miques gr\u00E2ce \u00E0 une approche innovante et technologique." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: objectives.map((objective, index) => (_jsx(motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5, delay: index * 0.1 }, whileHover: { y: -10, transition: { duration: 0.3 } }, children: _jsx(Card, { className: "h-full border-none shadow-lg hover:shadow-xl transition-shadow", children: _jsxs(CardContent, { className: "p-6", children: [_jsx("div", { className: `w-14 h-14 rounded-full ${objective.color} flex items-center justify-center mb-4`, children: _jsx("span", { className: "material-icons text-2xl", children: objective.icon }) }), _jsx("h3", { className: "text-xl font-bold mb-3 text-navy-800", children: objective.title }), _jsx("p", { className: "text-navy-700", children: objective.description })] }) }) }, index))) })] }) }));
};
export default Objectives;
