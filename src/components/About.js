import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
const About = () => {
    return (_jsx("section", { className: "section bg-gradient-to-br from-primary-50 to-blue-50", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -50 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.8 }, className: "space-y-6", children: [_jsx("h2", { className: "text-3xl font-bold text-navy", children: "Notre Plateforme" }), _jsx("p", { className: "text-lg text-navy-800", children: "ISIMemo est n\u00E9e d'une vision claire : num\u00E9riser, centraliser et optimiser la gestion des m\u00E9moires \u00E0 l'ISI." }), _jsx("p", { className: "text-navy-700", children: "Notre plateforme combine technologie de pointe et intelligence artificielle pour offrir une exp\u00E9rience utilisateur sans pr\u00E9c\u00E9dent. Gr\u00E2ce \u00E0 nos algorithmes avanc\u00E9s, nous facilitons la recherche, la consultation et la soumission des m\u00E9moires acad\u00E9miques." }), _jsx("p", { className: "text-navy-700", children: "L'innovation est au c\u0153ur de notre d\u00E9marche. Nous utilisons les derni\u00E8res avanc\u00E9es en mati\u00E8re d'IA pour analyser la pertinence des sujets, recommander des encadreurs, d\u00E9tecter le plagiat et indexer s\u00E9mantiquement les contenus." }), _jsx("div", { className: "pt-4", children: _jsxs(motion.button, { className: "btn-primary gap-2", whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: [_jsx("span", { className: "material-icons", children: "info" }), "En savoir plus"] }) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.8, delay: 0.3 }, className: "bg-white p-8 rounded-xl shadow-xl", children: _jsxs("div", { className: "space-y-6", children: [_jsx("h3", { className: "text-2xl font-bold text-navy border-b border-primary-100 pb-4", children: "Objectifs de notre plateforme" }), [
                                {
                                    title: 'Centralisation',
                                    desc: 'Regrouper tous les mémoires académiques en un seul endroit sécurisé et accessible.',
                                    icon: 'hub'
                                },
                                {
                                    title: 'Innovation',
                                    desc: 'Apporter des solutions technologiques avancées pour la gestion des travaux académiques.',
                                    icon: 'lightbulb'
                                },
                                {
                                    title: 'Accessibilité',
                                    desc: 'Permettre un accès facile aux connaissances pour tous les étudiants et chercheurs.',
                                    icon: 'accessibility'
                                },
                                {
                                    title: 'Excellence',
                                    desc: 'Promouvoir la qualité et l\'originalité dans les travaux de recherche académique.',
                                    icon: 'emoji_events'
                                }
                            ].map((item, index) => (_jsxs(motion.div, { className: "flex gap-4", initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { delay: 0.2 * index }, children: [_jsx("div", { className: "w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "material-icons text-primary", children: item.icon }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-bold text-navy", children: item.title }), _jsx("p", { className: "text-navy-700", children: item.desc })] })] }, index)))] }) })] }) }));
};
export default About;
