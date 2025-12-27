export const getProfesseurDashboardStats = (professeur) => {
    return {
        // Stats Encadrant
        etudiantsEncadres: professeur.nombreEncadrementsActuels || 0,
        capaciteEncadrement: professeur.capaciteEncadrement || 0,
        demandesEnAttente: 3, // TODO: Récupérer depuis le service de demandes
        ticketsEnCours: 12, // TODO: Récupérer depuis le service de tickets
        livrablesAValider: 5, // TODO: Récupérer depuis le service de livrables
        // Stats Jury
        soutenancesAssignees: 6, // TODO: Récupérer depuis le service de soutenances
        pvAConfirmer: 2, // TODO: Récupérer depuis le service de soutenances
        prochaineSoutenance: new Date('2025-03-25'),
        // Stats Commission
        sujetsEnAttente: 8, // TODO: Récupérer depuis le service de sujets
        sujetsValidesCeMois: 15,
        sujetsRejetesCeMois: 2,
        memoiresCorrigesAValider: 5,
        // Stats Chef (si applicable)
        dossiersDepartement: 45,
        soutenancesAPlanifier: 12,
        sallesDisponibles: 8
    };
};
export const isEncadrant = (professeur) => {
    return !!professeur.estEncadrant;
};
export const isJury = (professeur) => {
    return !!professeur.estJurie;
};
export const isCommission = (professeur) => {
    return !!professeur.estCommission;
};
export const isChef = (professeur) => {
    return !!professeur.estChef;
};
