// ============================================================================
// DASHBOARD SERVICES - Avec cache et synchronisation Backend
// ============================================================================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_BASE_URL = 'http://localhost:3001/api';
// Cache pour les données dashboard
let dashboardCache = null;
const CACHE_DURATION = 30000; // 30 secondes
// Fonction pour récupérer les stats (synchrone avec cache, mise à jour async en arrière-plan)
export const getDashboardStats = (userId) => {
    const defaultStats = {
        dossiersCount: 0,
        documentsCount: 0,
        documentsValides: 0,
        progression: 0,
        echeancesCount: 0,
        ticketsCount: 0,
        chapitresCompletes: 0,
        chapitresTotal: 5
    };
    if (!userId) {
        return defaultStats;
    }
    // Lancer la mise à jour en arrière-plan si le cache est périmé ou inexistant
    if (!dashboardCache ||
        dashboardCache.userId !== userId ||
        Date.now() - dashboardCache.lastUpdate >= CACHE_DURATION) {
        refreshDashboardData(userId);
    }
    // Retourner le cache existant s'il correspond à l'utilisateur
    if (dashboardCache && dashboardCache.userId === userId) {
        return dashboardCache.stats;
    }
    // Sinon retourner les valeurs par défaut
    return defaultStats;
};
// Fonction async pour rafraîchir les données
export const refreshDashboardData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${API_BASE_URL}/dossiers/candidat/${userId}`);
        const dossiers = yield response.json();
        const userDossiers = Array.isArray(dossiers) ? dossiers : [];
        const dossiersCount = userDossiers.length;
        // Calcul de la progression (basé sur le premier dossier actif)
        const activeDossier = userDossiers.find((d) => d.statut === 'EN_COURS');
        const progression = activeDossier ? activeDossier.progression || 0 : 0;
        dashboardCache = {
            userId,
            dossiers: userDossiers,
            stats: {
                dossiersCount,
                documentsCount: 0,
                documentsValides: 0,
                progression,
                echeancesCount: 0,
                ticketsCount: 0,
                chapitresCompletes: 0,
                chapitresTotal: 5
            },
            lastUpdate: Date.now()
        };
    }
    catch (error) {
        console.error('Erreur refreshDashboardData:', error);
    }
});
// Précharger les données au démarrage
export const preloadDashboardData = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    yield refreshDashboardData(userId);
    return (dashboardCache === null || dashboardCache === void 0 ? void 0 : dashboardCache.stats) || getDashboardStats(userId);
});
// Données pour un dossier
export const getDossierStatus = (dossierId) => {
    if (!dashboardCache || dashboardCache.dossiers.length === 0) {
        return null;
    }
    const dossiers = dashboardCache.dossiers;
    // Si un ID est fourni, chercher ce dossier, sinon prendre le plus récent
    const dossier = dossierId
        ? dossiers.find((d) => d.id === dossierId)
        : dossiers.sort((a, b) => new Date(b.dateModification).getTime() - new Date(a.dateModification).getTime())[0];
    if (!dossier) {
        return null;
    }
    return {
        titre: dossier.titre,
        statut: dossier.statut,
        etape: dossier.etape,
        progression: dossier.progression || 0,
        encadrant: dossier.encadrantId ? 'Encadrant assigné' : 'Non assigné',
        prochaineEcheance: null
    };
};
// Récupérer le dossier actuel de l'utilisateur
export const getCurrentDossier = () => {
    if (!dashboardCache || dashboardCache.dossiers.length === 0) {
        return null;
    }
    const dossiers = dashboardCache.dossiers;
    return dossiers.find((d) => d.statut === 'EN_COURS') || dossiers[0];
};
// Invalider le cache (à appeler après une modification)
export const invalidateDashboardCache = () => {
    dashboardCache = null;
};
export default {
    getDashboardStats,
    getDossierStatus,
    getCurrentDossier,
    preloadDashboardData,
    refreshDashboardData,
    invalidateDashboardCache
};
