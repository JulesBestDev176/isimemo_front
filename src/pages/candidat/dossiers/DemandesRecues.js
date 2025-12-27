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
import { useState, useEffect, useMemo } from 'react';
import { Users, CheckCircle, XCircle, Bell, UserCheck, AlertCircle, BookOpen, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { useAuth } from '../../../contexts/AuthContext';
import demandeBinomeService from '../../../services/demandeBinome.service';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '../../../components/ui/dialog';
const DemandesRecues = ({ dossierId }) => {
    const { user } = useAuth();
    const [propositionsRecues, setPropositionsRecues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [propositionAConfirmer, setPropositionAConfirmer] = useState(null);
    const [showConfirmAccept, setShowConfirmAccept] = useState(false);
    // Charger les demandes reçues depuis l'API
    useEffect(() => {
        const fetchDemandes = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(user === null || user === void 0 ? void 0 : user.id))
                return;
            try {
                setIsLoading(true);
                const recues = yield demandeBinomeService.getDemandesRecues(user.id);
                // Mapper les demandes reçues vers le format PropositionBinome
                const propositionsMappees = recues.map((d) => ({
                    id: d.idDemande,
                    etudiant: {
                        id: d.demandeurId,
                        nom: d.demandeurNom || 'Inconnu',
                        prenom: d.demandeurPrenom || '',
                        email: d.demandeurEmail || '',
                        numeroMatricule: d.demandeurMatricule || '',
                        niveau: 'Licence 3',
                        filiere: 'Génie Logiciel',
                        departement: 'Département Informatique'
                    },
                    dateProposition: new Date(d.dateDemande),
                    message: d.message,
                    sujetChoisi: {
                        id: d.dossierDemandeurId,
                        titre: d.sujetTitre || 'Sujet proposé',
                        description: d.sujetDescription || ''
                    },
                    statut: d.statut === 'EN_ATTENTE' ? 'en_attente' : d.statut === 'ACCEPTEE' ? 'acceptee' : 'refusee'
                }));
                setPropositionsRecues(propositionsMappees);
            }
            catch (err) {
                console.error('Erreur lors du chargement des demandes de binôme:', err);
            }
            finally {
                setIsLoading(false);
            }
        });
        fetchDemandes();
    }, [user === null || user === void 0 ? void 0 : user.id]);
    // Filtrer les propositions en attente
    const propositionsEnAttente = useMemo(() => {
        return propositionsRecues.filter(p => p.statut === 'en_attente');
    }, [propositionsRecues]);
    // Propositions acceptées
    const propositionsAcceptees = useMemo(() => {
        return propositionsRecues.filter(p => p.statut === 'acceptee');
    }, [propositionsRecues]);
    // Gestionnaires d'actions
    const handleAcceptProposition = (proposition) => {
        setPropositionAConfirmer(proposition);
        setShowConfirmAccept(true);
    };
    const handleConfirmAccept = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!propositionAConfirmer)
            return;
        try {
            yield demandeBinomeService.accepterDemande(propositionAConfirmer.id);
            // Mettre à jour l'état local
            setPropositionsRecues(prev => prev.map(p => p.id === propositionAConfirmer.id
                ? Object.assign(Object.assign({}, p), { statut: 'acceptee' }) : p));
            setShowConfirmAccept(false);
            setPropositionAConfirmer(null);
        }
        catch (error) {
            console.error('Erreur lors de l\'acceptation:', error);
        }
    });
    const handleRefuserProposition = (propositionId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield demandeBinomeService.refuserDemande(propositionId);
            // Mettre à jour l'état local
            setPropositionsRecues(prev => prev.map(p => p.id === propositionId
                ? Object.assign(Object.assign({}, p), { statut: 'refusee' }) : p));
        }
        catch (error) {
            console.error('Erreur lors du refus:', error);
        }
    });
    if (isLoading) {
        return (_jsxs("div", { className: "flex items-center justify-center py-12", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }), _jsx("span", { className: "ml-2 text-gray-600", children: "Chargement des demandes..." })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [propositionsAcceptees.length > 0 && (_jsxs(Card, { className: "border-green-200 bg-green-50", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-green-900 flex items-center gap-2", children: [_jsx(UserCheck, { className: "h-5 w-5" }), "Bin\u00F4me accept\u00E9"] }) }), _jsx(CardContent, { children: propositionsAcceptees.map((proposition) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "bg-green-100 rounded-full p-3", children: _jsx(Users, { className: "h-5 w-5 text-green-600" }) }), _jsxs("div", { children: [_jsxs("h4", { className: "font-semibold text-gray-900", children: [proposition.etudiant.prenom, " ", proposition.etudiant.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: proposition.etudiant.email }), _jsxs("p", { className: "text-xs text-green-700 mt-1", children: ["Vous travaillez ensemble sur : ", proposition.sujetChoisi.titre] })] })] }, proposition.id))) })] })), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Bell, { className: "h-5 w-5 text-primary" }), "Demandes de bin\u00F4me re\u00E7ues", propositionsEnAttente.length > 0 && (_jsxs(Badge, { variant: "default", className: "ml-2", children: [propositionsEnAttente.length, " en attente"] }))] }), _jsx(CardDescription, { children: "Les \u00E9tudiants ci-dessous souhaitent travailler avec vous sur leur sujet de m\u00E9moire." })] }), _jsx(CardContent, { children: propositionsEnAttente.length > 0 ? (_jsx("div", { className: "space-y-3", children: propositionsEnAttente.map((proposition) => (_jsx(Card, { className: "border-primary-200 bg-primary-50", children: _jsxs(CardContent, { className: "p-4", children: [_jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Badge, { variant: "secondary", className: "bg-primary-100 text-primary-800 border-primary-300", children: "Demande re\u00E7ue" }), _jsx("span", { className: "text-xs text-gray-500", children: proposition.dateProposition.toLocaleDateString('fr-FR') })] }), _jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-2", children: _jsx(Users, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-900", children: [proposition.etudiant.prenom, " ", proposition.etudiant.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: proposition.etudiant.email }), proposition.etudiant.numeroMatricule && (_jsx(Badge, { variant: "outline", className: "mt-1", children: proposition.etudiant.numeroMatricule }))] })] }), _jsx("div", { className: "p-3 bg-white border border-primary-200 rounded-lg mt-3", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(BookOpen, { className: "h-4 w-4 text-primary mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: "Sujet propos\u00E9 :" }), _jsx("p", { className: "text-sm text-gray-700", children: proposition.sujetChoisi.titre }), proposition.sujetChoisi.description && (_jsx("p", { className: "text-xs text-gray-500 mt-1", children: proposition.sujetChoisi.description }))] })] }) }), proposition.message && (_jsx("div", { className: "mt-3 p-3 bg-white border border-gray-200 rounded-lg", children: _jsxs("p", { className: "text-sm text-gray-700 italic", children: ["\"", proposition.message, "\""] }) }))] }) }), _jsxs("div", { className: "flex justify-end gap-2 mt-4 pt-4 border-t", children: [_jsxs(Button, { variant: "outline", size: "sm", className: "gap-1", onClick: () => handleRefuserProposition(proposition.id), children: [_jsx(XCircle, { className: "h-4 w-4" }), "Refuser"] }), _jsxs(Button, { size: "sm", className: "gap-1", onClick: () => handleAcceptProposition(proposition), children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Accepter"] })] })] }) }, proposition.id))) })) : (_jsxs("div", { className: "py-8 text-center", children: [_jsx(Users, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-600", children: "Aucune demande de bin\u00F4me en attente" }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Vous serez notifi\u00E9 lorsqu'un \u00E9tudiant vous enverra une demande de bin\u00F4me." })] })) })] }), propositionsRecues.filter(p => p.statut === 'refusee').length > 0 && (_jsxs(Card, { className: "border-gray-200", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-gray-600 text-base", children: "Demandes refus\u00E9es" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-2", children: propositionsRecues.filter(p => p.statut === 'refusee').map((proposition) => (_jsxs("div", { className: "flex items-center justify-between p-3 bg-gray-50 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-gray-200 rounded-full p-2", children: _jsx(Users, { className: "h-4 w-4 text-gray-500" }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-sm text-gray-700", children: [proposition.etudiant.prenom, " ", proposition.etudiant.nom] }), _jsx("p", { className: "text-xs text-gray-500", children: proposition.sujetChoisi.titre })] })] }), _jsx(Badge, { variant: "outline", className: "text-gray-500", children: "Refus\u00E9e" })] }, proposition.id))) }) })] })), _jsx(Dialog, { open: showConfirmAccept, onOpenChange: setShowConfirmAccept, children: _jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Confirmer l'acceptation de la demande" }), _jsx(DialogDescription, { children: "\u00CAtes-vous s\u00FBr de vouloir accepter cette demande de bin\u00F4me ?" })] }), propositionAConfirmer && (_jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "p-4 bg-primary-50 border border-primary-200 rounded-lg", children: [_jsxs("h4", { className: "font-semibold text-gray-900 mb-2", children: [propositionAConfirmer.etudiant.prenom, " ", propositionAConfirmer.etudiant.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: propositionAConfirmer.etudiant.email })] }), _jsx("div", { className: "p-4 bg-yellow-50 border border-yellow-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-yellow-600 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-yellow-900", children: "Important" }), _jsxs("p", { className: "text-sm text-yellow-700 mt-1", children: ["En acceptant cette demande, vous travaillerez sur le sujet de ", propositionAConfirmer.etudiant.prenom, " :"] }), _jsxs("p", { className: "text-sm font-medium text-yellow-900 mt-2", children: ["\"", propositionAConfirmer.sujetChoisi.titre, "\""] }), _jsx("p", { className: "text-xs text-yellow-600 mt-2", children: "Votre bin\u00F4me sera responsable de la progression du dossier." })] })] }) })] })), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => {
                                        setShowConfirmAccept(false);
                                        setPropositionAConfirmer(null);
                                    }, children: "Annuler" }), _jsxs(Button, { onClick: handleConfirmAccept, className: "gap-2", children: [_jsx(CheckCircle, { className: "h-4 w-4" }), "Confirmer l'acceptation"] })] })] }) })] }));
};
export default DemandesRecues;
