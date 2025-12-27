import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Edit2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, getYear, getMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TypeEtapePipeline } from '../../models/services/PipelinePeriodes';
const CalendrierAnnuel = ({ annee, etapes, onDateChange, onAjouterPeriode, onModifierPeriode }) => {
    const [moisActuel, setMoisActuel] = useState(new Date(annee, 0, 1));
    const [showModalAjout, setShowModalAjout] = useState(false);
    const [showModalModification, setShowModalModification] = useState(false);
    const [etapeSelectionnee, setEtapeSelectionnee] = useState(null);
    const [dateDebutSelectionnee, setDateDebutSelectionnee] = useState(null);
    const [dateFinSelectionnee, setDateFinSelectionnee] = useState(null);
    const [typePeriode, setTypePeriode] = useState('');
    const [nomPeriode, setNomPeriode] = useState('');
    const joursMois = useMemo(() => {
        const debut = startOfMonth(moisActuel);
        const fin = endOfMonth(moisActuel);
        return eachDayOfInterval({ start: debut, end: fin });
    }, [moisActuel]);
    const premierJourSemaine = useMemo(() => {
        const premierJour = startOfMonth(moisActuel);
        const jourSemaine = getDay(premierJour);
        // Convertir dimanche (0) en 6 pour l'affichage lundi-dimanche
        return jourSemaine === 0 ? 6 : jourSemaine - 1;
    }, [moisActuel]);
    const getCouleurEtape = (statut) => {
        switch (statut) {
            case 'ACTIVE':
                return 'bg-primary text-white border-primary';
            case 'TERMINEE':
                return 'bg-green-100 text-green-700 border-green-300';
            case 'PAS_COMMENCEE':
                return 'bg-gray-100 text-gray-700 border-gray-300';
            default:
                return 'bg-blue-100 text-blue-700 border-blue-300';
        }
    };
    const getEtapesPourDate = (date) => {
        return etapes.filter(etape => {
            if (!etape.dateDebut)
                return false;
            const dateDebut = new Date(etape.dateDebut);
            const dateFin = etape.dateFin ? new Date(etape.dateFin) : dateDebut;
            // Normaliser les dates (sans heures)
            const dateNormalisee = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const debutNormalise = new Date(dateDebut.getFullYear(), dateDebut.getMonth(), dateDebut.getDate());
            const finNormalise = new Date(dateFin.getFullYear(), dateFin.getMonth(), dateFin.getDate());
            return dateNormalisee >= debutNormalise && dateNormalisee <= finNormalise;
        });
    };
    const handleAjouterPeriode = () => {
        if (!typePeriode || !dateDebutSelectionnee || !dateFinSelectionnee || !onAjouterPeriode)
            return;
        onAjouterPeriode(typePeriode, dateDebutSelectionnee, dateFinSelectionnee, nomPeriode || undefined);
        setShowModalAjout(false);
        setTypePeriode('');
        setNomPeriode('');
        setDateDebutSelectionnee(null);
        setDateFinSelectionnee(null);
    };
    const handleModifierPeriode = () => {
        if (!etapeSelectionnee || !dateDebutSelectionnee || !dateFinSelectionnee || !onModifierPeriode)
            return;
        onModifierPeriode(etapeSelectionnee.id, dateDebutSelectionnee, dateFinSelectionnee);
        setShowModalModification(false);
        setEtapeSelectionnee(null);
        setDateDebutSelectionnee(null);
        setDateFinSelectionnee(null);
    };
    const handleDateClick = (date) => {
        const etapesDate = getEtapesPourDate(date);
        if (etapesDate.length > 0) {
            // Ouvrir modal de modification
            const etape = etapesDate[0];
            setEtapeSelectionnee(etape);
            setDateDebutSelectionnee(etape.dateDebut || new Date());
            setDateFinSelectionnee(etape.dateFin || etape.dateDebut || new Date());
            setShowModalModification(true);
        }
        else {
            // Ouvrir modal d'ajout avec la date pré-remplie
            setDateDebutSelectionnee(date);
            setDateFinSelectionnee(date);
            setShowModalAjout(true);
        }
    };
    const formatDateForInput = (date) => {
        return date.toISOString().split('T')[0];
    };
    const typesPeriodesDisponibles = [
        { value: TypeEtapePipeline.DEPOT_SUJET_ET_ENCADREMENT, label: 'Dépôt Sujet et Choix d\'Encadrant' },
        { value: TypeEtapePipeline.VALIDATION_SUJETS, label: 'Validation des Sujets' },
        { value: TypeEtapePipeline.PRELECTURE, label: 'Pré-lecture' },
        { value: TypeEtapePipeline.RENSEIGNEMENT_DISPONIBILITE, label: 'Renseignement Disponibilité' },
        { value: TypeEtapePipeline.DEPOT_FINAL, label: 'Dépôt Final' },
        { value: TypeEtapePipeline.SESSION_SOUTENANCE, label: 'Session de Soutenance' },
        { value: TypeEtapePipeline.VALIDATION_CORRECTIONS, label: 'Validation Corrections' }
    ];
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "h-5 w-5 text-primary" }), "Calendrier ", format(moisActuel, 'MMMM yyyy', { locale: fr })] }), _jsx(CardDescription, { children: "Cliquez sur une date pour ajouter ou modifier une p\u00E9riode" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setMoisActuel(subMonths(moisActuel, 1)), children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setMoisActuel(new Date(annee, 0, 1)), children: getYear(moisActuel) }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setMoisActuel(addMonths(moisActuel, 1)), children: _jsx(ChevronRight, { className: "h-4 w-4" }) }), _jsxs(Button, { variant: "default", size: "sm", onClick: () => {
                                        setDateDebutSelectionnee(new Date());
                                        setDateFinSelectionnee(new Date());
                                        setShowModalAjout(true);
                                    }, children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Ajouter"] })] })] }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "grid grid-cols-7 gap-1 mb-2", children: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((jour, i) => (_jsx("div", { className: "text-center text-xs font-medium text-gray-500 py-2", children: jour }, i))) }), _jsxs("div", { className: "grid grid-cols-7 gap-1", children: [Array.from({ length: premierJourSemaine }).map((_, i) => (_jsx("div", { className: "aspect-square" }, `empty-${i}`))), joursMois.map((date, index) => {
                                const etapesDate = getEtapesPourDate(date);
                                const estAujourdhui = date.toDateString() === new Date().toDateString();
                                const estDansMois = getMonth(date) === getMonth(moisActuel);
                                return (_jsxs("div", { className: `aspect-square border rounded-lg p-1 text-xs relative cursor-pointer transition-colors ${estAujourdhui ? 'ring-2 ring-primary' : ''} ${estDansMois ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}`, onClick: () => handleDateClick(date), children: [_jsx("div", { className: `font-medium mb-1 ${estDansMois ? 'text-gray-900' : 'text-gray-400'}`, children: format(date, 'd') }), _jsxs("div", { className: "space-y-0.5", children: [etapesDate.slice(0, 2).map((etape, idx) => (_jsx("div", { className: `text-[10px] px-1 py-0.5 rounded truncate border ${getCouleurEtape(etape.statut)}`, title: etape.nom, children: etape.nom.substring(0, 12) }, idx))), etapesDate.length > 2 && (_jsxs("div", { className: "text-[10px] text-gray-500 px-1", children: ["+", etapesDate.length - 2] }))] })] }, index));
                            })] }), etapes.filter(e => {
                        if (!e.dateDebut)
                            return false;
                        const moisEtape = getMonth(e.dateDebut);
                        return moisEtape === getMonth(moisActuel);
                    }).length > 0 && (_jsxs("div", { className: "mt-4 pt-4 border-t", children: [_jsx("h4", { className: "font-semibold text-sm mb-2", children: "P\u00E9riodes du mois" }), _jsx("div", { className: "space-y-1", children: etapes
                                    .filter(e => {
                                    if (!e.dateDebut)
                                        return false;
                                    const moisEtape = getMonth(e.dateDebut);
                                    return moisEtape === getMonth(moisActuel);
                                })
                                    .map((etape, idx) => (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("div", { className: `w-3 h-3 rounded border ${getCouleurEtape(etape.statut)}` }), _jsx("span", { className: "font-medium", children: etape.nom }), _jsxs("span", { className: "text-gray-500 text-xs", children: ["(", format(etape.dateDebut || new Date(), 'dd/MM'), " - ", format(etape.dateFin || etape.dateDebut || new Date(), 'dd/MM'), ")"] }), _jsx(Button, { size: "sm", variant: "ghost", className: "h-6 px-2 ml-auto", onClick: () => {
                                                setEtapeSelectionnee(etape);
                                                setDateDebutSelectionnee(etape.dateDebut || new Date());
                                                setDateFinSelectionnee(etape.dateFin || etape.dateDebut || new Date());
                                                setShowModalModification(true);
                                            }, children: _jsx(Edit2, { className: "h-3 w-3" }) })] }, idx))) })] }))] }), _jsx(Dialog, { open: showModalAjout, onOpenChange: setShowModalAjout, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Ajouter une p\u00E9riode" }), _jsx(DialogDescription, { children: "Cr\u00E9ez une nouvelle p\u00E9riode dans le calendrier" })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "typePeriode", children: "Type de p\u00E9riode" }), _jsxs(Select, { value: typePeriode, onValueChange: (value) => setTypePeriode(value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "S\u00E9lectionnez un type" }) }), _jsx(SelectContent, { children: typesPeriodesDisponibles.map((type) => (_jsx(SelectItem, { value: type.value, children: type.label }, type.value))) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "nomPeriode", children: "Nom (optionnel)" }), _jsx(Input, { id: "nomPeriode", placeholder: "Nom de la p\u00E9riode", value: nomPeriode, onChange: (e) => setNomPeriode(e.target.value) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dateDebutAjout", children: "Date de d\u00E9but" }), _jsx(Input, { id: "dateDebutAjout", type: "date", value: dateDebutSelectionnee ? formatDateForInput(dateDebutSelectionnee) : '', onChange: (e) => setDateDebutSelectionnee(new Date(e.target.value)) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dateFinAjout", children: "Date de fin" }), _jsx(Input, { id: "dateFinAjout", type: "date", value: dateFinSelectionnee ? formatDateForInput(dateFinSelectionnee) : '', onChange: (e) => setDateFinSelectionnee(new Date(e.target.value)) })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowModalAjout(false), children: "Annuler" }), _jsx(Button, { onClick: handleAjouterPeriode, disabled: !typePeriode || !dateDebutSelectionnee || !dateFinSelectionnee, children: "Ajouter" })] })] }) }), _jsx(Dialog, { open: showModalModification, onOpenChange: setShowModalModification, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Modifier la p\u00E9riode" }), _jsxs(DialogDescription, { children: ["Modifiez les dates de la p\u00E9riode \"", etapeSelectionnee === null || etapeSelectionnee === void 0 ? void 0 : etapeSelectionnee.nom, "\""] })] }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsx("div", { className: "space-y-2", children: _jsxs(Label, { children: ["Type: ", etapeSelectionnee === null || etapeSelectionnee === void 0 ? void 0 : etapeSelectionnee.nom] }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dateDebutModif", children: "Date de d\u00E9but" }), _jsx(Input, { id: "dateDebutModif", type: "date", value: dateDebutSelectionnee ? formatDateForInput(dateDebutSelectionnee) : '', onChange: (e) => setDateDebutSelectionnee(new Date(e.target.value)) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "dateFinModif", children: "Date de fin" }), _jsx(Input, { id: "dateFinModif", type: "date", value: dateFinSelectionnee ? formatDateForInput(dateFinSelectionnee) : '', onChange: (e) => setDateFinSelectionnee(new Date(e.target.value)) })] })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setShowModalModification(false), children: "Annuler" }), _jsx(Button, { onClick: handleModifierPeriode, disabled: !dateDebutSelectionnee || !dateFinSelectionnee, children: "Modifier" })] })] }) })] }));
};
export default CalendrierAnnuel;
