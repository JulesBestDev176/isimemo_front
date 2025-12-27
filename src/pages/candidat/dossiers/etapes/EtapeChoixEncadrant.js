var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from 'react';
import { UserCheck, Search, ArrowRight, Mail, Users, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
const API_BASE_URL = 'http://localhost:3001/api';
const EtapeChoixEncadrant = ({ dossier, onComplete, estSuiveur = false }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [encadrantSelectionne, setEncadrantSelectionne] = useState(null);
    const [demandesEnvoyees, setDemandesEnvoyees] = useState([]);
    const [activeTab, setActiveTab] = useState('choix');
    // États pour le chargement des encadrants depuis l'API
    const [encadrantsDisponibles, setEncadrantsDisponibles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Charger les encadrants inscrits depuis l'API
    useEffect(() => {
        const fetchEncadrants = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                setIsLoading(true);
                setError(null);
                const response = yield fetch(`${API_BASE_URL}/encadrants/disponibles`);
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des encadrants');
                }
                const data = yield response.json();
                // Mapper les données de l'API vers le format EncadrantOption
                const encadrants = data.map((e) => {
                    var _a;
                    return ({
                        id: e.id,
                        nom: e.nom,
                        prenom: e.prenom,
                        email: e.email,
                        grade: e.grade || 'Enseignant',
                        specialite: e.specialite || ((_a = e.domainesRecherche) === null || _a === void 0 ? void 0 : _a.join(', ')) || '',
                        departement: e.departement || 'Informatique',
                        estDisponible: e.estDisponible !== false,
                        nombreEtudiantsEncadres: e.nombreEncadrementsActuels || 0,
                        nombreMaxEtudiants: e.capaciteEncadrement || null
                    });
                });
                setEncadrantsDisponibles(encadrants);
                console.log('✅ Encadrants chargés:', encadrants.length);
            }
            catch (err) {
                console.error('Erreur chargement encadrants:', err);
                setError('Impossible de charger les encadrants. Veuillez réessayer.');
            }
            finally {
                setIsLoading(false);
            }
        });
        fetchEncadrants();
    }, []);
    // Charger la demande d'encadrement existante pour ce dossier
    useEffect(() => {
        const fetchDemande = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${API_BASE_URL}/demandes-encadrement/dossier/${dossier.id}`);
                if (response.ok) {
                    const data = yield response.json();
                    console.log('✅ Demande chargée:', data);
                    // Convertir la demande API en DemandeEncadrant local
                    if (data.encadrant) {
                        const demandeLocale = {
                            id: data.idDemande,
                            encadrant: {
                                id: data.encadrant.id,
                                nom: data.encadrant.nom,
                                prenom: data.encadrant.prenom,
                                email: data.encadrant.email,
                                grade: data.encadrant.grade || 'Enseignant',
                                specialite: '',
                                departement: '',
                                estDisponible: true,
                                nombreEtudiantsEncadres: 0,
                                nombreMaxEtudiants: null
                            },
                            dossierMemoire: {
                                id: dossier.id,
                                titre: dossier.titre,
                                description: dossier.description
                            },
                            dateDemande: new Date(data.dateDemande),
                            statut: data.statut === 'EN_ATTENTE' ? 'en_attente'
                                : data.statut === 'ACCEPTEE' ? 'acceptee'
                                    : data.statut === 'REFUSEE' ? 'refusee'
                                        : 'en_attente',
                            dateReponse: data.dateReponse ? new Date(data.dateReponse) : undefined,
                            motifRefus: data.motifRefus
                        };
                        setDemandesEnvoyees([demandeLocale]);
                    }
                }
            }
            catch (error) {
                console.log('ℹ️ Aucune demande existante pour ce dossier');
            }
        });
        fetchDemande();
    }, [dossier.id, dossier.titre, dossier.description]);
    // Trouver la demande en cours pour ce dossier
    const demandeEnCours = useMemo(() => {
        return demandesEnvoyees.find(d => d.dossierMemoire.id === dossier.id);
    }, [demandesEnvoyees, dossier.id]);
    // Si une demande existe et est en attente ou acceptée, afficher l'onglet attente
    useEffect(() => {
        if (demandeEnCours && (demandeEnCours.statut === 'en_attente' || demandeEnCours.statut === 'acceptee')) {
            setActiveTab('attente');
        }
        else if (demandeEnCours && demandeEnCours.statut === 'refusee') {
            // Si refusé, retourner à l'onglet choix
            setActiveTab('choix');
        }
    }, [demandeEnCours]);
    // Calculer les places disponibles pour chaque encadrant
    const getPlacesDisponibles = (encadrant) => {
        if (encadrant.nombreMaxEtudiants === null) {
            return null; // Infini
        }
        const placesDisponibles = encadrant.nombreMaxEtudiants - encadrant.nombreEtudiantsEncadres;
        return Math.max(0, placesDisponibles);
    };
    // Vérifier si un encadrant a des places disponibles
    const aPlacesDisponibles = (encadrant) => {
        const places = getPlacesDisponibles(encadrant);
        return places === null || places > 0;
    };
    // Vérifier si une demande a déjà été envoyée à un encadrant
    const demandeExistante = (encadrantId) => {
        return demandesEnvoyees.find(d => d.encadrant.id === encadrantId && d.dossierMemoire.id === dossier.id);
    };
    const encadrantsFiltres = encadrantsDisponibles.filter(encadrant => {
        var _a;
        const matchesSearch = `${encadrant.prenom} ${encadrant.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            encadrant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ((_a = encadrant.specialite) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase())) ||
            encadrant.departement.toLowerCase().includes(searchQuery.toLowerCase());
        // Filtrer par disponibilité et places disponibles
        const estDisponible = encadrant.estDisponible && aPlacesDisponibles(encadrant);
        // Ne pas exclure les encadrants qui ont déjà reçu une demande (pour afficher le statut)
        return matchesSearch && estDisponible;
    });
    const handleValider = () => __awaiter(void 0, void 0, void 0, function* () {
        if (encadrantSelectionne) {
            // Vérifier s'il y a déjà une demande en cours pour ce dossier
            if (demandeEnCours && demandeEnCours.statut === 'en_attente') {
                // On ne peut envoyer qu'une demande à la fois
                alert('Vous avez déjà une demande en attente. Veuillez attendre la réponse.');
                return;
            }
            // Vérifier si une demande existe déjà pour cet encadrant
            const demandeExist = demandeExistante(encadrantSelectionne.id);
            if (demandeExist && demandeExist.statut === 'refusee') {
                // Si la demande a été refusée, on peut renvoyer une nouvelle demande
                // Supprimer l'ancienne demande refusée
                setDemandesEnvoyees(prev => prev.filter(d => d.id !== demandeExist.id));
            }
            try {
                // Appel API pour envoyer la demande à l'encadrant
                const response = yield fetch(`${API_BASE_URL}/demandes-encadrement`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dossierId: dossier.id,
                        encadrantId: encadrantSelectionne.id
                    })
                });
                if (!response.ok) {
                    const error = yield response.json();
                    alert(error.message || 'Erreur lors de l\'envoi de la demande');
                    return;
                }
                const data = yield response.json();
                // Si une demande existe déjà, afficher un message et utiliser la demande existante
                if (data.alreadyExists) {
                    console.log('⚠️ Demande déjà existante:', data.demande);
                    alert(data.message || 'Vous avez déjà une demande en attente pour ce dossier');
                    // Créer une demande locale avec la demande existante
                    const demandeExistante = {
                        id: data.demande.id,
                        encadrant: encadrantSelectionne,
                        dossierMemoire: {
                            id: dossier.id,
                            titre: dossier.titre,
                            description: dossier.description
                        },
                        dateDemande: new Date(data.demande.dateDemande),
                        statut: 'en_attente'
                    };
                    setDemandesEnvoyees(prev => {
                        // Vérifier si la demande n'est pas déjà dans la liste
                        const exists = prev.find(d => d.id === demandeExistante.id);
                        if (exists)
                            return prev;
                        return [...prev, demandeExistante];
                    });
                    setActiveTab('attente');
                    return;
                }
                console.log('✅ Demande envoyée:', data);
                // Créer une nouvelle demande locale pour l'affichage
                const nouvelleDemande = {
                    id: data.demande.id,
                    encadrant: encadrantSelectionne,
                    dossierMemoire: {
                        id: dossier.id,
                        titre: dossier.titre,
                        description: dossier.description
                    },
                    dateDemande: new Date(data.demande.dateDemande),
                    statut: 'en_attente'
                };
                setDemandesEnvoyees(prev => [...prev, nouvelleDemande]);
                // Passer à l'onglet d'attente
                setActiveTab('attente');
            }
            catch (error) {
                console.error('❌ Erreur envoi demande:', error);
                alert('Erreur lors de l\'envoi de la demande. Veuillez réessayer.');
            }
        }
    });
    const handleRetourChoix = () => {
        setActiveTab('choix');
        setEncadrantSelectionne(null);
    };
    const handleContinuer = () => {
        if (demandeEnCours && demandeEnCours.statut === 'acceptee') {
            // Passer à l'étape supérieure (validation commission)
            onComplete();
        }
    };
    const handleAnnulerDemande = () => {
        if (demandeEnCours && demandeEnCours.statut === 'en_attente') {
            // TODO: Appel API pour annuler la demande
            console.log('Demande annulée:', demandeEnCours);
            // Supprimer la demande de la liste
            setDemandesEnvoyees(prev => prev.filter(d => d.id !== demandeEnCours.id));
            // Retourner à l'onglet choix
            setActiveTab('choix');
            setEncadrantSelectionne(null);
        }
    };
    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(UserCheck, { className: "h-5 w-5 text-primary" }), "\u00C9tape 3 : Choix de l'encadrant"] }), _jsx(CardDescription, { children: "S\u00E9lectionnez votre encadrant p\u00E9dagogique parmi les professeurs disponibles" })] }), _jsx(CardContent, { className: "space-y-6", children: _jsxs(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsxs(TabsTrigger, { value: "choix", className: "gap-2", children: [_jsx(UserCheck, { className: "h-4 w-4" }), "Choix de l'encadrant"] }), _jsxs(TabsTrigger, { value: "attente", className: "gap-2", disabled: !demandeEnCours, children: [_jsx(Clock, { className: "h-4 w-4" }), "Attente de r\u00E9ponse", demandeEnCours && demandeEnCours.statut === 'en_attente' && (_jsx(Badge, { variant: "secondary", className: "ml-2 bg-yellow-100 text-yellow-800", children: "1" }))] })] }), _jsxs(TabsContent, { value: "choix", className: "space-y-6 mt-6", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx(Input, { type: "text", placeholder: "Rechercher un encadrant par nom, sp\u00E9cialit\u00E9 ou d\u00E9partement...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] }), _jsx("div", { className: "space-y-4", children: isLoading ? (_jsx(Card, { children: _jsxs(CardContent, { className: "py-8 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Chargement des encadrants..." })] }) })) : error ? (_jsx(Card, { children: _jsxs(CardContent, { className: "py-8 text-center", children: [_jsx(AlertCircle, { className: "h-12 w-12 mx-auto mb-4 text-red-500" }), _jsx("p", { className: "text-red-600", children: error })] }) })) : encadrantsFiltres.length > 0 ? (encadrantsFiltres.map((encadrant) => (_jsx(Card, { className: `cursor-pointer transition-all ${(encadrantSelectionne === null || encadrantSelectionne === void 0 ? void 0 : encadrantSelectionne.id) === encadrant.id
                                                ? 'border-primary border-2 bg-primary-50'
                                                : 'hover:border-primary hover:shadow-md'}`, onClick: () => setEncadrantSelectionne(encadrant), children: _jsx(CardContent, { className: "p-4", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex items-start gap-4 flex-1", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-3", children: _jsx(UserCheck, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsxs("h3", { className: "font-semibold text-gray-900", children: [encadrant.grade, " ", encadrant.prenom, " ", encadrant.nom] }), (encadrantSelectionne === null || encadrantSelectionne === void 0 ? void 0 : encadrantSelectionne.id) === encadrant.id && (_jsx(Badge, { variant: "default", children: "S\u00E9lectionn\u00E9" }))] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600 mb-2", children: [_jsx(Mail, { className: "h-4 w-4" }), _jsx("span", { children: encadrant.email })] }), _jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [encadrant.specialite && (_jsx(Badge, { variant: "outline", children: encadrant.specialite })), _jsx(Badge, { variant: "outline", children: encadrant.departement }), _jsxs(Badge, { variant: "outline", children: [encadrant.nombreEtudiantsEncadres, " \u00E9tudiant(s) encadr\u00E9(s)"] }), (() => {
                                                                                const places = getPlacesDisponibles(encadrant);
                                                                                if (places === null) {
                                                                                    return (_jsxs(Badge, { variant: "outline", className: "bg-primary-50 text-primary-700 border-primary-300", children: [_jsx(Users, { className: "h-3 w-3 mr-1" }), "Places illimit\u00E9es"] }));
                                                                                }
                                                                                else if (places === 0) {
                                                                                    return (_jsxs(Badge, { variant: "outline", className: "bg-red-50 text-red-700 border-red-300", children: [_jsx(Users, { className: "h-3 w-3 mr-1" }), "Plein"] }));
                                                                                }
                                                                                else {
                                                                                    return (_jsxs(Badge, { variant: "outline", className: "bg-green-50 text-green-700 border-green-300", children: [_jsx(Users, { className: "h-3 w-3 mr-1" }), places, " place", places > 1 ? 's' : '', " disponible", places > 1 ? 's' : ''] }));
                                                                                }
                                                                            })()] })] })] }) }) }) }, encadrant.id)))) : (_jsx(Card, { children: _jsx(CardContent, { className: "py-8 text-center", children: _jsx("p", { className: "text-gray-600", children: searchQuery ? 'Aucun encadrant trouvé' : 'Aucun encadrant disponible' }) }) })) }), encadrantSelectionne && !estSuiveur && (_jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: handleValider, className: "gap-2", disabled: !!demandeEnCours && demandeEnCours.statut === 'en_attente', children: ["Envoyer la demande", _jsx(ArrowRight, { className: "h-4 w-4" })] }) })), estSuiveur && encadrantSelectionne && (_jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4", children: _jsx("p", { className: "text-sm text-blue-800", children: "Votre bin\u00F4me a s\u00E9lectionn\u00E9 cet encadrant." }) }))] }), _jsx(TabsContent, { value: "attente", className: "space-y-6 mt-6", children: demandeEnCours ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 bg-primary-50 border border-primary-200 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "bg-primary-100 rounded-full p-2", children: _jsx(Mail, { className: "h-5 w-5 text-primary" }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("h3", { className: "font-semibold text-gray-900 mb-1", children: ["Demande envoy\u00E9e \u00E0 ", demandeEnCours.encadrant.prenom, " ", demandeEnCours.encadrant.nom] }), _jsx("p", { className: "text-sm text-gray-600", children: demandeEnCours.encadrant.email }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["Envoy\u00E9e le ", formatDate(demandeEnCours.dateDemande)] })] }), demandeEnCours.statut === 'en_attente' && (_jsxs(Badge, { variant: "secondary", className: "bg-yellow-100 text-yellow-800 border-yellow-300", children: [_jsx(Clock, { className: "h-3 w-3 mr-1" }), "En attente"] })), demandeEnCours.statut === 'acceptee' && (_jsxs(Badge, { variant: "default", className: "bg-green-600 text-white", children: [_jsx(CheckCircle, { className: "h-3 w-3 mr-1" }), "Accept\u00E9e"] })), demandeEnCours.statut === 'refusee' && (_jsxs(Badge, { variant: "secondary", className: "bg-red-100 text-red-800 border-red-300", children: [_jsx(XCircle, { className: "h-3 w-3 mr-1" }), "Refus\u00E9e"] }))] }) }), _jsxs("div", { className: "p-4 bg-gray-50 border border-gray-200 rounded-lg", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: "Dossier concern\u00E9" }), _jsx("p", { className: "text-sm text-gray-700", children: demandeEnCours.dossierMemoire.titre }), demandeEnCours.dossierMemoire.description && (_jsx("p", { className: "text-xs text-gray-600 mt-1", children: demandeEnCours.dossierMemoire.description }))] }), demandeEnCours.statut === 'en_attente' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Clock, { className: "h-5 w-5 text-blue-600 mt-0.5" }), _jsx("div", { className: "flex-1", children: _jsx("p", { className: "text-sm text-blue-900", children: "Votre demande est en cours d'examen par l'encadrant. Vous recevrez une notification d\u00E8s qu'une r\u00E9ponse sera disponible." }) })] }) }), _jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: handleAnnulerDemande, variant: "outline", className: "gap-2", children: [_jsx(XCircle, { className: "h-4 w-4" }), "Annuler la demande"] }) })] })), demandeEnCours.statut === 'acceptee' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 bg-green-50 border border-green-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CheckCircle, { className: "h-5 w-5 text-green-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-green-900 mb-1", children: "Demande accept\u00E9e !" }), _jsx("p", { className: "text-sm text-green-700", children: "Votre encadrant a accept\u00E9 votre demande. Vous pouvez maintenant passer \u00E0 l'\u00E9tape suivante." }), demandeEnCours.dateReponse && (_jsxs("p", { className: "text-xs text-green-600 mt-2", children: ["R\u00E9ponse re\u00E7ue le ", formatDate(demandeEnCours.dateReponse)] }))] })] }) }), _jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: handleContinuer, className: "gap-2", disabled: estSuiveur, children: [estSuiveur ? 'Attente de progression' : 'Continuer vers l\'étape suivante', _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] })), demandeEnCours.statut === 'refusee' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "p-4 bg-red-50 border border-red-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-red-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-red-900 mb-1", children: "Motif de refus" }), _jsx("p", { className: "text-sm text-red-700", children: demandeEnCours.motifRefus }), demandeEnCours.dateReponse && (_jsxs("p", { className: "text-xs text-red-600 mt-2", children: ["R\u00E9ponse re\u00E7ue le ", formatDate(demandeEnCours.dateReponse)] }))] })] }) }), _jsx("div", { className: "p-4 bg-orange-50 border border-orange-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(AlertCircle, { className: "h-5 w-5 text-orange-600 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-orange-900 mb-1", children: "Demande refus\u00E9e" }), _jsx("p", { className: "text-sm text-orange-700", children: "Vous pouvez choisir un autre encadrant en retournant \u00E0 l'onglet de choix." })] })] }) }), _jsx("div", { className: "flex justify-end pt-4 border-t", children: _jsxs(Button, { onClick: handleRetourChoix, variant: "outline", className: "gap-2", children: ["Choisir un autre encadrant", _jsx(ArrowRight, { className: "h-4 w-4" })] }) })] }))] })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(Clock, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-600", children: "Aucune demande en cours" }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Veuillez d'abord choisir un encadrant dans l'onglet \"Choix de l'encadrant\"" })] }) })) })] }) })] }) }));
};
export default EtapeChoixEncadrant;
