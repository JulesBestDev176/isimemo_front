// ============================================================================
// TYPES & INTERFACES
// ============================================================================
export var StatutLivrable;
(function (StatutLivrable) {
    StatutLivrable["DEPOSE"] = "DEPOSE";
    StatutLivrable["EN_ATTENTE_VALIDATION"] = "EN_ATTENTE_VALIDATION";
    StatutLivrable["VALIDE"] = "VALIDE";
    StatutLivrable["REJETE"] = "REJETE";
})(StatutLivrable || (StatutLivrable = {}));
// ============================================================================
// MOCKS
// ============================================================================
export const mockLivrables = [];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getLivrableById = (id) => {
    return mockLivrables.find(l => l.idLivrable === id);
};
