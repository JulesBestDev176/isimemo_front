// ============================================================================
// TYPES & INTERFACES
// ============================================================================
// ============================================================================
// MOCKS
// ============================================================================
export const mockUsers = [
    // Étudiant Candidat
    {
        id: '2',
        name: 'Marie Martin',
        email: 'candidat@isimemo.edu.sn',
        password: 'password123',
        type: 'etudiant',
        department: 'Réseaux',
        estCandidat: true,
    },
    // Encadrant
    {
        id: '5',
        name: 'Sophie Diallo',
        email: 'encadrant@isimemo.edu.sn',
        password: 'password123',
        type: 'professeur',
        department: 'Réseaux',
        estEncadrant: true,
        estProfesseur: true,
    },
    // Chef de département
    {
        id: '4',
        name: 'Amadou Diop',
        email: 'chef@isimemo.edu.sn',
        password: 'password123',
        type: 'professeur',
        department: 'Informatique',
        estChef: true,
        estProfesseur: true,
    },
];
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export const getUserById = (id) => {
    return mockUsers.find(u => u.id === id);
};
export const getUserByEmail = (email) => {
    return mockUsers.find(u => u.email === email);
};
