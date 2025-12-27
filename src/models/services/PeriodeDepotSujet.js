// ============================================================================
// TYPES & INTERFACES - PÉRIODE DE DÉPÔT DE SUJET
// ============================================================================
// ============================================================================
// MOCKS
// ============================================================================
export const mockPeriodesDepotSujet = [
    {
        idPeriode: 1,
        anneeAcademique: '2024-2025',
        dateDebut: new Date('2024-10-01'),
        dateFin: new Date('2024-11-30'),
        estActive: false,
        dateCreation: new Date('2024-09-15'),
        creePar: 2
    },
    {
        idPeriode: 2,
        anneeAcademique: '2025-2026',
        dateDebut: new Date('2025-10-01'),
        dateFin: new Date('2025-12-25'),
        estActive: true,
        dateCreation: new Date('2025-09-15'),
        creePar: 2
    }
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Récupère la période de dépôt de sujet active
 */
export const getPeriodeDepotSujetActive = () => {
    return mockPeriodesDepotSujet.find(p => p.estActive) || null;
};
/**
 * Vérifie si une période de dépôt de sujet est active
 */
export const estPeriodeDepotSujetActive = () => {
    return getPeriodeDepotSujetActive() !== null;
};
/**
 * Vérifie si on est dans la période de dépôt de sujet
 */
export const estDansPeriodeDepotSujet = () => {
    const periode = getPeriodeDepotSujetActive();
    if (!periode)
        return false;
    const maintenant = new Date();
    return maintenant >= periode.dateDebut && maintenant <= periode.dateFin;
};
