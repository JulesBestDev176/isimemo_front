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
import { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useAnneesAcademiques, useActiverAnneeAcademique, useCloturerAnneeAcademique } from '../../../hooks/useAnneesAcademiques';
import { useSessionsSoutenance, useOuvrirSessionSoutenance, useFermerSessionSoutenance } from '../../../hooks/useSessionsSoutenance';
import { TypePeriodeValidation, mockPeriodesValidation, changerPeriodeActive } from '../../../models/commission/PeriodeValidation';
import { mockPeriodesDepotSujet } from '../../../models/services/PeriodeDepotSujet';
import { mockPeriodesPrelecture } from '../../../models/services/PeriodePrelecture';
import { mockPeriodesDisponibilite } from '../../../models/services/PeriodeDisponibilite';
import { mockPeriodesDepotFinal } from '../../../models/services/PeriodeDepotFinal';
import { construirePipeline, TypeEtapePipeline, StatutEtape, estDateArrivee, estDatePassee } from '../../../models/services/PipelinePeriodes';
import { PipelinePeriodes, CalendrierAnnuel, ModalNouvelleAnnee, ModalNouvelleSession, ModalNouvellePeriodeValidation } from '../../../components/periodes';
const PeriodesChef = () => {
    var _a, _b, _c, _d;
    const { annees, anneeActive } = useAnneesAcademiques();
    const { activerAnnee } = useActiverAnneeAcademique();
    const { cloturerAnnee } = useCloturerAnneeAcademique();
    const { sessions } = useSessionsSoutenance(anneeActive === null || anneeActive === void 0 ? void 0 : anneeActive.code);
    const { ouvrirSession } = useOuvrirSessionSoutenance();
    const { fermerSession } = useFermerSessionSoutenance();
    const [activeTab, setActiveTab] = useState('pipeline');
    const [showModalNouvelleAnnee, setShowModalNouvelleAnnee] = useState(false);
    const [showModalNouvelleSession, setShowModalNouvelleSession] = useState(false);
    const [showModalNouvellePeriodeValidation, setShowModalNouvellePeriodeValidation] = useState(false);
    const [etapeAModifier, setEtapeAModifier] = useState(null);
    const [periodesValidation, setPeriodesValidation] = useState(mockPeriodesValidation);
    // Récupérer toutes les périodes pour l'année active
    const periodeDepotSujet = useMemo(() => {
        if (!anneeActive)
            return undefined;
        return mockPeriodesDepotSujet.find(p => p.anneeAcademique === anneeActive.code);
    }, [anneeActive]);
    const periodeValidationSujets = useMemo(() => {
        if (!anneeActive)
            return undefined;
        return periodesValidation.find(p => p.anneeAcademique === anneeActive.code && p.type === TypePeriodeValidation.VALIDATION_SUJETS);
    }, [anneeActive, periodesValidation]);
    const periodesPrelecture = useMemo(() => {
        if (!anneeActive)
            return [];
        return mockPeriodesPrelecture.filter(p => p.anneeAcademique === anneeActive.code);
    }, [anneeActive]);
    const periodesDisponibilite = useMemo(() => {
        if (!anneeActive)
            return [];
        return mockPeriodesDisponibilite.filter(p => p.anneeAcademique === anneeActive.code);
    }, [anneeActive]);
    const periodesDepotFinal = useMemo(() => {
        if (!anneeActive)
            return [];
        return mockPeriodesDepotFinal.filter(p => p.anneeAcademique === anneeActive.code);
    }, [anneeActive]);
    const periodesValidationCorrections = useMemo(() => {
        if (!anneeActive)
            return [];
        return periodesValidation.filter(p => p.anneeAcademique === anneeActive.code && p.type === TypePeriodeValidation.VALIDATION_CORRECTIONS);
    }, [anneeActive, periodesValidation]);
    // Construire le pipeline
    const pipeline = useMemo(() => {
        if (!anneeActive)
            return [];
        return construirePipeline(anneeActive, periodeDepotSujet, // Inclut aussi la demande d'encadrement (même période)
        periodeValidationSujets, periodesPrelecture, periodesDisponibilite, periodesDepotFinal, sessions, periodesValidationCorrections);
    }, [
        anneeActive,
        periodeDepotSujet,
        periodeValidationSujets,
        periodesPrelecture,
        periodesDisponibilite,
        periodesDepotFinal,
        sessions,
        periodesValidationCorrections
    ]);
    // Vérifier et activer/désactiver automatiquement les périodes basées sur les dates
    useEffect(() => {
        if (!anneeActive)
            return;
        // Vérifier chaque période et activer/désactiver automatiquement
        pipeline.forEach(etape => {
            if (etape.peutActiver && etape.statut !== StatutEtape.ACTIVE && estDateArrivee(etape.dateDebut)) {
                // Auto-activation possible (mais nécessite confirmation manuelle pour certaines)
                console.log(`Période ${etape.nom} peut être activée`);
            }
            if (etape.peutDesactiver && etape.statut === StatutEtape.ACTIVE && estDatePassee(etape.dateFin)) {
                // Auto-désactivation
                console.log(`Période ${etape.nom} doit être désactivée`);
                // TODO: Implémenter la désactivation automatique
            }
        });
    }, [pipeline, anneeActive]);
    // Handlers
    const handleActiverEtape = (etape) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        if (!etape.peutActiver) {
            alert('Cette période ne peut pas être activée maintenant. Vérifiez les dates et les prérequis.');
            return;
        }
        if (confirm(`Voulez-vous activer la période "${etape.nom}" ?`)) {
            // TODO: Implémenter l'activation selon le type d'étape
            switch (etape.id) {
                case TypeEtapePipeline.DEBUT_ANNEE:
                    if ((_a = etape.donnees) === null || _a === void 0 ? void 0 : _a.anneeAcademique) {
                        yield activerAnnee(etape.donnees.anneeAcademique.idAnnee);
                        window.location.reload();
                    }
                    break;
                case TypeEtapePipeline.FIN_ANNEE:
                    if ((_b = etape.donnees) === null || _b === void 0 ? void 0 : _b.anneeAcademique) {
                        yield cloturerAnnee(etape.donnees.anneeAcademique.idAnnee);
                        window.location.reload();
                    }
                    break;
                case TypeEtapePipeline.SESSION_SOUTENANCE:
                    if ((_c = etape.donnees) === null || _c === void 0 ? void 0 : _c.sessionSoutenance) {
                        yield ouvrirSession(etape.donnees.sessionSoutenance.idSession);
                        window.location.reload();
                    }
                    break;
                case TypeEtapePipeline.VALIDATION_SUJETS:
                case TypeEtapePipeline.VALIDATION_CORRECTIONS:
                    if ((_d = etape.donnees) === null || _d === void 0 ? void 0 : _d.periodeValidation) {
                        changerPeriodeActive(etape.donnees.periodeValidation.type);
                        setPeriodesValidation([...mockPeriodesValidation]);
                    }
                    break;
                default:
                    // Pour les autres périodes, activer directement
                    console.log('Activation de', etape.nom);
            }
        }
    });
    const handleDesactiverEtape = (etape) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!etape.peutDesactiver) {
            alert('Cette période ne peut pas être désactivée maintenant.');
            return;
        }
        if (confirm(`Voulez-vous désactiver la période "${etape.nom}" ?`)) {
            // TODO: Implémenter la désactivation selon le type d'étape
            switch (etape.id) {
                case TypeEtapePipeline.SESSION_SOUTENANCE:
                    if ((_a = etape.donnees) === null || _a === void 0 ? void 0 : _a.sessionSoutenance) {
                        yield fermerSession(etape.donnees.sessionSoutenance.idSession);
                        window.location.reload();
                    }
                    break;
                case TypeEtapePipeline.VALIDATION_SUJETS:
                case TypeEtapePipeline.VALIDATION_CORRECTIONS:
                    changerPeriodeActive(TypePeriodeValidation.AUCUNE);
                    setPeriodesValidation([...mockPeriodesValidation]);
                    break;
                default:
                    console.log('Désactivation de', etape.nom);
            }
        }
    });
    const handleModifierEtape = (etape) => {
        setEtapeAModifier(etape);
        // Ouvrir le modal approprié selon le type
        switch (etape.id) {
            case TypeEtapePipeline.SESSION_SOUTENANCE:
                setShowModalNouvelleSession(true);
                break;
            case TypeEtapePipeline.VALIDATION_SUJETS:
            case TypeEtapePipeline.VALIDATION_CORRECTIONS:
                setShowModalNouvellePeriodeValidation(true);
                break;
            default:
                console.log('Modification de', etape.nom);
        }
    };
    const handleDateChange = (etapeId, type, nouvelleDate) => {
        // TODO: Implémenter la modification de date via API
        console.log('Modification date', etapeId, type, nouvelleDate);
    };
    const handleAjouterPeriode = (type, dateDebut, dateFin, nom) => {
        // TODO: Implémenter l'ajout de période via API
        console.log('Ajout période', type, dateDebut, dateFin, nom);
        // Pour l'instant, on peut ouvrir le modal approprié selon le type
        switch (type) {
            case TypeEtapePipeline.SESSION_SOUTENANCE:
                setShowModalNouvelleSession(true);
                break;
            case TypeEtapePipeline.VALIDATION_SUJETS:
            case TypeEtapePipeline.VALIDATION_CORRECTIONS:
                setShowModalNouvellePeriodeValidation(true);
                break;
            default:
                console.log('Ajout de période', type, 'à implémenter');
        }
    };
    const handleModifierPeriode = (etapeId, dateDebut, dateFin) => {
        // Trouver l'étape à modifier
        const etape = pipeline.find(e => e.id === etapeId);
        if (!etape)
            return;
        // Ouvrir le modal de modification approprié
        handleModifierEtape(etape);
        // TODO: Implémenter la modification de dates via API
        console.log('Modification période', etapeId, dateDebut, dateFin);
    };
    const handleCloturerAnnee = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!anneeActive)
            return;
        // Vérifier que toutes les périodes requises sont terminées
        const etapesRequis = pipeline.filter(e => e.estRequis);
        const toutesTerminees = etapesRequis.every(e => e.statut === StatutEtape.TERMINEE);
        if (!toutesTerminees) {
            alert('Impossible de clôturer l\'année académique. Toutes les périodes requises doivent être terminées.');
            return;
        }
        if (confirm('Êtes-vous sûr de vouloir clôturer cette année académique ? Cette action est irréversible.')) {
            yield cloturerAnnee(anneeActive.idAnnee);
            window.location.reload();
        }
    });
    const handleCreateAnnee = (data) => {
        // TODO: Implémenter la création via API
        console.log('Créer année:', data);
    };
    const handleCreateSession = (data) => {
        // TODO: Implémenter la création via API
        console.log('Créer session:', data);
    };
    const handleCreatePeriodeValidation = (data) => {
        // TODO: Implémenter la création via API
        console.log('Créer période validation:', data);
        changerPeriodeActive(data.type);
        setPeriodesValidation([...mockPeriodesValidation]);
    };
    if (!anneeActive) {
        return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Gestion des P\u00E9riodes" }), _jsx("p", { className: "text-gray-600 mt-1", children: "Aucune ann\u00E9e acad\u00E9mique active" })] }), _jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-gray-500 mb-4", children: "Veuillez activer une ann\u00E9e acad\u00E9mique pour commencer." }), _jsx("button", { onClick: () => setShowModalNouvelleAnnee(true), className: "px-4 py-2 bg-primary text-white rounded hover:bg-primary/90", children: "Cr\u00E9er une nouvelle ann\u00E9e" })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Gestion des P\u00E9riodes" }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["Pipeline des p\u00E9riodes acad\u00E9miques - ", anneeActive.code] })] }), _jsx("div", { className: "flex gap-2", children: _jsx("button", { onClick: handleCloturerAnnee, className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700", disabled: !pipeline.every(e => !e.estRequis || e.statut === StatutEtape.TERMINEE), children: "Cl\u00F4turer l'ann\u00E9e" }) })] }), _jsxs(Tabs, { value: activeTab, onValueChange: (v) => setActiveTab(v), className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [_jsx(TabsTrigger, { value: "pipeline", children: "Pipeline" }), _jsx(TabsTrigger, { value: "calendrier", children: "Calendrier Annuel" })] }), _jsx(TabsContent, { value: "pipeline", className: "space-y-6", children: _jsx(PipelinePeriodes, { etapes: pipeline, onActiver: handleActiverEtape, onDesactiver: handleDesactiverEtape, onModifier: handleModifierEtape }) }), _jsx(TabsContent, { value: "calendrier", className: "space-y-6", children: anneeActive && (_jsx(CalendrierAnnuel, { annee: anneeActive.dateDebut.getFullYear(), etapes: pipeline, onDateChange: handleDateChange, onAjouterPeriode: handleAjouterPeriode, onModifierPeriode: handleModifierPeriode })) })] }), _jsx(ModalNouvelleAnnee, { open: showModalNouvelleAnnee, onOpenChange: setShowModalNouvelleAnnee, onCreate: handleCreateAnnee }), _jsx(ModalNouvelleSession, { open: showModalNouvelleSession, onOpenChange: (open) => {
                    setShowModalNouvelleSession(open);
                    if (!open)
                        setEtapeAModifier(null);
                }, onCreate: handleCreateSession, etapeAModifier: (etapeAModifier === null || etapeAModifier === void 0 ? void 0 : etapeAModifier.id) === TypeEtapePipeline.SESSION_SOUTENANCE
                    ? {
                        nom: etapeAModifier.nom.replace(/^Soutenance\s+/, ''),
                        dateDebut: etapeAModifier.dateDebut,
                        dateFin: etapeAModifier.dateFin,
                        typeSession: (_b = (_a = etapeAModifier.donnees) === null || _a === void 0 ? void 0 : _a.sessionSoutenance) === null || _b === void 0 ? void 0 : _b.typeSession
                    }
                    : null }), _jsx(ModalNouvellePeriodeValidation, { open: showModalNouvellePeriodeValidation, onOpenChange: (open) => {
                    setShowModalNouvellePeriodeValidation(open);
                    if (!open)
                        setEtapeAModifier(null);
                }, etapeAModifier: (etapeAModifier === null || etapeAModifier === void 0 ? void 0 : etapeAModifier.id) === TypeEtapePipeline.VALIDATION_SUJETS || (etapeAModifier === null || etapeAModifier === void 0 ? void 0 : etapeAModifier.id) === TypeEtapePipeline.VALIDATION_CORRECTIONS
                    ? {
                        type: ((_d = (_c = etapeAModifier.donnees) === null || _c === void 0 ? void 0 : _c.periodeValidation) === null || _d === void 0 ? void 0 : _d.type) || (etapeAModifier.id === TypeEtapePipeline.VALIDATION_SUJETS ? TypePeriodeValidation.VALIDATION_SUJETS : TypePeriodeValidation.VALIDATION_CORRECTIONS),
                        dateDebut: etapeAModifier.dateDebut,
                        dateFin: etapeAModifier.dateFin
                    }
                    : null, onCreate: handleCreatePeriodeValidation })] }));
};
export default PeriodesChef;
