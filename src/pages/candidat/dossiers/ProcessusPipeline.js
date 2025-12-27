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
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, FileText, Upload, Lock } from 'lucide-react';
import { EtapeDossier } from '../../../models/dossier';
import { EtapePipeline } from '../../../models/pipeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import dossierService from '../../../services/dossier.service';
import EtapeChoixSujet from './etapes/EtapeChoixSujet';
import EtapeChoixBinome from './etapes/EtapeChoixBinome';
import EtapeChoixEncadrant from './etapes/EtapeChoixEncadrant';
import EtapeValidationCommission from './etapes/EtapeValidationCommission';
import EtapeRedaction from './etapes/EtapeRedaction';
import EtapePrelecture from './etapes/EtapePrelecture';
import EtapeDepotFinal from './etapes/EtapeDepotFinal';
import EtapeSoutenance from './etapes/EtapeSoutenance';
import EtapeCorrection from './etapes/EtapeCorrection';
// Mapping entre EtapeDossier et EtapePipeline
const getEtapePipelineFromDossier = (etape) => {
    switch (etape) {
        case EtapeDossier.CHOIX_SUJET:
            return EtapePipeline.CHOIX_SUJET;
        case EtapeDossier.CHOIX_BINOME:
            return EtapePipeline.CHOIX_BINOME;
        case EtapeDossier.CHOIX_ENCADRANT:
            return EtapePipeline.CHOIX_ENCADRANT;
        case EtapeDossier.VALIDATION_SUJET:
        case EtapeDossier.VALIDATION_COMMISSION:
            return EtapePipeline.VALIDATION_COMMISSION;
        case EtapeDossier.REDACTION:
            return EtapePipeline.REDACTION;
        case EtapeDossier.PRELECTURE:
            return EtapePipeline.PRELECTURE;
        case EtapeDossier.DEPOT_FINAL:
            return EtapePipeline.DEPOT_FINAL;
        case EtapeDossier.SOUTENANCE:
            return EtapePipeline.SOUTENANCE;
        case EtapeDossier.CORRECTION:
            return EtapePipeline.CORRECTION;
        case EtapeDossier.TERMINE:
            return EtapePipeline.TERMINE;
        default:
            return EtapePipeline.CHOIX_SUJET;
    }
};
// Mapping inverse : EtapePipeline vers EtapeDossier
const getEtapeDossierFromPipeline = (etape) => {
    switch (etape) {
        case EtapePipeline.CHOIX_SUJET:
            return EtapeDossier.CHOIX_SUJET;
        case EtapePipeline.CHOIX_BINOME:
            return EtapeDossier.CHOIX_BINOME;
        case EtapePipeline.CHOIX_ENCADRANT:
            return EtapeDossier.CHOIX_ENCADRANT;
        case EtapePipeline.VALIDATION_COMMISSION:
            return EtapeDossier.VALIDATION_COMMISSION;
        case EtapePipeline.REDACTION:
            return EtapeDossier.REDACTION;
        case EtapePipeline.PRELECTURE:
            return EtapeDossier.PRELECTURE;
        case EtapePipeline.DEPOT_FINAL:
            return EtapeDossier.DEPOT_FINAL;
        case EtapePipeline.SOUTENANCE:
            return EtapeDossier.SOUTENANCE;
        case EtapePipeline.CORRECTION:
            return EtapeDossier.CORRECTION;
        case EtapePipeline.TERMINE:
            return EtapeDossier.TERMINE;
        default:
            return EtapeDossier.CHOIX_SUJET;
    }
};
// Étapes pour l'onglet "Dépôt sujet"
const ETAPES_DEPOT_SUJET = [
    { id: EtapePipeline.CHOIX_SUJET, nom: 'Choix du sujet', description: 'Sélectionnez un sujet pour votre mémoire' },
    { id: EtapePipeline.CHOIX_BINOME, nom: 'Choix du binôme', description: 'Trouvez un partenaire pour votre mémoire' },
    { id: EtapePipeline.CHOIX_ENCADRANT, nom: 'Choix de l\'encadrant', description: 'Sélectionnez votre encadrant pédagogique' },
    { id: EtapePipeline.VALIDATION_COMMISSION, nom: 'Validation commission', description: 'Validation de votre dossier par la commission' }
];
// Étapes pour l'onglet "Dépôt dossier"
const ETAPES_DEPOT_DOSSIER = [
    { id: EtapePipeline.REDACTION, nom: 'Rédaction', description: 'Rédigez votre mémoire et gérez vos tickets' },
    { id: EtapePipeline.PRELECTURE, nom: 'Prélecture', description: 'Prélecture de votre mémoire par l\'encadrant' },
    { id: EtapePipeline.DEPOT_FINAL, nom: 'Dépôt final', description: 'Dépôt de la version finale' },
    { id: EtapePipeline.SOUTENANCE, nom: 'Soutenance', description: 'Présentation de votre mémoire' },
    { id: EtapePipeline.CORRECTION, nom: 'Correction', description: 'Correction du mémoire (optionnelle)' }
];
const ProcessusPipeline = ({ dossier, estSuiveur = false }) => {
    const etapeActuelleDossier = useMemo(() => getEtapePipelineFromDossier(dossier.etape), [dossier.etape]);
    // L'étape courante est directement celle du dossier backend (pas de localStorage)
    const [etapeCourante, setEtapeCourante] = useState(etapeActuelleDossier);
    const [activeTab, setActiveTab] = useState('depot-sujet');
    // Synchroniser avec le dossier si l'étape change en externe (ex: backend update)
    useEffect(() => {
        // Si l'étape du dossier est plus avancée que l'étape courante, mettre à jour
        if (etapeActuelleDossier > etapeCourante) {
            setEtapeCourante(etapeActuelleDossier);
        }
        // Déterminer l'onglet actif selon l'étape courante
        if (etapeCourante <= EtapePipeline.VALIDATION_COMMISSION) {
            setActiveTab('depot-sujet');
        }
        else {
            setActiveTab('depot-dossier');
        }
    }, [etapeActuelleDossier, etapeCourante]);
    // Déterminer l'onglet actif selon l'étape courante
    useEffect(() => {
        if (etapeCourante <= EtapePipeline.VALIDATION_COMMISSION) {
            setActiveTab('depot-sujet');
        }
        else {
            setActiveTab('depot-dossier');
        }
    }, [etapeCourante]);
    // Étapes complétées pour l'onglet actif
    const etapesCompletees = useMemo(() => {
        if (activeTab === 'depot-sujet') {
            return ETAPES_DEPOT_SUJET.filter(etape => etape.id < etapeCourante);
        }
        else {
            return ETAPES_DEPOT_DOSSIER.filter(etape => etape.id < etapeCourante);
        }
    }, [etapeCourante, activeTab]);
    // Étape active
    const etapeActive = useMemo(() => {
        if (activeTab === 'depot-sujet') {
            return ETAPES_DEPOT_SUJET.find(etape => etape.id === etapeCourante);
        }
        else {
            return ETAPES_DEPOT_DOSSIER.find(etape => etape.id === etapeCourante);
        }
    }, [etapeCourante, activeTab]);
    // Vérifier si l'onglet "Dépôt dossier" est débloqué (validation commission terminée)
    const depotDossierDebloque = useMemo(() => {
        return etapeCourante > EtapePipeline.VALIDATION_COMMISSION;
    }, [etapeCourante]);
    const [isSavingStep, setIsSavingStep] = useState(false);
    const handleEtapeComplete = () => __awaiter(void 0, void 0, void 0, function* () {
        const nextEtape = etapeCourante + 1;
        if (nextEtape <= EtapePipeline.TERMINE) {
            try {
                setIsSavingStep(true);
                // Appel API pour persister l'étape dans le backend
                const etapeDossier = getEtapeDossierFromPipeline(nextEtape);
                yield dossierService.changerEtape(dossier.id, etapeDossier);
                // Mettre à jour l'état local après succès de l'API
                setEtapeCourante(nextEtape);
                // Si on termine la validation commission, débloquer l'onglet "Dépôt dossier"
                if (nextEtape === EtapePipeline.REDACTION) {
                    setActiveTab('depot-dossier');
                }
                console.log(`✅ Étape ${etapeDossier} sauvegardée avec succès`);
            }
            catch (error) {
                console.error('❌ Erreur lors de la sauvegarde de etape:', error);
                // On met quand même à jour l'état local pour ne pas bloquer l'utilisateur
                setEtapeCourante(nextEtape);
                if (nextEtape === EtapePipeline.REDACTION) {
                    setActiveTab('depot-dossier');
                }
            }
            finally {
                setIsSavingStep(false);
            }
        }
    });
    const renderEtapeContent = () => {
        switch (etapeCourante) {
            // Onglet 1 : Dépôt sujet
            case EtapePipeline.CHOIX_SUJET:
                return _jsx(EtapeChoixSujet, { dossier: dossier, onComplete: handleEtapeComplete, estSuiveur: estSuiveur });
            case EtapePipeline.CHOIX_BINOME:
                return _jsx(EtapeChoixBinome, { dossier: dossier, onComplete: handleEtapeComplete, estSuiveur: estSuiveur });
            case EtapePipeline.CHOIX_ENCADRANT:
                return _jsx(EtapeChoixEncadrant, { dossier: dossier, onComplete: handleEtapeComplete, estSuiveur: estSuiveur });
            case EtapePipeline.VALIDATION_COMMISSION:
                return _jsx(EtapeValidationCommission, { dossier: dossier, onComplete: handleEtapeComplete, estSuiveur: estSuiveur });
            // Onglet 2 : Dépôt dossier
            case EtapePipeline.REDACTION:
                return _jsx(EtapeRedaction, { dossier: dossier, onComplete: handleEtapeComplete, estSuiveur: estSuiveur });
            case EtapePipeline.PRELECTURE:
                return _jsx(EtapePrelecture, { dossier: dossier, onComplete: handleEtapeComplete, estSuiveur: estSuiveur });
            case EtapePipeline.DEPOT_FINAL:
                return _jsx(EtapeDepotFinal, { dossier: dossier, onComplete: handleEtapeComplete, estSuiveur: estSuiveur });
            case EtapePipeline.SOUTENANCE:
                return _jsx(EtapeSoutenance, { dossier: dossier, onComplete: handleEtapeComplete, estSuiveur: estSuiveur });
            case EtapePipeline.CORRECTION:
                return _jsx(EtapeCorrection, { dossier: dossier, onComplete: handleEtapeComplete, estSuiveur: estSuiveur });
            default:
                return (_jsx(Card, { children: _jsx(CardContent, { className: "py-12 text-center", children: _jsx("p", { className: "text-gray-600", children: "\u00C9tape en cours de d\u00E9veloppement" }) }) }));
        }
    };
    // Obtenir les étapes de l'onglet actif
    const etapesActives = activeTab === 'depot-sujet' ? ETAPES_DEPOT_SUJET : ETAPES_DEPOT_DOSSIER;
    return (_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Processus de cr\u00E9ation du m\u00E9moire" }), _jsx(CardDescription, { children: "Suivez les \u00E9tapes pour compl\u00E9ter votre dossier de m\u00E9moire" })] }), _jsx(CardContent, { children: _jsxs(Tabs, { value: activeTab, onValueChange: (value) => {
                            // Empêcher de passer à "Dépôt dossier" si pas encore débloqué
                            if (value === 'depot-dossier' && !depotDossierDebloque) {
                                return;
                            }
                            setActiveTab(value);
                        }, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 mb-6", children: [_jsxs(TabsTrigger, { value: "depot-sujet", className: "gap-2", children: [_jsx(FileText, { className: "h-4 w-4" }), "D\u00E9p\u00F4t sujet"] }), _jsxs(TabsTrigger, { value: "depot-dossier", className: "gap-2", disabled: !depotDossierDebloque, children: [_jsx(Upload, { className: "h-4 w-4" }), "D\u00E9p\u00F4t dossier", !depotDossierDebloque && (_jsx(Badge, { variant: "secondary", className: "ml-2 bg-gray-200 text-gray-600", children: "Verrouill\u00E9" }))] })] }), _jsxs(TabsContent, { value: "depot-sujet", className: "space-y-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute top-5 left-0 right-0 h-0.5 bg-gray-200", children: _jsx("div", { className: "h-full bg-primary transition-all duration-500", style: {
                                                        width: etapeCourante <= EtapePipeline.VALIDATION_COMMISSION
                                                            ? `${((etapeCourante - EtapePipeline.CHOIX_SUJET) / (ETAPES_DEPOT_SUJET.length - 1)) * 100}%`
                                                            : '100%'
                                                    } }) }), _jsx("div", { className: "relative flex justify-between", children: ETAPES_DEPOT_SUJET.map((etape) => {
                                                    const isComplete = etape.id < etapeCourante;
                                                    const isActive = etape.id === etapeCourante;
                                                    return (_jsxs("div", { className: "flex flex-col items-center", style: { flex: 1 }, children: [_jsx("div", { className: `relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isComplete
                                                                    ? 'bg-primary border-primary text-white'
                                                                    : isActive
                                                                        ? 'bg-primary border-primary text-white'
                                                                        : 'bg-white border-gray-300 text-gray-400'}`, children: isComplete ? (_jsx(CheckCircle, { className: "h-6 w-6" })) : (_jsx(Circle, { className: "h-6 w-6" })) }), _jsx("div", { className: "mt-2 text-center max-w-[120px]", children: _jsx("p", { className: `text-xs font-medium ${isActive ? 'text-primary' : isComplete ? 'text-gray-900' : 'text-gray-500'}`, children: etape.nom }) })] }, etape.id));
                                                }) })] }), etapeCourante <= EtapePipeline.VALIDATION_COMMISSION && (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3 }, children: renderEtapeContent() }, etapeCourante) }))] }), _jsx(TabsContent, { value: "depot-dossier", className: "space-y-6", children: depotDossierDebloque ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute top-5 left-0 right-0 h-0.5 bg-gray-200", children: _jsx("div", { className: "h-full bg-primary transition-all duration-500", style: {
                                                            width: etapeCourante >= EtapePipeline.REDACTION
                                                                ? `${((etapeCourante - EtapePipeline.REDACTION) / (ETAPES_DEPOT_DOSSIER.length - 1)) * 100}%`
                                                                : '0%'
                                                        } }) }), _jsx("div", { className: "relative flex justify-between", children: ETAPES_DEPOT_DOSSIER.map((etape) => {
                                                        const isComplete = etape.id < etapeCourante;
                                                        const isActive = etape.id === etapeCourante;
                                                        return (_jsxs("div", { className: "flex flex-col items-center", style: { flex: 1 }, children: [_jsx("div", { className: `relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isComplete
                                                                        ? 'bg-primary border-primary text-white'
                                                                        : isActive
                                                                            ? 'bg-primary border-primary text-white'
                                                                            : 'bg-white border-gray-300 text-gray-400'}`, children: isComplete ? (_jsx(CheckCircle, { className: "h-6 w-6" })) : (_jsx(Circle, { className: "h-6 w-6" })) }), _jsx("div", { className: "mt-2 text-center max-w-[120px]", children: _jsx("p", { className: `text-xs font-medium ${isActive ? 'text-primary' : isComplete ? 'text-gray-900' : 'text-gray-500'}`, children: etape.nom }) })] }, etape.id));
                                                    }) })] }), etapeCourante >= EtapePipeline.REDACTION && (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: { duration: 0.3 }, children: renderEtapeContent() }, etapeCourante) }))] })) : (_jsx(Card, { children: _jsxs(CardContent, { className: "py-12 text-center", children: [_jsx(Lock, { className: "h-12 w-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-600 mb-2", children: "Onglet verrouill\u00E9" }), _jsx("p", { className: "text-sm text-gray-500", children: "Vous devez terminer toutes les \u00E9tapes du \"D\u00E9p\u00F4t sujet\" pour acc\u00E9der \u00E0 cette section." })] }) })) })] }) })] }) }));
};
export default ProcessusPipeline;
