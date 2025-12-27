import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Gavel, FileCheck, Calendar } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { getSoutenancesByProfesseur } from '../../models/soutenance/Soutenance';
import { getProcessVerbalBySoutenance, hasProfesseurApprouve } from '../../models/soutenance/ProcessVerbal';
import { getProfesseurIdByEmail } from '../../models/acteurs/Professeur';
export const getDashboardJuryCards = (userEmail, delay = 0, navigate) => {
    let currentDelay = delay;
    const idProfesseur = userEmail ? (getProfesseurIdByEmail(userEmail) || 0) : 0;
    const soutenances = idProfesseur > 0 ? getSoutenancesByProfesseur(idProfesseur) : [];
    // Compter les PV en attente d'approbation
    let pvEnAttente = 0;
    soutenances.forEach(soutenance => {
        const pv = getProcessVerbalBySoutenance(soutenance.idSoutenance);
        if (pv && !hasProfesseurApprouve(pv, idProfesseur)) {
            pvEnAttente++;
        }
    });
    // Trouver la prochaine soutenance
    const maintenant = new Date();
    const futures = soutenances
        .filter(s => new Date(s.dateSoutenance) > maintenant)
        .sort((a, b) => new Date(a.dateSoutenance).getTime() - new Date(b.dateSoutenance).getTime());
    const prochaineSoutenance = futures[0];
    const cards = [];
    // Soutenances assignées
    if (soutenances.length > 0) {
        cards.push(_jsx(DashboardCard, { title: "Soutenances assign\u00E9es", value: soutenances.length.toString(), icon: _jsx(Gavel, { className: "h-6 w-6" }), iconColor: "bg-red-100 text-red-600", delay: currentDelay, onClick: () => navigate('/jurie/soutenances') }, "soutenances-assignees"));
        currentDelay += 0.1;
    }
    // PV en attente d'approbation
    if (pvEnAttente > 0) {
        cards.push(_jsx(DashboardCard, { title: "PV \u00E0 confirmer", value: pvEnAttente.toString(), icon: _jsx(FileCheck, { className: "h-6 w-6" }), iconColor: "bg-yellow-100 text-yellow-600", trend: { value: "En attente", up: false }, delay: currentDelay, onClick: () => navigate('/jurie/soutenances') }, "pv-en-attente"));
        currentDelay += 0.1;
    }
    // Prochaine soutenance
    if (prochaineSoutenance) {
        const dateSoutenance = new Date(prochaineSoutenance.dateSoutenance);
        const joursRestants = Math.ceil((dateSoutenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        cards.push(_jsx(DashboardCard, { title: "Prochaine soutenance", value: joursRestants > 0 ? `Dans ${joursRestants} jour(s)` : "Aujourd'hui", icon: _jsx(Calendar, { className: "h-6 w-6" }), iconColor: "bg-indigo-100 text-indigo-600", delay: currentDelay, onClick: () => navigate('/jurie/soutenances') }, "prochaine-soutenance"));
        currentDelay += 0.1;
    }
    return cards;
};
export const DashboardJury = ({ userEmail, delay = 0 }) => {
    const navigate = useNavigate();
    const cards = getDashboardJuryCards(userEmail, delay, navigate);
    return _jsx(_Fragment, { children: cards });
};
