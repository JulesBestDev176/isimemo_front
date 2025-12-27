var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth.service';
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Vérifier si l'utilisateur est déjà connecté au chargement
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const accessToken = sessionStorage.getItem('access_token');
        if (storedUser && accessToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);
    const login = (email, password, userType) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            console.log('🔐 Tentative de connexion pour:', email, 'type:', userType);
            // Appeler le backend qui gère Keycloak
            const response = yield authService.login(email, password, userType);
            if (!response.success || !response.user) {
                console.error('❌ Échec de connexion:', response.message);
                return false;
            }
            console.log('✅ Connexion réussie:', response.user);
            // Stocker les tokens et l'utilisateur
            if (response.accessToken) {
                sessionStorage.setItem('access_token', response.accessToken);
            }
            if (response.refreshToken) {
                sessionStorage.setItem('refresh_token', response.refreshToken);
            }
            // Mapper le rôle backend vers le type frontend
            const role = ((_a = response.user.role) === null || _a === void 0 ? void 0 : _a.toUpperCase()) || '';
            let mappedUserType = 'etudiant';
            let estCandidat = false;
            let estChef = false;
            let estEncadrant = false;
            if (role === 'ETUDIANT' || role === 'CANDIDAT') {
                mappedUserType = 'etudiant';
                estCandidat = role === 'CANDIDAT' || role === 'ETUDIANT'; // Les étudiants inscrits sont des candidats
            }
            else if (role === 'PROFESSEUR' || role === 'CHEF' || role === 'ENCADRANT') {
                mappedUserType = 'professeur';
                estChef = role === 'CHEF';
                estEncadrant = role === 'ENCADRANT' || role === 'PROFESSEUR';
            }
            else if (role === 'SECRETAIRE' || role === 'ASSISTANT') {
                mappedUserType = 'assistant';
            }
            const user = {
                id: response.user.id || '',
                email: response.user.email,
                nom: response.user.nom || '',
                prenom: response.user.prenom || '',
                name: `${response.user.prenom || ''} ${response.user.nom || ''}`.trim(),
                role: response.user.role,
                type: mappedUserType,
                estCandidat,
                estChef,
                estEncadrant,
            };
            console.log('👤 User mapped:', user);
            setUser(user);
            sessionStorage.setItem('user', JSON.stringify(user));
            return true;
        }
        catch (error) {
            console.error('❌ Erreur de connexion:', error);
            return false;
        }
    });
    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            login,
            logout,
            isAuthenticated: !!user,
            loading
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
