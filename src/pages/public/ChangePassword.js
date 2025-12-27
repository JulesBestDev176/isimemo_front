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
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
const ChangePassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { fromRegistration, email, tempPassword } = location.state || {};
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const validatePassword = (password) => {
        // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    };
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setError('');
        if (!newPassword || !confirmPassword) {
            setError('Veuillez remplir tous les champs.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }
        if (!validatePassword(newPassword)) {
            setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
            return;
        }
        setIsLoading(true);
        try {
            // Appel au service d'authentification pour changer le mot de passe
            // On utilise le tempPassword (mot de passe temporaire) comme ancien mot de passe
            const data = yield authService.changePassword(email, tempPassword, newPassword);
            if (data.success) {
                // Se reconnecter avec le nouveau mot de passe
                console.log('🔄 Reconnexion avec le nouveau mot de passe...');
                const loginSuccess = yield login(email, newPassword);
                if (loginSuccess) {
                    // Redirection vers le dashboard
                    navigate('/dashboard');
                }
                else {
                    setError('Mot de passe changé mais échec de reconnexion. Veuillez vous connecter manuellement.');
                    setTimeout(() => navigate('/login'), 2000);
                }
            }
            else {
                setError(data.message || 'Erreur lors du changement de mot de passe.');
            }
        }
        catch (err) {
            setError('Une erreur s\'est produite. Veuillez réessayer.');
        }
        finally {
            setIsLoading(false);
        }
    });
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-navy-900 p-4", children: _jsx(motion.div, { className: "w-full max-w-md", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: _jsxs(Card, { className: "border-0 bg-white/10 backdrop-blur-lg shadow-xl", children: [_jsxs(CardHeader, { className: "space-y-2", children: [_jsx("div", { className: "flex items-center justify-center mb-4", children: _jsx("div", { className: "w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center", children: _jsx(Lock, { className: "h-8 w-8 text-primary" }) }) }), _jsx(CardTitle, { className: "text-2xl font-bold text-white text-center", children: "Changement de mot de passe" }), _jsx(CardDescription, { className: "text-gray-300 text-center", children: fromRegistration
                                    ? 'Pour des raisons de sécurité, veuillez changer votre mot de passe temporaire.'
                                    : 'Créez un nouveau mot de passe sécurisé.' })] }), _jsxs(CardContent, { children: [error && (_jsxs("div", { className: "mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-md flex items-start", children: [_jsx(AlertCircle, { className: "h-5 w-5 mr-2 mt-0.5 flex-shrink-0" }), _jsx("span", { className: "text-sm", children: error })] })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "newPassword", className: "text-sm font-medium text-gray-200", children: "Nouveau mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "newPassword", type: showNewPassword ? "text" : "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), required: true, className: "bg-white/20 border-gray-500 text-white pr-10" }), _jsx("button", { type: "button", onClick: () => setShowNewPassword(!showNewPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white", children: showNewPassword ? _jsx(EyeOff, { className: "h-4 w-4" }) : _jsx(Eye, { className: "h-4 w-4" }) })] }), _jsx("p", { className: "text-xs text-gray-400", children: "Min. 8 caract\u00E8res, 1 majuscule, 1 minuscule, 1 chiffre, 1 caract\u00E8re sp\u00E9cial" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "confirmPassword", className: "text-sm font-medium text-gray-200", children: "Confirmer le mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx(Input, { id: "confirmPassword", type: showConfirmPassword ? "text" : "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, className: "bg-white/20 border-gray-500 text-white pr-10" }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white", children: showConfirmPassword ? _jsx(EyeOff, { className: "h-4 w-4" }) : _jsx(Eye, { className: "h-4 w-4" }) })] })] }), _jsx(Button, { type: "submit", disabled: isLoading, className: "w-full bg-primary hover:bg-primary-700 text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50", children: isLoading ? 'Changement en cours...' : 'Changer le mot de passe' })] })] })] }) }) }));
};
export default ChangePassword;
