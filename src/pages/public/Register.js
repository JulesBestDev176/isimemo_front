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
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../../services/auth.service';
const Register = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [tempPassword, setTempPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [userType, setUserType] = useState('etudiant');
    const navigate = useNavigate();
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setError('');
        setSuccess('');
        setTempPassword('');
        if (!email) {
            setError('Veuillez entrer votre email institutionnel.');
            return;
        }
        if (!email.includes('@groupeisi.com')) {
            setError('S\'il vous plaît, utilisez votre email institutionnel (@groupeisi.com).');
            return;
        }
        setIsLoading(true);
        try {
            // Appeler la route appropriée selon le type d'utilisateur
            const response = userType === 'professeur'
                ? yield authService.registerProfesseur(email)
                : yield authService.register(email);
            console.log('📝 Réponse inscription:', response);
            if (response.success && response.temporaryPassword && response.email) {
                setSuccess('Inscription réussie ! Connexion en cours...');
                // Auto-login avec le mot de passe temporaire
                authService.login(response.email, response.temporaryPassword)
                    .then(loginResponse => {
                    if (loginResponse.success && loginResponse.user) {
                        // Stocker les tokens
                        if (loginResponse.accessToken)
                            sessionStorage.setItem('access_token', loginResponse.accessToken);
                        if (loginResponse.refreshToken)
                            sessionStorage.setItem('refresh_token', loginResponse.refreshToken);
                        // Stocker l'utilisateur
                        const user = {
                            id: loginResponse.user.id || '',
                            email: loginResponse.user.email,
                            name: `${loginResponse.user.prenom || ''} ${loginResponse.user.nom || ''}`.trim(),
                            type: 'etudiant',
                            estCandidat: true
                        };
                        sessionStorage.setItem('user', JSON.stringify(user));
                        // Redirection vers page de changement de mot de passe
                        setTimeout(() => {
                            navigate('/change-password', {
                                state: {
                                    fromRegistration: true,
                                    email: response.email,
                                    tempPassword: response.temporaryPassword
                                }
                            });
                        }, 1000);
                    }
                    else {
                        setError('Inscription réussie mais connexion échouée. Veuillez vous connecter manuellement.');
                        setTimeout(() => navigate('/login'), 2000);
                    }
                })
                    .catch(() => {
                    setError('Inscription réussie mais connexion échouée. Veuillez vous connecter manuellement.');
                    setTimeout(() => navigate('/login'), 2000);
                });
            }
            else {
                setError(response.message || 'Échec de l\'inscription.');
            }
        }
        catch (err) {
            setError('Une erreur s\'est produite lors de l\'inscription.');
        }
        finally {
            setIsLoading(false);
        }
    });
    return (_jsx("div", { className: "h-screen flex bg-navy-900", children: _jsx("div", { className: "w-full flex items-center justify-center p-8", children: _jsxs(motion.div, { className: "w-full max-w-md", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 }, children: [_jsx("div", { className: "text-center mb-8", children: _jsx(Link, { to: "/", className: "inline-block", children: _jsxs("div", { className: "flex items-center justify-center gap-2 text-white text-3xl font-bold", children: [_jsx("div", { className: "w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg", children: _jsx("span", { className: "material-symbols-outlined text-2xl", children: "school" }) }), _jsxs("span", { children: ["ISI", _jsx("span", { className: "text-primary-300", children: "Memo" })] })] }) }) }), _jsxs(Card, { className: "border-0 bg-white/10 backdrop-blur-lg shadow-xl", children: [_jsxs(CardHeader, { className: "space-y-2", children: [_jsx(CardTitle, { className: "text-2xl font-bold text-white text-center", children: "Inscription" }), _jsx(CardDescription, { className: "text-gray-300 text-center", children: "V\u00E9rifiez votre \u00E9ligibilit\u00E9 et cr\u00E9ez votre compte. Accessible uniquement aux \u00E9tudiants L3 GL \u00E9ligibles." })] }), _jsxs(CardContent, { children: [error && (_jsxs("div", { className: "mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-md flex items-start", children: [_jsx(AlertCircle, { className: "h-5 w-5 mr-2 mt-0.5" }), _jsx("span", { children: error })] })), success && (_jsx("div", { className: "mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-200 rounded-md", children: _jsxs("div", { className: "flex items-center mb-2", children: [_jsx(CheckCircle, { className: "h-5 w-5 mr-2" }), _jsx("span", { className: "font-bold", children: success })] }) })), !success && (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium text-gray-200", children: "Je suis" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { type: "button", onClick: () => setUserType('etudiant'), className: `p-3 rounded-lg border-2 transition-all ${userType === 'etudiant'
                                                                    ? 'border-primary bg-primary/20 text-white'
                                                                    : 'border-gray-500 text-gray-300 hover:border-primary/50'}`, children: [_jsx("span", { className: "material-icons text-2xl mb-1", children: "school" }), _jsx("p", { className: "text-sm font-medium", children: "Candidat" })] }), _jsxs("button", { type: "button", onClick: () => setUserType('professeur'), className: `p-3 rounded-lg border-2 transition-all ${userType === 'professeur'
                                                                    ? 'border-primary bg-primary/20 text-white'
                                                                    : 'border-gray-500 text-gray-300 hover:border-primary/50'}`, children: [_jsx("span", { className: "material-icons text-2xl mb-1", children: "person" }), _jsx("p", { className: "text-sm font-medium", children: "Encadrant" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { htmlFor: "email", className: "text-sm font-medium text-gray-200 flex items-center", children: [_jsx("span", { className: "material-icons text-primary-400 text-base mr-2", children: "mail" }), "Email Institutionnel"] }), _jsx(Input, { id: "email", type: "email", placeholder: "prenom.nom@groupeisi.com", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "bg-white/20 border-gray-500 placeholder:text-gray-400 text-white" })] }), _jsx(Button, { type: "submit", disabled: isLoading, className: "w-full bg-primary hover:bg-primary-700 text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50", children: isLoading ? 'Vérification...' : 'S\'inscrire' }), _jsxs("div", { className: "text-center text-sm text-gray-400 mt-4", children: ["D\u00E9j\u00E0 un compte ?", ' ', _jsx(Link, { to: "/login", className: "text-primary-300 hover:text-white underline", children: "Se connecter" })] })] }))] })] })] }) }) }));
};
export default Register;
