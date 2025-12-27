import { jsx as _jsx } from "react/jsx-runtime";
// Ce dossier contient les pages partagées (communes) à plusieurs rôles, comme le calendrier, la messagerie, etc.
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
const Index = () => {
    const { isAuthenticated } = useAuth();
    return _jsx(Navigate, { to: isAuthenticated ? "/dashboard" : "/login", replace: true });
};
export default Index;
