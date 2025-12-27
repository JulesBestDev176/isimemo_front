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
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DossierDetail from './DossierDetail';
import { dossierService } from '../../../services/dossier.service';
import { useAuth } from '../../../contexts/AuthContext';
const DossierDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [dossier, setDossier] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchDossierAndDocs = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!id)
                return;
            try {
                setLoading(true);
                const [dossierData, docsData] = yield Promise.all([
                    dossierService.getDossierById(parseInt(id)),
                    dossierService.getDocumentsByDossier(parseInt(id))
                ]);
                setDossier(dossierData);
                setDocuments(docsData);
            }
            catch (err) {
                console.error('Error fetching dossier data:', err);
                setError('Erreur lors du chargement des données');
            }
            finally {
                setLoading(false);
            }
        });
        fetchDossierAndDocs();
    }, [id]);
    const handleBack = () => {
        navigate('/candidat/dossiers');
    };
    // Détermine si l'utilisateur courant est un "suiveur" (pas le leader du dossier)
    const estSuiveur = React.useMemo(() => {
        if (!dossier || !(user === null || user === void 0 ? void 0 : user.id))
            return false;
        const candidatIds = dossier.candidatIds || [];
        if (candidatIds.length > 0 && candidatIds[0] !== user.id) {
            return candidatIds.includes(user.id);
        }
        return false;
    }, [dossier, user === null || user === void 0 ? void 0 : user.id]);
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" }) }));
    }
    if (error || !dossier) {
        return (_jsxs("div", { className: "flex flex-col justify-center items-center h-screen", children: [_jsx("p", { className: "text-red-600 mb-4", children: error || 'Dossier non trouvé' }), _jsx("button", { onClick: handleBack, className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Retour" })] }));
    }
    return (_jsx(DossierDetail, { dossier: dossier, documents: documents, onBack: handleBack, estSuiveur: estSuiveur }));
};
export default DossierDetailPage;
