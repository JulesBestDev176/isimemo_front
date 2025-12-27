// ============================================================================
// TYPES & INTERFACES - ANNÉE ACADÉMIQUE
// ============================================================================
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Récupère l'année académique active
 */
export const getAnneeActive = (annees) => {
    return annees.find(a => a.estActive);
};
/**
 * Vérifie si une année académique est terminée
 */
export const isAnneeTerminee = (annee) => {
    const maintenant = new Date();
    return maintenant > annee.dateFin;
};
/**
 * Vérifie si une année académique peut être activée
 */
export const peutActiverAnnee = (annee) => {
    return !annee.estActive && !isAnneeTerminee(annee);
};
/**
 * Génère le code d'une année académique à partir d'une date
 */
export const genererCodeAnnee = (date) => {
    const mois = date.getMonth() + 1;
    const annee = date.getFullYear();
    if (mois >= 9) {
        return `${annee}-${annee + 1}`;
    }
    else {
        return `${annee - 1}-${annee}`;
    }
};
/**
 * Crée une nouvelle année académique
 */
export const creerNouvelleAnnee = (anneeDebut) => {
    const anneeFin = anneeDebut + 1;
    const code = `${anneeDebut}-${anneeFin}`;
    return {
        idAnnee: 0, // Sera généré par le backend
        code,
        libelle: `Année Académique ${code}`,
        dateDebut: new Date(anneeDebut, 8, 1), // 1er septembre
        dateFin: new Date(anneeFin, 7, 31), // 31 août
        estActive: false
    };
};
/**
 * Récupère les années académiques futures (non encore commencées)
 */
export const getAnneesFutures = (annees) => {
    const maintenant = new Date();
    return annees.filter(a => a.dateDebut > maintenant);
};
/**
 * Récupère les années académiques passées
 */
export const getAnneesPassees = (annees) => {
    const maintenant = new Date();
    return annees.filter(a => a.dateFin < maintenant);
};
