// ============================================================================
// DONNÉES MOCK - CANDIDATS (Obsolète - les données viennent du backend)
// ============================================================================
// ATTENTION: Ces données ne sont plus utilisées.
// Toutes les données candidats viennent maintenant du backend API (http://localhost:3001/api/candidats)
export const candidatsData = [];
// Helper functions - Obsolètes
export const findCandidatByEmail = (email) => {
    console.warn('⚠️ findCandidatByEmail est obsolète - utiliser le backend');
    return undefined;
};
export const isCandidatRegistered = (email) => {
    console.warn('⚠️ isCandidatRegistered est obsolète - utiliser le backend');
    return false;
};
