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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DossiersList from './DossiersList';
import dossierService from '../../../services/dossier.service';
import { useAuth } from '../../../contexts/AuthContext';
const DossiersPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [dossiers, setDossiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchDossiers = () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('📋 DossiersPage - user:', user);
            console.log('📋 DossiersPage - user.id:', user === null || user === void 0 ? void 0 : user.id, 'type:', typeof (user === null || user === void 0 ? void 0 : user.id));
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                console.log('📋 DossiersPage - No user ID, returning');
                setLoading(false);
                return;
            }
            const candidatId = user.id;
            console.log('📋 DossiersPage - Fetching dossiers for candidatId:', candidatId);
            try {
                setLoading(true);
                // Récupérer uniquement les dossiers du candidat connecté
                const data = yield dossierService.getDossiersByCandidat(candidatId);
                console.log('📋 DossiersPage - Dossiers received:', data);
                setDossiers(data);
            }
            catch (err) {
                console.error('Error fetching dossiers:', err);
                setError('Erreur lors du chargement des dossiers');
            }
            finally {
                setLoading(false);
            }
        });
        fetchDossiers();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    const handleDossierClick = (dossierId) => {
        navigate(`/candidat/dossiers/${dossierId}`);
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex flex-col justify-center items-center h-screen", children: [_jsx("p", { className: "text-red-600 mb-4", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "R\u00E9essayer" })] }));
    }
    return (_jsx(DossiersList, { dossiers: dossiers, onDossierClick: handleDossierClick }));
};
export default DossiersPage;
