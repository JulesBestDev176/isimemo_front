import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
const departments = [
    {
        name: 'Génie Informatique',
        icon: 'code',
        color: 'bg-blue-100',
        iconColor: 'text-blue-600',
        specialties: ['Génie logiciel', 'Systèmes d\'information', 'Géomatique', 'Multimédia', 'Marketing numérique']
    },
    {
        name: 'Réseaux et Systèmes',
        icon: 'router',
        color: 'bg-green-100',
        iconColor: 'text-green-600',
        specialties: ['Réseaux', 'Cybersécurité', 'Systèmes embarqués', 'Cloud computing']
    },
    {
        name: 'IA et Data Science',
        icon: 'data_object',
        color: 'bg-purple-100',
        iconColor: 'text-purple-600',
        specialties: ['Intelligence artificielle', 'Data science', 'Big data', 'MIAGE']
    },
    {
        name: 'Gestion et Management',
        icon: 'business_center',
        color: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        specialties: ['Finance', 'Commerce', 'Banque', 'Assistanat']
    }
];
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};
const Departments = () => {
    return (_jsxs("section", { className: "section bg-gradient-to-br from-navy-50 to-blue-50", children: [_jsxs("div", { className: "text-center max-w-3xl mx-auto mb-16", children: [_jsx(motion.h2, { className: "text-3xl font-bold mb-4 text-navy", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, children: "Nos D\u00E9partements" }), _jsx(motion.p, { className: "text-lg text-navy-700", initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, delay: 0.2 }, children: "D\u00E9couvrez nos fili\u00E8res d'excellence pour une formation compl\u00E8te et de qualit\u00E9." })] }), _jsx(motion.div, { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", variants: container, initial: "hidden", whileInView: "show", viewport: { once: true }, children: departments.map((dept, index) => (_jsxs(motion.div, { className: "card p-6 group", variants: item, whileHover: {
                        y: -10,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                    }, children: [_jsx("div", { className: `w-16 h-16 rounded-full ${dept.color} flex items-center justify-center mb-6 transform transition-transform group-hover:scale-110`, children: _jsx("span", { className: `material-icons text-3xl ${dept.iconColor}`, children: dept.icon }) }), _jsx("h3", { className: "text-xl font-bold mb-3 text-navy", children: dept.name }), _jsx("ul", { className: "space-y-2", children: dept.specialties.map((specialty, i) => (_jsxs("li", { className: "flex items-center gap-2 text-navy-700", children: [_jsx("span", { className: "material-icons text-primary text-sm", children: "school" }), specialty] }, i))) })] }, index))) })] }));
};
export default Departments;
