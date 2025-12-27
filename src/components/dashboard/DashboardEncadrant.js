var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, UserPlus } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
export const getDashboardEncadrantCards = (idProfesseur, delay = 0, navigate, stats) => {
    let currentDelay = delay;
    const cards = [];
    // Toujours afficher les cartes, même si les valeurs sont à 0
    // Étudiants encadrés
    cards.push(_jsx(DashboardCard, { title: "\u00C9tudiants encadr\u00E9s", value: stats.nombreEtudiants.toString(), icon: _jsx(UserCheck, { className: "h-6 w-6" }), iconColor: "bg-emerald-100 text-emerald-600", delay: currentDelay, onClick: () => navigate('/professeur/encadrements') }, "etudiants-encadres"));
    currentDelay += 0.1;
    // Demandes d'encadrement (En attente)
    cards.push(_jsx(DashboardCard, { title: "Demandes en attente", value: stats.demandesEnAttente.toString(), icon: _jsx(UserPlus, { className: "h-6 w-6" }), iconColor: "bg-blue-100 text-blue-600", trend: stats.demandesEnAttente > 0 ? { value: "Nouveau", up: true } : undefined, delay: currentDelay, onClick: () => navigate('/professeur/encadrements') }, "demandes-encadrement"));
    return cards;
};
export const DashboardEncadrant = ({ idProfesseur, delay = 0 }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchStats = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log('🔍 Récupération stats encadrant pour ID:', idProfesseur);
                const response = yield fetch(`http://localhost:3001/api/encadrants/${idProfesseur}/stats`);
                console.log('📡 Réponse API stats:', response.status, response.ok);
                if (response.ok) {
                    const data = yield response.json();
                    console.log('✅ Stats encadrant reçues:', data);
                    setStats(data);
                }
                else {
                    console.error('❌ Erreur API stats:', response.status);
                }
            }
            catch (error) {
                console.error('❌ Erreur lors de la récupération des stats encadrant:', error);
            }
            finally {
                setLoading(false);
            }
        });
        if (idProfesseur) {
            fetchStats();
        }
        else {
            console.warn('⚠️ Pas d\'ID professeur fourni');
            setLoading(false);
        }
    }, [idProfesseur]);
    // Afficher les cartes même pendant le chargement (avec des valeurs par défaut)
    const displayStats = stats || { nombreEtudiants: 0, nombreDossiers: 0, demandesEnAttente: 0 };
    const cards = getDashboardEncadrantCards(idProfesseur, delay, navigate, displayStats);
    console.log('🎴 Nombre de cartes générées:', cards.length, 'Loading:', loading, 'Stats:', displayStats);
    return _jsx(_Fragment, { children: cards });
};
