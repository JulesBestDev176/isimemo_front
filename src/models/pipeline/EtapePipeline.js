// ============================================================================
// TYPES & INTERFACES
// ============================================================================
// Processus de pipeline pour le candidat
export var EtapePipeline;
(function (EtapePipeline) {
    // Onglet 1 : Dépôt sujet
    EtapePipeline[EtapePipeline["CHOIX_SUJET"] = 0] = "CHOIX_SUJET";
    EtapePipeline[EtapePipeline["CHOIX_BINOME"] = 1] = "CHOIX_BINOME";
    EtapePipeline[EtapePipeline["CHOIX_ENCADRANT"] = 2] = "CHOIX_ENCADRANT";
    EtapePipeline[EtapePipeline["VALIDATION_COMMISSION"] = 3] = "VALIDATION_COMMISSION";
    // Onglet 2 : Dépôt dossier
    EtapePipeline[EtapePipeline["REDACTION"] = 4] = "REDACTION";
    EtapePipeline[EtapePipeline["PRELECTURE"] = 5] = "PRELECTURE";
    EtapePipeline[EtapePipeline["DEPOT_FINAL"] = 6] = "DEPOT_FINAL";
    EtapePipeline[EtapePipeline["SOUTENANCE"] = 7] = "SOUTENANCE";
    EtapePipeline[EtapePipeline["CORRECTION"] = 8] = "CORRECTION";
    EtapePipeline[EtapePipeline["TERMINE"] = 9] = "TERMINE";
})(EtapePipeline || (EtapePipeline = {}));
// Processus de soutenance (séparé du processus de dépôt de sujet)
export var EtapeSoutenance;
(function (EtapeSoutenance) {
    EtapeSoutenance[EtapeSoutenance["DEMANDE_AUTORISATION"] = 0] = "DEMANDE_AUTORISATION";
    EtapeSoutenance[EtapeSoutenance["DEPOT_FICHE_SUIVI"] = 1] = "DEPOT_FICHE_SUIVI";
    EtapeSoutenance[EtapeSoutenance["DEPOT_RECU_PAIEMENT"] = 2] = "DEPOT_RECU_PAIEMENT";
    EtapeSoutenance[EtapeSoutenance["CONFIRMATION_EXEMPLAIRES"] = 3] = "CONFIRMATION_EXEMPLAIRES";
    EtapeSoutenance[EtapeSoutenance["VALIDATION_SOUTENANCE"] = 4] = "VALIDATION_SOUTENANCE";
})(EtapeSoutenance || (EtapeSoutenance = {}));
// ============================================================================
// MOCKS
// ============================================================================
export const mockEtapesPipeline = [
    {
        id: EtapePipeline.CHOIX_SUJET,
        nom: 'Choix du sujet',
        description: 'Sélectionnez un sujet de mémoire',
        estComplete: false,
        estActive: true
    },
    {
        id: EtapePipeline.CHOIX_BINOME,
        nom: 'Choix du binôme',
        description: 'Choisissez votre binôme (optionnel)',
        estComplete: false,
        estActive: false
    },
    {
        id: EtapePipeline.CHOIX_ENCADRANT,
        nom: 'Choix de l\'encadrant',
        description: 'Sélectionnez votre encadrant',
        estComplete: false,
        estActive: false
    },
    {
        id: EtapePipeline.VALIDATION_COMMISSION,
        nom: 'Validation commission',
        description: 'Validation par la commission',
        estComplete: false,
        estActive: false
    }
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getEtapeById = (id) => {
    return mockEtapesPipeline.find(e => e.id === id);
};
export const getEtapeActive = () => {
    return mockEtapesPipeline.find(e => e.estActive);
};
