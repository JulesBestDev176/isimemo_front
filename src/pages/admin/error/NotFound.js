import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
const NotFound = () => {
    return (_jsx("div", { className: "min-h-screen flex flex-col items-center justify-center p-4", children: _jsxs(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.5 }, className: "text-center", children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx(FiAlertCircle, { className: "h-20 w-20 text-primary" }) }), _jsx("h1", { className: "text-5xl font-bold mb-4 dark:text-white", children: "404" }), _jsx("h2", { className: "text-2xl font-semibold mb-4 dark:text-gray-200", children: "Page non trouv\u00E9e" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto", children: "La page que vous recherchez n'existe pas ou a \u00E9t\u00E9 d\u00E9plac\u00E9e." }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4", children: [_jsxs(Link, { to: "/", className: "btn-primary", children: [_jsx(FiHome, { className: "mr-2" }), " Retour \u00E0 l'accueil"] }), _jsx("button", { onClick: () => window.history.back(), className: "btn-outline", children: "Retour \u00E0 la page pr\u00E9c\u00E9dente" })] })] }) }));
};
export default NotFound;
