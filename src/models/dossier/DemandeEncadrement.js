// ============================================================================
// TYPES & INTERFACES
// ============================================================================
export var StatutDemandeEncadrement;
(function (StatutDemandeEncadrement) {
    StatutDemandeEncadrement["EN_ATTENTE"] = "EN_ATTENTE";
    StatutDemandeEncadrement["ACCEPTEE"] = "ACCEPTEE";
    StatutDemandeEncadrement["REFUSEE"] = "REFUSEE";
    StatutDemandeEncadrement["ANNULEE"] = "ANNULEE";
})(StatutDemandeEncadrement || (StatutDemandeEncadrement = {}));
// ============================================================================
// MOCKS
// ============================================================================
export const mockDemandesEncadrement = [
    {
        idDemande: 1,
        dateDemande: new Date('2025-09-15'),
        statut: StatutDemandeEncadrement.EN_ATTENTE,
        anneeAcademique: '2025-2026'
    },
    {
        idDemande: 2,
        dateDemande: new Date('2025-09-10'),
        dateReponse: new Date('2025-09-12'),
        statut: StatutDemandeEncadrement.ACCEPTEE,
        anneeAcademique: '2025-2026'
    },
    {
        idDemande: 3,
        dateDemande: new Date('2025-09-08'),
        dateReponse: new Date('2025-09-09'),
        statut: StatutDemandeEncadrement.REFUSEE,
        motifRefus: 'Capacité d\'encadrement atteinte pour cette année',
        anneeAcademique: '2025-2026'
    },
    {
        idDemande: 4,
        dateDemande: new Date('2025-09-20'),
        statut: StatutDemandeEncadrement.EN_ATTENTE,
        anneeAcademique: '2025-2026'
    },
    {
        idDemande: 5,
        dateDemande: new Date('2025-09-18'),
        statut: StatutDemandeEncadrement.EN_ATTENTE,
        anneeAcademique: '2025-2026'
    }
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getDemandeEncadrementById = (id) => {
    return mockDemandesEncadrement.find(d => d.idDemande === id);
};
export const getDemandesEncadrementByProfesseur = (idProfesseur) => {
    // TODO: Filtrer par professeur quand les relations seront complètes
    return mockDemandesEncadrement;
};
export const getDemandesEncadrementEnAttente = (idProfesseur) => {
    return getDemandesEncadrementByProfesseur(idProfesseur).filter(d => d.statut === StatutDemandeEncadrement.EN_ATTENTE);
};
export const getDemandesEncadrementByAnnee = (idProfesseur, anneeAcademique) => {
    return getDemandesEncadrementByProfesseur(idProfesseur).filter(d => d.anneeAcademique === anneeAcademique);
};
