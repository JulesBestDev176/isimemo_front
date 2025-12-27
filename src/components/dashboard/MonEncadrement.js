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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
const SimpleButton = ({ variant, onClick, children, size = 'md', className = '' }) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors';
    const variantClasses = variant === 'primary'
        ? 'bg-primary text-white hover:bg-primary/90'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2';
    return (_jsx("button", { onClick: onClick, className: `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`, children: children }));
};
const Badge = ({ variant, children }) => {
    const variantClasses = variant === 'warning'
        ? 'bg-orange-100 text-orange-700 border-orange-200'
        : 'bg-blue-100 text-blue-700 border-blue-200';
    return (_jsx("span", { className: `px-2 py-1 text-xs font-medium border rounded ${variantClasses}`, children: children }));
};
export const MonEncadrement = ({ idProfesseur }) => {
    const navigate = useNavigate();
    const [dossiers, setDossiers] = useState([]);
    const [anneeAcademique, setAnneeAcademique] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchEncadrement = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log('🔍 Récupération encadrement pour ID:', idProfesseur);
                const response = yield fetch(`http://localhost:3001/api/encadrants/${idProfesseur}/encadrement`);
                if (response.ok) {
                    const data = yield response.json();
                    console.log('✅ Encadrement reçu:', data);
                    setDossiers(data.dossiers || []);
                    setAnneeAcademique(data.anneeAcademique || '');
                }
                else {
                    console.error('❌ Erreur API encadrement:', response.status);
                }
            }
            catch (error) {
                console.error('❌ Erreur lors de la récupération de l\'encadrement:', error);
            }
            finally {
                setLoading(false);
            }
        });
        if (idProfesseur) {
            fetchEncadrement();
        }
        else {
            setLoading(false);
        }
    }, [idProfesseur]);
    // Toujours afficher la section, même sans dossiers
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: 0.6 }, className: "bg-white border border-gray-200 p-6 mb-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Mon encadrement" }), anneeAcademique && (_jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Ann\u00E9e acad\u00E9mique ", anneeAcademique] }))] }), dossiers.length > 0 && (_jsxs(SimpleButton, { variant: "primary", onClick: () => navigate('/professeur/encadrements'), children: ["Voir tous les encadrements ", _jsx(ChevronRight, { className: "h-4 w-4 ml-1" })] }))] }), loading ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(AlertCircle, { className: "h-8 w-8 mx-auto mb-2 animate-pulse" }), _jsx("p", { children: "Chargement de vos encadrements..." })] })) : dossiers.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(AlertCircle, { className: "h-8 w-8 mx-auto mb-2" }), _jsx("p", { children: "Aucun encadrement actif pour le moment." })] })) : (_jsx("div", { className: "space-y-4", children: dossiers.map((dossier) => (_jsxs("div", { className: "p-4 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer rounded", onClick: () => navigate(`/professeur/encadrements/${dossier.id}`), children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-gray-900 mb-1", children: dossier.titre }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Badge, { variant: "info", children: dossier.etape }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: ["Progression: ", dossier.progression, "%"] })] })] }), _jsx(ChevronRight, { className: "h-5 w-5 text-gray-400" })] }), dossier.candidats.length > 0 && (_jsxs("div", { className: "mt-3 pt-3 border-t border-gray-100", children: [_jsxs("p", { className: "text-xs text-gray-500 mb-2", children: [dossier.candidats.length, " \u00E9tudiant", dossier.candidats.length > 1 ? 's' : ''] }), _jsxs("div", { className: "space-y-1", children: [dossier.candidats.slice(0, 2).map((candidat) => (_jsxs("div", { className: "text-sm text-gray-700", children: [candidat.prenom, " ", candidat.nom] }, candidat.id))), dossier.candidats.length > 2 && (_jsxs("div", { className: "text-xs text-gray-500", children: ["+", dossier.candidats.length - 2, " autre", dossier.candidats.length - 2 > 1 ? 's' : ''] }))] })] }))] }, dossier.id))) }))] }));
};
