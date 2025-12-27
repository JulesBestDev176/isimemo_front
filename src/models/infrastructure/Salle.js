// ============================================================================
// TYPES & INTERFACES - SALLE DE SOUTENANCE
// ============================================================================
// ============================================================================
// MOCKS
// ============================================================================
export const mockSalles = [
    {
        idSalle: 1,
        nom: 'Amphi A',
        batiment: 'Bâtiment Principal',
        capacite: 100,
        equipements: ['Projecteur', 'Micro', 'Climatisation', 'Tableau'],
        estDisponible: true
    },
    {
        idSalle: 2,
        nom: 'Amphi B',
        batiment: 'Bâtiment Principal',
        capacite: 80,
        equipements: ['Projecteur', 'Micro', 'Climatisation'],
        estDisponible: true
    },
    {
        idSalle: 3,
        nom: 'Salle 101',
        batiment: 'Bâtiment Informatique',
        capacite: 50,
        equipements: ['Projecteur', 'Tableau', 'Climatisation'],
        estDisponible: true
    },
    {
        idSalle: 4,
        nom: 'Salle 102',
        batiment: 'Bâtiment Informatique',
        capacite: 50,
        equipements: ['Projecteur', 'Tableau'],
        estDisponible: true
    },
    {
        idSalle: 5,
        nom: 'Salle 201',
        batiment: 'Bâtiment Informatique',
        capacite: 40,
        equipements: ['Projecteur', 'Climatisation'],
        estDisponible: true
    },
    {
        idSalle: 6,
        nom: 'Salle 202',
        batiment: 'Bâtiment Informatique',
        capacite: 40,
        equipements: ['Projecteur', 'Tableau'],
        estDisponible: true
    },
    {
        idSalle: 7,
        nom: 'Salle Conférence',
        batiment: 'Bâtiment Administration',
        capacite: 60,
        equipements: ['Projecteur', 'Micro', 'Climatisation', 'Tableau', 'Visioconférence'],
        estDisponible: true
    }
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
/**
 * Récupère une salle par son ID
 */
export const getSalleById = (id) => {
    return mockSalles.find(s => s.idSalle === id);
};
/**
 * Récupère les salles disponibles
 */
export const getSallesDisponibles = () => {
    return mockSalles.filter(s => s.estDisponible);
};
/**
 * Récupère les salles avec une capacité minimale
 */
export const getSallesAvecCapacite = (capaciteMin) => {
    return mockSalles.filter(s => s.estDisponible && s.capacite >= capaciteMin);
};
