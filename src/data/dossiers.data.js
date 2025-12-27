// ============================================================================
// DONNÉES MOCK - DOSSIERS (Obsolète - les données viennent du backend)
// ============================================================================
// ATTENTION: Ces données ne sont plus utilisées.
// Toutes les données dossiers viennent maintenant du backend API (http://localhost:3001/api/dossiers)
export const dossiersData = [];
// Helper functions
export const getDossierByCandidat = (candidatId) => {
    // Cette fonction est obsolète - utiliser dossierService.getDossiersByCandidat()
    console.warn('⚠️ getDossierByCandidat est obsolète - utiliser dossierService');
    return undefined;
};
export const getDossierProgressDetails = (dossierId) => {
    // Cette fonction est obsolète - utiliser le backend
    console.warn('⚠️ getDossierProgressDetails est obsolète - utiliser le backend');
    return null;
};
