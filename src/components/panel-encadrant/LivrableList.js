import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { LivrableItem } from './LivrableItem';
export const LivrableList = ({ livrables, onValider, onRejeter, onDownload, canEdit = true }) => {
    // Ne garder qu'un seul livrable par étudiant (le plus récent, car chaque nouveau fichier écrase le précédent)
    const livrablesUniques = React.useMemo(() => {
        const livrablesParEtudiant = new Map();
        livrables.forEach(livrable => {
            const etudiantKey = `${livrable.etudiant.nom}-${livrable.etudiant.prenom}`;
            const existing = livrablesParEtudiant.get(etudiantKey);
            // Si aucun livrable pour cet étudiant, ou si celui-ci est plus récent, le garder
            if (!existing || livrable.dateSubmission > existing.dateSubmission) {
                livrablesParEtudiant.set(etudiantKey, livrable);
            }
        });
        return Array.from(livrablesParEtudiant.values());
    }, [livrables]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex justify-between items-center", children: _jsx("h2", { className: "text-lg font-semibold text-gray-900", children: "Livrables" }) }), livrablesUniques.length === 0 ? (_jsx("div", { className: "text-center py-12 text-gray-500", children: _jsx("p", { children: "Aucun livrable disponible." }) })) : (_jsx("div", { className: "space-y-4", children: livrablesUniques.map((livrable) => (_jsx(LivrableItem, { livrable: livrable, onValider: onValider, onRejeter: onRejeter, onDownload: onDownload, canEdit: canEdit }, livrable.id))) }))] }));
};
