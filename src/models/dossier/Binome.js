// ============================================================================
// TYPES & INTERFACES
// ============================================================================
export var StatutDemandeBinome;
(function (StatutDemandeBinome) {
    StatutDemandeBinome["EN_ATTENTE"] = "EN_ATTENTE";
    StatutDemandeBinome["ACCEPTE"] = "ACCEPTE";
    StatutDemandeBinome["REFUSE"] = "REFUSE";
    StatutDemandeBinome["DISSOUS"] = "DISSOUS";
})(StatutDemandeBinome || (StatutDemandeBinome = {}));
// ============================================================================
// MOCKS
// ============================================================================
export const mockBinomes = [];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getBinomeById = (id) => {
    return mockBinomes.find(b => b.idBinome === id);
};
