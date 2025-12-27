// ============================================================================
// TYPES & INTERFACES
// ============================================================================
// ============================================================================
// MOCKS
// ============================================================================
export const mockSalles = [
    {
        idSalle: 1,
        nom: 'A101',
        batiment: 'Bâtiment A',
        etage: 1,
        capacite: 50,
        estDisponible: true,
        estArchive: false
    },
    {
        idSalle: 2,
        nom: 'B205',
        batiment: 'Bâtiment B',
        etage: 2,
        capacite: 30,
        estDisponible: true,
        estArchive: false
    },
    {
        idSalle: 3,
        nom: 'C301',
        batiment: 'Bâtiment C',
        etage: 3,
        capacite: 40,
        estDisponible: false,
        estArchive: false
    },
    {
        idSalle: 4,
        nom: 'A32',
        batiment: 'Bâtiment A',
        etage: 3,
        capacite: 100,
        estDisponible: true,
        estArchive: false
    }
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getSalleById = (id) => {
    return mockSalles.find(s => s.idSalle === id);
};
export const getSallesDisponibles = () => {
    return mockSalles.filter(s => s.estDisponible && !s.estArchive);
};
