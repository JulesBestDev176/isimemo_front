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
import { motion } from 'framer-motion';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { useAuth } from "../../contexts/AuthContext";
import { AlertCircle } from 'lucide-react';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    // Pour afficher les rôles d'un utilisateur
    const getRoles = (user) => {
        const roles = [];
        // Type d'acteur principal
        if (user.type === 'etudiant') {
            if (user.estCandidat) {
                roles.push('Candidat');
            }
            else {
                roles.push('Étudiant');
            }
        }
        else if (user.type === 'professeur') {
            if (user.estChef) {
                roles.push('Chef de Département');
            }
            else if (user.estEncadrant) {
                roles.push('Encadrant');
            }
            else {
                roles.push('Professeur');
            }
        }
        else if (user.type === 'assistant') {
            roles.push('Personnel Administratif');
        }
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
            // Le backend détectera automatiquement le type d'utilisateur
            const success = yield login(email, password);
            if (success) {
                navigate('/dashboard');
            }
            else {
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
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return (_jsxs("div", { className: "h-screen flex bg-navy-900", children: [_jsx("div", { className: "w-full lg:w-1/2 flex items-center justify-center p-8", children: _jsxs(motion.div, { className: "w-full max-w-md", initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.5 }, children: [_jsx("div", { className: "text-center mb-8", children: _jsx(Link, { to: "/", className: "inline-block", children: _jsxs(motion.div, { className: "flex items-center justify-center gap-2 text-white text-3xl font-bold", whileHover: { scale: 1.05 }, children: [_jsx("div", { className: "w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg", children: _jsx("span", { className: "material-symbols-outlined text-2xl", children: "school" }) }), _jsxs("span", { children: ["ISI", _jsx("span", { className: "text-primary-300", children: "Memo" })] })] }) }) }), _jsxs(Card, { className: "border-0 bg-white/10 backdrop-blur-lg shadow-xl", children: [_jsxs(CardHeader, { className: "space-y-2", children: [_jsx(CardTitle, { className: "text-2xl font-bold text-white text-center", children: "Connexion" }), _jsx(CardDescription, { className: "text-gray-300 text-center", children: "Bienvenue \u00E0 nouveau ! Entrez vos identifiants pour acc\u00E9der \u00E0 votre compte" })] }), _jsxs(CardContent, { children: [error && (_jsxs("div", { className: "mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center", children: [_jsx(AlertCircle, { className: "h-5 w-5 mr-2" }), _jsx("span", { children: error })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("label", { htmlFor: "email", className: "text-sm font-medium text-gray-200 flex items-center", children: [_jsx("span", { className: "material-icons text-primary-400 text-base mr-2", children: "email" }), "Email"] }), _jsx(Input, { id: "email", type: "email", placeholder: "votre@email.com", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "bg-white/20 border-gray-500 placeholder:text-gray-400 text-white" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("label", { htmlFor: "password", className: "text-sm font-medium text-gray-200 flex items-center", children: [_jsx("span", { className: "material-icons text-primary-400 text-base mr-2", children: "lock" }), "Mot de passe"] }), _jsx(Link, { to: "/forgot-password", className: "text-sm font-medium text-primary-300 hover:text-primary-200", children: "Mot de passe oubli\u00E9?" })] }), _jsx(Input, { id: "password", type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "bg-white/20 border-gray-500 placeholder:text-gray-400 text-white" })] }), _jsxs(Button, { type: "submit", disabled: isLoading, className: "w-full bg-primary hover:bg-primary-700 text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx("span", { className: "material-icons text-sm mr-2", children: "login" }), isLoading ? 'Connexion en cours...' : 'Se connecter'] }), _jsxs("div", { className: "mt-4 text-center text-sm text-gray-300", children: ["Pas encore de compte ?", ' ', _jsx(Link, { to: "/register", className: "text-primary-300 hover:text-white font-medium hover:underline", children: "S'inscrire" })] })] })] })] }), _jsx("div", { className: "mt-8 text-center text-sm text-gray-400", children: _jsx("p", { children: "\u00A9 2025 ISIMemo. Tous droits r\u00E9serv\u00E9s." }) })] }) }), _jsxs("div", { className: "hidden lg:block w-1/2 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-navy-900/40 z-10" }), _jsx("img", { src: "/images/etudiante.png", alt: "Dipl\u00F4m\u00E9e", className: "absolute h-full w-full object-cover object-center" })] })] }));
};
export default Login;
