// ============================================================================
// TYPES & INTERFACES - CHEF DE DÉPARTEMENT
// ============================================================================
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Vérifie si le mandat du chef est actif
 */
export const isMandatActif = (chef) => {
    const maintenant = new Date();
    return maintenant >= chef.mandatDebut && maintenant <= chef.mandatFin;
};
/**
 * Vérifie si le mandat du chef est expiré
 */
export const isMandatExpire = (chef) => {
    const maintenant = new Date();
    return maintenant > chef.mandatFin;
};
/**
 * Calcule la durée restante du mandat en jours
 */
export const getDureeRestanteMandat = (chef) => {
    const maintenant = new Date();
    const diff = chef.mandatFin.getTime() - maintenant.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
