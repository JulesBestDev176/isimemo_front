import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import { Plus, Filter, Share2 } from 'lucide-react';
import { TacheCommuneItem } from './TacheCommuneItem';
export const TacheCommuneList = ({ taches, onAddTache, onSupprimer, onDesactiver, canEdit = true, demandes = [] }) => {
    const [filter, setFilter] = useState('all');
    const filteredTaches = useMemo(() => {
        return taches.filter(tache => {
            if (filter === 'all')
                return true;
            if (filter === 'commune')
                return !tache.demandeId;
            const demande = demandes.find(d => d.idDemande === tache.demandeId);
            if (filter === 'groupe')
                return demande && demande.candidats && demande.candidats.length > 1;
            if (filter === 'candidat')
                return demande && (!demande.candidats || demande.candidats.length <= 1);
            return true;
        });
    }, [taches, filter, demandes]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Suivi des T\u00E2ches" }), _jsx("p", { className: "text-sm text-gray-500", children: "G\u00E9rez les objectifs et l'avancement des travaux" })] }), _jsxs("div", { className: "flex items-center gap-3 w-full sm:w-auto", children: [_jsxs("div", { className: "relative flex-1 sm:flex-initial", children: [_jsx(Filter, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" }), _jsxs("select", { value: filter, onChange: (e) => setFilter(e.target.value), className: "pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer w-full shadow-sm hover:border-gray-300 transition-colors", children: [_jsx("option", { value: "all", children: "Toutes les t\u00E2ches" }), _jsx("option", { value: "commune", children: "T\u00E2ches communes" }), _jsx("option", { value: "groupe", children: "Par groupe (Bin\u00F4me)" }), _jsx("option", { value: "candidat", children: "Par candidat (Solo)" })] })] }), canEdit && (_jsxs("button", { onClick: onAddTache, className: "px-4 py-2 bg-primary text-white hover:bg-primary-700 transition-all flex items-center gap-2 rounded-lg shadow-md hover:shadow-lg font-medium", children: [_jsx(Plus, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Ajouter" }), _jsx("span", { className: "sm:hidden", children: "Ajouter" })] }))] })] }), _jsx("div", { className: "grid grid-cols-1 gap-4", children: filteredTaches.length === 0 ? (_jsxs("div", { className: "text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200", children: [_jsx("div", { className: "bg-white p-3 rounded-full shadow-sm inline-flex mb-4", children: _jsx(Share2, { className: "h-6 w-6 text-gray-300" }) }), _jsx("p", { className: "text-gray-600 font-medium", children: "Aucune t\u00E2che ne correspond au filtre" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Changez les crit\u00E8res ou cr\u00E9ez une nouvelle t\u00E2che" })] })) : (filteredTaches.map((tache) => {
                    const demande = demandes.find(d => d.idDemande === tache.demandeId);
                    let assigneString = "";
                    if (!tache.demandeId) {
                        assigneString = "Tous les groupes";
                    }
                    else if (demande) {
                        if (demande.candidats && demande.candidats.length > 1) {
                            assigneString = demande.candidats.map((c) => `${c.prenom} ${c.nom}`).join(' & ');
                        }
                        else {
                            const c = demande.candidat || (demande.candidats && demande.candidats[0]);
                            assigneString = c ? `${c.prenom} ${c.nom}` : "Inconnu";
                        }
                    }
                    return (_jsx(TacheCommuneItem, { tache: Object.assign(Object.assign({}, tache), { assigneA: assigneString || undefined }), onSupprimer: onSupprimer, onDesactiver: onDesactiver, canEdit: canEdit }, tache.id));
                })) })] }));
};
