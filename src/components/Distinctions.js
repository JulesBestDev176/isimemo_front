import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
const distinctions = [
    {
        year: '2015',
        title: 'Meilleure académie d\'excellence CISCO en Afrique subsaharienne',
        description: 'Reconnaissance internationale pour la qualité de notre formation dans les réseaux informatiques.',
        color: 'from-blue-400 to-blue-600',
        bgColor: 'bg-blue-400',
        icon: 'network_check'
    },
    {
        year: '2016',
        title: 'Trophée meilleure école informatique',
        description: 'Prix TIC Set Awards récompensant notre engagement pour l\'excellence académique.',
        color: 'from-emerald-400 to-emerald-600',
        bgColor: 'bg-emerald-400',
        icon: 'school'
    },
    {
        year: '2017',
        title: 'Entreprise la plus dynamique et innovante',
        description: 'Distinction nationale dans le domaine de l\'éducation pour nos approches pédagogiques innovantes.',
        color: 'from-violet-400 to-violet-600',
        bgColor: 'bg-violet-400',
        icon: 'rocket_launch'
    },
    {
        year: '2019',
        title: 'Meilleure Académie Huawei',
        description: 'Reconnaissance pour notre partenariat stratégique avec Huawei et la qualité de nos formations certifiantes.',
        color: 'from-amber-400 to-amber-600',
        bgColor: 'bg-amber-400',
        icon: 'workspace_premium'
    }
];
const Distinctions = () => {
    return (_jsxs("section", { className: "section bg-gradient-to-br from-white to-gray-50 py-20", children: [_jsxs("div", { className: "text-center max-w-3xl mx-auto mb-12", children: [_jsx(motion.h2, { className: "text-3xl font-bold mb-4 text-navy bg-clip-text text-transparent bg-gradient-to-r from-navy-800 to-primary-700", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, children: "Nos Distinctions" }), _jsx(motion.p, { className: "text-lg text-navy-700", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.2 }, children: "L'ISI a \u00E9t\u00E9 r\u00E9compens\u00E9 pour son excellence acad\u00E9mique et son innovation p\u00E9dagogique." })] }), _jsxs("div", { className: "relative max-w-5xl mx-auto", children: [_jsxs(motion.div, { className: "absolute left-1/2 transform -translate-x-1/2 h-full w-1.5 bg-gradient-to-b from-primary-300 via-primary to-primary-700 rounded-full", initial: { height: 0 }, whileInView: { height: "100%" }, viewport: { once: true }, transition: { duration: 1.5 }, children: [_jsx(motion.div, { className: "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary-300 shadow-lg shadow-primary-300/50", animate: {
                                    scale: [1, 1.5, 1],
                                    opacity: [0.7, 1, 0.7],
                                }, transition: {
                                    duration: 2,
                                    repeat: Infinity
                                } }), _jsx(motion.div, { className: "absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary-500 shadow-lg shadow-primary-500/50", animate: {
                                    scale: [1, 1.5, 1],
                                    opacity: [0.7, 1, 0.7],
                                }, transition: {
                                    duration: 2,
                                    delay: 0.5,
                                    repeat: Infinity
                                } }), _jsx(motion.div, { className: "absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary-600 shadow-lg shadow-primary-600/50", animate: {
                                    scale: [1, 1.5, 1],
                                    opacity: [0.7, 1, 0.7],
                                }, transition: {
                                    duration: 2,
                                    delay: 1,
                                    repeat: Infinity
                                } }), _jsx(motion.div, { className: "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-primary-700 shadow-lg shadow-primary-700/50", animate: {
                                    scale: [1, 1.5, 1],
                                    opacity: [0.7, 1, 0.7],
                                }, transition: {
                                    duration: 2,
                                    delay: 1.5,
                                    repeat: Infinity
                                } })] }), distinctions.map((distinction, index) => (_jsxs(motion.div, { className: `relative z-10 mb-20 md:mb-28 flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`, initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-100px" }, transition: { duration: 0.7, delay: index * 0.2 }, children: [_jsx("div", { className: "absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20", children: _jsx(motion.div, { className: `w-14 h-14 rounded-full ${distinction.bgColor} shadow-lg flex items-center justify-center`, whileHover: { scale: 1.2, rotate: 360 }, transition: { type: "spring", stiffness: 400, damping: 10 }, children: _jsx("span", { className: "material-icons text-white text-2xl", children: distinction.icon }) }) }), _jsx("div", { className: `w-full md:w-1/2 flex ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'} mb-10 md:mb-0`, children: _jsx("div", { className: "relative w-full", children: _jsxs(motion.div, { className: `w-full md:max-w-md ${index % 2 === 0 ? 'md:mr-10' : 'md:ml-10'} bg-white rounded-xl shadow-lg border border-gray-100 relative`, whileHover: {
                                            y: -5,
                                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                                            transition: { type: "spring", stiffness: 300 }
                                        }, children: [_jsxs("div", { className: "p-6 relative", children: [_jsx("div", { className: `absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${distinction.color} rounded-l-xl` }), _jsx("h3", { className: "text-xl font-bold mb-3 text-navy-800 pt-2 pr-16", children: distinction.title }), _jsx("p", { className: "text-navy-700 mb-4", children: distinction.description }), _jsxs(motion.div, { className: "mt-4 flex flex-wrap gap-2", initial: { opacity: 0 }, whileInView: {
                                                            opacity: 1,
                                                            transition: {
                                                                staggerChildren: 0.1
                                                            }
                                                        }, viewport: { once: true }, children: [_jsxs(motion.span, { className: "bg-gray-100 text-navy-600 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1", initial: { opacity: 0, x: -10 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.3 }, whileHover: { backgroundColor: "#e5e7eb", scale: 1.05 }, children: [_jsx("span", { className: "material-icons text-sm", children: "emoji_events" }), "Prix d'excellence"] }), _jsxs(motion.span, { className: "bg-gray-100 text-navy-600 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1", initial: { opacity: 0, x: -10 }, whileInView: { opacity: 1, x: 0 }, whileHover: { backgroundColor: "#e5e7eb", scale: 1.05 }, viewport: { once: true }, transition: { delay: 0.1 }, children: [_jsx("span", { className: "material-icons text-sm", children: "verified" }), "Certification"] }), _jsxs(motion.span, { className: "bg-gray-100 text-navy-600 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1", initial: { opacity: 0, x: -10 }, whileInView: { opacity: 1, x: 0 }, whileHover: { backgroundColor: "#e5e7eb", scale: 1.05 }, viewport: { once: true }, transition: { delay: 0.2 }, children: [_jsx("span", { className: "material-icons text-sm", children: "military_tech" }), "Reconnaissance"] })] })] }), _jsx(motion.div, { className: "absolute -top-4 -right-4 z-30", initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay: 0.2 }, children: _jsx(motion.div, { className: `bg-gradient-to-br ${distinction.color} shadow-xl text-white font-bold py-2 px-4 rounded-xl`, whileHover: { scale: 1.1 }, transition: { type: "spring", stiffness: 400 }, children: distinction.year }) })] }) }) }), _jsx("div", { className: "w-full md:w-1/2" })] }, index)))] }), _jsx(motion.div, { className: "relative z-10 flex justify-center mt-10", initial: { opacity: 0, scale: 0.5 }, whileInView: { opacity: 1, scale: 1 }, viewport: { once: true }, transition: { duration: 0.5, delay: 0.8 }, children: _jsxs(motion.div, { className: "bg-gradient-to-r from-primary to-primary-700 text-white px-8 py-3 rounded-full shadow-lg flex items-center gap-2 hover:shadow-xl", whileHover: {
                        scale: 1.05,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }, transition: { type: "spring", stiffness: 400 }, children: [_jsx("span", { className: "material-icons animate-pulse", children: "stars" }), _jsx("span", { className: "font-medium", children: "Et plus \u00E0 venir..." })] }) })] }));
};
export default Distinctions;
