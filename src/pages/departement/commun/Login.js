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
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';
import { mockUsers } from '../../../models/auth';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    // Pour afficher les rôles d'un utilisateur
    const getRoles = (user) => {
        const roles = [];
        if (user.estChef)
            roles.push('Chef');
        if (user.estEncadrant)
            roles.push('Encadrant');
        if (user.estJurie)
            roles.push('Jury');
        if (user.estCommission)
            roles.push('Commission');
        if (user.estSecretaire)
            roles.push('Secrétaire');
        if (user.estProfesseur && roles.length === 0)
            roles.push('Professeur');
        return roles.join(', ');
    };
    // Remplir le formulaire avec un utilisateur mock
    const fillUser = (user) => {
        setEmail(user.email);
        setPassword(user.password);
    };
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        setIsLoading(true);
        try {
            const success = yield login(email, password);
            if (!success) {
                setError('Email ou mot de passe incorrect.');
            }
        }
        catch (err) {
            setError('Une erreur s\'est produite lors de la connexion.');
        }
        finally {
            setIsLoading(false);
        }
    });
    if (isAuthenticated) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: _jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "bg-white p-8 rounded-xl shadow-md w-full max-w-md", children: [_jsxs(motion.div, { variants: itemVariants, className: "mb-6 flex flex-col items-center", children: [_jsx(Logo, { size: "large" }), _jsx("h2", { className: "mt-6 text-2xl font-bold text-gray-900", children: "Connexion au Dashboard" }), _jsx("p", { className: "mt-2 text-sm text-gray-600 text-center", children: "Veuillez vous connecter pour acc\u00E9der \u00E0 l'administration" })] }), error && (_jsxs(motion.div, { variants: itemVariants, className: "mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center", children: [_jsx(AlertCircle, { className: "h-5 w-5 mr-2" }), _jsx("span", { children: error })] })), _jsxs(motion.form, { variants: itemVariants, onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "email", className: "block text-gray-700 font-medium mb-2", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(UserIcon, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent", placeholder: "email@isimemo.edu.sn" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { htmlFor: "password", className: "block text-gray-700 font-medium mb-2", children: "Mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" }), _jsx("input", { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] })] }), _jsx(motion.button, { variants: itemVariants, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, type: "submit", disabled: isLoading, className: "w-full py-2 px-4 bg-primary hover:bg-primary-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? 'Connexion en cours...' : 'Se connecter' }), _jsxs("div", { className: "flex items-center justify-between mt-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "remember", type: "checkbox", className: "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" }), _jsx("label", { htmlFor: "remember", className: "ml-2 block text-sm text-gray-700", children: "Se souvenir de moi" })] }), _jsx("div", { className: "text-sm", children: _jsx("a", { href: "#", className: "text-primary hover:underline", children: "Mot de passe oubli\u00E9?" }) })] })] }), _jsxs(motion.div, { variants: itemVariants, className: "mt-8 text-center text-sm text-gray-600", children: [_jsx("p", { className: "mb-2", children: "Utiliser un compte test :" }), _jsx("div", { className: "space-y-2", children: mockUsers.map((user, idx) => (_jsxs("div", { className: "flex items-center justify-between bg-gray-100 rounded p-2", children: [_jsxs("div", { children: [_jsx("span", { className: "font-semibold", children: getRoles(user) }), _jsxs("span", { className: "ml-2 text-xs text-gray-500", children: [user.email, " / ", user.password] })] }), _jsx("button", { type: "button", className: "ml-2 px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-700", onClick: () => fillUser(user), children: "Remplir" })] }, user.email))) })] })] }) }));
};
export default Login;
