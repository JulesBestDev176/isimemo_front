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
// Force HMR - 2025-12-26
import { useState, useEffect, useMemo } from 'react';
import { FileText, Download, Users, User, BookOpen, Info, Search, ExternalLink, FileSpreadsheet, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateFicheDepotPDF } from '../../services/pdf.service';
import { toast } from 'sonner';
import dossierService from '../../services/dossier.service';
const API_BASE_URL = 'http://localhost:3001/api';
const DossiersList = () => {
    var _a, _b, _c, _d, _e, _f, _g;
    const [dossiers, setDossiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDossier, setSelectedDossier] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportType, setExportType] = useState('COMMISSION');
    // Filters state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('Tous');
    const [typeFilter, setTypeFilter] = useState('Tous');
    useEffect(() => {
        fetchDossiers();
    }, []);
    useEffect(() => {
        if (selectedDossier) {
            fetchNotes(selectedDossier.id);
        }
    }, [selectedDossier]);
    const fetchDossiers = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch(`${API_BASE_URL}/personnel/dossiers`);
            const data = yield response.json();
            setDossiers(data);
        }
        catch (error) {
            console.error('Erreur chargement dossiers:', error);
        }
        finally {
            setLoading(false);
        }
    });
    const fetchNotes = (dossierId) => __awaiter(void 0, void 0, void 0, function* () {
        setLoadingNotes(true);
        try {
            const response = yield fetch(`${API_BASE_URL}/dossiers/${dossierId}/notes`);
            const data = yield response.json();
            setNotes(data);
        }
        catch (error) {
            console.error('Erreur chargement notes:', error);
        }
        finally {
            setLoadingNotes(false);
        }
    });
    const filteredDossiers = useMemo(() => {
        return dossiers.filter(d => {
            var _a, _b;
            const matchesSearch = d.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ((_a = d.candidatPrincipal) === null || _a === void 0 ? void 0 : _a.nom.toLowerCase().includes(searchQuery.toLowerCase())) ||
                ((_b = d.candidatPrincipal) === null || _b === void 0 ? void 0 : _b.prenom.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (d.candidatBinome && (d.candidatBinome.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    d.candidatBinome.prenom.toLowerCase().includes(searchQuery.toLowerCase())));
            const matchesStatus = statusFilter === 'Tous' || d.statut === statusFilter;
            const matchesType = typeFilter === 'Tous' || d.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [dossiers, searchQuery, statusFilter, typeFilter]);
    const registerFicheDocument = (dossierId, candidatNom) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fetch(`${API_BASE_URL}/dossiers/${dossierId}/documents`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    titre: `Fiche de dépôt - ${candidatNom}`,
                    typeDocument: 'FICHE_DEPOT',
                    cheminFichier: `uploads/fiche_depot_${dossierId}_${candidatNom.replace(/ /g, '_')}.pdf`
                })
            });
        }
        catch (error) {
            console.error('Erreur enregistrement document:', error);
        }
    });
    const handleExportAll = () => {
        filteredDossiers.forEach(dossier => {
            var _a;
            // Pour le candidat principal
            generateFicheDepotPDF(dossier, (_a = dossier.candidatPrincipal) === null || _a === void 0 ? void 0 : _a.email);
            if (dossier.candidatPrincipal) {
                registerFicheDocument(dossier.id, `${dossier.candidatPrincipal.prenom} ${dossier.candidatPrincipal.nom}`);
            }
            // Pour le binôme si existe
            if (dossier.type === 'binome' && dossier.candidatBinome) {
                generateFicheDepotPDF(dossier, dossier.candidatBinome.email);
                registerFicheDocument(dossier.id, `${dossier.candidatBinome.prenom} ${dossier.candidatBinome.nom}`);
            }
        });
    };
    const handleExportExcel = (type = 'COMMISSION') => {
        // Préparation des données pour un CSV optimisé pour Excel (Excel-Ready)
        const headers = ['ID Dossier', 'Titre du Sujet', 'Candidat 1', 'Email 1', 'Candidat 2', 'Email 2', 'Encadrant', 'Valide', 'Motif Refus'];
        // Directive pour Excel: utiliser le point-virgule comme séparateur + MÉTADONNÉES
        let csvContent = "sep=;\n";
        csvContent += `# TYPE: ${type}\n`; // Ajout du type pour l'importateur
        csvContent += headers.join(';') + "\n";
        filteredDossiers.forEach(d => {
            const c1 = d.candidatPrincipal ? `${d.candidatPrincipal.prenom} ${d.candidatPrincipal.nom}` : '';
            const e1 = d.candidatPrincipal ? d.candidatPrincipal.email : '';
            const c2 = d.candidatBinome ? `${d.candidatBinome.prenom} ${d.candidatBinome.nom}` : '';
            const e2 = d.candidatBinome ? d.candidatBinome.email : '';
            const encadrant = d.encadrant ? `${d.encadrant.prenom} ${d.encadrant.nom}` : (d.encadrantNom || '');
            const row = [
                d.id,
                `"${(d.titre || '').replace(/"/g, '""')}"`,
                `"${c1.replace(/"/g, '""')}"`,
                e1,
                `"${c2.replace(/"/g, '""')}"`,
                e2,
                `"${encadrant.replace(/"/g, '""')}"`,
                'FALSE', // Valeur par défaut pour la validation
                '' // Motif vide par défaut
            ];
            csvContent += row.join(';') + "\n";
        });
        // BOM UTF-8 (\uFEFF) pour forcer Excel à lire correctement l'UTF-8
        const blob = new Blob(["\uFEFF", csvContent], { type: 'text/csv;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const fileName = type === 'DEPOT' ? 'validation_depots' : 'validation_commission';
        link.download = `dossiers_${fileName}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success(`Fichier ${type === 'DEPOT' ? 'Dépôts' : 'Commission'} généré`);
        setShowExportModal(false);
    };
    const handleImportExcel = (event) => {
        var _a;
        const file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        setIsImporting(true);
        const reader = new FileReader();
        reader.onload = (e) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const text = ((_a = e.target) === null || _a === void 0 ? void 0 : _a.result) || '';
            const decisions = [];
            // Détection du format : CSV ou HTML
            const isHtml = text.includes('<table') || text.includes('<tr') || text.includes('<html');
            if (isHtml) {
                // Fallback HTML avec DOMParser (si jamais l'utilisateur utilise un vieux fichier)
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const rows = Array.from(doc.querySelectorAll('tr'));
                rows.forEach((row, rowIndex) => {
                    var _a;
                    if (rowIndex === 0)
                        return;
                    const cells = Array.from(row.querySelectorAll('td'));
                    if (cells.length >= 8) {
                        const rawId = cells[0].textContent || '';
                        const id = parseInt(rawId.replace(/[^0-9]/g, ''));
                        const valideStr = (cells[7].textContent || '').trim().toUpperCase();
                        const motif = (((_a = cells[8]) === null || _a === void 0 ? void 0 : _a.textContent) || '').trim();
                        const isValide = ['TRUE', 'VRAI', 'YES', 'OUI', '1', 'T', 'V', 'TRU'].includes(valideStr);
                        const isRefuse = ['FALSE', 'FAUX', 'NO', 'NON', '0', 'F', 'FAU'].includes(valideStr);
                        if (!isNaN(id) && (isValide || isRefuse)) {
                            decisions.push({ id, valide: isValide, motif });
                        }
                    }
                });
            }
            else {
                // Parsing CSV robuste - LA SOLUTION PRÉFÉRÉE
                let csvBody = text;
                if (csvBody.startsWith('\uFEFF'))
                    csvBody = csvBody.substring(1);
                const csvLines = csvBody.split(/\r?\n/).filter(line => line.trim());
                if (csvLines.length === 0) {
                    setIsImporting(false);
                    return;
                }
                // Détection intelligente de l'en-tête et du début des données
                let headerRowIndex = -1;
                let separator = ';'; // Par défaut
                for (let i = 0; i < csvLines.length; i++) {
                    const line = csvLines[i].trim();
                    if (line.includes('sep=')) {
                        separator = line.split('=')[1] || ';';
                        continue;
                    }
                    if (line.startsWith('#'))
                        continue;
                    // La première ligne qui n'est ni sep= ni un commentaire est l'en-tête
                    headerRowIndex = i;
                    break;
                }
                if (headerRowIndex === -1) {
                    setIsImporting(false);
                    return;
                }
                const startIndex = headerRowIndex + 1;
                const headerCols = csvLines[headerRowIndex].toLowerCase().split(separator).map(h => h.replace(/"/g, '').trim());
                let idIdx = 0, valideIdx = 7, motifIdx = 8;
                const foundId = headerCols.findIndex(h => h.includes('id'));
                const foundVal = headerCols.findIndex(h => h.includes('valide') || h.includes('statut') || h.includes('décision'));
                const foundMot = headerCols.findIndex(h => h.includes('motif') || h.includes('refus'));
                if (foundId !== -1)
                    idIdx = foundId;
                if (foundVal !== -1)
                    valideIdx = foundVal;
                if (foundMot !== -1)
                    motifIdx = foundMot;
                for (let i = startIndex; i < csvLines.length; i++) {
                    const line = csvLines[i].trim();
                    const cols = [];
                    let current = '', inQuotes = false;
                    for (let char of line) {
                        if (char === '"')
                            inQuotes = !inQuotes;
                        else if (char === separator && !inQuotes) {
                            cols.push(current.trim());
                            current = '';
                        }
                        else {
                            current += char;
                        }
                    }
                    cols.push(current.trim());
                    if (cols.length <= Math.max(idIdx, valideIdx))
                        continue;
                    const id = parseInt((cols[idIdx] || '').replace(/[^0-9]/g, ''));
                    const vStr = (cols[valideIdx] || '').trim().toUpperCase();
                    const mot = (cols[motifIdx] || '');
                    const isV = ['TRUE', 'VRAI', 'YES', 'OUI', '1', 'T', 'V', 'TRU'].includes(vStr);
                    const isR = ['FALSE', 'FAUX', 'NO', 'NON', '0', 'F', 'FAU'].includes(vStr);
                    if (!isNaN(id) && (isV || isR)) {
                        decisions.push({ id, valide: isV, motif: mot });
                    }
                }
            }
            if (decisions.length === 0) {
                toast.error('Aucune décision valide trouvée dans le fichier.');
                setIsImporting(false);
                return;
            }
            // Extraction du type si présent dans les métadonnées
            let importType = 'COMMISSION';
            if (text.includes('# TYPE: DEPOT'))
                importType = 'DEPOT';
            try {
                const result = yield dossierService.batchValidation(decisions, importType);
                toast.success(`${result.results.updated} dossiers mis à jour (${importType === 'DEPOT' ? 'Dépôts' : 'Commission'})`);
                fetchDossiers();
            }
            catch (err) {
                console.error('Erreur import:', err);
                toast.error('Erreur lors de la mise à jour des dossiers');
            }
            finally {
                setIsImporting(false);
            }
        });
        reader.readAsText(file, 'UTF-8');
        event.target.value = '';
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx("div", { className: "text-primary font-medium italic", children: "Chargement des donn\u00E9es..." }) }));
    }
    return (_jsxs("div", { className: "p-4 md:p-6 space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-gray-100", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-primary font-outfit", children: "Liste des Dossiers de M\u00E9moire" }), _jsx("p", { className: "text-sm text-gray-500 font-inter", children: "Tableau de suivi des d\u00E9p\u00F4ts et inscriptions." })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("input", { type: "file", id: "excel-import", className: "hidden", accept: ".csv,.xls,.xlsx", onChange: handleImportExcel }), _jsxs("button", { onClick: () => { var _a; return (_a = document.getElementById('excel-import')) === null || _a === void 0 ? void 0 : _a.click(); }, disabled: isImporting, className: "flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded hover:bg-gray-50 transition-colors font-outfit font-bold text-sm shadow-sm", children: [isImporting ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : _jsx(Download, { className: "h-4 w-4 rotate-180" }), _jsx("span", { children: "Importer D\u00E9cisions" })] }), _jsxs("button", { onClick: () => setShowExportModal(true), className: "flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded hover:bg-gray-50 transition-colors font-outfit font-bold text-sm shadow-sm", children: [_jsx(FileSpreadsheet, { className: "h-4 w-4 text-emerald-600" }), _jsx("span", { children: "Exporter pour Validation" })] }), _jsxs("button", { onClick: handleExportAll, className: "flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded hover:bg-black transition-colors font-outfit font-bold text-sm", children: [_jsx(Download, { className: "h-4 w-4" }), _jsxs("span", { children: ["Exporter PDFs (", filteredDossiers.length, ")"] })] })] })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded border border-gray-200", children: [_jsxs("div", { className: "relative flex-1 w-full", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Rechercher...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none font-inter" })] }), _jsxs("div", { className: "flex gap-3 w-full md:w-auto", children: [_jsxs("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "flex-1 md:w-40 px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none focus:ring-1 focus:ring-primary font-inter", children: [_jsx("option", { value: "Tous", children: "Tout Statut" }), _jsx("option", { value: "EN_COURS", children: "En cours" }), _jsx("option", { value: "VALIDE", children: "Valid\u00E9" }), _jsx("option", { value: "DEPOSE", children: "D\u00E9pos\u00E9" })] }), _jsxs("select", { value: typeFilter, onChange: (e) => setTypeFilter(e.target.value), className: "flex-1 md:w-40 px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none focus:ring-1 focus:ring-primary font-inter", children: [_jsx("option", { value: "Tous", children: "Tout Type" }), _jsx("option", { value: "solo", children: "Solo" }), _jsx("option", { value: "binome", children: "Bin\u00F4me" })] })] })] }), _jsx("div", { className: "bg-white border border-gray-200 rounded shadow-sm overflow-hidden text-sm", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-primary text-white text-left font-outfit", children: [_jsx("th", { className: "px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10", children: "ID" }), _jsx("th", { className: "px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10", children: "Sujet" }), _jsx("th", { className: "px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10", children: "Candidats" }), _jsx("th", { className: "px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10", children: "Type" }), _jsx("th", { className: "px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10", children: "Encadrant" }), _jsx("th", { className: "px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10", children: "Statut" }), _jsx("th", { className: "px-6 py-3 font-bold uppercase tracking-wider text-[11px] text-right", children: "Actions" })] }) }), _jsxs("tbody", { className: "font-inter", children: [filteredDossiers.map((dossier) => {
                                        var _a, _b;
                                        return (_jsxs("tr", { className: "border-b border-gray-200 hover:bg-gray-50 group", children: [_jsxs("td", { className: "px-6 py-4 font-bold text-gray-500", children: ["#", dossier.id] }), _jsxs("td", { className: "px-6 py-4 min-w-[300px]", children: [_jsx("div", { className: "font-bold text-primary mb-1", children: dossier.titre }), _jsx("div", { className: "text-[11px] text-gray-400 font-bold uppercase tracking-widest", children: dossier.anneeAcademique })] }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { className: "h-3 w-3 text-primary" }), _jsxs("span", { className: "font-semibold text-gray-900", children: [(_a = dossier.candidatPrincipal) === null || _a === void 0 ? void 0 : _a.prenom, " ", (_b = dossier.candidatPrincipal) === null || _b === void 0 ? void 0 : _b.nom] })] }), dossier.type === 'binome' && dossier.candidatBinome && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "h-3 w-3 text-primary" }), _jsxs("span", { className: "font-semibold text-gray-900", children: [dossier.candidatBinome.prenom, " ", dossier.candidatBinome.nom] })] }))] }) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `font-bold uppercase text-[10px] ${dossier.type === 'binome' ? 'text-primary' : 'text-gray-500'}`, children: dossier.type === 'binome' ? 'Binôme' : 'Solo' }) }), _jsx("td", { className: "px-6 py-4 text-gray-700 font-medium", children: dossier.encadrant ? (_jsxs("div", { className: "flex flex-col", children: [_jsxs("span", { children: [dossier.encadrant.prenom, " ", dossier.encadrant.nom] }), _jsx("span", { className: "text-[10px] text-gray-400", children: "Encadrant principal" })] })) : (_jsx("span", { className: "text-gray-400 italic font-normal", children: "En attente" })) }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-2 py-0.5 rounded border text-[10px] font-bold ${dossier.statut === 'VALIDE' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' :
                                                            dossier.statut === 'DEPOSE' ? 'border-primary text-primary bg-primary/5' :
                                                                'border-gray-300 text-gray-500'}`, children: dossier.statut }) }), _jsx("td", { className: "px-6 py-4 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-3 font-bold uppercase text-[10px]", children: [_jsxs("button", { onClick: () => setSelectedDossier(dossier), className: "text-primary hover:text-black flex items-center gap-1", children: [_jsx(ExternalLink, { className: "h-3.5 w-3.5" }), " D\u00E9tails"] }), _jsxs("button", { onClick: () => {
                                                                    var _a;
                                                                    generateFicheDepotPDF(dossier, (_a = dossier.candidatPrincipal) === null || _a === void 0 ? void 0 : _a.email);
                                                                    if (dossier.type === 'binome' && dossier.candidatBinome) {
                                                                        generateFicheDepotPDF(dossier, dossier.candidatBinome.email);
                                                                    }
                                                                }, className: "text-emerald-600 hover:text-emerald-700 flex items-center gap-1", children: [_jsx(Download, { className: "h-3.5 w-3.5" }), " PDF"] })] }) })] }, dossier.id));
                                    }), filteredDossiers.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "px-6 py-12 text-center text-gray-400 italic", children: "Aucun r\u00E9sultat trouv\u00E9 pour votre recherche." }) }))] })] }) }) }), selectedDossier && (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl", children: [_jsxs("div", { className: "p-4 border-b flex items-center justify-between bg-primary text-white", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(BookOpen, { className: "h-5 w-5" }), _jsxs("h2", { className: "text-lg font-bold font-outfit uppercase", children: ["Dossier de m\u00E9moire #", selectedDossier.id] })] }), _jsx("button", { onClick: () => setSelectedDossier(null), className: "p-1 hover:bg-white/20 transition-colors uppercase font-bold text-xs", children: "Fermer" })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-8 font-inter", children: [_jsxs("section", { className: "bg-gray-50 p-6 rounded border border-gray-200", children: [_jsxs("h3", { className: "text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2 border-b pb-2", children: [_jsx(Info, { className: "h-4 w-4" }), " Titre et Sujet"] }), _jsxs("div", { children: [_jsx("h4", { className: "text-lg font-bold text-gray-900", children: selectedDossier.titre }), _jsx("p", { className: "text-sm text-gray-600 mt-2 italic leading-relaxed", children: selectedDossier.description })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mt-6", children: [_jsxs("div", { children: [_jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase", children: "P\u00E9riode Acad\u00E9mique" }), _jsx("p", { className: "font-bold text-primary", children: selectedDossier.anneeAcademique })] }), _jsxs("div", { children: [_jsx("span", { className: "text-[10px] font-bold text-gray-400 uppercase", children: "Statut dossier" }), _jsx("p", { className: "font-bold text-primary", children: selectedDossier.statut })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-6 rounded border border-gray-200", children: [_jsxs("h3", { className: "text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2 border-b pb-2", children: [_jsx(User, { className: "h-4 w-4" }), " Premier \u00C9tudiant"] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("p", { children: [_jsx("span", { className: "text-gray-400 font-medium", children: "Nom :" }), " ", _jsxs("span", { className: "font-bold", children: [(_a = selectedDossier.candidatPrincipal) === null || _a === void 0 ? void 0 : _a.prenom, " ", (_b = selectedDossier.candidatPrincipal) === null || _b === void 0 ? void 0 : _b.nom] })] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400 font-medium", children: "Email :" }), " ", (_c = selectedDossier.candidatPrincipal) === null || _c === void 0 ? void 0 : _c.email] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400 font-medium", children: "Contact :" }), " ", (_d = selectedDossier.candidatPrincipal) === null || _d === void 0 ? void 0 : _d.telephone] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400 font-medium", children: "N\u00E9 le :" }), " ", (_e = selectedDossier.candidatPrincipal) === null || _e === void 0 ? void 0 : _e.dateNaissance, " - ", (_f = selectedDossier.candidatPrincipal) === null || _f === void 0 ? void 0 : _f.lieuNaissance] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400 font-medium", children: "Classe :" }), " ", (_g = selectedDossier.candidatPrincipal) === null || _g === void 0 ? void 0 : _g.classe] })] })] }), selectedDossier.type === 'binome' && selectedDossier.candidatBinome ? (_jsxs("div", { className: "p-6 rounded border border-gray-200", children: [_jsxs("h3", { className: "text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2 border-b pb-2", children: [_jsx(Users, { className: "h-4 w-4" }), " Second \u00C9tudiant (Bin\u00F4me)"] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("p", { children: [_jsx("span", { className: "text-gray-400 font-medium", children: "Nom :" }), " ", _jsxs("span", { className: "font-bold", children: [selectedDossier.candidatBinome.prenom, " ", selectedDossier.candidatBinome.nom] })] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400 font-medium", children: "Email :" }), " ", selectedDossier.candidatBinome.email] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400 font-medium", children: "Contact :" }), " ", selectedDossier.candidatBinome.telephone] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400 font-medium", children: "N\u00E9 le :" }), " ", selectedDossier.candidatBinome.dateNaissance, " - ", selectedDossier.candidatBinome.lieuNaissance] }), _jsxs("p", { children: [_jsx("span", { className: "text-gray-400 font-medium", children: "Classe :" }), " ", selectedDossier.candidatBinome.classe] })] })] })) : (_jsx("div", { className: "p-6 rounded border border-dashed border-gray-200 flex items-center justify-center", children: _jsx("p", { className: "text-gray-400 italic text-sm text-center", children: "Dossier individuel sans bin\u00F4me." }) }))] }), _jsxs("section", { className: "font-inter", children: [_jsxs("h3", { className: "text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2 border-b pb-2", children: [_jsx(FileText, { className: "h-4 w-4" }), " Historique et Notes"] }), _jsx("div", { className: "bg-white border rounded divide-y divide-gray-100", children: loadingNotes ? (_jsx("div", { className: "p-4 text-center text-gray-400 italic text-sm", children: "Chargement de l'historique..." })) : notes.length > 0 ? (notes.map((note) => (_jsxs("div", { className: "p-4 bg-white", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsxs("span", { className: "text-[10px] font-bold text-primary", children: ["[", new Date(note.dateCreation).toLocaleDateString('fr-FR'), "]"] }), _jsx("span", { className: "text-[10px] text-gray-400 uppercase font-black", children: "Encadrant" })] }), _jsx("p", { className: "text-sm text-gray-700 leading-normal", children: note.contenu })] }, note.id)))) : (_jsx("div", { className: "p-8 text-center text-gray-400 text-sm", children: "Aucune note de suivi enregistr\u00E9e." })) })] })] }), _jsxs("div", { className: "p-6 border-t bg-gray-50 flex justify-end gap-3 font-outfit", children: [_jsx("button", { onClick: () => {
                                        var _a;
                                        generateFicheDepotPDF(selectedDossier, (_a = selectedDossier.candidatPrincipal) === null || _a === void 0 ? void 0 : _a.email);
                                        if (selectedDossier.type === 'binome' && selectedDossier.candidatBinome) {
                                            generateFicheDepotPDF(selectedDossier, selectedDossier.candidatBinome.email);
                                        }
                                    }, className: "px-4 py-2 border border-primary text-primary rounded font-bold transition-all text-xs uppercase", children: "Exporter PDF" }), _jsx("button", { onClick: () => setSelectedDossier(null), className: "px-4 py-2 bg-primary text-white rounded font-bold transition-all text-xs uppercase", children: "Fermer" })] })] }) })), _jsx(AnimatePresence, { children: showExportModal && (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 20 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 }, className: "bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100", children: [_jsxs("div", { className: "p-6 border-b border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "p-2 bg-emerald-50 rounded-lg", children: _jsx(FileSpreadsheet, { className: "h-5 w-5 text-emerald-600" }) }), _jsx("h2", { className: "text-xl font-outfit font-bold text-gray-900", children: "Type d'Exportation" })] }), _jsx("p", { className: "text-sm text-gray-500 font-inter", children: "S\u00E9lectionnez l'\u00E9tape de validation concern\u00E9e par cet export." })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { onClick: () => setExportType('COMMISSION'), className: `p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 ${exportType === 'COMMISSION'
                                            ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`, children: [_jsx("div", { className: `p-2 rounded-lg ${exportType === 'COMMISSION' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`, children: _jsx(Users, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-bold text-gray-900 mb-1", children: "Validation Commission" }), _jsx("div", { className: "text-xs text-gray-500 leading-relaxed", children: "Validation initiale des sujets par le d\u00E9partement. Pr\u00E9pare le passage \u00E0 la r\u00E9daction." })] }), exportType === 'COMMISSION' && _jsx(CheckCircle2, { className: "h-5 w-5 text-primary shrink-0" })] }), _jsxs("div", { onClick: () => setExportType('DEPOT'), className: `p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 ${exportType === 'DEPOT'
                                            ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}`, children: [_jsx("div", { className: `p-2 rounded-lg ${exportType === 'DEPOT' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`, children: _jsx(FileText, { className: "h-5 w-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-bold text-gray-900 mb-1", children: "Validation D\u00E9p\u00F4ts Finals" }), _jsx("div", { className: "text-xs text-gray-500 leading-relaxed", children: "Validation des m\u00E9moires finaux d\u00E9pos\u00E9s par les \u00E9tudiants. Pr\u00E9pare la soutenance." })] }), exportType === 'DEPOT' && _jsx(CheckCircle2, { className: "h-5 w-5 text-primary shrink-0" })] })] }), _jsxs("div", { className: "p-6 bg-gray-50 flex items-center justify-end gap-3", children: [_jsx("button", { onClick: () => setShowExportModal(false), className: "px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors", children: "Annuler" }), _jsx("button", { onClick: () => handleExportExcel(exportType), className: "px-6 py-2 bg-primary text-white rounded-lg font-outfit font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95", children: "Lancer l'Exportation" })] })] }) })) })] }));
};
export default DossiersList;
