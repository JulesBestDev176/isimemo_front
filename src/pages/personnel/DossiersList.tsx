// Force HMR - 2025-12-26
import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Download, Users, User, ArrowRight, BookOpen, Info, Search, Filter, SlidersHorizontal, ChevronDown, ChevronUp, ExternalLink, FileSpreadsheet, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateFicheDepotPDF, PDFDossier } from '../../services/pdf.service';
import { toast } from 'sonner';
import dossierService from '../../services/dossier.service';

const API_BASE_URL = 'http://localhost:3001/api';

interface Candidat {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance?: string;
  lieuNaissance?: string;
  classe?: string;
}

interface Encadrant {
  nom: string;
  prenom: string;
  email: string;
}

interface Dossier {
  id: number;
  titre: string;
  description: string;
  anneeAcademique: string;
  statut: string;
  type: 'solo' | 'binome';
  candidatPrincipal: Candidat | null;
  candidatBinome: Candidat | null;
  encadrant: Encadrant | null;
  encadrantNom?: string;
  createdAt: string;
  notesSuivi?: any[];
}

const DossiersList: React.FC = () => {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'COMMISSION' | 'DEPOT'>('COMMISSION');

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

  const fetchDossiers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/personnel/dossiers`);
      const data = await response.json();
      setDossiers(data);
    } catch (error) {
      console.error('Erreur chargement dossiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async (dossierId: number) => {
    setLoadingNotes(true);
    try {
      const response = await fetch(`${API_BASE_URL}/dossiers/${dossierId}/notes`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Erreur chargement notes:', error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const filteredDossiers = useMemo(() => {
    return dossiers.filter(d => {
      const matchesSearch = 
        d.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.candidatPrincipal?.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.candidatPrincipal?.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.candidatBinome && (
          d.candidatBinome.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.candidatBinome.prenom.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      
      const matchesStatus = statusFilter === 'Tous' || d.statut === statusFilter;
      const matchesType = typeFilter === 'Tous' || d.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [dossiers, searchQuery, statusFilter, typeFilter]);

  const registerFicheDocument = async (dossierId: number, candidatNom: string) => {
    try {
      await fetch(`${API_BASE_URL}/dossiers/${dossierId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre: `Fiche de dépôt - ${candidatNom}`,
          typeDocument: 'FICHE_DEPOT',
          cheminFichier: `uploads/fiche_depot_${dossierId}_${candidatNom.replace(/ /g, '_')}.pdf`
        })
      });
    } catch (error) {
      console.error('Erreur enregistrement document:', error);
    }
  };

  const handleExportAll = () => {
    filteredDossiers.forEach(dossier => {
      // Pour le candidat principal
      generateFicheDepotPDF(dossier as any, dossier.candidatPrincipal?.email);
      if (dossier.candidatPrincipal) {
        registerFicheDocument(dossier.id, `${dossier.candidatPrincipal.prenom} ${dossier.candidatPrincipal.nom}`);
      }

      // Pour le binôme si existe
      if (dossier.type === 'binome' && dossier.candidatBinome) {
        generateFicheDepotPDF(dossier as any, dossier.candidatBinome.email);
        registerFicheDocument(dossier.id, `${dossier.candidatBinome.prenom} ${dossier.candidatBinome.nom}`);
      }
    });
  };

  const handleExportExcel = (type: 'COMMISSION' | 'DEPOT' = 'COMMISSION') => {
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
        ''       // Motif vide par défaut
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

  const handleImportExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target?.result as string) || '';
      const decisions: any[] = [];

      // Détection du format : CSV ou HTML
      const isHtml = text.includes('<table') || text.includes('<tr') || text.includes('<html');

      if (isHtml) {
        // Fallback HTML avec DOMParser (si jamais l'utilisateur utilise un vieux fichier)
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const rows = Array.from(doc.querySelectorAll('tr'));
        
        rows.forEach((row, rowIndex) => {
          if (rowIndex === 0) return;
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length >= 8) {
            const rawId = cells[0].textContent || '';
            const id = parseInt(rawId.replace(/[^0-9]/g, ''));
            const valideStr = (cells[7].textContent || '').trim().toUpperCase();
            const motif = (cells[8]?.textContent || '').trim();

            const isValide = ['TRUE', 'VRAI', 'YES', 'OUI', '1', 'T', 'V', 'TRU'].includes(valideStr);
            const isRefuse = ['FALSE', 'FAUX', 'NO', 'NON', '0', 'F', 'FAU'].includes(valideStr);

            if (!isNaN(id) && (isValide || isRefuse)) {
              decisions.push({ id, valide: isValide, motif });
            }
          }
        });
      } else {
        // Parsing CSV robuste - LA SOLUTION PRÉFÉRÉE
        let csvBody = text;
        if (csvBody.startsWith('\uFEFF')) csvBody = csvBody.substring(1);

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
          if (line.startsWith('#')) continue;
          
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
        
        if (foundId !== -1) idIdx = foundId;
        if (foundVal !== -1) valideIdx = foundVal;
        if (foundMot !== -1) motifIdx = foundMot;

        for (let i = startIndex; i < csvLines.length; i++) {
          const line = csvLines[i].trim();
          const cols: string[] = [];
          let current = '', inQuotes = false;
          
          for (let char of line) {
            if (char === '"') inQuotes = !inQuotes;
            else if (char === separator && !inQuotes) {
              cols.push(current.trim());
              current = '';
            } else {
              current += char;
            }
          }
          cols.push(current.trim());
          
          if (cols.length <= Math.max(idIdx, valideIdx)) continue;

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
      let importType: 'COMMISSION' | 'DEPOT' = 'COMMISSION';
      if (text.includes('# TYPE: DEPOT')) importType = 'DEPOT';

      try {
        const result = await dossierService.batchValidation(decisions, importType);
        toast.success(`${result.results.updated} dossiers mis à jour (${importType === 'DEPOT' ? 'Dépôts' : 'Commission'})`);
        fetchDossiers(); 
      } catch (err) {
        console.error('Erreur import:', err);
        toast.error('Erreur lors de la mise à jour des dossiers');
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsText(file, 'UTF-8');
    event.target.value = '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-primary font-medium italic">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-primary font-outfit">Liste des Dossiers de Mémoire</h1>
          <p className="text-sm text-gray-500 font-inter">Tableau de suivi des dépôts et inscriptions.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            id="excel-import"
            className="hidden"
            accept=".csv,.xls,.xlsx"
            onChange={handleImportExcel}
          />
          <button
            onClick={() => document.getElementById('excel-import')?.click()}
            disabled={isImporting}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded hover:bg-gray-50 transition-colors font-outfit font-bold text-sm shadow-sm"
          >
            {isImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 rotate-180" />}
            <span>Importer Décisions</span>
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded hover:bg-gray-50 transition-colors font-outfit font-bold text-sm shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Exporter pour Validation</span>
          </button>
          <button
            onClick={handleExportAll}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded hover:bg-black transition-colors font-outfit font-bold text-sm"
          >
            <Download className="h-4 w-4" />
            <span>Exporter PDFs ({filteredDossiers.length})</span>
          </button>
        </div>
      </div>

      {/* Filtres simples */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded border border-gray-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-primary outline-none font-inter"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:w-40 px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none focus:ring-1 focus:ring-primary font-inter"
          >
            <option value="Tous">Tout Statut</option>
            <option value="EN_COURS">En cours</option>
            <option value="VALIDE">Validé</option>
            <option value="DEPOSE">Déposé</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 md:w-40 px-3 py-2 border border-gray-300 rounded text-sm bg-white outline-none focus:ring-1 focus:ring-primary font-inter"
          >
            <option value="Tous">Tout Type</option>
            <option value="solo">Solo</option>
            <option value="binome">Binôme</option>
          </select>
        </div>
      </div>

      {/* Tableau Simple et Clair */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden text-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary text-white text-left font-outfit">
                <th className="px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10">ID</th>
                <th className="px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10">Sujet</th>
                <th className="px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10">Candidats</th>
                <th className="px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10">Type</th>
                <th className="px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10">Encadrant</th>
                <th className="px-6 py-3 font-bold uppercase tracking-wider text-[11px] border-r border-white/10">Statut</th>
                <th className="px-6 py-3 font-bold uppercase tracking-wider text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-inter">
              {filteredDossiers.map((dossier) => (
                <tr key={dossier.id} className="border-b border-gray-200 hover:bg-gray-50 group">
                  <td className="px-6 py-4 font-bold text-gray-500">#{dossier.id}</td>
                  <td className="px-6 py-4 min-w-[300px]">
                    <div className="font-bold text-primary mb-1">{dossier.titre}</div>
                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">{dossier.anneeAcademique}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-primary" />
                        <span className="font-semibold text-gray-900">{dossier.candidatPrincipal?.prenom} {dossier.candidatPrincipal?.nom}</span>
                      </div>
                      {dossier.type === 'binome' && dossier.candidatBinome && (
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-primary" />
                          <span className="font-semibold text-gray-900">{dossier.candidatBinome.prenom} {dossier.candidatBinome.nom}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold uppercase text-[10px] ${dossier.type === 'binome' ? 'text-primary' : 'text-gray-500'}`}>
                      {dossier.type === 'binome' ? 'Binôme' : 'Solo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {dossier.encadrant ? (
                      <div className="flex flex-col">
                        <span>{dossier.encadrant.prenom} {dossier.encadrant.nom}</span>
                        <span className="text-[10px] text-gray-400">Encadrant principal</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic font-normal">En attente</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                      dossier.statut === 'VALIDE' ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 
                      dossier.statut === 'DEPOSE' ? 'border-primary text-primary bg-primary/5' : 
                      'border-gray-300 text-gray-500'
                    }`}>
                      {dossier.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 font-bold uppercase text-[10px]">
                      <button
                        onClick={() => setSelectedDossier(dossier)}
                        className="text-primary hover:text-black flex items-center gap-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Détails
                      </button>
                      <button
                        onClick={() => {
                          generateFicheDepotPDF(dossier as any, dossier.candidatPrincipal?.email);
                          if (dossier.type === 'binome' && dossier.candidatBinome) {
                            generateFicheDepotPDF(dossier as any, dossier.candidatBinome.email);
                          }
                        }}
                        className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredDossiers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic">
                    Aucun résultat trouvé pour votre recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détail Dossier (Simple) */}
      {selectedDossier && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
            {/* Header Modal */}
            <div className="p-4 border-b flex items-center justify-between bg-primary text-white">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <h2 className="text-lg font-bold font-outfit uppercase">Dossier de mémoire #{selectedDossier.id}</h2>
              </div>
              <button onClick={() => setSelectedDossier(null)} className="p-1 hover:bg-white/20 transition-colors uppercase font-bold text-xs">
                Fermer
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 font-inter">
              {/* Infos Sujet */}
              <section className="bg-gray-50 p-6 rounded border border-gray-200">
                <h3 className="text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2 border-b pb-2">
                  <Info className="h-4 w-4" /> Titre et Sujet
                </h3>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedDossier.titre}</h4>
                  <p className="text-sm text-gray-600 mt-2 italic leading-relaxed">{selectedDossier.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Période Académique</span>
                    <p className="font-bold text-primary">{selectedDossier.anneeAcademique}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Statut dossier</span>
                    <p className="font-bold text-primary">{selectedDossier.statut}</p>
                  </div>
                </div>
              </section>

              {/* Infos Étudiants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded border border-gray-200">
                  <h3 className="text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2 border-b pb-2">
                    <User className="h-4 w-4" /> Premier Étudiant
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-400 font-medium">Nom :</span> <span className="font-bold">{selectedDossier.candidatPrincipal?.prenom} {selectedDossier.candidatPrincipal?.nom}</span></p>
                    <p><span className="text-gray-400 font-medium">Email :</span> {selectedDossier.candidatPrincipal?.email}</p>
                    <p><span className="text-gray-400 font-medium">Contact :</span> {selectedDossier.candidatPrincipal?.telephone}</p>
                    <p><span className="text-gray-400 font-medium">Né le :</span> {selectedDossier.candidatPrincipal?.dateNaissance} - {selectedDossier.candidatPrincipal?.lieuNaissance}</p>
                    <p><span className="text-gray-400 font-medium">Classe :</span> {selectedDossier.candidatPrincipal?.classe}</p>
                  </div>
                </div>

                {selectedDossier.type === 'binome' && selectedDossier.candidatBinome ? (
                  <div className="p-6 rounded border border-gray-200">
                    <h3 className="text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2 border-b pb-2">
                      <Users className="h-4 w-4" /> Second Étudiant (Binôme)
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400 font-medium">Nom :</span> <span className="font-bold">{selectedDossier.candidatBinome.prenom} {selectedDossier.candidatBinome.nom}</span></p>
                      <p><span className="text-gray-400 font-medium">Email :</span> {selectedDossier.candidatBinome.email}</p>
                      <p><span className="text-gray-400 font-medium">Contact :</span> {selectedDossier.candidatBinome.telephone}</p>
                      <p><span className="text-gray-400 font-medium">Né le :</span> {selectedDossier.candidatBinome.dateNaissance} - {selectedDossier.candidatBinome.lieuNaissance}</p>
                      <p><span className="text-gray-400 font-medium">Classe :</span> {selectedDossier.candidatBinome.classe}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded border border-dashed border-gray-200 flex items-center justify-center">
                    <p className="text-gray-400 italic text-sm text-center">Dossier individuel sans binôme.</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              <section className="font-inter">
                <h3 className="text-sm font-bold text-primary uppercase mb-4 flex items-center gap-2 border-b pb-2">
                  <FileText className="h-4 w-4" /> Historique et Notes
                </h3>
                <div className="bg-white border rounded divide-y divide-gray-100">
                    {loadingNotes ? (
                      <div className="p-4 text-center text-gray-400 italic text-sm">Chargement de l'historique...</div>
                    ) : notes.length > 0 ? (
                      notes.map((note) => (
                        <div key={note.id} className="p-4 bg-white">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-primary">[{new Date(note.dateCreation).toLocaleDateString('fr-FR')}]</span>
                            <span className="text-[10px] text-gray-400 uppercase font-black">Encadrant</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-normal">{note.contenu}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-400 text-sm">Aucune note de suivi enregistrée.</div>
                    )}
                </div>
              </section>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 font-outfit">
              <button 
                onClick={() => {
                  generateFicheDepotPDF(selectedDossier as any, selectedDossier.candidatPrincipal?.email);
                  if (selectedDossier.type === 'binome' && selectedDossier.candidatBinome) {
                    generateFicheDepotPDF(selectedDossier as any, selectedDossier.candidatBinome.email);
                  }
                }}
                className="px-4 py-2 border border-primary text-primary rounded font-bold transition-all text-xs uppercase"
              >
                Exporter PDF
              </button>
              <button 
                onClick={() => setSelectedDossier(null)} 
                className="px-4 py-2 bg-primary text-white rounded font-bold transition-all text-xs uppercase"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de sélection Type Export */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h2 className="text-xl font-outfit font-bold text-gray-900">Type d'Exportation</h2>
                </div>
                <p className="text-sm text-gray-500 font-inter">Sélectionnez l'étape de validation concernée par cet export.</p>
              </div>

              <div className="p-6 space-y-4">
                <div 
                  onClick={() => setExportType('COMMISSION')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                    exportType === 'COMMISSION' 
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${exportType === 'COMMISSION' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 mb-1">Validation Commission</div>
                    <div className="text-xs text-gray-500 leading-relaxed">
                      Validation initiale des sujets par le département. Prépare le passage à la rédaction.
                    </div>
                  </div>
                  {exportType === 'COMMISSION' && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                </div>

                <div 
                  onClick={() => setExportType('DEPOT')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 ${
                    exportType === 'DEPOT' 
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/10' 
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${exportType === 'DEPOT' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 mb-1">Validation Dépôts Finals</div>
                    <div className="text-xs text-gray-500 leading-relaxed">
                      Validation des mémoires finaux déposés par les étudiants. Prépare la soutenance.
                    </div>
                  </div>
                  {exportType === 'DEPOT' && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                </div>
              </div>

              <div className="p-6 bg-gray-50 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleExportExcel(exportType)}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-outfit font-bold text-sm hover:bg-primary/90 transition-all shadow-md active:scale-95"
                >
                  Lancer l'Exportation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DossiersList;
